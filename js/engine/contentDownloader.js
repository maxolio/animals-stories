// js/engine/contentDownloader.js
// Модуль облачной загрузки, нативной распаковки и синхронного разрешения путей к ассетам (DLC)
// Разработано по образцу kids-story-quest_1 специально для «Живых Историй»

import { getUserId } from './robokassa.js';

const STORAGE_KEY_DOWNLOADED_PARTS = 'animals_downloaded_parts';

let isNative = false;
let baseDataUrl = '';
let nativeDataDirectoryPath = '';
let downloadedParts = new Set();
let isInitialized = false;

// Определение принадлежности ассета к Сборнику №1 (платные истории)
function isCollection1Asset(path) {
  // Платная история «Лобо» и все будущие платные истории сборника №1
  if (path.includes('stories/seton-lobo/')) {
    return true;
  }
  return false;
}

/**
 * Инициализация сервиса загрузки контента.
 * Вызывается один раз на старте приложения (в app.js).
 */
export async function initContentDownloader() {
  if (isInitialized) return;

  try {
    const cap = window.Capacitor;
    isNative = Boolean(cap && (cap.isNativePlatform?.() || cap.isNative));

    // Чтение сохранённых скачанных частей из localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DOWNLOADED_PARTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          downloadedParts = new Set(parsed);
        }
      }
    } catch (e) {
      console.warn('⚠️ Ошибка чтения скачанных частей из localStorage:', e);
    }

    if (isNative && cap?.Plugins?.Filesystem) {
      const { Filesystem } = cap.Plugins;
      // Получаем URI корневой постоянной папки Directory.Data
      const uriResult = await Filesystem.getUri({
        directory: 'DATA',
        path: ''
      });

      if (uriResult && uriResult.uri) {
        nativeDataDirectoryPath = uriResult.uri;
        // Преобразуем нативный URI в WebView-совместимый URL (https://localhost/_capacitor_file_/...)
        baseDataUrl = cap.convertFileSrc(uriResult.uri);
        // Убираем хвостовой слэш для чистоты склейки
        baseDataUrl = baseDataUrl.replace(/\/+$/, '');
      }
    }
  } catch (err) {
    console.error('⚠️ Ошибка инициализации contentDownloader:', err);
  } finally {
    isInitialized = true;
  }
}

/**
 * Проверка, скачана ли указанная часть.
 * В Web-среде всегда возвращает true, так как все файлы лежат локально в репозитории проекта.
 */
export function isPartDownloaded(partId = 'animals_collection_1') {
  if (!isNative) return true; // В веб-режиме (ПК/браузер) всё доступно сразу из папки assets
  return downloadedParts.has(partId);
}

/**
 * Синхронный резолвер путей к медиа-ассетам.
 * Бесшовно переключает пути: для Чинка — из APK, для Лобо — из постоянной памяти устройства.
 * @param {string} relPath - относительный путь (например 'assets/audio/stories/seton-lobo/page-01.mp3')
 * @returns {string} - готовый путь для тегов <img> и new Audio()
 */
export function getAssetPath(relPath) {
  if (!relPath || typeof relPath !== 'string') return relPath;
  if (!isNative || !baseDataUrl) return relPath; // Web или среда до инициализации
  if (
    relPath.startsWith('http://') ||
    relPath.startsWith('https://') ||
    relPath.startsWith('data:') ||
    relPath.startsWith('blob:')
  ) {
    return relPath;
  }

  const cleanPath = relPath.replace(/^[/\\]+/, '');

  // 1. Ассеты, которые ВСЕГДА включены в базовый APK (никогда не перенаправляем в скачанные):
  // Бесплатная история «Чинк», обложки каталога, иконки, шрифты и стили
  if (
    cleanPath.includes('stories/seton-chink/') ||
    cleanPath.includes('/cover.webp') ||
    cleanPath.startsWith('assets/fonts/') ||
    cleanPath.startsWith('css/') ||
    cleanPath.startsWith('js/')
  ) {
    return cleanPath;
  }

  // 2. Сборник №1: если скачан -> отдаём из постоянной памяти устройства
  if (isCollection1Asset(cleanPath) && downloadedParts.has('animals_collection_1')) {
    return `${baseDataUrl}/${cleanPath}`;
  }

  return cleanPath;
}

