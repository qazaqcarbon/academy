import { execSync } from 'child_process';
import { chromium } from 'playwright';

const BASE_URL = (process.argv[2] || 'http://localhost:3000').replace(/\/+$/, '');
const SITE_URL = 'https://academy.qazaqcarbon.com';

let totalErrors = 0;
const results = [];

function recordResult(address, code, destinationOrDetails, statusOk, message = '') {
    const isOk = Boolean(statusOk);
    if (!isOk) totalErrors++;
    results.push({
        address,
        code,
        destination: destinationOrDetails,
        status: isOk ? 'ОК' : 'ОШИБКА',
        message
    });
}

async function fetchDirect(url) {
    try {
        const res = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': 'seo-check-bot' } });
        const text = await res.text();
        return {
            status: res.status,
            headers: res.headers,
            text,
            location: res.headers.get('location')
        };
    } catch (e) {
        return { status: 'ERR', error: e.message, text: '' };
    }
}

function normalizePath(urlStr) {
    if (!urlStr) return '';
    try {
        const u = new URL(urlStr, BASE_URL);
        let p = u.pathname;
        if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
        return p || '/';
    } catch {
        return urlStr;
    }
}

function parseHtmlSeo(html) {
    const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
                           html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
    const canonical = canonicalMatch ? canonicalMatch[1] : '';

    const hreflangs = {};
    const hlRegex = /<link[^>]+rel=["']alternate["'][^>]+(?:hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)["']|href=["']([^"']+)["'][^>]+hreflang=["']([^"']+)["'])/gi;
    let m;
    while ((m = hlRegex.exec(html)) !== null) {
        const lang = m[1] || m[4];
        const href = m[2] || m[3];
        hreflangs[lang] = href;
    }

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
                      html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
    const description = descMatch ? descMatch[1].trim() : '';

    const robotsMatch = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i) ||
                        html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']robots["']/i);
    const robots = robotsMatch ? robotsMatch[1].trim() : '';

    const ogLocaleMatch = html.match(/<meta[^>]+property=["']og:locale["'][^>]+content=["']([^"']*)["']/i) ||
                          html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:locale["']/i);
    const ogLocale = ogLocaleMatch ? ogLocaleMatch[1].trim() : '';

    const hasYandexVerif = /<meta[^>]+name=["']yandex-verification["'][^>]+content=["']ea3d9d339b0fad07["']/i.test(html) ||
                           /<meta[^>]+content=["']ea3d9d339b0fad07["'][^>]+name=["']yandex-verification["']/i.test(html);

    const jsonLdBlocks = [];
    const jsonLdRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let jm;
    while ((jm = jsonLdRegex.exec(html)) !== null) {
        try {
            const parsed = JSON.parse(jm[1]);
            if (Array.isArray(parsed)) jsonLdBlocks.push(...parsed);
            else jsonLdBlocks.push(parsed);
        } catch {
            jsonLdBlocks.push({ parseError: true });
        }
    }

    return { canonical, hreflangs, title, description, robots, ogLocale, hasYandexVerif, jsonLdBlocks };
}

async function run() {
    console.log(`\n======================================================`);
    console.log(`🔎 ЗАПУСК SEO_CHECK: ${BASE_URL}`);
    console.log(`======================================================\n`);

    // ─────────────────────────────────────────────────────────────────
    // а) robots.txt и sitemap.xml
    // ─────────────────────────────────────────────────────────────────
    console.log(`[1/6] Проверка /robots.txt и /sitemap.xml...`);
    const robotsRes = await fetchDirect(`${BASE_URL}/robots.txt`);
    const robotsCt = robotsRes.headers?.get('content-type') || '';
    const isTextPlain = robotsCt.includes('text/plain');
    const hasSitemap = robotsRes.text.includes('Sitemap: https://academy.qazaqcarbon.com/sitemap.xml');
    const hasNoHost = !/(?:^|\n)\s*Host:/i.test(robotsRes.text);
    const robotsOk = robotsRes.status === 200 && isTextPlain && hasSitemap && hasNoHost;
    let robotsMsg = '';
    if (!isTextPlain) robotsMsg += `Content-Type: ${robotsCt}; `;
    if (!hasSitemap) robotsMsg += 'Missing or incorrect Sitemap header; ';
    if (!hasNoHost) robotsMsg += 'Found Host directive; ';
    recordResult('/robots.txt', robotsRes.status, 'text/plain, Sitemap, no Host', robotsOk, robotsMsg.trim());

    const sitemapRes = await fetchDirect(`${BASE_URL}/sitemap.xml`);
    const sitemapLocMatches = [...sitemapRes.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    const isXmlValid = sitemapRes.status === 200 && sitemapLocMatches.length > 0;
    recordResult('/sitemap.xml', sitemapRes.status, `Валидный XML (${sitemapLocMatches.length} URL)`, isXmlValid);

    // ─────────────────────────────────────────────────────────────────
    // б) Проверка всех URL из sitemap
    // ─────────────────────────────────────────────────────────────────
    console.log(`[2/6] Проверка каждого URL из sitemap (${sitemapLocMatches.length} шт.)...`);
    for (const locUrl of sitemapLocMatches) {
        const testPath = normalizePath(locUrl);
        const targetFetchUrl = `${BASE_URL}${testPath === '/' ? '' : testPath}`;
        const pageRes = await fetchDirect(targetFetchUrl);

        if (pageRes.status !== 200) {
            recordResult(testPath, pageRes.status, '200 expected', false, 'Страница из sitemap вернула не 200');
            continue;
        }

        const seo = parseHtmlSeo(pageRes.text);
        const canonPath = normalizePath(seo.canonical);
        const canonicalMatch = canonPath === testPath;
        const noIndexAbsent = !seo.robots.includes('noindex');
        const hasTitle = Boolean(seo.title && seo.title.length > 0);
        const hasDesc = Boolean(seo.description && seo.description.length > 0);

        const isEn = testPath.startsWith('/en');
        const expectedOgLocale = isEn ? 'en_US' : 'ru_RU';
        const ogLocaleMatch = seo.ogLocale === expectedOgLocale;

        // Hreflang logic
        const isArticle = testPath.startsWith('/article/');
        let hreflangOk = false;
        let hreflangMsg = '';

        if (isArticle) {
            // RU article without EN translation: must have ru and x-default, NO en
            const hasRu = Boolean(seo.hreflangs.ru);
            const hasXDef = Boolean(seo.hreflangs['x-default']);
            const hasEn = Boolean(seo.hreflangs.en);
            hreflangOk = hasRu && hasXDef && !hasEn;
            if (!hasRu) hreflangMsg += 'нет hreflang ru; ';
            if (!hasXDef) hreflangMsg += 'нет hreflang x-default; ';
            if (hasEn) hreflangMsg += 'hreflang en не должен быть у непереведённой статьи; ';
        } else {
            // Bilingual pages: ru, en, x-default must all exist
            const hasRu = Boolean(seo.hreflangs.ru);
            const hasEn = Boolean(seo.hreflangs.en);
            const hasXDef = Boolean(seo.hreflangs['x-default']);
            hreflangOk = hasRu && hasEn && hasXDef;
            if (!hasRu) hreflangMsg += 'нет hreflang ru; ';
            if (!hasEn) hreflangMsg += 'нет hreflang en; ';
            if (!hasXDef) hreflangMsg += 'нет hreflang x-default; ';
        }

        const yandexOk = seo.hasYandexVerif;

        let failDetails = [];
        if (!canonicalMatch) failDetails.push(`canonical mismatch (got: ${seo.canonical || 'none'})`);
        if (!noIndexAbsent) failDetails.push('содержит noindex');
        if (!hasTitle) failDetails.push('пустой title');
        if (!hasDesc) failDetails.push('пустой description');
        if (!ogLocaleMatch) failDetails.push(`og:locale mismatch (got: ${seo.ogLocale}, expected: ${expectedOgLocale})`);
        if (!hreflangOk) failDetails.push(hreflangMsg.trim());
        if (!yandexOk) failDetails.push('отсутствует yandex-verification');

        const pageOk = canonicalMatch && noIndexAbsent && hasTitle && hasDesc && ogLocaleMatch && hreflangOk && yandexOk;
        recordResult(
            `sitemap: ${testPath}`,
            pageRes.status,
            `canonical: ${canonPath}, og:locale: ${seo.ogLocale}`,
            pageOk,
            failDetails.join('; ')
        );
    }

    // ─────────────────────────────────────────────────────────────────
    // в) Постоянные редиректы /ru и /ru/... (ровно 1 прыжок 308)
    // ─────────────────────────────────────────────────────────────────
    console.log(`[3/6] Проверка 308 редиректов /ru и /ru/...`);
    const redirectTestPaths = [
        { from: '/ru', expectedTo: '/' },
        { from: '/ru/calculator', expectedTo: '/calculator' },
        { from: '/ru/standards', expectedTo: '/standards' },
        { from: '/ru/article/additionality', expectedTo: '/article/additionality' },
        { from: '/ru/article/glossarii', expectedTo: '/article/glossarii' },
    ];

    for (const r of redirectTestPaths) {
        const direct = await fetchDirect(`${BASE_URL}${r.from}`);
        const is308 = direct.status === 308;
        const loc = direct.location || '';
        const locPath = normalizePath(loc);
        const expectedPath = normalizePath(r.expectedTo);
        const locationMatch = locPath === expectedPath;

        const targetRes = await fetchDirect(`${BASE_URL}${expectedPath === '/' ? '' : expectedPath}`);
        const target200 = targetRes.status === 200;

        const isOk = is308 && locationMatch && target200;
        let msg = '';
        if (!is308) msg += `Статус не 308 (получен ${direct.status}); `;
        if (!locationMatch) msg += `Location не ${expectedPath} (получен ${loc}); `;
        if (!target200) msg += `Целевой адрес вернул ${targetRes.status}; `;

        recordResult(r.from, direct.status, `→ ${locPath} [${targetRes.status}]`, isOk, msg.trim());
    }

    // ─────────────────────────────────────────────────────────────────
    // г) Проверка HTML страниц на битые ссылки и невыведенные ключи
    // ─────────────────────────────────────────────────────────────────
    console.log(`[4/6] Проверка HTML страниц на чистоту ссылок и отсутствие невыведенных ключей...`);
    for (const locUrl of sitemapLocMatches) {
        const testPath = normalizePath(locUrl);
        const targetFetchUrl = `${BASE_URL}${testPath === '/' ? '' : testPath}`;
        const pageRes = await fetchDirect(targetFetchUrl);
        const html = pageRes.text;

        // Check for invalid hrefs
        const hrefRegex = /href=["']([^"']+)["']/gi;
        let hm;
        const badHrefs = [];
        while ((hm = hrefRegex.exec(html)) !== null) {
            const rawHref = hm[1];
            if (
                rawHref.startsWith('/robots.txt') ||
                rawHref === '/ru' ||
                rawHref.startsWith('/ru/') ||
                rawHref.startsWith('/ru#') ||
                rawHref === `${SITE_URL}/ru` ||
                rawHref.startsWith(`${SITE_URL}/ru/`) ||
                rawHref === '&' ||
                rawHref === '$' ||
                rawHref === '/&' ||
                rawHref === '/$'
            ) {
                badHrefs.push(rawHref);
            }
        }

        // Check for missing translation keys like HomePage.Timeline...
        const missingKeyMatch = html.match(/HomePage\.[a-zA-Z0-9_.]+/g) || [];

        const isClean = badHrefs.length === 0 && missingKeyMatch.length === 0;
        let cleanMsg = [];
        if (badHrefs.length > 0) cleanMsg.push(`Недопустимые href: [${[...new Set(badHrefs)].join(', ')}]`);
        if (missingKeyMatch.length > 0) cleanMsg.push(`Невыведенные ключи: [${[...new Set(missingKeyMatch)].join(', ')}]`);

        recordResult(
            `cleanliness: ${testPath}`,
            pageRes.status,
            `bad hrefs: ${badHrefs.length}, unrendered keys: ${missingKeyMatch.length}`,
            isClean,
            cleanMsg.join('; ')
        );
    }

    // ─────────────────────────────────────────────────────────────────
    // д) Google Analytics & Consent Mode v2 & чистота репозитория
    // ─────────────────────────────────────────────────────────────────
    console.log(`[5/6] Проверка Google Analytics и Consent Mode v2...`);
    {
        const testRes = await fetchDirect(`${BASE_URL}/`);
        const html = testRes.text;
        const gaIdEnv = process.env.NEXT_PUBLIC_GA_ID;

        if (gaIdEnv) {
            const consentIdx = html.indexOf("gtag('consent', 'default'");
            const gtmIdx = html.indexOf('googletagmanager.com/gtag/js');
            const consentBeforeGtm = consentIdx !== -1 && gtmIdx !== -1 && consentIdx < gtmIdx;

            const hasAnalyticsDenied = /['"]analytics_storage['"]\s*:\s*['"]denied['"]/.test(html);
            const hasAdDenied = /['"]ad_storage['"]\s*:\s*['"]denied['"]/.test(html);
            const hasUserDataDenied = /['"]ad_user_data['"]\s*:\s*['"]denied['"]/.test(html);
            const hasPersonalizationDenied = /['"]ad_personalization['"]\s*:\s*['"]denied['"]/.test(html);

            const allDenied = hasAnalyticsDenied && hasAdDenied && hasUserDataDenied && hasPersonalizationDenied;
            const gaOk = consentBeforeGtm && allDenied;

            recordResult(
                `GA4 Consent Mode (with ID: ${gaIdEnv})`,
                testRes.status,
                `Consent < GTM: ${consentBeforeGtm}, all denied: ${allDenied}`,
                gaOk,
                !gaOk ? 'Consent script must be placed before gtag.js with denied flags' : ''
            );
        } else {
            const hasGtm = html.includes('googletagmanager.com/gtag/js');
            const gaOk = !hasGtm;
            recordResult(
                'GA4 Script Loading (no ID)',
                testRes.status,
                'ID отсутствует -> googletagmanager не загружается',
                gaOk,
                hasGtm ? 'Обнаружен скрипт googletagmanager при отсутствии NEXT_PUBLIC_GA_ID' : ''
            );
        }

        // Git grep hardcoded GA ID
        try {
            const grepRes = execSync('git grep -i "G-HSCTG8CTJR" -- ":!scripts/seo_check.mjs"', { encoding: 'utf8' }).trim();
            if (grepRes.length > 0) {
                recordResult('git grep G-HSCTG8CTJR', 'ERR', 'Найдена захардкоженная строка старого GA ID', false, grepRes.slice(0, 100));
            } else {
                recordResult('git grep G-HSCTG8CTJR', 'CLEAN', '0 совпадений в коде', true);
            }
        } catch {
            recordResult('git grep G-HSCTG8CTJR', 'CLEAN', '0 совпадений в коде', true);
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // е) Playwright Browser Check (гидратация, консоль, переключатель RU/EN)
    // ─────────────────────────────────────────────────────────────────
    console.log(`[6/6] Playwright: Проверка консоли, гидратации и переключателя языков...`);
    try {
        let browser;
        try {
            browser = await chromium.launch({ headless: true });
        } catch {
            browser = await chromium.launch({ channel: 'chrome', headless: true });
        }
        const context = await browser.newContext();
        const testPages = ['/', '/calculator', '/article/additionality'];

        for (const p of testPages) {
            const page = await context.newPage();
            const consoleErrors = [];
            const pageErrors = [];

            page.on('console', msg => {
                if (msg.type() === 'error') {
                    consoleErrors.push(msg.text());
                }
            });
            page.on('pageerror', err => {
                pageErrors.push(err.message);
            });

            await page.goto(`${BASE_URL}${p}`, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(800);

            const hydrationErrors = [...consoleErrors, ...pageErrors].filter(txt =>
                /hydration|hydrate|minified react error/i.test(txt)
            );

            const isOk = consoleErrors.length === 0 && pageErrors.length === 0;
            let errMsg = '';
            if (consoleErrors.length > 0) errMsg += `console errors: [${consoleErrors.slice(0, 2).join('; ')}]; `;
            if (pageErrors.length > 0) errMsg += `page errors: [${pageErrors.slice(0, 2).join('; ')}]; `;
            if (hydrationErrors.length > 0) errMsg += `гидратация нарушена: [${hydrationErrors.slice(0, 2).join('; ')}]; `;

            recordResult(
                `Playwright: ${p}`,
                200,
                `0 errors (console: ${consoleErrors.length}, page: ${pageErrors.length})`,
                isOk,
                errMsg.trim()
            );

            // Test language switch on home page
            if (p === '/') {
                const enLink = page.locator('[data-testid="lang-en"], nav a:has-text("EN")').first();
                if (await enLink.count() > 0) {
                    await enLink.click();
                    await page.waitForTimeout(1000);
                    const switchedToEn = page.url().includes('/en');

                    const ruLink = page.locator('[data-testid="lang-ru"], nav a:has-text("RU")').first();
                    await ruLink.click();
                    await page.waitForTimeout(1000);
                    const switchedToRu = !page.url().includes('/en');

                    const switcherOk = switchedToEn && switchedToRu;
                    recordResult(
                        'Playwright: Переключатель RU/EN',
                        200,
                        'Переключение RU <-> EN работает без ошибок',
                        switcherOk,
                        !switcherOk ? `Сбой перехода при клике RU/EN (switchedToEn: ${switchedToEn}, switchedToRu: ${switchedToRu})` : ''
                    );
                }
            }

            await page.close();
        }

        await browser.close();
    } catch (err) {
        recordResult('Playwright Browser Test', 'ERR', 'Ошибка выполнения Playwright', false, err.message);
    }

    // ─────────────────────────────────────────────────────────────────
    // ВЫВОД ИТОГОВОЙ ТАБЛИЦЫ
    // ─────────────────────────────────────────────────────────────────
    console.log(`\n========================================================================================================================`);
    console.log(`| ${'Адрес / Проверка'.padEnd(38)} | ${'Код'.padEnd(6)} | ${'Куда / Детали'.padEnd(52)} | ${'Статус'.padEnd(8)} |`);
    console.log(`|----------------------------------------|--------|------------------------------------------------------|----------|`);
    for (const r of results) {
        const addr = r.address.slice(0, 38).padEnd(38);
        const code = String(r.code).slice(0, 6).padEnd(6);
        const dest = r.destination.slice(0, 52).padEnd(52);
        const stat = r.status.padEnd(8);
        console.log(`| ${addr} | ${code} | ${dest} | ${stat} |`);
        if (r.message) {
            console.log(`|   ↳ Примечание: ${r.message}`);
        }
    }
    console.log(`========================================================================================================================\n`);

    if (totalErrors === 0) {
        console.log(`🎉 ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ УСПЕШНО! Всего проверок: ${results.length}, Ошибок: 0\n`);
        process.exit(0);
    } else {
        console.error(`❌ ОБНАРУЖЕНЫ ОШИБКИ: ${totalErrors} из ${results.length} проверок завершились неудачей.\n`);
        process.exit(1);
    }
}

run();
