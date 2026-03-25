export default {
    name: 'article',
    type: 'document',
    title: 'Урок Академии / Разбор Стандарта',
    fields: [
        {
            name: 'title',
            type: 'string',
            title: 'Заголовок (RU)',
            validation: Rule => Rule.required()
        },
        {
            name: 'title_en',
            type: 'string',
            title: 'Title (EN)',
        },
        {
            name: 'slug',
            type: 'slug',
            title: 'URL (Slug)',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: Rule => Rule.required()
        },
        {
            name: 'category',
            type: 'string',
            title: 'Категория',
            options: {
                list: [
                    { title: 'Основы VCM (Академия)', value: 'academy' },
                    { title: 'Справочник Стандартов', value: 'standard' }
                ]
            },
            validation: Rule => Rule.required()
        },
        {
            name: 'registry',
            type: 'string',
            title: 'Регистр / Стандарт (Бейдж слева)',
            description: 'Выберите регистр, чтобы окрасить левый бейдж в правильный цвет (Verra, Gold Standard, PLAN VIVO, OFP и др.)',
            options: {
                list: [
                    { title: 'Включить в Verra', value: 'verra' },
                    { title: 'Включить в Gold Standard', value: 'gs' },
                    { title: 'Включить в Plan Vivo', value: 'pv' },
                    { title: 'Включить в Open Forest Protocol (OFP)', value: 'ofp' },
                    { title: 'Без регистра (Просто Стандарт)', value: 'none' }
                ]
            }
        },
        {
            name: 'badgeText',
            type: 'string',
            title: 'Текст Бейджа (RU) (напр. Verra VM0047, Экологический Кодекс)'
        },
        {
            name: 'badgeText_en',
            type: 'string',
            title: 'Badge Text (EN)',
        },
        {
            name: 'subtitle',
            type: 'text',
            title: 'Краткое описание (RU) (Подзаголовок)'
        },
        {
            name: 'subtitle_en',
            type: 'text',
            title: 'Subtitle (EN)',
        },
        {
            name: 'bgImage',
            type: 'image',
            title: 'Фоновое изображение',
            options: {
                hotspot: true
            }
        },
        {
            name: 'content',
            type: 'array',
            title: 'Содержание статьи (RU)',
            of: [
                { type: 'block' },
                { type: 'image' },
                { type: 'infoBox' },
                { type: 'orgCard' },
                { type: 'timeline' }
            ]
        },
        {
            name: 'content_en',
            type: 'array',
            title: 'Article Content (EN)',
            of: [
                { type: 'block' },
                { type: 'image' },
                { type: 'infoBox' },
                { type: 'orgCard' },
                { type: 'timeline' }
            ]
        }
    ]
}
