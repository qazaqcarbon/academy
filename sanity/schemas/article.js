export default {
    name: 'article',
    type: 'document',
    title: 'Урок Академии / Разбор Стандарта',
    fields: [
        {
            name: 'title',
            type: 'string',
            title: 'Заголовок (H1)',
            validation: Rule => Rule.required()
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
            name: 'badgeText',
            type: 'string',
            title: 'Текст Бейджа (напр. Verra VM0047, Экологический Кодекс)'
        },
        {
            name: 'subtitle',
            type: 'text',
            title: 'Краткое описание (Подзаголовок)'
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
            title: 'Содержание статьи',
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
