import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://your-domain.com"; // Replace with actual domain

    // Static routes
    const routes = [
        "",
        "/politics",
        "/tech",
        "/business",
        "/entertainment",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: route === "" ? 1 : 0.8,
    }));

    // In a real app, you would fetch dynamic slugs here and map them
    const videos = [
        "tech-startup-boom",
        "mars-mission",
        "market-update",
        "urban-farming",
        "senate-hearing",
    ].map((slug) => ({
        url: `${baseUrl}/videos/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
    }));

    return [...routes, ...videos];
}
