import { mockBlogPosts } from "@/data/blog";
import { workItems as sampleWorkItems } from "@/data/work";
import { createSupabaseClient, getPublicStorageUrl } from "@/lib/supabase";

export async function getBlogPosts({ includeDrafts = false } = {}) {
    const supabase = createSupabaseClient();
    if (!supabase)
        return mockBlogPosts;

    let query = supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, body_markdown, cover_asset_id, status, published_at, created_at")
        .order("published_at", { ascending: false });

    if (!includeDrafts)
        query = query.eq("status", "published").lte("published_at", new Date().toISOString());

    const { data, error } = await query;
    if (error)
        throw new Error(`Could not load blog posts: ${error.message}`);

    const coverIds = data.map((post) => post.cover_asset_id).filter(Boolean);
    let coversById = new Map();
    if (coverIds.length > 0) {
        const { data: covers, error: coverError } = await supabase
            .from("media_assets")
            .select("id, storage_path, alt_text, title")
            .in("id", coverIds);
        if (coverError)
            throw new Error(`Could not load blog cover images: ${coverError.message}`);
        coversById = new Map(covers.map((cover) => [cover.id, cover]));
    }

    return data.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt ?? "",
        body: post.body_markdown,
        status: post.status,
        publishedAt: post.published_at ?? post.created_at,
        coverUrl: post.cover_asset_id ? getPublicStorageUrl(coversById.get(post.cover_asset_id)?.storage_path) : null,
        coverAlt: post.cover_asset_id ? coversById.get(post.cover_asset_id)?.alt_text ?? post.title : post.title,
    }));
}

export async function getWorkItems() {
    const supabase = createSupabaseClient();
    if (!supabase)
        return sampleWorkItems;

    const { data, error } = await supabase
        .from("portfolio_projects")
        .select("id, slug, title, discipline, role, tools, project_year, description, body_markdown, status, featured, sort_order, created_at, project_media(role, sort_order, media_assets(storage_bucket, storage_path, asset_type, title, alt_text, external_url))")
        .eq("status", "published")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

    if (error)
        throw new Error(`Could not load portfolio projects: ${error.message}`);

    const publishedItems = data.map((project) => {
        const media = (project.project_media ?? [])
            .filter(({ media_assets: asset }) => asset)
            .sort((a, b) => a.sort_order - b.sort_order)
            .map(({ role, media_assets: asset }) => ({
                role,
                type: asset.asset_type,
                url: asset.external_url ?? getPublicStorageUrl(asset.storage_path),
                alt: asset.alt_text || asset.title || project.title,
            }))
            .filter((asset) => asset.url);
        const cover = media.find((asset) => asset.role === "cover") ?? media[0];

        return {
            slug: project.slug,
            title: project.title,
            discipline: project.discipline,
            role: project.role ?? "",
            tools: project.tools ?? [],
            year: project.project_year ? String(project.project_year) : "",
            description: project.description ?? "",
            body: project.body_markdown ?? "",
            colors: ["#c3ed75", "#254a3c"],
            art: "web",
            featured: project.featured,
            imageUrl: cover?.type === "image" ? cover.url : null,
            mediaUrl: cover?.type === "video" ? cover.url : null,
            imageAlt: cover?.alt ?? project.title,
            media,
        };
    });

    const publishedSlugs = new Set(publishedItems.map((item) => item.slug));
    return [
        ...sampleWorkItems.filter((item) => !publishedSlugs.has(item.slug)),
        ...publishedItems,
    ];
}
