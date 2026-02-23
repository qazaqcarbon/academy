"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "./standards.module.css";
import RevealOnScroll from "../../../components/RevealOnScroll";

export default function StandardsClient({ standards }) {
    const [activeTab, setActiveTab] = useState("all");

    // Временная заглушка для категорий/реестров. 
    // В идеале можно брать это из самой схемы Sanity (например, поле реестра).
    const getTabCategory = (badgeText) => {
        const lower = (badgeText || "").toLowerCase();
        if (lower.includes("verra") || lower.includes("vcs")) return "verra";
        if (lower.includes("gold") || lower.includes("gs")) return "gs";
        if (lower.includes("plan") || lower.includes("pv")) return "pv";
        return "other";
    };

    const filteredStandards = standards.filter(std => {
        if (activeTab === "all") return true;
        return getTabCategory(std.badgeText) === activeTab;
    });

    return (
        <>
            <section className="section bg-light">
                <div className="container">
                    <div className={styles.filterTabs}>
                        <div
                            className={`${styles.filterTab} ${activeTab === 'all' ? styles.filterTabActive : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            Все стандарты
                        </div>
                        <div
                            className={`${styles.filterTab} ${activeTab === 'verra' ? styles.filterTabActive : ''}`}
                            onClick={() => setActiveTab('verra')}
                        >
                            Verra (VCS)
                        </div>
                        <div
                            className={`${styles.filterTab} ${activeTab === 'gs' ? styles.filterTabActive : ''}`}
                            onClick={() => setActiveTab('gs')}
                        >
                            Gold Standard
                        </div>
                        <div
                            className={`${styles.filterTab} ${activeTab === 'pv' ? styles.filterTabActive : ''}`}
                            onClick={() => setActiveTab('pv')}
                        >
                            Plan Vivo
                        </div>
                    </div>

                    <div className={styles.standardsGrid}>
                        {filteredStandards.map((std, index) => {
                            const category = getTabCategory(std.badgeText);
                            let registryClass = styles.registryVerra;
                            let registryStyle = { background: '#e6f4ea', color: '#1e8e3e' };
                            let registryName = "Verra";

                            if (category === 'gs') {
                                registryClass = styles.registryGs;
                                registryStyle = { background: '#fef7e0', color: '#b06000' };
                                registryName = "Gold Standard";
                            } else if (category === 'pv') {
                                registryClass = styles.registryPlanvivo;
                                registryStyle = { background: '#fce8e6', color: '#c5221f' };
                                registryName = "Plan Vivo";
                            }

                            return (
                                <RevealOnScroll key={std._id} delay={index * 0.1}>
                                    <div className={`${styles.standardCard} ${registryClass}`}>
                                        <div className={styles.stdMeta}>
                                            <span className={styles.stdRegistry} style={registryStyle}>{registryName}</span>
                                            <span className={styles.stdType}>{std.badgeText || "Стандарт VCM"}</span>
                                        </div>
                                        <h3 className={styles.stdTitle}>{std.title}</h3>
                                        <p className={styles.stdDesc}>{std.subtitle}</p>
                                        <div className={styles.stdActions}>
                                            <Link href={`/article/${std.slug.current}`} className="btn btn-secondary" style={{ textAlign: 'center', borderColor: 'var(--brand-blue)', color: 'var(--brand-blue)' }}>
                                                Читать разбор простым языком
                                            </Link>
                                            <a href="#" className={styles.btnPdf}>
                                                <span className={styles.iconPdf}>📄</span> Скачать оригинал (PDF)
                                            </a>
                                        </div>
                                    </div>
                                </RevealOnScroll>
                            );
                        })}

                        {filteredStandards.length === 0 && (
                            <p>Стандарты для этого реестра пока не добавлены.</p>
                        )}
                    </div>

                    <div className="section-header" style={{ marginTop: '4rem' }}>
                        <h2 className="section-title" style={{ fontSize: '2rem' }}>Инструкция по работе с документами</h2>
                        <p className="section-desc">
                            Оригинальные англоязычные PDF-документы предназначены в первую очередь для наших инженеров и аудиторов.
                            Для вашего удобства мы подготовили краткие выжимки-переводы по кнопке
                            <strong style={{ color: 'var(--brand-blue)' }}> «Читать разбор простым языком»</strong>.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
