import { getTranslations } from 'next-intl/server';

const SITE_URL = "https://academy.qazaqcarbon.com";

export async function generateMetadata({ params }) {
  const locale = (await params).locale || 'ru';
  const t = await getTranslations({ locale, namespace: "Calculator" });

  return {
    title: t("heroTitle1") + " " + t("heroTitle2"),
    alternates: {
      canonical: `${SITE_URL}/${locale}/calculator`,
    },
    openGraph: {
      title: t("heroTitle1") + " " + t("heroTitle2"),
      description: t("heroDesc"),
      url: locale === 'en' ? `${SITE_URL}/en/calculator` : `${SITE_URL}/calculator`,
      images: [
        {
          url: `${SITE_URL}/og.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default function CalculatorLayout({ children }) {
  return children;
}
