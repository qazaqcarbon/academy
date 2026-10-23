import "../globals.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AnalyticsWithConsent from "../../components/AnalyticsWithConsent";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';

const SITE_URL = "https://academy.qazaqcarbon.com";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const rawLocale = resolvedParams?.locale || 'ru';
  const locale = rawLocale === 'en' ? 'en' : 'ru';
  const t = await getTranslations({ locale, namespace: "Meta.HomePage" });

  const canonicalUrl = locale === 'en' ? `${SITE_URL}/en` : `${SITE_URL}`;

  return {
    title: {
      default: t("title"),
      template: `%s | Qazaq Carbon Academy`,
    },
    description: t("desc"),
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "ru": `${SITE_URL}`,
        "en": `${SITE_URL}/en`,
        "x-default": `${SITE_URL}`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("desc"),
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
    robots: {
      index: true,
      follow: true,
    },
    verification: {
      yandex: "ea3d9d339b0fad07",
    },
  };
}

export default async function SiteLayout({ children, params }) {
  const resolvedParams = await params;
  const rawLocale = resolvedParams?.locale || 'ru';
  const locale = rawLocale === 'en' ? 'en' : 'ru';
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <meta name="yandex-verification" content="ea3d9d339b0fad07" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Navbar locale={locale} />
          {children}
          <Footer locale={locale} />
          <AnalyticsWithConsent locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
