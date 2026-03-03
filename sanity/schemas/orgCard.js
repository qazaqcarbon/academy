export default {
    name: 'orgCard',
    type: 'object',
    title: 'Карточка организации / Ведомства',
    fields: [
        {
            name: 'icon',
            type: 'string',
            title: 'Иконка (Эмодзи или текст)',
            validation: Rule => Rule.required()
        },
        {
            name: 'title',
            type: 'string',
            title: 'Название (RU)',
            validation: Rule => Rule.required()
        },
        {
            name: 'title_en',
            type: 'string',
            title: 'Name (EN)',
        },
        {
            name: 'content',
            type: 'array',
            title: 'Описание функций (RU)',
            of: [{ type: 'block' }]
        },
        {
            name: 'content_en',
            type: 'array',
            title: 'Description (EN)',
            of: [{ type: 'block' }]
        }
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'icon'
        },
        prepare(selection) {
            const { title, subtitle } = selection
            return {
                title: `RU: ${title}`,
                subtitle: subtitle
            }
        }
    }
}
