import React from "react";
import styles from "./standards.module.css";
import StandardsClient from "./StandardsClient";
import { client } from "../../../sanity/client";
import { getTranslations } from "next-intl/server";

export const revalidate = 60; // Обновлять страницу каждые 60 секунд (ISR)

const SITE_URL = "https://academy.qazaqcarbon.com";

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const rawLocale = resolvedParams?.locale || 'ru';
    const locale = rawLocale === 'en' ? 'en' : 'ru';
    const t = await getTranslations({ locale, namespace: "Meta.StandardsPage" });

    const canonicalUrl = locale === 'en' ? `${SITE_URL}/en/standards` : `${SITE_URL}/standards`;

    return {
        title: t("title"),
        description: t("desc"),
        alternates: {
            canonical: canonicalUrl,
            languages: {
                "ru": `${SITE_URL}/standards`,
                "en": `${SITE_URL}/en/standards`,
                "x-default": `${SITE_URL}/standards`,
            },
        },
        openGraph: {
            title: t("title"),
            description: t("desc"),
            url: canonicalUrl,
            siteName: "Qazaq Carbon Academy",
            locale: locale === "en" ? "en_US" : "ru_RU",
            type: "website",
            images: [
                {
                    url: `${SITE_URL}/og.png`,
                    width: 1200,
                    height: 630,
                },
            ],
        },
    };
}

export default async function StandardsPage(props) {
    const params = await props.params;
    const rawLocale = params?.locale || 'ru';
    const locale = rawLocale === 'en' ? 'en' : 'ru';

    const t = await getTranslations("Standards");
    // Получаем статьи из Sanity (только из категории "Справочник Стандартов")
    const standards = await client.fetch(`
        *[_type == "article" && category == "standard"] | order(_createdAt asc) {
            _id,
            title,
            title_en,
            slug,
            subtitle,
            subtitle_en,
            badgeText,
            badgeText_en,
            category,
            registry
        }
    `);

    return (
        <main>
            <header className={styles.standardsHeader}>
                <div className="container">
                    <div className="hero-badge" style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
                        {t("heroBadge")}
                    </div>
                    <h1 className={styles.standardsTitle}>{t("heroTitle")}</h1>
                    <p className="hero-subtitle" style={{ margin: '0 auto', color: 'rgba(255,255,255,0.8)' }}>
                        {t("heroDesc")}
                    </p>
                </div>
            </header>

            <StandardsClient standards={standards} locale={locale} />
        </main>
    );
}
