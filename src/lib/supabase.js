import { createClient } from "@supabase/supabase-js";

export function getSupabaseConfig() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    return url && publishableKey ? { url, publishableKey } : null;
}

export function createSupabaseClient() {
    const config = getSupabaseConfig();
    if (!config)
        return null;

    return createClient(config.url, config.publishableKey);
}

export function getPublicStorageUrl(storagePath) {
    const config = getSupabaseConfig();
    if (!config || !storagePath)
        return null;

    const encodedPath = storagePath.split("/").map(encodeURIComponent).join("/");
    return `${config.url}/storage/v1/object/public/portfolio-media/${encodedPath}`;
}
