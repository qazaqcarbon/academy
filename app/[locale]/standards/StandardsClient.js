"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "./standards.module.css";
import RevealOnScroll from "../../../components/RevealOnScroll";
import { useTranslations } from "next-intl";

export default function StandardsClient({ standards }) {
    const t = useTranslations("Standards");
    const [activeTab, setActiveTab] = useState("all");

    const getTabCategory = (std) => {
        if (std.registry && std.registry !== 'none') {
            return std.registry;
        }
        if (std.registry === 'none') {
            return 'other';
        }
        const lower = (std.badgeText || "").toLowerCase();
        if (lower.includes("verra") || lower.includes("vcs")) return "verra";
        if (lower.includes("gold") || lower.includes("gs")) return "gs";
        if (lower.includes("plan") || lower.includes("pv")) return "pv";
        if (lower.includes("open") || lower.includes("ofp")) return "ofp";
        return "other";
    };

    const filteredStandards = standards.filter(std => {
        if (activeTab === "all") return true;
        return getTabCategory(std) === activeTab;
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
                            {t("filterAll")}
                        </div>
                        <div
                            className={`${styles.filterTab} ${activeTab === 'verra' ? styles.filterTabActive : ''}`}
                            onClick={() => setActiveTab('verra')}
                        >
                            {t("filterVerra")}
                        </div>
                        <div
                            className={`${styles.filterTab} ${activeTab === 'gs' ? styles.filterTabActive : ''}`}
                            onClick={() => setActiveTab('gs')}
                        >
                            {t("filterGs")}
                        </div>
                        <div
                            className={`${styles.filterTab} ${activeTab === 'pv' ? styles.filterTabActive : ''}`}
                            onClick={() => setActiveTab('pv')}
                        >
                            {t("filterPv")}
                        </div>
                        <div
                            className={`${styles.filterTab} ${activeTab === 'ofp' ? styles.filterTabActive : ''}`}
                            onClick={() => setActiveTab('ofp')}
                        >
                            OFP
                        </div>
                    </div>

                    <div className={styles.standardsGrid}>
                        {filteredStandards.map((std, index) => {
                            const category = getTabCategory(std);
                            let registryClass = "";
                            let registryStyle = { background: '#f3f4f6', color: '#4b5563' };
                            let registryName = "Стандарт";

                            if (category === 'verra') {
                                registryClass = styles.registryVerra || "";
                                registryStyle = { background: '#e6f4ea', color: '#1e8e3e' };
                                registryName = "Verra";
                            } else if (category === 'gs') {
                                registryClass = styles.registryGs || "";
                                registryStyle = { background: '#fef7e0', color: '#b06000' };
                                registryName = "Gold Standard";
                            } else if (category === 'pv') {
                                registryClass = styles.registryPlanvivo || "";
                                registryStyle = { background: '#fce8e6', color: '#c5221f' };
                                registryName = "Plan Vivo";
                            } else if (category === 'ofp') {
                                registryStyle = { background: '#e0f2fe', color: '#0284c7' };
                                registryName = "OFP";
                            }

                            return (
                                <RevealOnScroll key={std._id} delay={index * 0.1}>
                                    <div className={`${styles.standardCard} ${registryClass}`}>
                                        <div className={styles.stdMeta}>
                                            <span className={styles.stdRegistry} style={registryStyle}>{registryName}</span>
                                            <span className={styles.stdType}>{std.badgeText || "VCM Standard"}</span>
                                        </div>
                                        <h3 className={styles.stdTitle}>{std.title}</h3>
                                        <p className={styles.stdDesc}>{std.subtitle}</p>
                                        <div className={styles.stdActions}>
                                            <Link href={`/article/${std.slug.current}`} className="btn btn-secondary" style={{ textAlign: 'center', borderColor: 'var(--brand-blue)', color: 'var(--brand-blue)' }}>
                                                {t("readArticle")}
                                            </Link>

                                        </div>
                                    </div>
                                </RevealOnScroll>
                            );
                        })}

                        {filteredStandards.length === 0 && (
                            <p>{t("emptyFilter")}</p>
                        )}
                    </div>

                    <div className="section-header" style={{ marginTop: '4rem' }}>
                        <h2 className="section-title" style={{ fontSize: '2rem' }}>{t("howToTitle")}</h2>
                        <p className="section-desc">
                            {t("howToDesc")}
                            <strong style={{ color: 'var(--brand-blue)' }}> {t("howToBtnHint")}</strong>.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
