// js/engine/robokassa.js
// Модуль работы с сервером (Оплата, проверка и восстановление покупок — по стандарту kids-story-quest_1)
// Двухконтурная отказоустойчивая система (Failover: Primary API + Yandex Cloud Function)

const SERVERS = [
  'https://api.skazkikids.ru',
  'https://functions.yandexcloud.net/d4egt4gkuijcme22e2e6'
];

async function fetchWithFailover(pathAndQuery, options = {}, timeoutMs = 7000) {
  let lastError = null;

  for (const baseUrl of SERVERS) {
    const url = `${baseUrl}${pathAndQuery}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.status < 500) {
        return response;
      }
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err;
    }
  }

  throw new Error(`Сервер временно недоступен (${lastError?.message || 'Ошибка сети'})`);
}

export function getUserId() {
  if (typeof window === 'undefined') return 'usr_anonymous';
  let userId = null;
  try {
    userId = localStorage.getItem('animals_user_id');
  } catch (e) {}

  if (!userId) {
    userId = 'usr_' + Math.random().toString(36).substring(2, 12);
    try {
      localStorage.setItem('animals_user_id', userId);
    } catch (e) {}
  }
  return userId;
}

export async function fetchRobokassaUrl(email = '', partId = 'animals_collection_1', promoCode = '') {
  const userId = getUserId();
  let query = `/?action=get-payment-url&userId=${encodeURIComponent(userId)}&partId=${encodeURIComponent(partId)}&_t=${Date.now()}`;
  if (email) query += `&email=${encodeURIComponent(email.trim().toLowerCase())}`;
  if (promoCode) query += `&promoCode=${encodeURIComponent(promoCode.trim().toLowerCase())}`;

  const response = await fetchWithFailover(query, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    cache: 'no-store'
  }, 10000);

  if (!response.ok) throw new Error(`Ошибка связи с сервером оплаты (${response.status})`);
  const data = await response.json();
  if (!data.paymentUrl) throw new Error(data.error || 'Сервер не вернул ссылку на оплату');
  return data.paymentUrl;
}

export async function checkPremiumStatus(partId = 'animals_collection_1') {
  try {
    const userId = getUserId();
    let query = `/?action=check&userId=${encodeURIComponent(userId)}&_t=${Date.now()}`;
    if (partId) {
      query += `&partId=${encodeURIComponent(partId)}`;
    }
    const response = await fetchWithFailover(query, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    }, 6000);
    if (!response.ok) return false;
    const data = await response.json();
    if (partId && Array.isArray(data?.unlockedParts)) {
      return data.unlockedParts.includes(partId);
    }
    return Boolean(data?.isPremium);
  } catch (e) {
    return false;
  }
}

export async function fetchCloudUnlockedParts() {
  try {
    const userId = getUserId();
    const response = await fetchWithFailover(`/?action=check&userId=${encodeURIComponent(userId)}&_t=${Date.now()}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    }, 6000);
    if (!response.ok) return [];
    const data = await response.json();
    if (Array.isArray(data?.unlockedParts)) {
      return data.unlockedParts.filter(p => p.startsWith('animals_'));
    }
    return [];
  } catch (e) {
    return [];
  }
}

export async function restoreByEmail(email, invId) {
  try {
    const userId = getUserId();
    const query = `/?action=restore&userId=${encodeURIComponent(userId)}&email=${encodeURIComponent(email || '')}&invId=${encodeURIComponent(invId || '')}&_t=${Date.now()}`;
    const response = await fetchWithFailover(query, {}, 9000);
    if (!response.ok) return { success: false, message: `Ошибка сервера (${response.status})` };
    const data = await response.json();
    return data;
  } catch (e) {
    console.error('Ошибка восстановления по email и чеку:', e);
    return { success: false, message: `Не удалось связаться с сервером (${e?.message || 'Ошибка сети'})` };
  }
}
