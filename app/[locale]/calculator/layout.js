import { getTranslations } from 'next-intl/server';

const SITE_URL = "https://academy.qazaqcarbon.com";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const rawLocale = resolvedParams?.locale || 'ru';
  const locale = rawLocale === 'en' ? 'en' : 'ru';
  const t = await getTranslations({ locale, namespace: "Calculator" });

  const canonicalUrl = locale === 'en' ? `${SITE_URL}/en/calculator` : `${SITE_URL}/calculator`;
  const pageTitle = `${t("heroTitle1")} ${t("heroTitle2")}`;
  const pageDesc = t("heroDesc");

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "ru": `${SITE_URL}/calculator`,
        "en": `${SITE_URL}/en/calculator`,
        "x-default": `${SITE_URL}/calculator`,
      },
    },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: canonicalUrl,
      siteName: "Qazaq Carbon Academy",
      locale: locale === "en" ? "en_US" : "ru_RU",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/og.png`,
          width: 1200,
          height: 630,
          alt: "Qazaq Carbon Academy",
        },
      ],
    },
  };
}

export default function CalculatorLayout({ children }) {
  return children;
}
