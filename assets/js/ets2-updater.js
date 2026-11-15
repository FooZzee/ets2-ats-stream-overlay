/**
 * ============================================================================
 * PIP-BOY 3000 // GITHUB AUTO-UPDATE DETECTOR & CRT TERMINAL
 * ETS2 / ATS Cockpit Telemetry Stream Overlay
 * ============================================================================
 */

(function () {
  'use strict';

  // 1. ТЕКУЩАЯ ВЕРСИЯ ОВЕРЛЕЯ И РЕПОЗИТОРИЙ
  const CURRENT_VERSION = 'v1.1.0';
  const GITHUB_REPO = 'FooZzee/ets2-ats-stream-overlay';
  const API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;
  const STORAGE_KEY_DISMISSED = 'ets2_overlay_dismissed_update';
  const STORAGE_KEY_LAST_CHECK = 'ets2_overlay_last_update_check';
  const CHECK_INTERVAL_MS = 2 * 60 * 60 * 1000; // 2 часа между проверками API

  // 2. ОПРЕДЕЛЕНИЕ ЯЗЫКА И ПАРАМЕТРОВ URL
  const urlParams = new URLSearchParams(window.location.search);
  const isTestMode = urlParams.get('test_update') === '1';

  function getLang() {
    const forced = (urlParams.get('lang') || '').toLowerCase();
    if (forced === 'ru' || forced === 'en') return forced;
    const cfgLang = (window.OVERLAY_CONFIG && window.OVERLAY_CONFIG.lang || '').toLowerCase();
    return cfgLang === 'en' ? 'en' : 'ru';
  }

  // 3. СРАВНЕНИЕ СЕМАНТИЧЕСКИХ ВЕРСИЙ (v1.1.0 vs v1.2.0)
  function isNewerVersion(latest, current) {
    if (!latest) return false;
    const cleanL = latest.replace(/^v/i, '').trim();
    const cleanC = current.replace(/^v/i, '').trim();

    const partsL = cleanL.split('.').map(n => parseInt(n, 10) || 0);
    const partsC = cleanC.split('.').map(n => parseInt(n, 10) || 0);

    for (let i = 0; i < Math.max(partsL.length, partsC.length); i++) {
      const numL = partsL[i] || 0;
      const numC = partsC[i] || 0;
      if (numL > numC) return true;
      if (numL < numC) return false;
    }
    return false;
  }

  // 4. WEBAUDIO РЕТРО-СИНТЕЗАТОР ЗВУКОВ ТЕРМИНАЛА (PIP-BOY SYNTH)
  let audioCtx = null;

  function getAudioContext() {
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioCtx = new AudioContextClass();
        }
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }
      return audioCtx;
    } catch (e) {
      return null;
    }
  }

  // Звук щелчка печатной машинки
  function playTerminalClick() {
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== 'running') return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(1400 + Math.random() * 400, ctx.currentTime);

      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.012);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.015);
    } catch (e) {}
  }

  // Звук выключения CRT-монитора
  function playCrtPowerOff() {
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== 'running') return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.38);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  }

  // 5. ОЧИСТКА ТЕКСТА РЕЛИЗА ИЗ GITHUB ДЛЯ ТЕРМИНАЛА
  function formatChangelogText(rawBody, latestTag, isRu) {
    if (!rawBody) {
      return isRu
        ? `[СИСТЕМА] Доступна новая версия ${latestTag}.\nПодробности релиза на странице GitHub.`
        : `[SYSTEM] New firmware version ${latestTag} is available.\nSee GitHub release page for details.`;
    }

    // Удаляем markdown ссылки, картинки и html-теги
    let cleaned = rawBody
      .replace(/<[^>]+>/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
      .replace(/#{1,6}\s?/g, '')
      .replace(/`{1,3}/g, '');

    const lines = cleaned.split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0 && !l.startsWith('>') && !l.startsWith('---'));

    // Ограничиваем объём текста терминала до 8-10 самых информативных строк
    const snippet = lines.slice(0, 10).join('\n');
    return snippet;
  }

  // 6. СОЗДАНИЕ И ПОКАЗ PIP-BOY ОКНА
  function showPipBoyModal(latestVersion, releaseNotes, releaseUrl) {
    if (document.getElementById('pipboy-modal-overlay')) return;

    const isRu = getLang() === 'ru';

    // Локализация интерфейса Pip-Boy
    const textConfig = isRu ? {
      sysHeader: 'ROBCO INDUSTRIES // PIP-BOY 3000 OVERLAY PROTOCOL',
      mainTitle: 'ОБНАРУЖЕНО ОБНОВЛЕНИЕ СИСТЕМЫ',
      tagText: `ДОСТУПНА ВЕРСИЯ: ${latestVersion} (ТЕКУЩАЯ: ${CURRENT_VERSION})`,
      btnUpdate: '🚀 ОБНОВИТЬ',
      btnDismiss: '💤 ДА НУ ЕГО НАФИГ',
      skipHint: 'Нажмите в область текста, чтобы пропустить печать...'
    } : {
      sysHeader: 'ROBCO INDUSTRIES // PIP-BOY 3000 OVERLAY PROTOCOL',
      mainTitle: 'FIRMWARE UPDATE DETECTED',
      tagText: `NEW VERSION: ${latestVersion} (INSTALLED: ${CURRENT_VERSION})`,
      btnUpdate: '🚀 UPDATE NOW',
      btnDismiss: '💤 NEVERMIND',
      skipHint: 'Click inside text area to skip typewriter...'
    };

    const formattedLog = formatChangelogText(releaseNotes, latestVersion, isRu);

    const fullTerminalText = isRu
      ? `[СИСТЕМА ОПОВЕЩЕНИЙ PIP-BOY 3000]\n` +
        `ПОДКЛЮЧЕНИЕ К СЕРВЕРУ ОБНОВЛЕНИЙ... УСПЕШНО.\n` +
        `------------------------------------------------------------\n` +
        `КРАТКИЙ СПИСОК ИЗМЕНЕНИЙ:\n\n` +
        `${formattedLog}\n\n` +
        `------------------------------------------------------------\n` +
        `ВЫБЕРИТЕ ДЕЙСТВИЕ НА ТЕРМИНАЛЕ:`
      : `[PIP-BOY 3000 BROADCAST SYSTEM]\n` +
        `CONNECTING TO UPDATE SERVER... SUCCESS.\n` +
        `------------------------------------------------------------\n` +
        `CHANGELOG SUMMARY:\n\n` +
        `${formattedLog}\n\n` +
        `------------------------------------------------------------\n` +
        `SELECT OPERATIONAL COMMAND:`;

    // Создаем разметку терминала
    const overlay = document.createElement('div');
    overlay.className = 'pipboy-overlay';
    overlay.id = 'pipboy-modal-overlay';

    overlay.innerHTML = `
      <div class="pipboy-screen" id="pipboy-crt-screen" role="dialog" aria-modal="true">
        <header class="pipboy-header">
          <div class="pipboy-logo-wrapper">
            <img src="./assets/img/pipboy-logo.png" alt="FooZzee Logo" class="pipboy-logo" onerror="this.style.display='none'">
          </div>
          <div class="pipboy-header-meta">
            <div class="pipboy-sys-title">${textConfig.sysHeader}</div>
            <div class="pipboy-main-title">${textConfig.mainTitle}</div>
            <div class="pipboy-status-strip">
              <span class="pipboy-status-tag">
                <span class="pipboy-pulse-dot" aria-hidden="true"></span>
                <span>${textConfig.tagText}</span>
              </span>
            </div>
          </div>
        </header>

        <div class="pipboy-body" id="pipboy-body" title="${textConfig.skipHint}">
          <div class="pipboy-terminal-text" id="pipboy-text"></div>
          <span class="pipboy-cursor" id="pipboy-cursor" aria-hidden="true"></span>
          <div class="pipboy-hint">${textConfig.skipHint}</div>
        </div>

        <footer class="pipboy-footer">
          <button type="button" class="pipboy-btn pipboy-btn--dismiss" id="pipboy-btn-dismiss">
            ${textConfig.btnDismiss}
          </button>
          <button type="button" class="pipboy-btn pipboy-btn--update" id="pipboy-btn-update">
            ${textConfig.btnUpdate}
          </button>
        </footer>
      </div>
    `;

    document.body.appendChild(overlay);

    const bodyEl = document.getElementById('pipboy-body');
    const textEl = document.getElementById('pipboy-text');
    const cursorEl = document.getElementById('pipboy-cursor');
    const screenEl = document.getElementById('pipboy-crt-screen');
    const btnUpdate = document.getElementById('pipboy-btn-update');
    const btnDismiss = document.getElementById('pipboy-btn-dismiss');

    // ЭФФЕКТ ПЕЧАТНОЙ МАШИНКИ (TYPEWRITER)
    let charIndex = 0;
    let isTyping = true;
    let typeInterval = null;

    function finishTypingInstantly() {
      if (!isTyping) return;
      isTyping = false;
      if (typeInterval) clearInterval(typeInterval);
      textEl.textContent = fullTerminalText;
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    bodyEl.addEventListener('click', finishTypingInstantly);

    typeInterval = setInterval(() => {
      if (charIndex < fullTerminalText.length) {
        textEl.textContent += fullTerminalText[charIndex];
        charIndex++;

        // Периодический ретро-звук щелчка клавиши
        if (charIndex % 3 === 0) {
          playTerminalClick();
        }

        bodyEl.scrollTop = bodyEl.scrollHeight;
      } else {
        isTyping = false;
        clearInterval(typeInterval);
      }
    }, 20);

    // ОБРАБОТЧИК КНОПКИ: ОБНОВИТЬ
    btnUpdate.addEventListener('click', () => {
      window.open(releaseUrl || `https://github.com/${GITHUB_REPO}/releases/latest`, '_blank');
    });

    // ОБРАБОТЧИК КНОПКИ: ДА НУ ЕГО НАФИГ
    btnDismiss.addEventListener('click', () => {
      playCrtPowerOff();
      try {
        localStorage.setItem(STORAGE_KEY_DISMISSED, latestVersion);
        sessionStorage.setItem('ets2_overlay_dismissed_session', 'true');
      } catch (e) {}

      screenEl.classList.add('pipboy-powering-off');
      setTimeout(() => {
        overlay.style.transition = 'opacity 0.2s';
        overlay.style.opacity = '0';
        setTimeout(() => {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, 200);
      }, 450);
    });
  }

  // 7. ЗАПУСК ПРОВЕРКИ И РЕЖИМА ТЕСТИРОВАНИЯ
  async function checkForUpdates() {
    // Режим принудительного демо-теста через ?test_update=1
    if (isTestMode) {
      console.log('[PipBoy Updater] Test mode activated via ?test_update=1');
      const sampleNotes =
        `- Полная поддержка Euro Truck Simulator 2 — DLC Coaches (Пассажирские рейсы).\n` +
        `- Вывод показателя комфорта пассажиров: КОМФОРТ: XX% в бегущей строке.\n` +
        `- 4 новых канала телеметрии: bus_job.average_satisfaction, rest.stop, electric, engine.\n` +
        `- 100% сплошной непрозрачный фон нижней приборной панели (alpha = 1) для OBS Studio.\n` +
        `- Настройка DonationAlerts в графическом установщике Install-Overlay.bat.`;
      setTimeout(() => {
        showPipBoyModal('v1.2.0', sampleNotes, `https://github.com/${GITHUB_REPO}/releases/latest`);
      }, 800);
      return;
    }

    // Проверяем, не было ли окно отклонено в этой сессии
    try {
      if (sessionStorage.getItem('ets2_overlay_dismissed_session') === 'true') {
        return;
      }
    } catch (e) {}

    // Проверяем частоту обращений к GitHub API (не чаще раза в 2 часа)
    try {
      const lastCheck = parseInt(localStorage.getItem(STORAGE_KEY_LAST_CHECK), 10);
      if (lastCheck && (Date.now() - lastCheck < CHECK_INTERVAL_MS)) {
        return;
      }
    } catch (e) {}

    try {
      const response = await fetch(API_URL, {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });

      if (!response.ok) return;

      const data = await response.json();
      const latestTag = data.tag_name || '';
      const releaseUrl = data.html_url || `https://github.com/${GITHUB_REPO}/releases/latest`;
      const releaseNotes = data.body || '';

      try {
        localStorage.setItem(STORAGE_KEY_LAST_CHECK, Date.now().toString());
      } catch (e) {}

      // Проверяем, не отклонял ли пользователь именно эту версию
      try {
        const dismissedTag = localStorage.getItem(STORAGE_KEY_DISMISSED);
        if (dismissedTag === latestTag) {
          return;
        }
      } catch (e) {}

      // Если версия на GitHub новее текущей — выводим терминал Pip-Boy
      if (isNewerVersion(latestTag, CURRENT_VERSION)) {
        setTimeout(() => {
          showPipBoyModal(latestTag, releaseNotes, releaseUrl);
        }, 1200);
      }
    } catch (err) {
      console.warn('[PipBoy Updater] Could not check GitHub releases:', err);
    }
  }

  // Экспортируем функцию в window для возможности ручного вызова из консоли:
  // window.showPipBoyUpdateModal('v1.2.0', 'Пример изменений...');
  window.showPipBoyUpdateModal = function (tag, notes, url) {
    showPipBoyModal(tag || 'v1.2.0', notes || 'Тестовое обновление...', url || `https://github.com/${GITHUB_REPO}/releases/latest`);
  };

  // Автозапуск после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkForUpdates);
  } else {
    checkForUpdates();
  }
})();
