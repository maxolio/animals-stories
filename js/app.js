// js/app.js
// Главный координатор приложения интерактивных рассказов о животных («Живые Истории»)
// Логика доступа по образцу kids-story-quest_1:
// 1-я история («Чинк») бесплатна целиком, остальные закрыты (при клике — только звук замочка и анимация),
// покупка и восстановление всего сборника — через верхнюю кнопку «Купить» и Родительский контроль.

import { COLLECTIONS_DATA } from './data/catalog.js';
import { getStory } from './data/storiesRegistry.js';
import { soundManager } from './engine/sound.js';
import {
  fetchRobokassaUrl,
  checkPremiumStatus,
  fetchCloudUnlockedParts,
  restoreByEmail
} from './engine/robokassa.js';
import {
  initContentDownloader,
  isPartDownloaded,
  getAssetPath,
  downloadAndInstallPart
} from './engine/contentDownloader.js';

const ENABLE_PAYWALL = true;

const THEMES = [
  { id: 'forest', icon: '🌲', label: 'Лесная книга', metaColor: '#EAE0D0' },
  { id: 'light',  icon: '☀️', label: 'Светлая',      metaColor: '#F1F5F9' },
  { id: 'dark',   icon: '🌙', label: 'Тёмная',       metaColor: '#0F171E' }
];

