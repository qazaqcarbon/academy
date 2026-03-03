import React from "react";
import ArticleLayout from "../../../../components/ArticleLayout";
import styles from "../../../../components/Article.module.css";
import { client } from "../../../../sanity/client";
import { urlFor } from "../../../../sanity/imageBuilder";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

// Настройка стилей для редактора PortableText
const ptComponents = {
    types: {
        image: ({ value }) => {
            if (!value?.asset?._ref) return null;
            return (
                <img
                    alt={value.alt || "Article illustration"}
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
            const text = children?.[0];
            const id = typeof text === 'string' ? text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-а-я]/g, '') : 'section';
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
    const { slug, locale } = params;

    // Fetch original title and localized version
    const article = await client.fetch(`*[_type == "article" && slug.current == $slug][0]{ title, title_en, subtitle, subtitle_en }`, { slug });

    if (!article) return { title: locale === 'ru' ? "Статья не найдена" : "Article not found" };

    const displayTitle = (locale === 'en' && article.title_en) ? article.title_en : article.title;
    const displaySubtitle = (locale === 'en' && article.subtitle_en) ? article.subtitle_en : article.subtitle;

    return {
        title: `${displayTitle} | Qazaq Carbon Academy`,
        description: displaySubtitle,
    };
}

export default async function ArticlePage(props) {
    const params = await props.params;
    const { slug, locale } = params;
    const t = await getTranslations("Article");

    // Fetch original and localized fields
    const article = await client.fetch(`*[_type == "article" && slug.current == $slug][0]`, { slug });

    if (!article) notFound();

    const displayTitle = (locale === 'en' && article.title_en) ? article.title_en : article.title;
    const displaySubtitle = (locale === 'en' && article.subtitle_en) ? article.subtitle_en : article.subtitle;
    const displayBadge = (locale === 'en' && article.badgeText_en) ? article.badgeText_en : (article.badgeText || (article.category === 'standard' ? t("defaultBadgeStandard") : t("defaultBadgeAcademy")));
    const displayContent = (locale === 'en' && article.content_en && article.content_en.length > 0) ? article.content_en : article.content;

    const toc = extractTOC(displayContent);
    const bgImageUrl = article.bgImage ? urlFor(article.bgImage).width(2000).url() : null;

    return (
        <ArticleLayout
            badgeText={displayBadge}
            badgeBg={article.category === 'standard' ? "rgba(45, 77, 124, 0.2)" : "rgba(45, 194, 107, 0.2)"}
            badgeColor={article.category === 'standard' ? "var(--brand-blue)" : "#2dc26b"}
            title={displayTitle}
            subtitle={displaySubtitle}
            toc={toc.length > 0 ? toc : [{ id: "content", label: t("defaultStart") }]}
            bgImage={bgImageUrl}
            showPdfAction={false}
        >
            <PortableText value={displayContent} components={ptComponents} />
        </ArticleLayout>
    );
}
