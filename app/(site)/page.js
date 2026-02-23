import React from "react";
import Link from "next/link";
import RevealOnScroll from "../../components/RevealOnScroll";
import { client } from "../../sanity/client";
import { urlFor } from "../../sanity/imageBuilder";

export const revalidate = 60; // Обновлять страницу каждые 60 секунд (ISR)

export default async function HomePage() {
  const academyArticles = await client.fetch(`
    *[_type == "article" && category == "academy"] | order(_createdAt asc) {
      _id,
      title,
      slug,
      subtitle,
      badgeText,
      bgImage
    }
  `);

  return (
    <main>
      <header className="hero">
        <div className="hero-bg-accent"></div>
        <div className="container hero-content">
          <div className="hero-badge">Прозрачный Стандарт VCM</div>
          <h1 className="hero-title">
            Превращаем ваши правильные агро-практики <br />
            <span className="text-highlight">в реальный доход</span>
          </h1>
          <p className="hero-subtitle">
            Понятный интерактивный путеводитель по стандартам добровольного рынка. Узнайте, как строгие международные
            требования конвертируются в безопасность и прибыль для вашего хозяйства.
          </p>
          <div className="hero-actions">
            <Link href="/calculator" className="btn btn-primary btn-large">Рассчитать потенциал</Link>
            <Link href="#academy" className="btn btn-secondary btn-large">Начать обучение</Link>
          </div>
        </div>
      </header>

      <section id="about" className="section bg-light">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Почему процесс такой строгий?</h2>
            <p className="section-desc">
              Одобрение мировых верификаторов требует работы с сотнями деталей. Мы забираем всю сложную экспертизу на себя, оставляя вам прозрачность действий.
            </p>
          </div>

          <div className="features-grid">
            <RevealOnScroll>
              <div className="feature-card">
                <div className="feature-icon">🛡️</div>
                <h3 className="feature-title">Снятие рисков</h3>
                <p className="feature-text">
                  Мы берем на себя ответственность за полное соответствие вашего проекта сложным методикам международных стандартов (Verra, Gold Standard).
                </p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3 className="feature-title">Точность данных</h3>
                <p className="feature-text">
                  Мы организуем сбор требуемых данных, необходимых для обоснования базовой линии и подтверждения дополнительности проекта.
                </p>
              </div>
            </RevealOnScroll>
            <RevealOnScroll>
              <div className="feature-card">
                <div className="feature-icon">🤝</div>
                <h3 className="feature-title">Уверенность в результате</h3>
                <p className="feature-text">
                  Глобальные инвесторы платят только за верифицированные единицы. Наш процесс гарантирует, что ваша работа будет подтверждена аудитом.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section id="roadmap" className="section bg-dark text-white">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Жизненный цикл проекта</h2>
            <p className="section-desc text-light">Интерактивная карта: ваш путь от первоначальной идеи до выпуска первых углеродных кредитов.</p>
          </div>

          <div className="timeline">
            <RevealOnScroll>
              <div className="timeline-step">
                <div className="step-marker">1</div>
                <div className="step-content">
                  <h4 className="step-title">Идея и Оценка (ТЭО)</h4>
                  <p className="step-desc">Оценка потенциала земель. Мы проводим первичный аудит, выбираем оптимальную методологию и стандарта (ARR, SOC).</p>
                  <div className="step-tags">
                    <span className="tag tag-farmer">Ваша задача: Данные контуров</span>
                    <span className="tag tag-qazaq">Наша задача: ТЭО, Прогнозы</span>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll>
              <div className="timeline-step">
                <div className="step-marker">2</div>
                <div className="step-content">
                  <h4 className="step-title">Разработка документации (PDD)</h4>
                  <p className="step-desc">Многостраничное обоснование проекта для регистра: почему проект важен и какова его базовая линия.</p>
                  <div className="step-tags">
                    <span className="tag tag-farmer">Ваша задача: История земель</span>
                    <span className="tag tag-qazaq">Наша задача: Написание PDD</span>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll>
              <div className="timeline-step">
                <div className="step-marker">3</div>
                <div className="step-content">
                  <h4 className="step-title">Валидация (VVB)</h4>
                  <p className="step-desc">Независимый международный аудит проектной документации до старта проекта.</p>
                  <div className="step-tags">
                    <span className="tag tag-shared">Совместная задача: Ответы на запросы аудиторов</span>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
            <RevealOnScroll>
              <div className="timeline-step">
                <div className="step-marker">4</div>
                <div className="step-content">
                  <h4 className="step-title">Мониторинг (MRV)</h4>
                  <p className="step-desc">Использование космоснимков (dMRV), датчиков и отчетов для подтверждения роста леса и улучшения почв.</p>
                  <div className="step-tags">
                    <span className="tag tag-farmer">Ваша задача: Следование плану</span>
                    <span className="tag tag-qazaq">Наша задача: Сброр данных (MRV)</span>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section id="academy" className="section bg-light">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Академия (Основы VCM)</h2>
            <p className="section-desc">Ключевые принципы, о которых вам предстоит часто слышать во время сотрудничества.</p>
          </div>

          <div className="cards-grid">
            {academyArticles.map((article, index) => {
              const bgImageUrl = article.bgImage ? urlFor(article.bgImage).width(800).url() : "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600";
              return (
                <RevealOnScroll key={article._id} delay={index * 0.1}>
                  <div className="info-card module-card">
                    <div className="module-img" style={{ backgroundImage: `url('${bgImageUrl}')` }}></div>
                    <div className="module-content">
                      <div className="module-badge" style={{ backgroundColor: "rgba(45,194,107,0.1)", color: "#2dc26b", borderColor: "rgba(45,194,107,0.3)" }}>
                        {article.badgeText || "Урок Академии"}
                      </div>
                      <h3 className="module-title">{article.title}</h3>
                      <p className="module-text">{article.subtitle}</p>
                      <Link href={`/article/${article.slug.current}`} className="link-btn">Смотреть урок ➔</Link>
                    </div>
                  </div>
                </RevealOnScroll>
              );
            })}
            {academyArticles.length === 0 && (
              <p>Уроки Академии пока не загружены.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
