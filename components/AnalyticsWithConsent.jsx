'use client';

import React, { useState, useEffect } from 'react';

export default function AnalyticsWithConsent({ locale = 'ru' }) {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            try {
                const saved = localStorage.getItem('qc_consent');
                if (saved === 'granted') {
                    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
                        window.gtag('consent', 'update', {
                            analytics_storage: 'granted',
                        });
                    }
                } else if (!saved) {
                    setShowBanner(true);
                }
            } catch (e) {
                // If localStorage is unavailable, display banner gracefully
                setShowBanner(true);
            }
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    const handleAccept = () => {
        try {
            localStorage.setItem('qc_consent', 'granted');
        } catch (e) { }

        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                analytics_storage: 'granted',
            });
        }
        setShowBanner(false);
    };

    const handleDecline = () => {
        try {
            localStorage.setItem('qc_consent', 'denied');
        } catch (e) { }
        setShowBanner(false);
    };

    const isEn = locale === 'en';
    const privacyHref = isEn ? 'https://qazaqcarbon.com/en/privacy' : 'https://qazaqcarbon.com/privacy';
    const acceptLabel = isEn ? 'Accept' : 'Принять';
    const declineLabel = isEn ? 'Decline' : 'Отклонить';

    return (
        <>
            {gaId && (
                <script
                    id="google-consent-and-gtag"
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('consent', 'default', {
                                'analytics_storage': 'denied',
                                'ad_storage': 'denied',
                                'ad_user_data': 'denied',
                                'ad_personalization': 'denied'
                            });

                            var s = document.createElement('script');
                            s.async = true;
                            s.src = 'https://www.googletagmanager.com/gtag/js?id=${gaId}';
                            document.head.appendChild(s);

                            gtag('js', new Date());
                            gtag('config', '${gaId}');
                        `,
                    }}
                />
            )}

            {/* Cookie Consent Banner */}
            {showBanner && (
                <div
                    role="dialog"
                    aria-label="Cookie Consent"
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 9999,
                        backgroundColor: 'rgba(9, 14, 21, 0.96)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                        boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(12px)',
                        padding: '1rem 1.5rem',
                        fontFamily: 'inherit',
                    }}
                >
                    <div
                        style={{
                            maxWidth: '1280px',
                            margin: '0 auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '1rem',
                        }}
                    >
                        <div style={{ flex: '1 1 320px', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.5' }}>
                            {isEn ? (
                                <span>
                                    We use Google Analytics to understand which parts of the site are useful to visitors. Analytics is enabled only with your consent. Learn more in our{' '}
                                    <a
                                        href={privacyHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            color: '#12c27b',
                                            textDecoration: 'underline',
                                        }}
                                    >
                                        Privacy Policy
                                    </a>
                                    .
                                </span>
                            ) : (
                                <span>
                                    Мы используем Google Analytics, чтобы понимать, какие материалы сайта полезны посетителям. Аналитика включается только с вашего согласия. Подробнее — в{' '}
                                    <a
                                        href={privacyHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            color: '#12c27b',
                                            textDecoration: 'underline',
                                        }}
                                    >
                                        Политике конфиденциальности
                                    </a>
                                    .
                                </span>
                            )}
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                flexShrink: 0,
                            }}
                        >
                            <button
                                type="button"
                                onClick={handleDecline}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    backgroundColor: 'transparent',
                                    color: '#94a3b8',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {declineLabel}
                            </button>
                            <button
                                type="button"
                                onClick={handleAccept}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    backgroundColor: '#12c27b',
                                    color: '#090e15',
                                    border: 'none',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {acceptLabel}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
