// js/ui/icons.js
// Коллекция SVG-иконок в стиле «Скаутская нашивка со строчкой» (Scout Stitched Badges)
// Палитры динамически адаптируются под тему оформления через CSS-переменные:
// 🌲 «Лесная книга» -> «Йеллоустоун и Дикий Запад» (мох, охра, бирюза, терракота, сланец)
// ☀️ «Светлая» -> «Свежий альпийский луг» (сочная трава, ультрамариновое небо, солнце, коралл)
// 🌙 «Тёмная» -> «Ночной костёр в тайге» (сосна в ночи, пламя костра, лунная бирюза, рубин)

const VARS = {
  terracotta: 'var(--badge-red, #D94B3D)',
  teal: 'var(--badge-teal, #3F9295)',
  olive: 'var(--badge-olive, #7F9132)',
  amber: 'var(--badge-amber, #E08E28)',
  slate: 'var(--badge-slate, #30373B)',
  gold: 'var(--badge-gold, #EBB036)'
};

const badge = (innerSvg, bgColor, cls = '', size = 24) => `
  <svg class="svg-icon svg-badge ${cls}" width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" aria-hidden="true" style="display:inline-block;vertical-align:middle;flex-shrink:0;">
    <!-- 1. Тканевый кругляш нашивки -->
    <circle cx="20" cy="20" r="19.5" fill="${bgColor}"/>
    <!-- 2. Белая пунктирная строчка скаутского шва -->
    <circle cx="20" cy="20" r="17.2" fill="none" stroke="#FFFFFF" stroke-opacity="0.65" stroke-dasharray="2.6 1.8" stroke-width="1.3"/>
    <!-- 3. Белый контрастный силуэт символа -->
    <g transform="translate(8, 8)" fill="#FFFFFF" color="${bgColor}">
      ${innerSvg.trim()}
    </g>
  </svg>
`.trim();

