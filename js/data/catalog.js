// js/data/catalog.js
// Каталог сборников и рассказов о животных
// Логика доступа (как в kids-story-quest_1):
// 1-я история («Чинк») — полностью бесплатная (isFree: true), все остальные — платные (isFree: false, закрыты до покупки сборника)

export const COLLECTIONS_DATA = [
  {
    id: 'animals_collection_1',
    number: 'Сборник №1',
    title: 'О верности и дружбе',
    subtitle: 'Классические иллюстрированные рассказы о животных с профессиональной озвучкой',
    price: 399,
    oldPrice: 549,
    stories: [
      {
        id: 'seton-chink',
        title: 'Чинк — щенок из Йеллоустоуна',
        author: 'Эрнест Сетон-Томпсон',
        description: 'Трогательная и отважная история щенка, оставленного сторожить лагерь в диких горах перед хитрым и опасным горным койотом.',
        pagesCount: 10,
        readingTime: '6 мин',
        isFree: true,
        isAvailable: true
      },
      {
        id: 'seton-lobo',
        title: 'Лобо — король Куррумпо',
        author: 'Эрнест Сетон-Томпсон',
        description: 'Легенда о неуловимом вожаке волчьей стаи, чья смекалка и безграничная преданность ставили в тупик лучших следопытов прерий.',
        pagesCount: 12,
        readingTime: '8 мин',
        isFree: false,
        isAvailable: true
      }
    ]
  }
];
