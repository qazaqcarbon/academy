"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
                <Link href="/" className="logo">
                    <img src="/logo.png" alt="Qazaq Carbon" className="nav-logo-img" style={{ height: "45px" }} />
                </Link>
                <div className="nav-links">
                    <Link href="/#about" className="nav-link">Как это работает?</Link>
                    <Link href="/#academy" className="nav-link">Академия (Основы VCM)</Link>
                    <Link
                        href="/standards"
                        className="nav-link"
                        style={pathname === '/standards' ? { color: "var(--brand-blue)", borderBottom: "2px solid var(--brand-blue)" } : {}}
                    >
                        Справочник стандартов
                    </Link>
                </div>
                <Link href="/calculator" className="btn btn-primary nav-btn">Рассчитать потенциал</Link>
            </div>
        </nav>
    );
}
