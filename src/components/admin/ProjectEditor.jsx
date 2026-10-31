"use client";

import { useRef, useState } from "react";
import { uploadPortfolioFile } from "@/lib/upload";

const allowedTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
    "video/mp4",
    "video/webm",
    "video/quicktime",
]);
const maxFileSize = 100 * 1024 * 1024;
const disciplines = ["Video Editing", "Graphic Design", "UX / Product", "Development", "AI"];

function makeSlug(value) {
    return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function ProjectEditor({ client, userId, project, onSaved, onCancel }) {
    const formRef = useRef(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        setSaving(true);
        setError("");

        const formData = new FormData(event.currentTarget);
        const title = String(formData.get("title") ?? "").trim();
        const slug = makeSlug(String(formData.get("slug") ?? title));
        const files = formData.getAll("files").filter((file) => file instanceof File && file.size > 0);
        const status = String(formData.get("status"));
        const yearValue = String(formData.get("year") ?? "").trim();
        const storagePaths = [];
        const assetIds = [];
        let assetsLinked = false;

        if (!title || !slug) {
            setError("Enter a title and a valid URL slug.");
            setSaving(false);
            return;
        }

        const invalidFile = files.find((file) => !allowedTypes.has(file.type) || file.size > maxFileSize);
        if (invalidFile) {
            setError(`${invalidFile.name} is not a supported image/video or is larger than 100 MiB.`);
            setSaving(false);
            return;
        }

        if (yearValue && (!/^\d{4}$/.test(yearValue) || Number(yearValue) < 1900 || Number(yearValue) > 2200)) {
            setError("Enter a year between 1900 and 2200.");
            setSaving(false);
            return;
        }

        try {
            const projectResult = await client
                .from("portfolio_projects")
                .upsert({
                    ...(project?.id ? { id: project.id } : {}),
                    slug,
                    title,
                    discipline: String(formData.get("discipline")),
                    role: String(formData.get("role") ?? "").trim(),
                    tools: String(formData.get("tools") ?? "").split(",").map((tool) => tool.trim()).filter(Boolean),
                    project_year: yearValue ? Number(yearValue) : null,
                    description: String(formData.get("description") ?? "").trim(),
                    body_markdown: String(formData.get("body") ?? "").trim(),
                    status,
                    featured: formData.get("featured") === "on",
                    created_by: userId,
                }, { onConflict: "slug" })
                .select("id")
                .single();

            if (projectResult.error)
                throw new Error(projectResult.error.message);

            if (files.length > 0) {
                const assetRows = [];

                for (const [index, file] of files.entries()) {
                    const extension = file.name.match(/\.[a-z0-9]+$/i)?.[0] ?? "";
                    const storagePath = `projects/${slug}/${crypto.randomUUID()}${extension}`;
                    storagePaths.push(storagePath);
                    try {
                        await uploadPortfolioFile(client, file, storagePath);
                    }
                    catch (uploadError) {
                        throw new Error(`The project was saved, but ${file.name} could not be uploaded: ${uploadError.message}`);
                    }

                    const asset = await client.from("media_assets").insert({
                        storage_path: storagePath,
                        asset_type: file.type.startsWith("image/") ? "image" : "video",
                        title: file.name,
                        alt_text: file.type.startsWith("image/") ? String(formData.get("altText") ?? "").trim() || title : null,
                        caption: String(formData.get("description") ?? "").trim(),
                        is_public: status === "published",
                        uploaded_by: userId,
                    }).select("id").single();

                    if (asset.error) {
                        throw new Error(`The project was saved, but media details for ${file.name} could not be saved: ${asset.error.message}`);
                    }

                    assetIds.push(asset.data.id);
                    assetRows.push({
                        project_id: projectResult.data.id,
                        asset_id: asset.data.id,
                        role: index === 0 ? "cover" : "gallery",
                        sort_order: index,
                    });
                }

                const linked = await client.from("project_media").insert(assetRows);
                if (linked.error)
                    throw new Error(`The project was saved, but media could not be attached: ${linked.error.message}`);
                assetsLinked = true;
            }

            const linkedMedia = await client.from("project_media")
                .select("asset_id")
                .eq("project_id", projectResult.data.id);
            if (linkedMedia.error)
                throw new Error(`The project was saved, but media visibility could not be updated: ${linkedMedia.error.message}`);

            const linkedAssetIds = linkedMedia.data.map((entry) => entry.asset_id);
            if (linkedAssetIds.length > 0) {
                const visibility = await client.from("media_assets")
                    .update({ is_public: status === "published" })
                    .in("id", linkedAssetIds);
                if (visibility.error)
                    throw new Error(`The project was saved, but media visibility could not be updated: ${visibility.error.message}`);
            }

            formRef.current?.reset();
            onSaved();
        }
        catch (saveError) {
            let message = saveError instanceof Error ? saveError.message : "The project could not be saved.";
            if (!assetsLinked && storagePaths.length > 0) {
                try {
                    const cleanup = await client.storage.from("portfolio-media").remove(storagePaths);
                    if (cleanup.error)
                        message += ` Cleanup also failed: ${cleanup.error.message}`;
                }
                catch (cleanupError) {
                    message += ` Cleanup also failed: ${cleanupError instanceof Error ? cleanupError.message : "unknown error"}`;
                }
            }
            if (!assetsLinked && assetIds.length > 0) {
                try {
                    const cleanup = await client.from("media_assets").delete().in("id", assetIds);
                    if (cleanup.error)
                        message += ` Media-record cleanup also failed: ${cleanup.error.message}`;
                }
                catch (cleanupError) {
                    message += ` Media-record cleanup also failed: ${cleanupError instanceof Error ? cleanupError.message : "unknown error"}`;
                }
            }
            setError(message);
        }
        finally {
            setSaving(false);
        }
    }

    return (
      <form className="admin-form" ref={formRef} onSubmit={handleSubmit} key={project?.id ?? "new-project"}>
        <div className="admin-form-heading">
          <h3>{project ? "Edit project" : "Add a project"}</h3>
          {project && <button className="admin-text-button" type="button" onClick={onCancel}>Cancel edit</button>}
        </div>
        <div className="admin-form-grid">
          <label>Project title<input className="admin-input" name="title" defaultValue={project?.title ?? ""} required maxLength={120}/></label>
          <label>URL slug<input className="admin-input" name="slug" defaultValue={project?.slug ?? ""} placeholder="my-project" pattern="[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*" required/></label>
          <label>Discipline<select className="admin-input" name="discipline" defaultValue={project?.discipline ?? disciplines[0]}>{disciplines.map((discipline) => <option key={discipline}>{discipline}</option>)}</select></label>
          <label>Role<input className="admin-input" name="role" defaultValue={project?.role ?? ""} maxLength={120}/></label>
          <label>Year<input className="admin-input" name="year" type="number" min="1900" max="2200" defaultValue={project?.project_year ?? ""}/></label>
          <label>Tools, separated by commas<input className="admin-input" name="tools" defaultValue={project?.tools?.join(", ") ?? ""} maxLength={300}/></label>
          <label className="admin-wide">Short description<textarea className="admin-input" name="description" rows="3" maxLength={500} defaultValue={project?.description ?? ""}/></label>
          <label className="admin-wide">Project story (Markdown)<textarea className="admin-input" name="body" rows="8" defaultValue={project?.body_markdown ?? ""}/></label>
          <label className="admin-wide">Images or videos (up to 100 MiB each)<input className="admin-input admin-file-input" name="files" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/quicktime" multiple/></label>
          <label className="admin-wide">Image description for accessibility<input className="admin-input" name="altText" defaultValue="" maxLength={250}/></label>
          <label>Visibility<select className="admin-input" name="status" defaultValue={project?.status ?? "draft"}><option value="draft">Draft</option><option value="published">Published</option></select></label>
          <label className="admin-checkbox"><input type="checkbox" name="featured" defaultChecked={project?.featured ?? false}/> Feature this project on the home page</label>
        </div>
        {error && <p className="admin-message admin-message--error" role="alert">{error}</p>}
        <div className="admin-form-actions">
          <button className="button button--primary" type="submit" disabled={saving}>{saving ? "Saving…" : project ? "Save changes" : "Create project"}</button>
        </div>
      </form>
    );
}
