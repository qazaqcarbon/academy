/**
 * Helper to produce canonical internal URLs:
 * - Russian ('ru'): no language prefix (e.g. '/article/additionality', '/calculator', '/standards', '/')
 * - English ('en'): prefixed with '/en' (e.g. '/en/article/additionality', '/en/calculator', '/en')
 * 
 * @param {string} locale - 'ru' | 'en'
 * @param {string} path - path or hash (e.g. '/calculator', '/#about', '#academy', '/')
 * @returns {string} canonical href
 */
export function localizedHref(locale = 'ru', path = '/') {
    if (!path) return locale === 'en' ? '/en' : '/';

    // If external or mailto/tel, return as is
    if (/^(https?:|mailto:|tel:|\/\/)/.test(path)) {
        return path;
    }

    // Normalize path to ensure leading slash if it's not a hash-only
    let cleanPath = path;
    if (!cleanPath.startsWith('/') && !cleanPath.startsWith('#')) {
        cleanPath = `/${cleanPath}`;
    }

    // Hash only: e.g. '#academy'
    if (cleanPath.startsWith('#')) {
        return locale === 'en' ? `/en${cleanPath}` : `/${cleanPath}`;
    }

    // Root path '/' or '/#about'
    if (cleanPath === '/') {
        return locale === 'en' ? '/en' : '/';
    }

    if (cleanPath.startsWith('/#')) {
        return locale === 'en' ? `/en${cleanPath.slice(1)}` : cleanPath;
    }

    // Strip out /ru or /en if already prefixed
    if (cleanPath === '/ru') cleanPath = '/';
    else if (cleanPath.startsWith('/ru/')) cleanPath = cleanPath.slice(3);
    else if (cleanPath.startsWith('/ru#')) cleanPath = cleanPath.slice(3);

    if (cleanPath === '/en') cleanPath = '/';
    else if (cleanPath.startsWith('/en/')) cleanPath = cleanPath.slice(3);
    else if (cleanPath.startsWith('/en#')) cleanPath = cleanPath.slice(3);

    if (cleanPath === '/') {
        return locale === 'en' ? '/en' : '/';
    }

    return locale === 'en' ? `/en${cleanPath}` : cleanPath;
}

/**
 * Calculates language switch target URL for RU / EN switcher.
 * @param {string} currentPathname - e.g. '/calculator' or '/en/calculator'
 * @param {string} targetLocale - 'ru' | 'en'
 * @returns {string}
 */
export function getLanguageSwitchHref(currentPathname = '/', targetLocale = 'ru') {
    let path = currentPathname || '/';

    if (path === '/en') path = '/';
    else if (path.startsWith('/en/')) path = path.slice(3);
    else if (path === '/ru') path = '/';
    else if (path.startsWith('/ru/')) path = path.slice(3);

    return localizedHref(targetLocale, path);
}
