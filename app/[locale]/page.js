import React from "react";
import Link from "next/link";
import RevealOnScroll from "../../components/RevealOnScroll";
import { client } from "../../sanity/client";
import { urlFor } from "../../sanity/imageBuilder";
import { getTranslations } from "next-intl/server";

export const revalidate = 60; // Обновлять страницу каждые 60 секунд (ISR)

export default async function HomePage(props) {
  const params = await props.params;
  const locale = params.locale || 'ru';
  const t = await getTranslations("HomePage");

  // Fetch articles and include localized fields
  const academyArticles = await client.fetch(`
    *[_type == "article" && category == "academy"] | order(_createdAt asc) {
      _id,
      title,
      title_en,
      slug,
      subtitle,
      subtitle_en,
      badgeText,
      badgeText_en,
      bgImage
    }
  `);

  return (
    <main>
      <header className="hero">
        <div className="hero-bg-accent"></div>
        <div className="container hero-content">
          <div className="hero-badge">{t("Hero.badge")}</div>
          <h1 className="hero-title">
            {t("Hero.title1")} <br />
            <span className="text-highlight">{t("Hero.title2")}</span>
          </h1>
          <p className="hero-subtitle">
            {t("Hero.desc")}
          </p>
          <div className="hero-actions">
            <Link href="/calculator" className="btn btn-primary btn-large">{t("Hero.btnCalculate")}</Link>
            <Link href="#academy" className="btn btn-secondary btn-large">{t("Hero.btnLearn")}</Link>
          </div>
        </div>
      </header>

      <section id="about" className="section bg-light">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t("About.title")}</h2>
            <p className="section-desc">
              {t("About.desc")}
            </p>
          </div>

          <div className="features-grid">
            <RevealOnScroll>
              <div className="feature-card">
                <div className="feature-icon">{t("About.card1Icon")}</div>
                <h3 className="feature-title">{t("About.card1Title")}</h3>
                <p className="feature-text">
                  {t("About.card1Desc")}
                </p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll>
              <div className="feature-card">
                <div className="feature-icon">{t("About.card2Icon")}</div>
                <h3 className="feature-title">{t("About.card2Title")}</h3>
                <p className="feature-text">
                  {t("About.card2Desc")}
                </p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll>
              <div className="feature-card">
                <div className="feature-icon">{t("About.card3Icon")}</div>
                <h3 className="feature-title">{t("About.card3Title")}</h3>
                <p className="feature-text">
                  {t("About.card3Desc")}
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section id="roadmap" className="section bg-dark text-white">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t("Timeline.title")}</h2>
            <p className="section-desc text-light">{t("Timeline.desc")}</p>
          </div>

          <div className="timeline">
            {[1, 2, 3, 4].map((step) => (
              <RevealOnScroll key={step}>
                <div className="timeline-step">
                  <div className="step-marker">{step}</div>
                  <div className="step-content">
                    <h4 className="step-title">{t(`Timeline.step${step}Title`)}</h4>
                    <p className="step-desc">{t(`Timeline.step${step}Desc`)}</p>
                    <div className="step-tags">
                      {t(`Timeline.step${step}Tag1`) && (
                        <span className={`tag ${step === 3 ? 'tag-shared' : 'tag-farmer'}`}>
                          {t(`Timeline.step${step}Tag1`)}
                        </span>
                      )}
                      {t(`Timeline.step${step}Tag2`) && (
                        <span className="tag tag-qazaq">
                          {t(`Timeline.step${step}Tag2`)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section id="academy" className="section bg-light">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t("Academy.title")}</h2>
            <p className="section-desc">{t("Academy.desc")}</p>
          </div>

          <div className="cards-grid">
            {academyArticles.map((article, index) => {
              const bgImageUrl = article.bgImage ? urlFor(article.bgImage).width(800).url() : "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600";
              const displayTitle = (locale === 'en' && article.title_en) ? article.title_en : article.title;
              const displaySubtitle = (locale === 'en' && article.subtitle_en) ? article.subtitle_en : article.subtitle;
              const displayBadge = (locale === 'en' && article.badgeText_en) ? article.badgeText_en : (article.badgeText || t("Academy.defaultBadge"));

              return (
                <RevealOnScroll key={article._id} delay={index * 0.1}>
                  <div className="info-card module-card">
                    <div className="module-img" style={{ backgroundImage: `url('${bgImageUrl}')` }}></div>
                    <div className="module-content">
                      <div className="module-badge" style={{ backgroundColor: "rgba(45,194,107,0.1)", color: "#2dc26b", borderColor: "rgba(45,194,107,0.3)" }}>
                        {displayBadge}
                      </div>
                      <h3 className="module-title">{displayTitle}</h3>
                      <p className="module-text">{displaySubtitle}</p>
                      <Link href={`/${locale}/article/${article.slug.current}`} className="link-btn">{t("Academy.readLesson")}</Link>
                    </div>
                  </div>
                </RevealOnScroll>
              );
            })}
            {academyArticles.length === 0 && (
              <p>{t("Academy.empty")}</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
