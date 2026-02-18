import { notFound } from "next/navigation";
import { Metadata } from "next";
import { AlstraCta } from "@/components/alstra-cta";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { categorizePage } from "@/lib/classification";

// ... (SAAS_API_URL, PROJECT_ID, fetchPseoPage, generateMetadata remain unchanged)

export default async function PseoPage(props: Props) {
    const params = await props.params;
    const slug = params.slug.join("/");
    const data = await fetchPseoPage(slug);

    if (!data) return notFound();

    const category = categorizePage(data);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto py-12 px-4 max-w-4xl">
                <div className="mb-4">
                    <span className="text-sm font-bold text-primary uppercase tracking-wider">
                        {category}
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">{data.title}</h1>

                {data.updatedAt && (
                    <div className="flex items-center text-muted-foreground mb-8">
                        <span className="text-sm font-medium">
                            Published: {new Date(data.updatedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                )}

                <div
                    className="pseo-content prose prose-lg dark:prose-invert max-w-none"
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