class App {
  constructor() {
    this.appContainer = document.getElementById('app-container');
    window.__app = this;

    // Быстрые команды для консоли браузера (F12)
    window.unlock = () => {
      this.unlockCollection('animals_collection_1');
      console.log('✅ Сборник №1 разблокирован! Все истории открыты.');
      return 'OK: Unlocked';
    };
    window.lock = () => {
      this.lockCollectionForTest('animals_collection_1');
      console.log('🔒 Сборник №1 заблокирован! Открыта только бесплатная история «Чинк».');
      return 'OK: Locked';
    };
    console.info('💡 Команды для тестирования в консоли: unlock() — открыть все истории, lock() — вернуть замок.');

    this.currentTheme = this.getStorage('animals_theme') || 'forest';
    this.applyTheme(this.currentTheme);

    this.state = {
      screen: 'HOME', // 'HOME' | 'COLLECTION' | 'READER'
      selectedCollectionId: 'animals_collection_1',
      selectedStoryId: 'seton-chink',
      currentPage: 1
    };

    this.slideTimers = [];
    this.currentSlideIndex = 0;
    this.storyStarted = false;
    this._toastTimer = null;
    this._isVerifyingPayment = false;

    const unlockAudio = () => soundManager.initContext();
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });

    initContentDownloader();
    this.initLifecycle();
    this.checkPaymentReturn();
    this.syncCloudSubscription();
    this.render();
  }

  initLifecycle() {
    // Перехват возврата из браузера / банка (в веб-версии и Android WebView / Capacitor)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.handleAppRestore();
      }
    });

    window.addEventListener('pageshow', () => {
      this.handleAppRestore();
    });

    const CapApp = window.Capacitor?.Plugins?.App;
    if (CapApp && !window.__animalsCapInitialized) {
      window.__animalsCapInitialized = true;
      CapApp.addListener('appUrlOpen', (event) => {
        const url = event?.url || '';
        if (url.includes('payment')) {
          window.Capacitor?.Plugins?.Browser?.close().catch(() => {});
          this.verifyPaymentAfterReturn(15);
        }
      });
    }
  }

  handleAppRestore() {
    const pendingCollection = this.getStorage('animals_pending_collection');
    if (pendingCollection && !this.isCollectionUnlocked(pendingCollection)) {
      this.verifyPaymentAfterReturn(12);
    }
  }

  clearSlideTimers() {
    if (this.slideTimers && this.slideTimers.length > 0) {
      this.slideTimers.forEach(id => clearTimeout(id));
    }
    this.slideTimers = [];
  }

  getPageSlides(story, pageData) {
    if (Array.isArray(pageData.slides) && pageData.slides.length > 0) {
      return pageData.slides.map((s, idx) => ({
        image: getAssetPath(s.image || ''),
        svg: s.svg || pageData.svg || story.coverSvg || '',
        at: typeof s.at === 'number' ? s.at : idx * 15,
        sceneBrief: s.sceneBrief || pageData.sceneBrief || ''
      }));
    }
    return [
      {
        image: getAssetPath(pageData.image || ''),
        svg: pageData.svg || story.coverSvg || '',
        at: 0,
        sceneBrief: pageData.sceneBrief || ''
      }
    ];
  }

  getStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  setStorage(key, val) {
    try {
      localStorage.setItem(key, val);
    } catch (e) {}
  }

  removeStorage(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }

  showToast(message) {
    let toast = document.querySelector('.app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'app-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('visible');
    if (this._toastTimer) clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2600);
  }

  isCollectionUnlocked(collectionId = 'animals_collection_1') {
    if (!ENABLE_PAYWALL) return true;
    return this.getStorage(`animals_unlocked_${collectionId}`) === 'true';
  }

  unlockCollection(collectionId = 'animals_collection_1') {
    this.setStorage(`animals_unlocked_${collectionId}`, 'true');
    this.removeStorage('animals_pending_collection');
    this.render();
  }

  lockCollectionForTest(collectionId = 'animals_collection_1') {
    this.removeStorage(`animals_unlocked_${collectionId}`);
    this.removeStorage('animals_pending_collection');
    this.render();
  }

  isStoryUnlocked(storyId, collectionId = 'animals_collection_1') {
    if (!ENABLE_PAYWALL) return true;
    if (this.isCollectionUnlocked(collectionId)) return true;

    const collection = COLLECTIONS_DATA.find(c => c.id === collectionId) || COLLECTIONS_DATA[0];
    const catalogItem = collection?.stories?.find(s => s.id === storyId);
    if (catalogItem && catalogItem.isFree) return true;

    const fullStory = getStory(storyId);
    return Boolean(fullStory?.isFree);
  }

  async syncCloudSubscription() {
    try {
      const parts = await fetchCloudUnlockedParts();
      if (Array.isArray(parts) && parts.length > 0) {
        parts.forEach(p => {
          if (!this.isCollectionUnlocked(p)) {
            this.unlockCollection(p);
          }
        });
        return;
      }
      const isCloudPremium = await checkPremiumStatus('animals_collection_1');
      if (isCloudPremium && !this.isCollectionUnlocked('animals_collection_1')) {
        this.unlockCollection('animals_collection_1');
      }
    } catch (e) {}
  }

  checkPaymentReturn() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (
        urlParams.get('status') === 'success' ||
        urlParams.get('payment') === 'success' ||
        urlParams.get('InvId')
      ) {
        window.history.replaceState({}, document.title, window.location.pathname);
        this.verifyPaymentAfterReturn();
      }
    } catch (e) {}
  }

  handlePaymentSuccess(collectionId = 'animals_collection_1') {
    const targetId = collectionId || this.getStorage('animals_pending_collection') || 'animals_collection_1';
    this.unlockCollection(targetId);
    setTimeout(() => {
      soundManager.playStarBell();
      this.showSuccessModal(
        'Оплата прошла успешно! 🎉',
        'Полный доступ к «Сборнику №1: Зов дикой природы» навсегда активирован. Приятного чтения!'
      );
    }, 250);
  }

  async verifyPaymentAfterReturn(retries = 15) {
    if (this._isVerifyingPayment) return;
    this._isVerifyingPayment = true;

    const pendingId = this.getStorage('animals_pending_collection') || 'animals_collection_1';
    window.Capacitor?.Plugins?.Browser?.close().catch(() => {});

    try {
      for (let i = 0; i < retries; i++) {
        const isPremium = await checkPremiumStatus(pendingId);
        if (isPremium) {
          document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
          this.handlePaymentSuccess(pendingId);
          return;
        }
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    } finally {
      this._isVerifyingPayment = false;
    }
  }

  applyTheme(themeId) {
    const found = THEMES.find(t => t.id === themeId) || THEMES[0];
    this.currentTheme = found.id;
    document.documentElement.setAttribute('data-theme', found.id);
    this.setStorage('animals_theme', found.id);

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', found.metaColor);
    }
  }

  cycleTheme() {
    const idx = THEMES.findIndex(t => t.id === this.currentTheme);
    const next = THEMES[(idx + 1) % THEMES.length];
    soundManager.playMenuTap();
    this.applyTheme(next.id);
    this.render();
  }

  getThemeMeta() {
    return THEMES.find(t => t.id === this.currentTheme) || THEMES[0];
  }

  navigate(screen, params = {}) {
    this.clearSlideTimers();
    soundManager.stopVoice();
    this.state.screen = screen;
    if (params.selectedCollectionId !== undefined) this.state.selectedCollectionId = params.selectedCollectionId;
    if (params.selectedStoryId !== undefined) {
      this.state.selectedStoryId = params.selectedStoryId;
      this.storyStarted = false;
    }
    if (screen === 'COLLECTION' || screen === 'HOME') {
      this.storyStarted = false;
    }
    if (params.currentPage !== undefined) this.state.currentPage = params.currentPage;
    this.render();
  }

  renderHeaderControls() {
    const themeMeta = this.getThemeMeta();
    const soundOn = soundManager.speechEnabled;
    return `
      <div class="header-controls">
        <button class="btn-icon" id="btnCycleTheme" title="Тема: ${themeMeta.label}">
          ${themeMeta.icon}
        </button>
        <button class="btn-icon ${soundOn ? '' : 'muted'}" id="btnToggleSound" title="${soundOn ? 'Озвучка включена (нажмите, чтобы читать в тишине)' : 'Озвучка выключена'}">
          ${soundOn ? '🔊' : '🔇'}
        </button>
      </div>
    `;
  }

  bindHeaderControls(onSoundToggle) {
    const btnTheme = document.getElementById('btnCycleTheme');
    if (btnTheme) {
      btnTheme.addEventListener('click', () => this.cycleTheme());
    }

    const btnSound = document.getElementById('btnToggleSound');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        soundManager.playMenuTap();
        const isNowOn = soundManager.toggleSpeech();
        if (typeof onSoundToggle === 'function') {
          onSoundToggle(isNowOn);
        } else {
          this.render();
        }
      });
    }
  }

  render() {
    if (this.state.screen === 'HOME') {
      this.renderHomeScreen();
    } else if (this.state.screen === 'COLLECTION') {
      this.renderCollectionScreen();
    } else if (this.state.screen === 'READER') {
      this.renderReaderScreen();
    }
  }

  // ==========================================================================
  // 1. ГЛАВНЫЙ ЭКРАН (Выбор сборника + переключатель 3 тем)
  // ==========================================================================
  renderHomeScreen() {
    const collection = COLLECTIONS_DATA[0];
    const isUnlocked = this.isCollectionUnlocked(collection.id);
    const totalStories = collection.stories.length;

    this.appContainer.innerHTML = `
      <header class="header-bar">
        <div class="header-title-wrap">
          <div class="header-title">Аудио Истории</div>
        </div>
        ${this.renderHeaderControls()}
      </header>

      <main class="screen-scrollable">
        <section class="hero-banner">
          <div class="hero-banner-badge">Для детей и семейного чтения</div>
          <h1 class="hero-banner-title">Истории о природе и человеке</h1>
          <p class="hero-banner-desc">
            Великие рассказы о силе духа, преданности и неповторимом характере каждого зверя. Мы открываем детям подлинную красоту дикого мира и учим беречь жизнь во всех её проявлениях.
          </p>

          <!-- Быстрое переключение 3 тем оформления -->
          <div class="theme-pill-bar" style="margin-top: 4px;">
            ${THEMES.map(t => `
              <button class="theme-chip ${this.currentTheme === t.id ? 'active' : ''}" data-set-theme="${t.id}">
                <span>${t.icon}</span>
                <span>${t.label}</span>
              </button>
            `).join('')}
          </div>
        </section>

        <!-- Карточка Сборника №1 -->
        <section class="collection-card" id="cardOpenCollection1">
          <div class="collection-card-top">
            <div class="collection-badge-icon">🐾</div>
            <div class="collection-card-info">
              <div class="collection-card-label">
                <span class="collection-number-badge">${collection.number}</span>
              </div>
              <div class="collection-card-title">${collection.title}</div>
              <div class="collection-card-sub">${collection.subtitle}</div>
            </div>
          </div>

          <button class="btn-primary-action" id="btnOpenCollection1">
            <span>Открыть</span>
            <span>→</span>
          </button>
        </section>
      </main>
    `;

    this.bindHeaderControls();

    this.appContainer.querySelectorAll('[data-set-theme]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        soundManager.playMenuTap();
        this.applyTheme(btn.getAttribute('data-set-theme'));
        this.render();
      });
    });

    document.getElementById('cardOpenCollection1')?.addEventListener('click', () => {
      soundManager.playMenuTap();
      this.navigate('COLLECTION', { selectedCollectionId: collection.id });
    });
  }

  // ==========================================================================
  // 2. ЭКРАН СБОРНИКА (1-я история бесплатна, остальные закрыты со звуком замка)
  // ==========================================================================
  renderCollectionScreen() {
    const collection = COLLECTIONS_DATA.find(c => c.id === this.state.selectedCollectionId) || COLLECTIONS_DATA[0];
    const isUnlocked = this.isCollectionUnlocked(collection.id);
    const isDownloaded = isPartDownloaded(collection.id);

    this.appContainer.innerHTML = `
      <header class="header-bar">
        <button class="btn-icon" id="btnBackHome" title="На главную">←</button>
        <div class="header-title-wrap">
          <div class="header-title">${collection.number}</div>
        </div>
        ${this.renderHeaderControls()}
      </header>

      <main class="screen-scrollable">
        <!-- Верхняя плашка покупки сборника (как sets-hero-header в kids-story-quest_1) -->
        ${!isUnlocked ? `
          <section class="collection-promo-header">
            <div class="collection-promo-title">Откройте навсегда</div>
            <div class="collection-promo-subtitle">Разовая покупка без подписок и рекламы!</div>
            <button type="button" class="collection-promo-pill" id="btnHeroBuy" aria-label="Купить ${collection.number}">
              <span>✨</span>
              <span>${collection.number}</span>
              <span class="promo-new-price">${collection.price} ₽</span>
              <span class="promo-buy-word">Купить</span>
            </button>
          </section>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 2px 4px;">
              <span style="font-size: 0.85rem; font-weight: 800; color: var(--accent-primary);">
                ✨ Полный доступ открыт • Выберите рассказ:
              </span>
              <button id="btnResetDemoLock" style="background: none; border: none; color: var(--text-muted); font-size: 0.76rem; text-decoration: underline; cursor: pointer;">
                Сбросить оплату (тест)
              </button>
            </div>
            ${!isDownloaded ? `
              <button class="btn-primary-action" id="btnDownloadCollection" style="padding: 10px 14px; font-size: 0.86rem; border-radius: 12px; margin-bottom: 4px;">
                <span>📥 Скачать платные истории сборника (14.4 МБ)</span>
              </button>
            ` : ''}
          </div>
        `}

        <div class="stories-list">
          ${collection.stories.map(item => {
            const fullStory = getStory(item.id);
            const isStoryOpen = Boolean(item.isFree || isUnlocked);
            const isLocked = ENABLE_PAYWALL && !isStoryOpen;

            const thumbMedia = fullStory?.coverImage
              ? `<img src="${fullStory.coverImage}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">`
              : (fullStory?.coverSvg || `<span style="font-size: 2rem;">🐺</span>`);

            return `
              <article
                class="story-item-card ${isLocked ? 'story-item-card--locked' : ''}"
                data-story-id="${item.id}"
                data-locked="${isLocked}"
              >
                <div class="story-item-thumb">
                  ${thumbMedia}
                  ${isLocked ? `<div class="story-item-thumb-lock" aria-hidden="true">🔒</div>` : ''}
                </div>
                <div class="story-item-body">
                  <div class="story-item-author">${item.author}</div>
                  <h3 class="story-item-title">${item.title}</h3>
                  <p class="story-item-desc">${item.description}</p>
                  <div class="story-item-meta">
                    ${isLocked
                      ? `<span class="meta-pill locked">🔒 Закрыто</span>`
                      : (!isUnlocked && item.isFree)
                        ? `<span class="meta-pill free">🎁 Бесплатно</span>`
                        : `<span class="meta-pill unlocked">✨ Открыто</span>`
                    }
                  </div>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      </main>
    `;

    this.bindHeaderControls();

    document.getElementById('btnBackHome')?.addEventListener('click', () => {
      soundManager.playMenuTap();
      this.navigate('HOME');
    });

    document.getElementById('btnResetDemoLock')?.addEventListener('click', () => {
      soundManager.playMenuTap();
      this.lockCollectionForTest(collection.id);
    });

    document.getElementById('btnDownloadCollection')?.addEventListener('click', () => {
      soundManager.playMenuTap();
      this.showDownloadModal(collection.id);
    });

    // Нажатие на верхнюю кнопку «Купить» -> сразу окно оплаты сборника
    if (ENABLE_PAYWALL) {
      document.getElementById('btnHeroBuy')?.addEventListener('click', () => {
        soundManager.playMenuTap();
        this.showPaywallModal(collection.id);
      });
    }

    // Обработка клика по карточкам рассказов (как в kids-story-quest_1)
    this.appContainer.querySelectorAll('.story-item-card').forEach(card => {
      card.addEventListener('click', () => {
        const storyId = card.getAttribute('data-story-id');
        const isLocked = card.getAttribute('data-locked') === 'true';

        // Если история платная и сборник ещё не куплен -> ТОЛЬКО звук замка и лёгкое покачивание карточки!
        if (isLocked) {
          soundManager.playLockedSoft();
          card.classList.remove('story-item-card--shaking');
          void card.offsetWidth;
          card.classList.add('story-item-card--shaking');
          return;
        }

        // Если сборник открыт, но ещё не скачан и история не бесплатная (Лобо) -> диалог скачивания!
        const clickedStory = collection.stories.find(s => s.id === storyId);
        if (clickedStory && !clickedStory.isFree && !isPartDownloaded(collection.id)) {
          soundManager.playMenuTap();
          this.showDownloadModal(collection.id, () => {
            this.navigate('READER', { selectedStoryId: storyId, currentPage: 1 });
          });
          return;
        }

        soundManager.playMenuTap();
        this.navigate('READER', { selectedStoryId: storyId, currentPage: 1 });
      });
    });
  }

  // ==========================================================================
  // 3. ЭКРАН ЧТЕНИЯ РАССКАЗА (РИДЕР — читается целиком без обрыва на середине)
  // ==========================================================================
  renderReaderScreen() {
    this.clearSlideTimers();
    this.currentSlideIndex = 0;

    const story = getStory(this.state.selectedStoryId);
    if (!story) {
      this.navigate('COLLECTION');
      return;
    }

    // Защита: если рассказ закрыт, возвращаем в список сборника
    if (!this.isStoryUnlocked(story.id, story.collectionId)) {
      this.navigate('COLLECTION');
      return;
    }

    const totalPages = story.pages.length;
    const pageIndex = Math.max(0, Math.min(this.state.currentPage - 1, totalPages - 1));
    const pageData = story.pages[pageIndex];
    const currentPageNum = pageIndex + 1;

    // Процент прочитанного текста для полосы в шапке
    const progressPercent = Math.round((currentPageNum / totalPages) * 100);

    // Слайды текущей страницы (1, 2 или 3 картинки с таймкодом at в секундах)
    const slides = this.getPageSlides(story, pageData);

    const slidesStageHtml = `
      <div class="reader-slides-stage" id="readerSlidesStage">
        ${slides.map((slide, idx) => {
          const mediaHtml = slide.image
            ? `<img src="${slide.image}" alt="${pageData.chapterTitle} — кадр ${idx + 1}">`
            : (slide.svg || '');
          return `
            <div class="reader-slide ${idx === 0 ? 'active' : ''}" data-slide-index="${idx}">
              ${mediaHtml}
            </div>
          `;
        }).join('')}
      </div>
      ${slides.length > 1 ? `
        <div class="reader-slide-dots" id="readerSlideDots">
          ${slides.map((s, idx) => `
            <button type="button" class="reader-slide-dot ${idx === 0 ? 'active' : ''}" data-dot-index="${idx}" title="Кадр ${idx + 1} (${s.at} сек)"></button>
          `).join('')}
        </div>
      ` : ''}
    `;

    const textWindowContent = `
      <div class="reader-page-heading">${pageData.chapterTitle || `Страница ${currentPageNum}`}</div>
      ${pageData.paragraphs.map(p => `<p class="reader-paragraph">${p}</p>`).join('')}
    `;

    const isFirstPageNotStarted = (currentPageNum === 1 && !this.storyStarted && soundManager.speechEnabled);

    this.appContainer.innerHTML = `
      <!-- ШАПКА С ПОЛОСОЙ ПРОЧИТАННОГО И ОСТАВШЕГОСЯ ТЕКСТА -->
      <header class="header-bar">
        <button class="btn-icon" id="btnBackToCollection" title="К списку рассказов">←</button>
        
        <div class="header-title-wrap">
          <div class="header-title-row">
            <span class="header-title">${story.shortTitle || story.title}</span>
            <span class="header-page-counter">${currentPageNum} / ${totalPages}</span>
          </div>
          <div class="reading-progress-bar" title="Страница ${currentPageNum} из ${totalPages}">
            <div class="reading-progress-fill" style="width: ${progressPercent}%;"></div>
          </div>
        </div>

        ${this.renderHeaderControls()}
      </header>

      <!-- ОСНОВНАЯ СЦЕНА РИДЕРА -->
      <main class="reader-stage">
        <!-- 1. Вверху картинка (с плавной однократной сменой слайдов по таймкоду) -->
        <div class="reader-illustration-box">
          ${slidesStageHtml}
        </div>

        <!-- 2. Фиксированное окно текста с внутренним скроллом -->
        <div class="reader-text-window" id="readerTextWindow">
          ${textWindowContent}
        </div>

        <!-- 3. Внизу две кнопки пролистывания страниц Вперёд и Назад -->
        <nav class="reader-nav-bar">
          <button class="btn-page-nav btn-prev" id="btnPrevPage" ${currentPageNum <= 1 ? 'disabled' : ''}>
            <span>←</span>
            <span>Назад</span>
          </button>
          ${isFirstPageNotStarted ? `
            <button class="btn-page-nav btn-next" id="btnStartStory">
              <span>Начать</span>
              <span>▶</span>
            </button>
          ` : `
            <button class="btn-page-nav btn-next ${soundManager.speechEnabled ? 'btn-next--hidden' : ''}" id="btnNextPage">
              <span>${currentPageNum >= totalPages ? 'В сборник ✓' : 'Вперёд'}</span>
              <span>${currentPageNum >= totalPages ? '' : '→'}</span>
            </button>
          `}
        </nav>
      </main>
    `;

    // Функция плавного появления кнопки «Вперёд» после окончания озвучки или при 🔇
    const btnNext = document.getElementById('btnNextPage');
    const revealNextButton = () => {
      if (btnNext && btnNext.classList.contains('btn-next--hidden')) {
        btnNext.classList.remove('btn-next--hidden');
      }
    };

    // Функция переключения активного слайда
    const setActiveSlide = (targetIdx) => {
      if (targetIdx < 0 || targetIdx >= slides.length) return;
      this.currentSlideIndex = targetIdx;

      this.appContainer.querySelectorAll('.reader-slide').forEach(el => {
        const idx = Number(el.getAttribute('data-slide-index'));
        el.classList.toggle('active', idx === targetIdx);
      });

      this.appContainer.querySelectorAll('.reader-slide-dot').forEach(dot => {
        const idx = Number(dot.getAttribute('data-dot-index'));
        dot.classList.toggle('active', idx === targetIdx);
      });
    };

    // Клик по точкам слайдов вручную
    this.appContainer.querySelectorAll('.reader-slide-dot').forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = Number(dot.getAttribute('data-dot-index'));
        setActiveSlide(idx);
      });
    });

    // Однократный запуск таймеров смены картинок (когда звук выключен или используется фолбэк)
    const startFallbackSlideTimers = () => {
      this.clearSlideTimers();
      if (slides.length <= 1) return;

      slides.forEach((slide, idx) => {
        if (idx === 0) return;
        const delayMs = Math.max(1, Number(slide.at) || idx * 15) * 1000;
        const timerId = setTimeout(() => {
          if (this.currentSlideIndex < idx) {
            setActiveSlide(idx);
          }
        }, delayMs);
        this.slideTimers.push(timerId);
      });
    };

    // Логика запуска рассказа и озвучки страницы
    if (isFirstPageNotStarted) {
      // Рассказ ещё не начат: ждём клика по кнопке «Начать ▶»
      document.getElementById('btnStartStory')?.addEventListener('click', () => {
        soundManager.playMenuTap();
        this.storyStarted = true;
        this.renderReaderScreen();
      });
    } else {
      // Рассказ уже идёт: запускаем озвучку и синхронизируем смену картинок
      const fullPageSpeech = pageData.paragraphs.join(' ');
      if (soundManager.speechEnabled) {
        soundManager.playVoice(
          getAssetPath(pageData.audio),
          fullPageSpeech,
          () => {
            // Озвучка завершилась — кнопка «Вперёд» появляется
            revealNextButton();
          },
          (currentTimeSec) => {
            for (let i = slides.length - 1; i > this.currentSlideIndex; i--) {
              if (currentTimeSec >= (slides[i].at || 0)) {
                setActiveSlide(i);
                break;
              }
            }
          },
          () => {
            startFallbackSlideTimers();
          }
        );
      } else {
        startFallbackSlideTimers();
        revealNextButton();
      }
    }

    this.bindHeaderControls((isNowOn) => {
      const btnToggleSound = document.getElementById('btnToggleSound');
      if (btnToggleSound) {
        btnToggleSound.classList.toggle('muted', !isNowOn);
        btnToggleSound.textContent = isNowOn ? '🔊' : '🔇';
        btnToggleSound.title = isNowOn ? 'Озвучка включена' : 'Озвучка выключена';
      }

      if (currentPageNum === 1 && !this.storyStarted) {
        // До начала рассказа: при выключении звука (🔇) сразу появляется «Вперёд →», при включении (🔊) — «Начать ▶»
        this.renderReaderScreen();
        return;
      }

      if (isNowOn) {
        // Звук включили — перезапускаем ридер с озвучкой
        this.renderReaderScreen();
      } else {
        // Звук выключили (🔇) — останавливаем голос и сразу показываем кнопку «Вперёд»
        soundManager.stopVoice();
        revealNextButton();
        startFallbackSlideTimers();
      }
    });

    document.getElementById('btnBackToCollection')?.addEventListener('click', () => {
      soundManager.playMenuTap();
      this.storyStarted = false;
      this.navigate('COLLECTION');
    });

    // Кнопка «Назад»
    document.getElementById('btnPrevPage')?.addEventListener('click', () => {
      if (currentPageNum > 1) {
        soundManager.playPageTurn();
        this.navigate('READER', { currentPage: currentPageNum - 1 });
      }
    });

    // Кнопка «Вперёд»
    document.getElementById('btnNextPage')?.addEventListener('click', () => {
      if (currentPageNum < totalPages) {
        soundManager.playPageTurn();
        this.navigate('READER', { currentPage: currentPageNum + 1 });
      } else {
        soundManager.playMenuTap();
        this.storyStarted = false;
        this.navigate('COLLECTION');
      }
    });
  }

  // ==========================================================================
  // 4. ОКНО ОПЛАТЫ И ВОССТАНОВЛЕНИЯ ПОКУПОК
  // ==========================================================================
  showPaywallModal(collectionId = 'animals_collection_1') {
    const collection = COLLECTIONS_DATA.find(c => c.id === collectionId) || COLLECTIONS_DATA[0];
    let currentPrice = collection.price || 399;
    let appliedPromoCode = '';

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal-card" style="max-width: 440px;">
        <button class="modal-close-btn" id="closePaywall" aria-label="Закрыть">✕</button>

        <div class="paywall-badge-pill">🌲 Коллекционное издание</div>
        <div class="paywall-header-title">${collection.number}: «${collection.title}»</div>
        <p class="paywall-header-desc">
          Полный иллюстрированный сборник классических рассказов с мастер-озвучкой диктора
        </p>

        <!-- Список преимуществ сборника -->
        <div class="paywall-benefits-box">
          <div class="paywall-benefit-item">
            <span class="paywall-benefit-icon">✓</span>
            <span>Все 12 глав драмы <strong>«Лобо — король Куррумпо»</strong></span>
          </div>
          <div class="paywall-benefit-item">
            <span class="paywall-benefit-icon">✓</span>
            <span>Студийная озвучка диктора (голос Iapetus, -16 LUFS)</span>
          </div>
          <div class="paywall-benefit-item">
            <span class="paywall-benefit-icon">✓</span>
            <span>21 акварельная HD-иллюстрация с живой сменой кадров</span>
          </div>
          <div class="paywall-benefit-item">
            <span class="paywall-benefit-icon">✓</span>
            <span>Все будущие рассказы и обновления Сборника №1</span>
          </div>
          <div class="paywall-benefit-item">
            <span class="paywall-benefit-icon">✓</span>
            <span>Работает офлайн • Без рекламы • Без подписок</span>
          </div>
        </div>

        <div class="paywall-tariff-card">
          <div style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; color: var(--accent-primary); letter-spacing: 0.04em;">
            ПОЛНЫЙ ДОСТУП НАВСЕГДА
          </div>
          <div class="paywall-price" id="paywallDisplayPrice">
            <span style="text-decoration: line-through; font-size: 1.15rem; opacity: 0.55; margin-right: 8px;">549 ₽</span>${currentPrice} ₽
          </div>
          <div id="paywallTariffDesc" style="font-size: 0.82rem; color: var(--text-secondary);">
            Один платёж навсегда • Доступ ко всем историям сборника
          </div>
        </div>

        <!-- Поле ввода E-mail для чека -->
        <div style="margin-bottom: 10px; text-align: left;">
          <label style="display: block; font-size: 0.78rem; font-weight: 800; color: var(--text-secondary); margin-bottom: 4px;">
            ✉️ Ваш E-mail (для чека и восстановления):
          </label>
          <input
            type="email"
            id="paywallUserEmail"
            placeholder="name@mail.ru"
            autocomplete="email"
            style="width: 100%; padding: 11px 12px; border-radius: 12px; border: 1.5px solid var(--border-strong); background: var(--bg-reader-text); color: var(--text-main); font-size: 0.95rem; outline: none;"
          />
          <div id="emailValidationHint" style="display: none; color: #EF4444; font-size: 0.76rem; font-weight: 800; margin-top: 4px;">
            Пожалуйста, укажите корректный E-mail для отправки чека
          </div>
        </div>

        <!-- Кнопка оплаты Robokassa -->
        <button class="btn-primary-action" id="btnPaySubmit" style="margin-bottom: 8px;">
          <span id="payBtnLabel">💳 Открыть сборник за ${currentPrice} ₽</span>
        </button>

        <!-- Кнопка проверки уже оплаченного заказа (СБП) -->
        <button class="btn-page-nav" id="btnCheckPendingPayment" style="width: 100%; font-size: 0.82rem; padding: 9px 12px; margin-bottom: 8px;">
          <span id="btnCheckPendingLabel">🔄 Я уже оплатил — проверить статус</span>
        </button>

        <!-- Блок промокода (скрытый по умолчанию) -->
        <div id="promoCodeBox" style="display: none; margin: 8px 0; text-align: left;">
          <div style="display: flex; gap: 6px;">
            <input
              type="text"
              id="promoCodeInput"
              placeholder="Введите промокод"
              style="flex: 1; padding: 9px 12px; border-radius: 10px; border: 1.5px solid var(--border-strong); background: var(--bg-reader-text); color: var(--text-main); font-size: 0.88rem; text-transform: uppercase; outline: none;"
            />
            <button type="button" id="btnApplyPromo" class="btn-page-nav" style="padding: 8px 14px; font-size: 0.84rem;">
              ОК
            </button>
          </div>
          <div id="promoMessage" style="display: none; font-size: 0.78rem; font-weight: 800; margin-top: 5px;"></div>
        </div>

        <!-- Ссылки: Промокод и Восстановить покупку -->
        <div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 6px; flex-wrap: wrap;">
          <a href="#" id="btnTogglePromo" style="color: var(--text-secondary); font-size: 0.8rem; font-weight: 700; text-decoration: underline;">
            У меня есть промокод
          </a>
          <span style="color: var(--text-muted); font-size: 0.8rem;">•</span>
          <a href="#" id="btnRestorePurchase" style="color: var(--accent-primary); font-size: 0.8rem; font-weight: 800; text-decoration: underline;">
            Восстановить покупку
          </a>
        </div>

        <!-- Тестовая разблокировка для проверки -->
        <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed var(--border-color);">
          <button type="button" class="btn-page-nav" id="btnDemoUnlockNow" style="width: 100%; font-size: 0.8rem; padding: 8px;">
            🔓 Тестовая разблокировка (для тестировщиков)
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);

    const displayPrice = backdrop.querySelector('#paywallDisplayPrice');
    const tariffDesc = backdrop.querySelector('#paywallTariffDesc');
    const payBtnLabel = backdrop.querySelector('#payBtnLabel');
    const paySubmitBtn = backdrop.querySelector('#btnPaySubmit');
    const emailInput = backdrop.querySelector('#paywallUserEmail');
    const emailHint = backdrop.querySelector('#emailValidationHint');

    // Предзаполняем сохранённый E-mail
    const savedEmail = this.getStorage('animals_user_email') || '';
    if (savedEmail && emailInput) {
      emailInput.value = savedEmail;
    }

    const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((val || '').trim());

    const updatePayBtnState = () => {
      const valid = isValidEmail(emailInput?.value || '');
      if (paySubmitBtn) {
        paySubmitBtn.style.opacity = valid ? '1' : '0.65';
      }
      return valid;
    };
    updatePayBtnState();

    emailInput?.addEventListener('input', () => {
      const valid = updatePayBtnState();
      if (valid) {
        if (emailHint) emailHint.style.display = 'none';
        this.setStorage('animals_user_email', emailInput.value.trim());
      }
    });

    const closeModal = () => {
      soundManager.playMenuTap();
      backdrop.remove();
    };

    backdrop.querySelector('#closePaywall')?.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    // Промокоды (как в kids-story-quest_1)
    const promoBox = backdrop.querySelector('#promoCodeBox');
    const promoInput = backdrop.querySelector('#promoCodeInput');
    const promoMessage = backdrop.querySelector('#promoMessage');

    backdrop.querySelector('#btnTogglePromo')?.addEventListener('click', (e) => {
      e.preventDefault();
      soundManager.playMenuTap();
      const isHidden = promoBox.style.display === 'none';
      promoBox.style.display = isHidden ? 'block' : 'none';
      if (isHidden) setTimeout(() => promoInput?.focus(), 80);
    });

    const PROMOCODES = {
      'KOTIK': { price: 299, desc: '🔥 Спец-цена по промокоду: 299 ₽', btnText: '💳 Оплатить 299 ₽ (Скидка 100 ₽)' },
      'TEST1234': { price: 11, desc: '⚙️ Тестовый платёж: 11 ₽', btnText: '💳 Оплатить 11 ₽ (Тест)' }
    };

    const applyPromo = () => {
      const code = (promoInput?.value || '').trim().toUpperCase();
      if (!code) return;
      const promo = PROMOCODES[code];
      if (!promo) {
        soundManager.playMenuTap();
        promoMessage.style.display = 'block';
        promoMessage.style.color = '#EF4444';
        promoMessage.textContent = '❌ Промокод не найден';
        return;
      }
      soundManager.playStarBell();
      currentPrice = promo.price;
      appliedPromoCode = code.toLowerCase();
      displayPrice.innerHTML = `<span style="text-decoration: line-through; font-size: 1rem; opacity: 0.6; margin-right: 6px;">${collection.price} ₽</span> ${currentPrice} ₽`;
      tariffDesc.textContent = promo.desc;
      payBtnLabel.textContent = promo.btnText;
      promoMessage.style.display = 'block';
      promoMessage.style.color = '#10B981';
      promoMessage.textContent = `✅ Промокод ${code} успешно применён!`;
    };

    backdrop.querySelector('#btnApplyPromo')?.addEventListener('click', applyPromo);
    promoInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyPromo();
      }
    });

    // Переход на оплату Robokassa
    paySubmitBtn?.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = (emailInput?.value || '').trim();
      if (!isValidEmail(email)) {
        if (emailHint) emailHint.style.display = 'block';
        emailInput?.focus();
        soundManager.playLockedSoft();
        return;
      }

      this.setStorage('animals_user_email', email);
      this.setStorage('animals_pending_collection', collectionId);
      soundManager.playMenuTap();

      const origText = payBtnLabel ? payBtnLabel.textContent : '';
      paySubmitBtn.disabled = true;
      if (payBtnLabel) payBtnLabel.textContent = '⏳ Подключение к кассе...';

      try {
        const paymentUrl = await fetchRobokassaUrl(email, collectionId, appliedPromoCode);
        const BrowserPlugin = window.Capacitor?.Plugins?.Browser;
        if (BrowserPlugin && typeof BrowserPlugin.open === 'function') {
          await BrowserPlugin.open({ url: paymentUrl });
        } else {
          window.location.href = paymentUrl;
        }
      } catch (err) {
        this.showToast('Не удалось связаться с кассой. Для проверки используйте тестовую разблокировку.');
      } finally {
        paySubmitBtn.disabled = false;
        if (payBtnLabel) payBtnLabel.textContent = origText;
      }
    });

    // Проверка статуса оплаты вручную
    const btnCheckPending = backdrop.querySelector('#btnCheckPendingPayment');
    btnCheckPending?.addEventListener('click', async (e) => {
      e.preventDefault();
      soundManager.playMenuTap();
      const label = backdrop.querySelector('#btnCheckPendingLabel');
      const origText = label ? label.textContent : '';
      if (label) label.textContent = 'Проверка в банке... ⏳';
      btnCheckPending.disabled = true;

      try {
        const isPremium = await checkPremiumStatus(collectionId);
        if (isPremium) {
          backdrop.remove();
          this.handlePaymentSuccess(collectionId);
        } else {
          btnCheckPending.disabled = false;
          if (label) label.textContent = origText;
          this.showToast('Платёж ещё обрабатывается банком. Подождите 10–15 сек и нажмите снова.');
        }
      } catch (err) {
        btnCheckPending.disabled = false;
        if (label) label.textContent = origText;
        this.showToast('Ошибка связи с сервером проверки.');
      }
    });

    // Восстановление покупки
    backdrop.querySelector('#btnRestorePurchase')?.addEventListener('click', async (e) => {
      e.preventDefault();
      soundManager.playMenuTap();
      const restoreLink = backdrop.querySelector('#btnRestorePurchase');
      const origText = restoreLink ? restoreLink.textContent : '';
      if (restoreLink) restoreLink.textContent = 'Проверка облака...';

      const parts = await fetchCloudUnlockedParts();
      if (Array.isArray(parts) && parts.includes(collectionId)) {
        this.unlockCollection(collectionId);
        backdrop.remove();
        soundManager.playStarBell();
        this.showSuccessModal('Покупка восстановлена! ✨', 'Полный доступ к Сборнику №1 активирован через облако.');
        return;
      }

      const isCloudPremium = await checkPremiumStatus(collectionId);
      if (isCloudPremium) {
        this.unlockCollection(collectionId);
        backdrop.remove();
        soundManager.playStarBell();
        this.showSuccessModal('Покупка восстановлена! ✨', 'Полный доступ к Сборнику №1 активирован через облако.');
        return;
      }

      if (restoreLink) restoreLink.textContent = origText;
      this.showRestoreEmailModal(collectionId, () => {
        backdrop.remove();
        this.showSuccessModal('Покупка восстановлена! ✨', 'Полный доступ к Сборнику №1 успешно активирован по вашему чеку.');
      });
    });

    // Тестовая разблокировка
    backdrop.querySelector('#btnDemoUnlockNow')?.addEventListener('click', () => {
      soundManager.playStarBell();
      backdrop.remove();
      this.unlockCollection(collectionId);
      this.showToast('✨ Сборник №1 разблокирован (тестовый режим)');
    });
  }

  // ==========================================================================
  // 6. ОКНО ВОССТАНОВЛЕНИЯ ПО E-MAIL И НОМЕРУ ЗАКАЗА ИЗ ЧЕКА
  // ==========================================================================
  showRestoreEmailModal(collectionId = 'animals_collection_1', onSuccess) {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal-card" style="max-width: 420px;">
        <button class="modal-close-btn" id="closeRestoreModal" aria-label="Закрыть">✕</button>
        <div class="parental-gate-title">✉️ Восстановление покупки</div>
        <p class="parental-gate-desc">
          Введите E-mail и номер заказа из чека Робокассы, который пришёл вам на почту:
        </p>

        <form id="restoreEmailForm" style="display: flex; flex-direction: column; gap: 10px;">
          <input
            type="email"
            id="restoreEmailInput"
            placeholder="Ваш E-mail из чека"
            required
            autocomplete="email"
            style="width: 100%; padding: 11px 12px; border-radius: 12px; border: 1.5px solid var(--border-strong); background: var(--bg-reader-text); color: var(--text-main); font-size: 0.95rem; text-align: center; outline: none;"
          />
          <input
            type="text"
            id="restoreInvInput"
            placeholder="Номер заказа из чека (цифры)"
            required
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="12"
            style="width: 100%; padding: 11px 12px; border-radius: 12px; border: 1.5px solid var(--border-strong); background: var(--bg-reader-text); color: var(--text-main); font-size: 0.95rem; text-align: center; outline: none;"
          />
          <button type="submit" id="btnSubmitRestore" class="btn-primary-action">
            <span>Восстановить доступ ✨</span>
          </button>
        </form>

        <div id="restoreErrorMsg" style="display: none; color: #EF4444; font-size: 0.84rem; font-weight: 800; margin-top: 10px;"></div>
      </div>
    `;

    document.body.appendChild(backdrop);

    const emailInput = backdrop.querySelector('#restoreEmailInput');
    const invInput = backdrop.querySelector('#restoreInvInput');
    const form = backdrop.querySelector('#restoreEmailForm');
    const submitBtn = backdrop.querySelector('#btnSubmitRestore');
    const errorMsg = backdrop.querySelector('#restoreErrorMsg');

    const savedEmail = this.getStorage('animals_user_email') || '';
    if (savedEmail && emailInput) emailInput.value = savedEmail;

    const closeModal = () => {
      soundManager.playMenuTap();
      backdrop.remove();
    };

    backdrop.querySelector('#closeRestoreModal')?.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = (emailInput?.value || '').trim();
      const invId = (invInput?.value || '').trim();
      if (!email || !invId) return;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Поиск покупки... ⏳</span>';
      errorMsg.style.display = 'none';

      const res = await restoreByEmail(email, invId);
      if (res && res.success) {
        soundManager.playStarBell();
        this.unlockCollection(collectionId);
        backdrop.remove();
        if (typeof onSuccess === 'function') onSuccess();
      } else {
        soundManager.playLockedSoft();
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Восстановить доступ ✨</span>';
        errorMsg.style.display = 'block';
        errorMsg.textContent = res?.message || 'Оплата с такими данными не найдена. Проверьте E-mail и номер заказа.';
      }
    });
  }

  // ==========================================================================
  // 7. МОДАЛЬНОЕ ОКНО УСПЕШНОЙ АКТИВАЦИИ
  // ==========================================================================
  showSuccessModal(title, message, onClose) {
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal-card">
        <button class="modal-close-btn" id="closeSuccess" aria-label="Закрыть">✕</button>
        <div style="font-size: 2.6rem; margin-bottom: 6px;">🎉</div>
        <div class="parental-gate-title">${title}</div>
        <p class="parental-gate-desc" style="margin-bottom: 18px;">${message}</p>
        <button class="btn-primary-action" id="btnSuccessOk">
          <span>К рассказам →</span>
        </button>
      </div>
    `;

    document.body.appendChild(backdrop);

    const close = () => {
      soundManager.playMenuTap();
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
      this.navigate('COLLECTION');
      if (typeof onClose === 'function') onClose();
    };

    backdrop.querySelector('#closeSuccess')?.addEventListener('click', close);
    backdrop.querySelector('#btnSuccessOk')?.addEventListener('click', close);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) close();
    });
  }

  // ==========================================================================
  // 8. ОКНО ОБЛАЧНОЙ ЗАГРУЗКИ АРХИВА (DLC)
  // ==========================================================================
  showDownloadModal(collectionId = 'animals_collection_1', onSuccess) {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal-card" style="max-width: 420px; text-align: center;">
        <div class="paywall-badge-pill">📥 Загрузка историй</div>
        <div class="paywall-header-title" style="margin-top: 6px;">Сборник №1: «Зов дикой природы»</div>
        <p class="paywall-header-desc" id="dlStatusDesc" style="margin-bottom: 16px;">
          Загрузка платных рассказов и аудио диктора в высоком качестве (~14.4 МБ)...
        </p>

        <!-- Прогресс-бар -->
        <div style="background: var(--border-color); border-radius: 999px; height: 14px; overflow: hidden; margin-bottom: 10px; position: relative;">
          <div id="dlProgressBar" style="background: linear-gradient(90deg, #10B981, #059669); height: 100%; width: 0%; border-radius: 999px; transition: width 0.25s ease;"></div>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 800; color: var(--text-secondary); margin-bottom: 16px;">
          <span id="dlStatusStep">Подключение к серверу...</span>
          <span id="dlPercentLabel">0%</span>
        </div>

        <div id="dlErrorBox" style="display: none; color: #EF4444; font-size: 0.85rem; font-weight: 800; margin-bottom: 12px;"></div>

        <button class="btn-primary-action" id="btnStartOrRetryDl" style="display: none;">
          <span>Повторить попытку 🔄</span>
        </button>
      </div>
    `;

    document.body.appendChild(backdrop);

    const progressBar = backdrop.querySelector('#dlProgressBar');
    const statusDesc = backdrop.querySelector('#dlStatusDesc');
    const statusStep = backdrop.querySelector('#dlStatusStep');
    const percentLabel = backdrop.querySelector('#dlPercentLabel');
    const errorBox = backdrop.querySelector('#dlErrorBox');
    const retryBtn = backdrop.querySelector('#btnStartOrRetryDl');

    const start = async () => {
      if (errorBox) errorBox.style.display = 'none';
      if (retryBtn) retryBtn.style.display = 'none';
      if (statusStep) statusStep.textContent = 'Скачивание...';

      try {
        await downloadAndInstallPart(collectionId, null, (p) => {
          const pct = Math.round(p.percent || 0);
          if (progressBar) progressBar.style.width = `${pct}%`;
          if (percentLabel) percentLabel.textContent = `${pct}%`;

          if (p.status === 'downloading') {
            const mbLoaded = (p.loadedBytes ? (p.loadedBytes / 1048576).toFixed(1) : '...');
            const mbTotal = (p.totalBytes ? (p.totalBytes / 1048576).toFixed(1) : '14.4');
            if (statusStep) statusStep.textContent = `Скачано ${mbLoaded} из ${mbTotal} МБ`;
          } else if (p.status === 'unzipping') {
            if (statusStep) statusStep.textContent = 'Распаковка историй...';
            if (statusDesc) statusDesc.textContent = 'Установка медиафайлов в память устройства...';
          } else if (p.status === 'complete') {
            if (statusStep) statusStep.textContent = 'Готово!';
          }
        });

        soundManager.playStarBell();
        setTimeout(() => {
          backdrop.remove();
          this.render();
          this.showToast('✨ Истории Сборника №1 успешно загружены!');
          if (typeof onSuccess === 'function') onSuccess();
        }, 500);
      } catch (err) {
        console.error('Ошибка скачивания:', err);
        if (errorBox) {
          errorBox.style.display = 'block';
          errorBox.textContent = `Не удалось завершить загрузку: ${err.message || 'Ошибка сети'}`;
        }
        if (retryBtn) retryBtn.style.display = 'block';
      }
    };

    retryBtn?.addEventListener('click', start);
    start();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
