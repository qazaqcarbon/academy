export default {
    name: 'carbonPrices',
    title: 'Рыночные цены за tCO₂e',
    type: 'document',
    fields: [
        {
            name: 'low',
            title: 'Консервативный сценарий ($)',
            type: 'number',
            validation: Rule => Rule.required().min(0)
        },
        {
            name: 'base',
            title: 'Базовый сценарий ($)',
            type: 'number',
            validation: Rule => Rule.required().min(0)
        },
        {
            name: 'high',
            title: 'Оптимистичный сценарий ($)',
            type: 'number',
            validation: Rule => Rule.required().min(0)
        }
    ]
}
