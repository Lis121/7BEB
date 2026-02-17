import { notFound } from "next/navigation";
import { Metadata } from "next";
import { AlstraCta } from "@/components/alstra-cta";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// Config - This interacts with your SaaS Platform (Do NOT change to localhost)
const SAAS_API_URL = "https://www.alstras.com";
const PROJECT_ID = "b17364ef-337e-4134-9b5e-2ab36c97e022";

export const runtime = 'edge';

type Props = {
    params: Promise<{ slug: string[] }>;
};

async function fetchPseoPage(slug: string) {
    try {
        // Added &include=related for Smart Linking
        const res = await fetch(
            `${SAAS_API_URL}/api/public/content?projectId=${PROJECT_ID}&slug=${slug}&include=related`,
            {
                next: { revalidate: 3600 },
            },
        );

        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error("pSEO Fetch Error:", error);
        return null;
    }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const slug = params.slug.join("/");
    const data = await fetchPseoPage(slug);

    if (!data) return {};

    return {
        title: data.title,
        description: data.excerpt || data.title,
    };
}

export default async function PseoPage(props: Props) {
    const params = await props.params;
    const slug = params.slug.join("/");
    const data = await fetchPseoPage(slug);

    if (!data) return notFound();

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto py-12 px-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">{data.title}</h1>

                {/* 
                   Tip: Use @tailwindcss/typography plugin for nice styling of raw HTML.
                   Add 'prose' class to the container.
                */}
                <div
                    className="prose prose-lg dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: data.contentHtml }}
                />

                {/* Smart Internal Linking */}
                {data.relatedPages?.length > 0 && (
                    <div className="mt-12 border-t pt-8">
                        <h3 className="text-2xl font-bold mb-6">Se även</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.relatedPages.map((page: any) => (
                                <a
                                    key={page.url}
                                    href={page.url}
                                    className="block p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    {page.title}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Headless CTA - Rendered if configured in dashboard */}
                {data.cta && (
                    <div className="mt-12 p-8 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                        {data.cta.description && (
                            <p
                                className="text-lg text-gray-600 dark:text-gray-300 mb-4"
                                style={{ color: data.cta.msg_text_color }}
                            >
                                {data.cta.description}
                            </p>
                        )}
                        <AlstraCta cta={data.cta} apiUrl={SAAS_API_URL} />
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
