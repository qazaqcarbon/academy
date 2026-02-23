export default {
    name: 'orgCard',
    type: 'object',
    title: 'Карточка организации / Ведомства',
    fields: [
        {
            name: 'icon',
            type: 'string',
            title: 'Иконка (Эмодзи или текст, например 💻 или 🏛️)',
            validation: Rule => Rule.required()
        },
        {
            name: 'title',
            type: 'string',
            title: 'Название организации',
            validation: Rule => Rule.required()
        },
        {
            name: 'content',
            type: 'array',
            title: 'Описание функций',
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
                title: `Карточка: ${title}`,
                subtitle: subtitle
            }
        }
    }
}
