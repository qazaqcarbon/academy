import "../globals.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';

const SITE_URL = "https://academy.qazaqcarbon.com";

export async function generateMetadata({ params }) {
  const locale = (await params).locale || 'ru';
  const t = await getTranslations({ locale, namespace: "Meta.HomePage" });

  return {
    title: {
      default: t("title"),
      template: `%s | Qazaq Carbon Academy`,
    },
    description: t("desc"),
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        "ru": `${SITE_URL}/`,
        "en": `${SITE_URL}/en`,
        "x-default": `${SITE_URL}/`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("desc"),
      url: locale === 'en' ? `${SITE_URL}/en` : SITE_URL,
      siteName: "Qazaq Carbon Academy",
      locale: locale === "ru" ? "ru_RU" : "en_US",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SiteLayout({ children, params }) {
  const locale = (await params).locale || 'ru';
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
