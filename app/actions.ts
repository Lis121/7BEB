import { fetchTrendingPages, fetchCategoryPages } from "@/lib/alstra";

export async function getMoreVideos(count: number = 8) {
    // For "Load More", we'll fetch random trending/other pages to keep it feeling fresh
    return await fetchTrendingPages(count);
}

export async function getMoreCategoryVideos(category: string, offset: number, limit: number = 8) {
    return await fetchCategoryPages(category, limit, offset);
}
