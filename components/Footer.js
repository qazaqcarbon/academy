import React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { localizedHref } from "../lib/navigation";

export default async function Footer({ locale = 'ru' }) {
    const t = await getTranslations({ locale, namespace: "Footer" });
    const year = new Date().getFullYear();
    const isEn = locale === 'en';

    const privacyUrl = isEn ? "https://qazaqcarbon.com/en/privacy" : "https://qazaqcarbon.com/privacy";
    const termsUrl = isEn ? "https://qazaqcarbon.com/en/terms" : "https://qazaqcarbon.com/terms";
    const contactUrl = isEn ? "https://qazaqcarbon.com/en/contact" : "https://qazaqcarbon.com/contact";
    const mainSiteUrl = isEn ? "https://qazaqcarbon.com/en" : "https://qazaqcarbon.com";

    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-brand">
                    <span className="logo-stack">
                        <span className="logo-top" style={{ color: "#ffffff" }}>QAZAQ</span>
                        <span className="logo-bottom" style={{ color: "#ffffff" }}>CARBON</span>
                    </span>
                    <p className="footer-desc">
                        {t("desc")}
                    </p>
                </div>
                <div className="footer-links">
                    <h4>{t("sectionsTitle")}</h4>
                    <Link href={localizedHref(locale, "/#about")}>{t("howItWorks")}</Link>
                    <Link href={localizedHref(locale, "/calculator")}>{t("calculator")}</Link>
                    <Link href={localizedHref(locale, "/standards")}>{t("standards")}</Link>
                    <a href={mainSiteUrl} target="_blank" rel="noopener noreferrer">{t("mainSite")}</a>
                </div>
                <div className="footer-links">
                    <h4>{t("legalTitle")}</h4>
                    <a href={privacyUrl} target="_blank" rel="noopener noreferrer">{t("privacy")}</a>
                    <a href={termsUrl} target="_blank" rel="noopener noreferrer">{t("terms")}</a>
                </div>
                <div className="footer-contact">
                    <h4>{t("contactTitle")}</h4>
                    <p>info@qazaqcarbon.com</p>
                    <p>www.qazaqcarbon.com</p>
                    <a href={contactUrl} className="btn btn-primary btn-small mt-2">{t("leaveRequest")}</a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>{t("copyright", { year })}</p>
            </div>
        </footer>
    );
}
