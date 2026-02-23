"use client";
import React, { useState, useEffect } from "react";
import styles from "./Article.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ArticleLayout({
    badgeText,
    badgeBg = "rgba(46, 139, 87, 0.2)",
    badgeColor = "#4CAF50",
    title,
    subtitle,
    children,
    toc = [],
    bgImage = null,
    showPdfAction = true
}) {
    const pathname = usePathname();
    const [activeId, setActiveId] = useState("");

    useEffect(() => {
        // Simple intersection observer to highlight TOC
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "-80px 0px -60% 0px" }
        );

        const headers = document.querySelectorAll(`.${styles.articleContent} h2[id]`);
        headers.forEach((h) => observer.observe(h));

        return () => {
            headers.forEach((h) => observer.unobserve(h));
        };
    }, [pathname]);

    const handleScrollTo = (e, id) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) {
            window.scrollTo({
                top: el.offsetTop - 80,
                behavior: 'smooth'
            });
        }
        // Update hash silently
        if (history.pushState) {
            history.pushState(null, null, `#${id}`);
        } else {
            location.hash = `#${id}`;
        }
    };

    return (
        <main>
            <header
                className={styles.articleHeader}
                style={bgImage ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url('${bgImage}')` } : {}}
            >
                <div className="container">
                    <div className={styles.articleRegistryBadge} style={{ backgroundColor: badgeBg, color: badgeColor, borderColor: badgeColor }}>
                        {badgeText}
                    </div>
                    <h1 className={styles.articleTitle}>{title}</h1>
                    <p className={styles.articleSubtitle}>{subtitle}</p>
                </div>
            </header>

            <section className="section bg-light" style={{ paddingTop: 0 }}>
                <div className={`container ${styles.articleGrid}`}>
                    <aside className={styles.articleSidebar}>
                        <h3 className={styles.tocTitle}>Содержание</h3>
                        <ul className={styles.tocList}>
                            {toc.map(item => (
                                <li key={item.id}>
                                    <a
                                        href={`#${item.id}`}
                                        className={activeId === item.id || (!activeId && toc[0].id === item.id) ? styles.tocActive : ""}
                                        onClick={(e) => handleScrollTo(e, item.id)}
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        {showPdfAction && (
                            <div className={styles.sidebarAction}>
                                <a href="#" className="btn btn-primary" style={{ width: '100%', textAlign: 'center', padding: '0.8rem', fontSize: '0.9rem' }}>
                                    📄 Скачать PDF оригинал
                                </a>
                            </div>
                        )}
                    </aside>

                    <article className={styles.articleContent}>
                        {children}
                    </article>
                </div>
            </section>
        </main>
    );
}