export const Icons = {
  // Лапка зверя (бейджи сборника и карточки)
  paw: (cls = '', size = 24) => badge(`
    <ellipse cx="7" cy="9.5" rx="1.5" ry="2"/>
    <ellipse cx="10.5" cy="5.5" rx="1.5" ry="2"/>
    <ellipse cx="14.5" cy="5.5" rx="1.5" ry="2"/>
    <ellipse cx="18" cy="9.5" rx="1.5" ry="2"/>
    <path d="M12.5 11.5c-3 0-5 2-5 4.5 0 2 2 3.5 5 3.5s5-1.5 5-3.5c0-2.5-2-4.5-5-4.5z"/>
  `, VARS.olive, cls, size),

  // Тема «Лесная книга» (Хвойная ель)
  tree: (cls = '', size = 24) => badge(`
    <path d="M12 4L5 12h3l-2.5 5h5v3h3v-3h5l-2.5-5h3L12 4z"/>
  `, VARS.olive, cls, size),

  // Тема «Светлая» (Солнце прерии из референса)
  sun: (cls = '', size = 24) => badge(`
    <circle cx="12" cy="12" r="4.2"/>
    <path d="M12 2l1.2 2.5h2.8l-1.8 2.2 1 2.7-2.6-.8-1.6 2.3-1.6-2.3-2.6.8 1-2.7-1.8-2.2h2.8z"/>
    <path d="M12 22l-1.2-2.5H8l1.8-2.2-1-2.7 2.6.8 1.6-2.3 1.6 2.3 2.6-.8-1 2.7 1.8 2.2h-2.8z"/>
  `, VARS.amber, cls, size),

  // Тема «Тёмная» (Месяц)
  moon: (cls = '', size = 24) => badge(`
    <path d="M19 12.8A7.8 7.8 0 1 1 10.5 4a6.1 6.1 0 0 0 8.5 8.8z"/>
  `, VARS.slate, cls, size),

  // Озвучка включена (Динамик)
  soundOn: (cls = '', size = 24) => badge(`
    <polygon points="10 6 5 9.5 2 9.5 2 14.5 5 14.5 10 18 10 6"/>
    <path d="M14 9a4 4 0 0 1 0 6M17 6a8 8 0 0 1 0 12" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
  `, VARS.teal, cls, size),

  // Озвучка выключена (Тишина)
  soundOff: (cls = '', size = 24) => badge(`
    <polygon points="10 6 5 9.5 2 9.5 2 14.5 5 14.5 10 18 10 6"/>
    <line x1="21" y1="8" x2="15" y2="16" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/>
    <line x1="15" y1="8" x2="21" y2="16" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/>
  `, VARS.terracotta, cls, size),

  // Стрелка назад
  arrowLeft: (cls = '', size = 24) => badge(`
    <path d="M18 12H6M11 7l-5 5 5 5" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  `, VARS.slate, cls, size),

  // Стрелка вперёд
  arrowRight: (cls = '', size = 24) => badge(`
    <path d="M6 12h12M13 7l5 5-5 5" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  `, VARS.teal, cls, size),

  // Кнопка «Начать» (Play)
  play: (cls = '', size = 24) => badge(`
    <polygon points="7 5 19 12 7 19 7 5"/>
  `, VARS.amber, cls, size),

  // Замочек (закрытые истории)
  lock: (cls = '', size = 22) => badge(`
    <rect x="5" y="10.5" width="14" height="9.5" rx="2.5"/>
    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="12" cy="15" r="1.3" fill="var(--badge-red, #D94B3D)"/>
  `, VARS.terracotta, cls, size),

  // Подарок (бесплатная история)
  gift: (cls = '', size = 22) => badge(`
    <polyline points="19 11 19 20 5 20 5 11" fill="none" stroke="#FFFFFF" stroke-width="2"/>
    <rect x="3" y="7" width="18" height="4" rx="1"/>
    <line x1="12" y1="20" x2="12" y2="7" stroke="#FFFFFF" stroke-width="2"/>
    <path d="M12 7H8a2 2 0 0 1 0-4c3 0 4 4 4 4z"/>
    <path d="M12 7h4a2 2 0 0 0 0-4c-3 0-4 4-4 4z"/>
  `, VARS.gold, cls, size),

  // Искра / Звёздочка (премиум)
  sparkle: (cls = '', size = 22) => badge(`
    <path d="M12 3l2.2 6.5L21 12l-6.8 2.5L12 21l-2.2-6.5L3 12l6.8-2.5L12 3z"/>
  `, VARS.gold, cls, size),

  // Круглая галочка (успех, завершено)
  checkCircle: (cls = '', size = 22) => badge(`
    <circle cx="12" cy="12" r="9" fill="none" stroke="#FFFFFF" stroke-width="2"/>
    <polyline points="8 12 11 15 16 9" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  `, VARS.teal, cls, size),

  // Простая галочка в кружке (для списка преимуществ)
  check: (cls = '', size = 20) => badge(`
    <polyline points="6 12 10 16 18 8" fill="none" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  `, VARS.teal, cls, size),

  // Банковская карта / оплата
  card: (cls = '', size = 24) => badge(`
    <rect x="3" y="6" width="18" height="12" rx="2.5"/>
    <line x1="3" y1="10" x2="21" y2="10" stroke="var(--badge-amber, #E08E28)" stroke-width="1.8"/>
    <circle cx="7" cy="14" r="1.2" fill="var(--badge-amber, #E08E28)"/>
  `, VARS.amber, cls, size),

  // E-mail письмо
  mail: (cls = '', size = 22) => badge(`
    <rect x="3" y="6" width="18" height="12" rx="2.5"/>
    <polyline points="4 8 12 13 20 8" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  `, VARS.teal, cls, size),

  // Круговое обновление (проверка СБП)
  refresh: (cls = '', size = 22) => badge(`
    <path d="M20 5v4h-4M4 19v-4h4" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5.5 10a7.5 7.5 0 0 1 12.3-2.5L20 9M4 15l2.2 1.5A7.5 7.5 0 0 0 18.5 14" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
  `, VARS.amber, cls, size),

  // Скачать (DLC контент)
  download: (cls = '', size = 22) => badge(`
    <path d="M19 14v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-4" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
    <polyline points="8 10 12 14 16 10" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="12" y1="14" x2="12" y2="4" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/>
  `, VARS.teal, cls, size),

  // Закрыть (крестик)
  close: (cls = '', size = 20) => badge(`
    <line x1="17" y1="7" x2="7" y2="17" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round"/>
    <line x1="7" y1="7" x2="17" y2="17" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round"/>
  `, VARS.terracotta, cls, size),

  // Костёр (дополнительный атмосферный символ)
  campfire: (cls = '', size = 24) => badge(`
    <path d="M12 3c1.5 2.5 4 4.5 4 7a4 4 0 0 1-8 0c0-1.8 1-3.5 2-4.5.5 1 1.5 1.5 2 1.5z"/>
    <path d="M6 18l12 3M18 18L6 21" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/>
  `, VARS.amber, cls, size)
};
