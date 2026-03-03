export default {
    name: 'timeline',
    type: 'object',
    title: 'Таймлайн (История)',
    fields: [
        {
            name: 'events',
            type: 'array',
            title: 'События таймлайна',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'year',
                            type: 'string',
                            title: 'Год / Период (Например: 1990-е)'
                        },
                        {
                            name: 'description',
                            type: 'text',
                            title: 'Описание (RU)'
                        },
                        {
                            name: 'description_en',
                            type: 'text',
                            title: 'Description (EN)'
                        }
                    ],
                    preview: {
                        select: {
                            title: 'year',
                            subtitle: 'description'
                        }
                    }
                }
            ]
        }
    ]
}
