// js/engine/sound.js
// Модуль звука и озвучки для интерактивных рассказов о животных (с поддержкой звуков из kids-story-quest_1)

class SoundManager {
  constructor() {
    this.ctx = null;
    this.speechEnabled = this.loadSpeechPref();
    this.currentAudio = null;
    this.currentPlayId = 0;
    if (typeof window !== 'undefined') {
      window.soundManager = this;
    }

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.stopVoice();
        } else if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
      });
    }
  }

  loadSpeechPref() {
    try {
      const saved = localStorage.getItem('animals_speech_enabled');
      return saved === null ? true : saved === 'true';
    } catch (e) {
      return true;
    }
  }

  toggleSpeech() {
    this.speechEnabled = !this.speechEnabled;
    try {
      localStorage.setItem('animals_speech_enabled', String(this.speechEnabled));
    } catch (e) {}

    if (!this.speechEnabled) {
      this.stopVoice();
    }
    return this.speechEnabled;
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Тактильный виброотклик (Haptic Feedback) для мобильных устройств (как в kids-story-quest_1)
  vibrate(pattern = 22) {
    try {
      const Haptics = window.Capacitor?.Plugins?.Haptics;
      if (Haptics) {
        const style = pattern > 20 ? 'MEDIUM' : 'LIGHT';
        Haptics.impact({ style }).catch(() => {});
      } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch (e) {}
  }

  // 1. Мягкий звук нажатия кнопки меню
  playMenuTap() {
    this.vibrate(22);
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(270, now + 0.08);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.21, now + 0.016);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  // 2. Мягкий минорный перезвон для закрытых историй («Ой, замочек» — один в один из kids-story-quest_1)
  playLockedSoft() {
    this.vibrate(18);
    try {
      this.initContext();
      if (!this.ctx) return;

      const baseNow = this.ctx.currentTime;
      // Мягкое нисходящее минорное созвучие: F4 (349.23) -> D4 (293.66)
      const notes = [
        { freq: 349.23, delay: 0.000, decay: 0.28, vol: 0.26 }, // F4
        { freq: 293.66, delay: 0.090, decay: 0.36, vol: 0.22 }  // D4
      ];

      notes.forEach(n => {
        const noteStart = baseNow + n.delay;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, noteStart);

        gain.gain.setValueAtTime(0.001, noteStart);
        gain.gain.linearRampToValueAtTime(n.vol, noteStart + 0.020);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + n.decay);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + n.decay);
      });
    } catch (e) {
      console.warn('Audio error (locked soft)', e);
    }
  }

  // 3. Сказочный перебор струнок для успешной разблокировки и промокода (из kids-story-quest_1)
  playStarBell() {
    this.vibrate(22);
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const strings = [
        { freq: 1760.00, delay: 0.000, decay: 0.20, vol: 0.060 }, // A6
        { freq: 2217.46, delay: 0.022, decay: 0.22, vol: 0.065 }, // C#7
        { freq: 2637.02, delay: 0.044, decay: 0.26, vol: 0.070 }  // E7
      ];

      strings.forEach(s => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(s.freq, now + s.delay);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(s.freq * 2.2, now + s.delay);
        filter.frequency.exponentialRampToValueAtTime(s.freq * 1.05, now + s.delay + 0.08);

        gain.gain.setValueAtTime(0.0001, now + s.delay);
        gain.gain.linearRampToValueAtTime(s.vol, now + s.delay + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + s.delay + s.decay);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + s.delay);
        osc.stop(now + s.delay + s.decay + 0.02);
      });
    } catch (e) {}
  }

  // 4. Мягкий книжный звук перелистывания страницы
  playPageTurn() {
    this.vibrate(20);
    try {
      this.initContext();
      if (!this.ctx) return;

      const baseNow = this.ctx.currentTime;
      const notes = [440, 554.37]; // A4 -> C#5
      notes.forEach((freq, idx) => {
        const start = baseNow + idx * 0.045;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.11, start + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.23);
      });
    } catch (e) {}
  }

  // Остановка текущей озвучки
  stopVoice() {
    this.currentPlayId++;
    if (this.currentAudio) {
      try {
        this.currentAudio.ontimeupdate = null;
        this.currentAudio.onended = null;
        this.currentAudio.onerror = null;
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.src = '';
      } catch (e) {}
      this.currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Синтез речи (резервный вариант, пока нет записанного mp3-файла)
  speak(text, onFinish, playId) {
    if (playId !== undefined && this.currentPlayId !== playId) return;
    if (!this.speechEnabled || !('speechSynthesis' in window)) {
      if (onFinish) onFinish();
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = (text || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!cleanText) {
      if (onFinish) onFinish();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.96;
    utterance.pitch = 1.0;

    let hasFinished = false;
    const finish = () => {
      if (playId !== undefined && this.currentPlayId !== playId) return;
      if (!hasFinished) {
        hasFinished = true;
        if (onFinish) onFinish();
      }
    };

    utterance.onend = finish;
    utterance.onerror = finish;
    window.speechSynthesis.speak(utterance);
  }

  // Воспроизведение аудиофайла страницы с синхронизацией таймингов иллюстраций (onTimeUpdate)
  playVoice(audioSrc, fallbackText, onFinish, onTimeUpdate, onUseFallbackTimer) {
    this.stopVoice();
    const playId = this.currentPlayId;

    if (!this.speechEnabled) {
      if (typeof onUseFallbackTimer === 'function') onUseFallbackTimer();
      if (onFinish) onFinish();
      return;
    }

    if (audioSrc) {
      const audio = new Audio(audioSrc);
      this.currentAudio = audio;

      if (typeof onTimeUpdate === 'function') {
        audio.ontimeupdate = () => {
          if (this.currentPlayId !== playId) return;
          onTimeUpdate(audio.currentTime || 0);
        };
      }

      let hasFinished = false;
      const finish = () => {
        if (this.currentPlayId !== playId) return;
        if (!hasFinished) {
          hasFinished = true;
          if (this.currentAudio === audio) this.currentAudio = null;
          if (onFinish) onFinish();
        }
      };

      let fallbackTriggered = false;
      const handleFallback = () => {
        if (this.currentPlayId !== playId || fallbackTriggered) return;
        fallbackTriggered = true;
        if (this.currentAudio === audio) this.currentAudio = null;
        if (typeof onUseFallbackTimer === 'function') onUseFallbackTimer();
        if (fallbackText) {
          this.speak(fallbackText, onFinish, playId);
        } else {
          finish();
        }
      };

      audio.onended = finish;
      audio.onerror = handleFallback;

      audio.play().catch(handleFallback);
      return;
    }

    if (typeof onUseFallbackTimer === 'function') onUseFallbackTimer();
    if (fallbackText) {
      this.speak(fallbackText, onFinish, playId);
    } else if (onFinish) {
      onFinish();
    }
  }
}

export const soundManager = new SoundManager();
