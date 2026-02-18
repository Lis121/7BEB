"use server";

import { fetchTrendingPages } from "@/lib/alstra";

export async function getMoreVideos(count: number = 8) {
    // For "Load More", we'll fetch random trending/other pages to keep it feeling fresh
    return await fetchTrendingPages(count);
}
