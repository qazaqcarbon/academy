export default {
    name: 'infoBox',
    type: 'object',
    title: 'Информационный блок (Info Box)',
    fields: [
        {
            name: 'title',
            type: 'string',
            title: 'Заголовок блока (RU)'
        },
        {
            name: 'title_en',
            type: 'string',
            title: 'Block Title (EN)'
        },
        {
            name: 'content',
            type: 'text',
            title: 'Текст (RU)',
            validation: Rule => Rule.required()
        },
        {
            name: 'content_en',
            type: 'text',
            title: 'Content Text (EN)'
        },
        {
            name: 'color',
            type: 'string',
            title: 'Цвет акцента',
            options: {
                list: [
                    { title: 'Синий (По умолчанию)', value: 'var(--brand-blue)' },
                    { title: 'Зеленый', value: '#2dc26b' },
                    { title: 'Желтый', value: '#ffc800' },
                    { title: 'Красный', value: '#c5221f' },
                    { title: 'Оранжевый', value: '#b06000' }
                ]
            },
            initialValue: 'var(--brand-blue)'
        }
    ]
}
