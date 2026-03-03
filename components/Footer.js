import React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
    const t = await getTranslations("Footer");
    const year = new Date().getFullYear();

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
                    <Link href="/#about">{t("howItWorks")}</Link>
                    <Link href="/calculator">{t("calculator")}</Link>
                    <Link href="/standards">{t("standards")}</Link>
                    <a href="https://qazaqcarbon.com" target="_blank" rel="noopener noreferrer">{t("mainSite")}</a>
                </div>
                <div className="footer-links">
                    <h4>{t("legalTitle")}</h4>
                    <a href="https://qazaqcarbon.com/privacy" target="_blank" rel="noopener noreferrer">{t("privacy")}</a>
                    <a href="https://qazaqcarbon.com/terms" target="_blank" rel="noopener noreferrer">{t("terms")}</a>
                </div>
                <div className="footer-contact">
                    <h4>{t("contactTitle")}</h4>
                    <p>info@qazaqcarbon.com</p>
                    <p>www.qazaqcarbon.com</p>
                    <a href="https://qazaqcarbon.com/contact" className="btn btn-primary btn-small mt-2">{t("leaveRequest")}</a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>{t("copyright", { year })}</p>
            </div>
        </footer>
    );
}
