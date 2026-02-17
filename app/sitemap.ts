import { MetadataRoute } from 'next'

const SAAS_API_URL = "https://www.alstras.com";
const PROJECT_ID = "b17364ef-337e-4134-9b5e-2ab36c97e022";

type SitemapEntry = {
    url: string;
    lastModified?: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://7beb.com'

    // 1. Fetch pSEO pages from SaaS (With Pagination Support)
    let pseoPages: MetadataRoute.Sitemap = [];
    let page = 1;

    try {
        while (true) {
            const res = await fetch(`${SAAS_API_URL}/api/public/sitemap?projectId=${PROJECT_ID}&format=json&limit=5000&page=${page}`, {
                next: { revalidate: 3600 }
            });

            if (!res.ok) break;

            const data: SitemapEntry[] = await res.json();
            if (!data || data.length === 0) break;

            const chunks = data.map(item => ({
                url: item.url,
                lastModified: item.lastModified ? new Date(item.lastModified) : new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }));

            pseoPages = [...pseoPages, ...chunks];

            if (data.length < 5000) break;
            page++;
        }
    } catch (error) {
        console.error('Failed to fetch pSEO sitemap:', error);
    }

    const myPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/politics`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/tech`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/business`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/entertainment`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
    ]

    // Filter out duplicates (if pSEO returns pages we already defined manually)
    const myUrls = new Set(myPages.map((page) => page.url));
    const filteredPseoPages = pseoPages.filter((page) => !myUrls.has(page.url));

    return [...myPages, ...filteredPseoPages];
}