// Активная фоновая загрузка (Singleton)
let activeDownload = null;

export function isPartDownloading(partId = null) {
  if (!activeDownload) return false;
  if (!partId) return true;
  return activeDownload.partId === partId;
}

export function getActiveDownloadProgress(partId = null) {
  if (!activeDownload) return null;
  if (partId && activeDownload.partId !== partId) return null;
  return activeDownload.lastProgress;
}

export function removeDownloadListener(cb) {
  if (activeDownload && activeDownload.callbacks) {
    activeDownload.callbacks.delete(cb);
  }
}

/**
 * Получение ссылки на скачивание архива с бэкенда api.skazkikids.ru
 */
export async function fetchDownloadUrl(partId = 'animals_collection_1') {
  const userId = getUserId();
  const url = `https://api.skazkikids.ru/?action=get-download-url&partId=${encodeURIComponent(partId)}&userId=${encodeURIComponent(userId)}&_t=${Date.now()}`;
  
  const response = await fetch(url, { headers: { 'Accept': 'application/json' }, cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Ошибка запроса ссылки на скачивание (${response.status})`);
  }
  const data = await response.json();
  const downloadUrl = data.downloadUrl || data.url;
  if (!downloadUrl) {
    throw new Error(data.error || 'Сервер не вернул ссылку на скачивание архива');
  }
  return downloadUrl;
}

/**
 * Процесс скачивания, нативной распаковки и очистки архива.
 * @param {string} partId - 'animals_collection_1'
 * @param {string|null} downloadUrl - HTTPS ссылка на скачивание архива
 * @param {Function} onProgress - колбэк с объектом прогресса { status, percent, loadedBytes, totalBytes }
 */
export async function downloadAndInstallPart(partId = 'animals_collection_1', downloadUrl = null, onProgress = () => {}) {
  // 1. Если загрузка этой же части УЖЕ выполняется в фоне — подключаемся к ней
  if (activeDownload && activeDownload.partId === partId) {
    console.log(`Загрузка ${partId} уже выполняется в фоне. Подключаем слушатель...`);
    activeDownload.callbacks.add(onProgress);
    if (activeDownload.lastProgress) {
      onProgress(activeDownload.lastProgress);
    }
    return activeDownload.promise;
  }

  if (activeDownload) {
    throw new Error(`Уже выполняется загрузка другого сборника (${activeDownload.partId}).`);
  }

  // Если URL не передан, запрашиваем с сервера
  let targetUrl = downloadUrl;
  if (!targetUrl) {
    targetUrl = await fetchDownloadUrl(partId);
  }

  const callbacks = new Set([onProgress]);
  let maxPercent = 0;
  let lastProgress = { status: 'downloading', percent: 0, loadedBytes: 0, totalBytes: 0 };

  const notifyAll = (p) => {
    if (p.status === 'downloading') {
      if (p.percent < maxPercent) {
        p.percent = maxPercent;
      } else {
        maxPercent = p.percent;
      }
    }
    lastProgress = p;
    callbacks.forEach(cb => {
      try { cb(p); } catch (e) { console.warn('Ошибка вызова callback прогресса:', e); }
    });
  };

  const cap = window.Capacitor;
  const isNativePlatform = Boolean(cap && (cap.isNativePlatform?.() || cap.isNative));

  const runDownload = async () => {
    if (!isNativePlatform || !cap?.Plugins?.Filesystem) {
      // Симуляция для Web/Dev среды (ПК/браузер)
      notifyAll({ status: 'downloading', percent: 20, loadedBytes: 3000000, totalBytes: 15000000 });
      await new Promise(r => setTimeout(r, 400));
      notifyAll({ status: 'downloading', percent: 65, loadedBytes: 9800000, totalBytes: 15000000 });
      await new Promise(r => setTimeout(r, 400));
      notifyAll({ status: 'unzipping', percent: 92 });
      await new Promise(r => setTimeout(r, 350));
      downloadedParts.add(partId);
      localStorage.setItem(STORAGE_KEY_DOWNLOADED_PARTS, JSON.stringify([...downloadedParts]));
      notifyAll({ status: 'complete', percent: 100 });
      return { success: true };
    }

    const { Filesystem } = cap.Plugins;
    const zipPlugin = cap.Plugins.CapacitorZip || cap.Plugins.Zip;
    const zipFileName = `${partId}_temp.zip`;

    let progressListener = null;

    try {
      // 0. Удаляем старый временный zip при прерванной сессии
      try {
        await Filesystem.deleteFile({
          directory: 'DATA',
          path: zipFileName
        });
      } catch (_) {}

      // 1. Подписка на прогресс
      notifyAll({ status: 'downloading', percent: 0, loadedBytes: 0, totalBytes: 0 });

      if (Filesystem.addListener) {
        progressListener = await Filesystem.addListener('progress', (progress) => {
          const loaded = progress.bytes || progress.loaded || 0;
          const total = progress.contentLength || progress.total || 0;
          const percent = total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 0;
          notifyAll({
            status: 'downloading',
            percent,
            loadedBytes: loaded,
            totalBytes: total
          });
        });
      }

      // 2. Скачивание ZIP-файла
      await Filesystem.downloadFile({
        url: targetUrl,
        path: zipFileName,
        directory: 'DATA',
        progress: true,
        shouldEncodeUrlParams: false
      });

      if (progressListener) {
        await progressListener.remove();
        progressListener = null;
      }

      notifyAll({ status: 'unzipping', percent: 95 });

      // 3. Определение абсолютных путей для нативной распаковки
      const zipUriResult = await Filesystem.getUri({
        directory: 'DATA',
        path: zipFileName
      });
      const destUriResult = await Filesystem.getUri({
        directory: 'DATA',
        path: ''
      });

      let zipSourcePath = zipUriResult.uri;
      let targetDirPath = destUriResult.uri;

      if (zipSourcePath.startsWith('file://')) zipSourcePath = zipSourcePath.replace('file://', '');
      if (targetDirPath.startsWith('file://')) targetDirPath = targetDirPath.replace('file://', '');

      // 4. Нативная распаковка
      if (zipPlugin && typeof zipPlugin.unzip === 'function') {
        await zipPlugin.unzip({
          source: zipSourcePath,
          destination: targetDirPath
        });
      } else {
        console.warn('⚠️ Плагин нативной распаковки ZIP не найден!');
      }

      // 5. Очистка временного ZIP с диска устройства (освобождаем ~15 МБ)
      try {
        await Filesystem.deleteFile({
          directory: 'DATA',
          path: zipFileName
        });
      } catch (cleanErr) {
        console.warn('⚠️ Не удалось удалить временный zip:', cleanErr);
      }

      // 6. Успешная фиксация состояния
      downloadedParts.add(partId);
      localStorage.setItem(STORAGE_KEY_DOWNLOADED_PARTS, JSON.stringify([...downloadedParts]));

      notifyAll({ status: 'complete', percent: 100 });
      return { success: true };
    } catch (err) {
      if (progressListener) {
        try { await progressListener.remove(); } catch (_) {}
      }
      console.error(`❌ Ошибка скачивания и установки ${partId}:`, err);
      throw err;
    }
  };

  const promise = runDownload();

  activeDownload = {
    partId,
    promise,
    callbacks,
    get lastProgress() { return lastProgress; }
  };

  try {
    const result = await promise;
    return result;
  } finally {
    activeDownload = null;
  }
}
