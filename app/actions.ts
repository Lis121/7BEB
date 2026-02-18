import { fetchTrendingPages, fetchCategoryPages, searchPages } from "@/lib/alstra";

export async function getMoreVideos(count: number = 8) {
    return await fetchTrendingPages(count);
}

export async function getMoreCategoryVideos(category: string, offset: number, limit: number = 8) {
    return await fetchCategoryPages(category, limit, offset);
}

export async function getMoreSearchResults(query: string, offset: number, limit: number = 8) {
    return await searchPages(query, limit, offset);
}
