import React from "react";
import ArticleLayout from "../../../../components/ArticleLayout";
import styles from "../../../../components/Article.module.css";
import { client } from "../../../../sanity/client";
import { urlFor } from "../../../../sanity/imageBuilder";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";

// Настройка стилей для редактора PortableText
const ptComponents = {
    types: {
        image: ({ value }) => {
            if (!value?.asset?._ref) {
                return null;
            }
            return (
                <img
                    alt={value.alt || "Иллюстрация к статье"}
                    loading="lazy"
                    src={urlFor(value).width(1000).url()}
                    className={styles.articleImage}
                />
            );
        },
        infoBox: ({ value }) => (
            <div className={styles.infoBox} style={value.color ? { borderLeftColor: value.color } : {}}>
                {value.title && <h4 style={value.color ? { color: value.color } : {}}>{value.title}</h4>}
                <p>{value.content}</p>
            </div>
        ),
        orgCard: ({ value }) => (
            <div className={styles.orgCard}>
                <div className={styles.orgCardIcon}>{value.icon}</div>
                <div>
                    <h4 className={styles.orgCardTitle}>{value.title}</h4>
                    <PortableText value={value.content || []} components={ptComponents} />
                </div>
            </div>
        ),
        timeline: ({ value }) => (
            <div className={styles.timeline}>
                {value.events?.map((event, index) => (
                    <div key={index} className={styles.timelineItem}>
                        <span className={styles.timelineYear}>{event.year}</span>
                        <p>{event.description}</p>
                    </div>
                ))}
            </div>
        )
    },
    block: {
        h2: ({ children }) => {
            // Генерируем ID из текста для оглавления
            const id = children[0]?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-а-я]/g, '');
            return <h2 id={id}>{children}</h2>;
        },
        h3: ({ children }) => <h3>{children}</h3>,
        normal: ({ children }) => <p>{children}</p>,
        blockquote: ({ children }) => <div className={styles.lawQuote}>{children}</div>
    },
    list: {
        bullet: ({ children }) => <ul>{children}</ul>,
        number: ({ children }) => <ol>{children}</ol>
    },
    listItem: {
        bullet: ({ children }) => <li>{children}</li>,
    }
};

// Функция для извлечения заголовков H2 и создания Оглавления (TOC)
function extractTOC(contentBlocks = []) {
    if (!Array.isArray(contentBlocks)) return [];

    return contentBlocks
        .filter(block => block._type === 'block' && block.style === 'h2')
        .map(block => {
            const text = block.children?.[0]?.text || '';
            const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-а-я]/g, '');
            return { id, label: text };
        });
}


export async function generateMetadata(props) {
    const params = await props.params;
    const { slug } = params;
    const article = await client.fetch(`*[_type == "article" && slug.current == $slug][0]`, { slug });

    if (!article) return { title: "Статья не найдена" };

    return {
        title: `${article.title} | Qazaq Carbon Academy`,
        description: article.subtitle,
    };
}

export default async function ArticlePage(props) {
    const params = await props.params;
    const { slug } = params;

    // Получаем статью из Sanity
    const article = await client.fetch(`*[_type == "article" && slug.current == $slug][0]`, { slug });

    if (!article) {
        notFound();
    }

    // Создаем динамическое оглавление
    const toc = extractTOC(article.content);

    // Достаем картинку, если есть
    const bgImageUrl = article.bgImage ? urlFor(article.bgImage).width(2000).url() : null;

    return (
        <ArticleLayout
            badgeText={article.badgeText || (article.category === 'standard' ? "Стандарт VCM" : "Академия")}
            badgeBg={article.category === 'standard' ? "rgba(45, 77, 124, 0.2)" : "rgba(45, 194, 107, 0.2)"}
            badgeColor={article.category === 'standard' ? "var(--brand-blue)" : "#2dc26b"}
            title={article.title}
            subtitle={article.subtitle}
            toc={toc.length > 0 ? toc : [{ id: "content", label: "Начало" }]}
            bgImage={bgImageUrl}
            showPdfAction={false}
        >
            {/* Главный контент из Sanity CMS */}
            <PortableText value={article.content} components={ptComponents} />
        </ArticleLayout>
    );
}
