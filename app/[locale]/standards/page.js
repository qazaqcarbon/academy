import React from "react";
import styles from "./standards.module.css";
import StandardsClient from "./StandardsClient";
import { client } from "../../../sanity/client";
import { getTranslations } from "next-intl/server";

export const revalidate = 60; // Обновлять страницу каждые 60 секунд (ISR)

export default async function StandardsPage() {
    const t = await getTranslations("Standards");
    // Получаем статьи из Sanity (только из категории "Справочник Стандартов")
    const standards = await client.fetch(`
        *[_type == "article" && category == "standard"] | order(_createdAt asc) {
            _id,
            title,
            slug,
            subtitle,
            badgeText,
            category
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

            <StandardsClient standards={standards} />
        </main>
    );
}
