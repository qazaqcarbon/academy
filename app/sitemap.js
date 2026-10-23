import { client } from "@/sanity/client";

const SITE_URL = "https://academy.qazaqcarbon.com";
const STATIC_LAST_MOD = new Date("2026-03-25T00:00:00.000Z");

const staticPages = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/calculator", priority: 0.9, changeFrequency: "monthly" },
    { path: "/standards", priority: 0.9, changeFrequency: "monthly" },
];

export default async function sitemap() {
    const urls = [];

    // 1. Static pages (RU and EN)
    for (const page of staticPages) {
        const ruUrl = `${SITE_URL}${page.path}`;
        const enUrl = `${SITE_URL}/en${page.path}`;

        // RU entry
        urls.push({
            url: ruUrl,
            lastModified: STATIC_LAST_MOD,
            changeFrequency: page.changeFrequency,
            priority: page.priority,
            alternates: {
                languages: {
                    ru: ruUrl,
                    en: enUrl,
                    "x-default": ruUrl,
                },
            },
        });

        // EN entry
        urls.push({
            url: enUrl,
            lastModified: STATIC_LAST_MOD,
            changeFrequency: page.changeFrequency,
            priority: page.priority,
            alternates: {
                languages: {
                    ru: ruUrl,
                    en: enUrl,
                    "x-default": ruUrl,
                },
            },
        });
    }

    // 2. Articles from Sanity
    try {
        const query = `*[_type == "article" && defined(slug.current)] {
            "slug": slug.current,
            _createdAt,
            _updatedAt,
            title,
            title_en,
            "hasEnContent": count(content_en) > 0
        }`;
        const articles = await client.fetch(query);

        if (Array.isArray(articles)) {
            for (const art of articles) {
                if (!art?.slug) continue;

                const ruUrl = `${SITE_URL}/article/${art.slug}`;
                const enUrl = `${SITE_URL}/en/article/${art.slug}`;
                const hasEnTranslation = Boolean(art.hasEnContent && art.title_en && art.title_en.trim() !== art.title);

                const lastMod = art._updatedAt
                    ? new Date(art._updatedAt)
                    : (art._createdAt ? new Date(art._createdAt) : STATIC_LAST_MOD);

                if (hasEnTranslation) {
                    // RU entry with EN alternate
                    urls.push({
                        url: ruUrl,
                        lastModified: lastMod,
                        changeFrequency: "monthly",
                        priority: 0.7,
                        alternates: {
                            languages: {
                                ru: ruUrl,
                                en: enUrl,
                                "x-default": ruUrl,
                            },
                        },
                    });

                    // EN entry
                    urls.push({
                        url: enUrl,
                        lastModified: lastMod,
                        changeFrequency: "monthly",
                        priority: 0.7,
                        alternates: {
                            languages: {
                                ru: ruUrl,
                                en: enUrl,
                                "x-default": ruUrl,
                            },
                        },
                    });
                } else {
                    // Only RU entry (EN is untranslated, excluded from sitemap and noindex)
                    urls.push({
                        url: ruUrl,
                        lastModified: lastMod,
                        changeFrequency: "monthly",
                        priority: 0.7,
                        alternates: {
                            languages: {
                                ru: ruUrl,
                                "x-default": ruUrl,
                            },
                        },
                    });
                }
            }
        }
    } catch (err) {
        // Fallback gracefully without breaking sitemap if Sanity is temporarily unreachable
        console.error("Sitemap Sanity fetch error:", err.message);
    }

    return urls;
}
