import React from "react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-brand">
                    <span className="logo-stack">
                        <span className="logo-top" style={{ color: "#ffffff" }}>QAZAQ</span>
                        <span className="logo-bottom" style={{ color: "#ffffff" }}>CARBON</span>
                    </span>
                    <p className="footer-desc">
                        Qazaq Carbon - платформа для развития добровольного углеродного рынка в Казахстане.
                    </p>
                </div>
                <div className="footer-links">
                    <h4>Разделы</h4>
                    <Link href="/#about">Почему мы?</Link>
                    <Link href="/calculator">Калькулятор</Link>
                    <Link href="/standards">Справочник стандартов</Link>
                </div>
                <div className="footer-contact">
                    <h4>Свяжитесь с нами</h4>
                    <p>info@qazaqcarbon.com</p>
                    <p>www.qazaqcarbon.com</p>
                    <Link href="#" className="btn btn-primary btn-small mt-2">Заказать аудит</Link>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2026 Qazaq Carbon (бренд ТОО SF Analytics). Все права защищены. Интерактивная платформа "Qazaq Carbon Academy".</p>
            </div>
        </footer>
    );
}
