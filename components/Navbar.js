"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { localizedHref, getLanguageSwitchHref } from "../lib/navigation";

export default function Navbar({ locale = 'ru' }) {
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const t = useTranslations("Navbar");

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isEn = pathname.startsWith('/en') || locale === 'en';
    const currentLocale = isEn ? 'en' : 'ru';

    const ruHref = getLanguageSwitchHref(pathname, 'ru');
    const enHref = getLanguageSwitchHref(pathname, 'en');

    const switchLocale = (targetLocale) => {
        if (typeof document !== 'undefined') {
            document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000`;
        }
        const targetHref = getLanguageSwitchHref(pathname, targetLocale);
        router.push(targetHref);
    };

    return (
        <nav
            className="navbar"
            id="navbar"
            style={{
                backgroundColor: scrolled ? "rgba(255, 255, 255, 0.98)" : "rgba(231, 232, 234, 0.95)",
                boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.05)" : "none",
                transition: "all 0.3s ease",
            }}
        >
            <div className="container nav-container">
                <Link href={localizedHref(currentLocale, "/")} className="logo">
                    <img src="/logo.png" alt="Qazaq Carbon" className="nav-logo-img" style={{ height: "45px" }} />
                </Link>
                <div className="nav-links">
                    <Link href={localizedHref(currentLocale, "/#about")} className="nav-link">{t("howItWorks")}</Link>
                    <Link href={localizedHref(currentLocale, "/#academy")} className="nav-link">{t("academy")}</Link>
                    <Link
                        href={localizedHref(currentLocale, "/standards")}
                        className="nav-link"
                        style={pathname === '/standards' || pathname === '/en/standards'
                            ? { color: "var(--brand-blue)", borderBottom: "2px solid var(--brand-blue)" }
                            : {}}
                    >
                        {t("standards")}
                    </Link>
                </div>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontFamily: 'var(--font-heading)', fontSize: '14px', marginRight: '1rem' }}>
                        <Link
                            href={ruHref}
                            data-testid="lang-ru"
                            onClick={(e) => {
                                e.preventDefault();
                                switchLocale('ru');
                            }}
                            style={{ cursor: 'pointer', color: !isEn ? 'var(--brand-blue)' : '#aaa', textDecoration: !isEn ? 'underline' : 'none' }}
                        >
                            RU
                        </Link>
                        <span style={{ color: '#ccc' }}>|</span>
                        <Link
                            href={enHref}
                            data-testid="lang-en"
                            onClick={(e) => {
                                e.preventDefault();
                                switchLocale('en');
                            }}
                            style={{ cursor: 'pointer', color: isEn ? 'var(--brand-blue)' : '#aaa', textDecoration: isEn ? 'underline' : 'none' }}
                        >
                            EN
                        </Link>
                    </div>
                    <Link href={localizedHref(currentLocale, "/calculator")} className="btn btn-primary nav-btn">{t("calculate")}</Link>
                </div>
            </div>
        </nav>
    );
}
