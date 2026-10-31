"use client";

import { useRef, useState } from "react";
import { uploadPortfolioFile } from "@/lib/upload";

function makeSlug(value) {
    return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function BlogEditor({ client, userId, post, onSaved, onCancel }) {
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
        const status = String(formData.get("status"));
        const excerpt = String(formData.get("excerpt") ?? "").trim();
        const body = String(formData.get("body") ?? "").trim();
        let uploadedPath = null;
        let uploadedAssetId = null;
        let postSaved = false;

        if (!title || !slug || !body) {
            setError("A title, URL slug and article text are required.");
            setSaving(false);
            return;
        }

        try {
            let coverAssetId = post?.cover_asset_id ?? null;
            const coverFile = formData.get("cover");

            if (coverFile instanceof File && coverFile.size > 0) {
                const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
                if (!allowedImageTypes.has(coverFile.type) || coverFile.size > 100 * 1024 * 1024)
                    throw new Error("Choose a supported image file smaller than 100 MiB for the cover.");

                const extension = coverFile.name.match(/\.[a-z0-9]+$/i)?.[0] ?? "";
                const storagePath = `blog/${slug}/${crypto.randomUUID()}${extension}`;
                uploadedPath = storagePath;
                try {
                    await uploadPortfolioFile(client, coverFile, storagePath);
                }
                catch (uploadError) {
                    throw new Error(`The cover could not be uploaded: ${uploadError.message}`);
                }

                const asset = await client.from("media_assets").insert({
                    storage_path: storagePath,
                    asset_type: "image",
                    title: coverFile.name,
                    alt_text: title,
                    is_public: status === "published",
                    uploaded_by: userId,
                }).select("id").single();

                if (asset.error) {
                    throw new Error(`The cover was uploaded but its media details could not be saved: ${asset.error.message}`);
                }
                coverAssetId = asset.data.id;
                uploadedAssetId = asset.data.id;
            }

            const saved = await client.from("blog_posts").upsert({
                ...(post?.id ? { id: post.id } : {}),
                slug,
                title,
                excerpt,
                body_markdown: body,
                cover_asset_id: coverAssetId,
                status,
                published_at: status === "published" ? post?.published_at ?? new Date().toISOString() : null,
                created_by: userId,
            }, { onConflict: "slug" });

            if (saved.error)
                throw new Error(saved.error.message);
            postSaved = true;

            if (coverAssetId) {
                const visibility = await client.from("media_assets")
                    .update({ is_public: status === "published" })
                    .eq("id", coverAssetId);
                if (visibility.error)
                    throw new Error(`The post was saved, but cover visibility could not be updated: ${visibility.error.message}`);
            }

            formRef.current?.reset();
            onSaved();
        }
        catch (saveError) {
            let message = saveError instanceof Error ? saveError.message : "The post could not be saved.";
            if (!postSaved && uploadedPath) {
                try {
                    const cleanup = await client.storage.from("portfolio-media").remove([uploadedPath]);
                    if (cleanup.error)
                        message += ` Cover cleanup also failed: ${cleanup.error.message}`;
                }
                catch (cleanupError) {
                    message += ` Cover cleanup also failed: ${cleanupError instanceof Error ? cleanupError.message : "unknown error"}`;
                }
            }
            if (!postSaved && uploadedAssetId) {
                try {
                    const cleanup = await client.from("media_assets").delete().eq("id", uploadedAssetId);
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
      <form className="admin-form" ref={formRef} onSubmit={handleSubmit} key={post?.id ?? "new-post"}>
        <div className="admin-form-heading">
          <h3>{post ? "Edit post" : "Write a post"}</h3>
          {post && <button className="admin-text-button" type="button" onClick={onCancel}>Cancel edit</button>}
        </div>
        <div className="admin-form-grid">
          <label>Post title<input className="admin-input" name="title" defaultValue={post?.title ?? ""} required maxLength={160}/></label>
          <label>URL slug<input className="admin-input" name="slug" defaultValue={post?.slug ?? ""} placeholder="my-post-title" pattern="[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*" required/></label>
          <label className="admin-wide">Short introduction<textarea className="admin-input" name="excerpt" rows="2" maxLength={500} defaultValue={post?.excerpt ?? ""}/></label>
          <label className="admin-wide">Article (Markdown)<textarea className="admin-input" name="body" rows="12" defaultValue={post?.body_markdown ?? ""} required/></label>
          <label className="admin-wide">Cover image<input className="admin-input admin-file-input" name="cover" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif"/></label>
          <label>Visibility<select className="admin-input" name="status" defaultValue={post?.status ?? "draft"}><option value="draft">Draft</option><option value="published">Published</option></select></label>
        </div>
        {error && <p className="admin-message admin-message--error" role="alert">{error}</p>}
        <div className="admin-form-actions">
          <button className="button button--primary" type="submit" disabled={saving}>{saving ? "Saving…" : post ? "Save changes" : "Publish post"}</button>
        </div>
      </form>
    );
}
