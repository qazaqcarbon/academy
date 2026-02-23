import React from "react";
import styles from "./standards.module.css";
import StandardsClient from "./StandardsClient";
import { client } from "../../../sanity/client";

export const revalidate = 60; // Обновлять страницу каждые 60 секунд (ISR)

export default async function StandardsPage() {
    // Получаем статьи из Sanity (только из категории "Справочник Стандартов")
    const standards = await client.fetch(`
        *[_type == "article" && category == "standard"] | order(_createdAt desc) {
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
                        База Знаний VCM
                    </div>
                    <h1 className={styles.standardsTitle}>Справочник Стандартов</h1>
                    <p className="hero-subtitle" style={{ margin: '0 auto', color: 'rgba(255,255,255,0.8)' }}>
                        Оригинальные методологии (PDF) ведущих международных реестров <br />
                        и их краткий перевод на понятный язык для наших партнеров.
                    </p>
                </div>
            </header>

            <StandardsClient standards={standards} />
        </main>
    );
}
