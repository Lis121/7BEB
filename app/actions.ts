"use server";

import { fetchWatchPagesWithThumbnails, WatchPageWithThumbnail } from "@/lib/alstra";

export async function getMoreVideos(count: number = 20): Promise<WatchPageWithThumbnail[]> {
    return await fetchWatchPagesWithThumbnails(count);
}
