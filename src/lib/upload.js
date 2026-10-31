import { Upload } from "tus-js-client";
import { getSupabaseConfig } from "@/lib/supabase";

const resumableThreshold = 6 * 1024 * 1024;
const resumableChunkSize = 6 * 1024 * 1024;

export async function uploadPortfolioFile(client, file, storagePath) {
    if (file.size <= resumableThreshold) {
        const { error } = await client.storage
            .from("portfolio-media")
            .upload(storagePath, file, { contentType: file.type, upsert: false });
        if (error)
            throw new Error(error.message);
        return;
    }

    const config = getSupabaseConfig();
    if (!config)
        throw new Error("Supabase is not configured.");

    const { data: { session }, error: sessionError } = await client.auth.getSession();
    if (sessionError)
        throw new Error(`Could not check the upload session: ${sessionError.message}`);
    if (!session)
        throw new Error("Your session expired. Sign in again before uploading.");

    await new Promise((resolve, reject) => {
        const upload = new Upload(file, {
            endpoint: `${config.url}/storage/v1/upload/resumable`,
            headers: {
                authorization: `Bearer ${session.access_token}`,
                apikey: config.publishableKey,
                "x-upsert": "false",
            },
            chunkSize: resumableChunkSize,
            retryDelays: [0, 3000, 5000, 10000, 20000],
            metadata: {
                bucketName: "portfolio-media",
                objectName: storagePath,
                contentType: file.type,
                cacheControl: "3600",
            },
            onError: reject,
            onSuccess: resolve,
        });
        upload.start();
    });
}
