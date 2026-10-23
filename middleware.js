import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    locales: ['ru', 'en'],
    defaultLocale: 'ru',
    localePrefix: 'as-needed',
    localeDetection: false
});

export const config = {
    // Skip all paths that should not be internationalized
    matcher: ['/((?!api|_next|studio|robots\\.txt|sitemap\\.xml|.*\\..*).*)']
};
