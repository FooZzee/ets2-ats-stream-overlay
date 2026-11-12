/**
 * Строго последовательная FIFO-очередь алертов бортового компьютера ETS2 / ATS.
 * Поддерживает donate, sub, follow, raid, безопасный звук и fallback-таймер.
 */
(function initETS2Alerts(global) {
  'use strict';

  const app = global.ETS2Overlay;
  if (!app) return;

  const { config, isPlaceholder, escapeHtml, log, warn } = app;

  const ALERT_PRESETS = {
    donate: {
      code: 'OBC // ТОПЛИВО И ГРУЗ',
      subtitle: 'ДОНАТ В РЕЙСЕ',
      defaultBadge: 'ДОНАТ'
    },
    sub: {
      code: 'CREW // ЛИЦЕНЗИЯ',
      subtitle: 'ПОДПИСКА НА КАНАЛ',
      defaultBadge: 'ПОДПИСЧИК'
    },
    follow: {
      code: 'CONVOY // НОВЫЙ ВОДИТЕЛЬ',
      subtitle: 'ВСТУПИЛ В КОЛОННУ',
      defaultBadge: '+1 ЮНИТ'
    },
    raid: {
      code: 'CONVOY // ВСТРЕЧНАЯ КОЛОННА',
      subtitle: 'ВХОДЯЩИЙ РЕЙД',
      defaultBadge: 'РЕЙД'
    }
  };

  const queue = [];
  const brokenSounds = new Set();
  const audioPool = new Map();

  let isProcessing = false;
  let activeAlertId = null;
  let activeCardEl = null;
  let activeAudio = null;
  let audioCtx = null;
  let seqCounter = 0;

  let enterTimer = null;
  let displayTimer = null;
  let exitTimer = null;
  let pauseTimer = null;
  let fallbackTimer = null;

  function getContainer() {
    return global.document.getElementById('alert-dock');
  }

  function clearTimers() {
    if (enterTimer !== null) {
      cancelAnimationFrame(enterTimer);
      enterTimer = null;
    }
    if (displayTimer !== null) {
      clearTimeout(displayTimer);
      displayTimer = null;
    }
    if (exitTimer !== null) {
      clearTimeout(exitTimer);
      exitTimer = null;
    }
    if (pauseTimer !== null) {
      clearTimeout(pauseTimer);
      pauseTimer = null;
    }
    if (fallbackTimer !== null) {
      clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }
  }

  function stopActiveAudio() {
    if (activeAudio) {
      try {
        activeAudio.pause();
        activeAudio.currentTime = 0;
      } catch (_) {
        // Игнорируем возможные ошибки остановки аудио
      }
      activeAudio = null;
    }
    if (global.speechSynthesis && typeof global.speechSynthesis.cancel === 'function') {
      try {
        global.speechSynthesis.cancel();
      } catch (_) {
        // Игнорируем ограничения браузера
      }
    }
  }

  function playSynthChime(type, volume) {
    if (volume <= 0 || config.alerts.synthFallback === false) return;
    const AudioContextCtor = global.AudioContext || global.webkitAudioContext;
    if (!AudioContextCtor) return;

    try {
      if (!audioCtx) {
        audioCtx = new AudioContextCtor();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }

      const now = audioCtx.currentTime;
      const notesByType = {
        donate: [587.33, 880.0, 1174.66],
        sub: [523.25, 659.25, 783.99],
        follow: [523.25, 659.25],
        raid: [440.0, 554.37, 659.25, 880.0]
      };
      const notes = notesByType[type] || notesByType.follow;

      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const startAt = now + idx * 0.085;
        const duration = 0.22;

        osc.type = type === 'raid' ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, startAt);

        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.02, volume * 0.14), startAt + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(startAt);
        osc.stop(startAt + duration + 0.02);
      });
    } catch (err) {
      warn('WebAudio chime fallback skipped:', err);
    }
  }

  function playAlertSound(type) {
    const rawVolume = Number(config.alerts.volume);
    const volume = Number.isFinite(rawVolume) ? Math.max(0, Math.min(1, rawVolume)) : 0.65;
    if (volume <= 0) return;

    const soundSrc = config.alerts.sounds && config.alerts.sounds[type];
    if (!soundSrc || brokenSounds.has(soundSrc)) {
      playSynthChime(type, volume);
      return;
    }

    let audio = audioPool.get(soundSrc);
    if (!audio) {
      audio = new Audio();
      audio.preload = 'auto';
      audio.src = soundSrc;
      audio.addEventListener('error', () => {
        brokenSounds.add(soundSrc);
        warn(`Звуковой файл не найден или не загружен (${soundSrc}), используется синтезированный сигнал.`);
      });
      audioPool.set(soundSrc, audio);
    }

    const alertIdAtStart = activeAlertId;

    try {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = volume;
      activeAudio = audio;
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch((err) => {
          if (activeAlertId !== alertIdAtStart || (err && err.name === 'AbortError')) {
            return;
          }
          warn(`Автозапуск звука заблокирован или файл недоступен (${type}):`, err && err.message ? err.message : err);
          playSynthChime(type, volume);
        });
      }
    } catch (err) {
      warn('Ошибка запуска звука алерта:', err);
      playSynthChime(type, volume);
    }
  }

  function speakDonationMessage(alertItem) {
    if (!config.alerts.ttsEnabled || alertItem.type !== 'donate' || !alertItem.message) return;
    if (!global.speechSynthesis || typeof global.SpeechSynthesisUtterance !== 'function') return;

    try {
      const utterance = new global.SpeechSynthesisUtterance(
        `${alertItem.username}. ${alertItem.message}`
      );
      utterance.lang = 'ru-RU';
      const rawVolume = Number(config.alerts.volume);
      utterance.volume = Number.isFinite(rawVolume) ? Math.max(0, Math.min(1, rawVolume)) : 0.65;
      global.speechSynthesis.speak(utterance);
    } catch (err) {
      warn('TTS недоступен:', err);
    }
  }

  function formatBadge(item, preset) {
    if (item.badgeText) return String(item.badgeText);

    if (item.type === 'donate') {
      const amount = Number(item.amount);
      const currency = item.currency || '₽';
      if (Number.isFinite(amount) && amount > 0) {
        return `${amount.toLocaleString('ru-RU')} ${currency}`;
      }
      return preset.defaultBadge;
    }

    if (item.type === 'sub') {
      const months = Number(item.months);
      if (Number.isFinite(months) && months > 1) {
        return `${months} МЕС.`;
      }
      return item.tier ? String(item.tier).toUpperCase() : preset.defaultBadge;
    }

    if (item.type === 'raid') {
      const viewers = Number(item.viewers);
      if (Number.isFinite(viewers) && viewers > 0) {
        return `+${viewers} ТЯГАЧЕЙ`;
      }
      return preset.defaultBadge;
    }

    return preset.defaultBadge;
  }

  function buildAlertCard(item) {
    const preset = ALERT_PRESETS[item.type] || ALERT_PRESETS.follow;
    const badgeText = formatBadge(item, preset);
    const subtitleText = item.subtitle || preset.subtitle;

    const card = global.document.createElement('div');
    card.className = `alert-card alert-card--${item.type}`;
    card.setAttribute('role', 'status');
    card.innerHTML = `
      <div class="alert-top">
        <span class="alert-code">${escapeHtml(preset.code)}</span>
        <span class="alert-badge">${escapeHtml(badgeText)}</span>
      </div>
      <div class="alert-main">
        <div class="alert-user">${escapeHtml(item.username || 'ВОДИТЕЛЬ')}</div>
        <div class="alert-subtitle">${escapeHtml(subtitleText)}</div>
      </div>
      ${item.message ? `<div class="alert-message">${escapeHtml(item.message)}</div>` : ''}
      <div class="alert-progress-track">
        <div class="alert-progress-fill"></div>
      </div>
    `;
    return card;
  }

  function finishCurrentAlert(reason) {
    clearTimers();
    stopActiveAudio();

    if (activeCardEl && activeCardEl.parentNode) {
      activeCardEl.parentNode.removeChild(activeCardEl);
    }

    log(`Алерт #${activeAlertId} завершён (${reason}). В очереди: ${queue.length}`);
    activeCardEl = null;
    activeAlertId = null;
    isProcessing = false;

    processNext();
  }

  function processNext() {
    if (isProcessing || queue.length === 0) return;

    const container = getContainer();
    if (!container) {
      warn('Контейнер #alert-dock не найден в DOM.');
      return;
    }

    const item = queue.shift();
    isProcessing = true;
    activeAlertId = item.id;

    const displayDurationMs = Math.max(1200, Number(config.alerts.displayDurationMs) || 5000);
    const pauseBetweenMs = Math.max(0, Number(config.alerts.pauseBetweenMs) || 800);
    const fallbackTimeoutMs = Math.max(1000, Number(config.alerts.fallbackTimeoutMs) || 10000);
    const exitAnimMs = 320;

    if (fallbackTimeoutMs <= displayDurationMs) {
      warn(`fallbackTimeoutMs (${fallbackTimeoutMs}ms) <= displayDurationMs (${displayDurationMs}ms)`);
    }

    // Страховочный таймер принудительной разблокировки FIFO-очереди
    fallbackTimer = setTimeout(() => {
      if (activeAlertId === item.id) {
        warn(`Сработал fallback-таймер (${fallbackTimeoutMs}ms) для алерта #${item.id}`);
        finishCurrentAlert('fallback-timeout');
      }
    }, fallbackTimeoutMs);

    const card = buildAlertCard(item);
    activeCardEl = card;
    container.replaceChildren(card);

    const progressFill = card.querySelector('.alert-progress-fill');

    enterTimer = requestAnimationFrame(() => {
      if (activeAlertId !== item.id) return;
      card.classList.add('is-visible');

      if (progressFill) {
        progressFill.style.transition = `transform ${displayDurationMs}ms linear`;
        requestAnimationFrame(() => {
          if (activeAlertId === item.id) {
            progressFill.style.transform = 'scaleX(0)';
          }
        });
      }
    });

    playAlertSound(item.type);
    speakDonationMessage(item);

    displayTimer = setTimeout(() => {
      if (activeAlertId !== item.id) return;
      card.classList.remove('is-visible');
      card.classList.add('is-leaving');

      exitTimer = setTimeout(() => {
        if (activeAlertId !== item.id) return;
        if (card.parentNode) {
          card.parentNode.removeChild(card);
        }
        activeCardEl = null;
        stopActiveAudio();

        if (pauseBetweenMs > 0) {
          pauseTimer = setTimeout(() => {
            if (activeAlertId === item.id) {
              finishCurrentAlert('completed');
            }
          }, pauseBetweenMs);
        } else {
          finishCurrentAlert('completed');
        }
      }, exitAnimMs);
    }, displayDurationMs);
  }

  function enqueueAlert(rawPayload) {
    if (!rawPayload || typeof rawPayload !== 'object') return false;

    const normalizedType = ALERT_PRESETS[rawPayload.type] ? rawPayload.type : 'follow';
    if (normalizedType === 'donate' && !rawPayload.force) {
      const minDonate = Number(config.alerts.minDonateAmount) || 0;
      const amount = Number(rawPayload.amount) || 0;
      if (amount < minDonate) {
        log(`Донат ${amount} отклонён по фильтру minDonateAmount (${minDonate}).`);
        return false;
      }
    }

    seqCounter += 1;
    const item = {
      id: seqCounter,
      type: normalizedType,
      username: rawPayload.username || 'ВОДИТЕЛЬ',
      amount: rawPayload.amount,
      currency: rawPayload.currency || '₽',
      months: rawPayload.months,
      tier: rawPayload.tier,
      viewers: rawPayload.viewers,
      subtitle: rawPayload.subtitle,
      badgeText: rawPayload.badgeText,
      message: rawPayload.message ? String(rawPayload.message).trim() : ''
    };

    queue.push(item);
    log(`Алерт #${item.id} (${item.type}) добавлен в FIFO-очередь. Длина очереди: ${queue.length}`);

    if (!isProcessing) {
      processNext();
    }
    return true;
  }

  function clearQueue() {
    queue.length = 0;
    finishCurrentAlert('manual-clear');
  }

  let daSocket = null;
  let daPingTimer = null;
  let daReconnectTimer = null;
  let daClosedByPage = false;

  function stopDonationAlertsTimers() {
    if (daPingTimer !== null) {
      clearInterval(daPingTimer);
      daPingTimer = null;
    }
    if (daReconnectTimer !== null) {
      clearTimeout(daReconnectTimer);
      daReconnectTimer = null;
    }
  }

  function decodeJwtPayload(token) {
    try {
      const parts = String(token || '').split('.');
      if (parts.length !== 3) return null;
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
      const json = global.atob(padded);
      return JSON.parse(json);
    } catch (_) {
      return null;
    }
  }

  function extractDonationPayload(rawData) {
    let data = rawData;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (_) {
        return null;
      }
    }
    if (!data || typeof data !== 'object') return null;

    // Разворачиваем вложенные обёртки Centrifugo (data.data)
    if (!data.username && !data.name && data.data !== undefined) {
      if (typeof data.data === 'string') {
        try {
          data = JSON.parse(data.data);
        } catch (_) {
          return null;
        }
      } else if (data.data && typeof data.data === 'object') {
        data = data.data;
      }
    }

    const hasAmountField = data.amount_main !== undefined || data.amount !== undefined || data.money !== undefined;
    const amount = Number(data.amount_main ?? data.amount ?? data.money ?? 0);
    const username = data.username || data.name;
    if (!username && !hasAmountField) return null;

    return {
      type: 'donate',
      username: username || 'Аноним',
      amount: Number.isFinite(amount) ? amount : 0,
      currency: data.currency || '₽',
      message: data.message ? String(data.message) : ''
    };
  }

  function connectDonationAlerts() {
    const da = config.channels && config.channels.donationAlerts;
    if (!da || !da.enabled || isPlaceholder(da.socketToken)) return false;

    const rawToken = String(da.socketToken).trim();
    const centrifugoUrl = da.centrifugoUrl || 'wss://centrifugo.donationalerts.com/connection/websocket';
    const fallbackSocketUrl = da.socketUrl || 'wss://socket.donationalerts.com/socket.io/?EIO=3&transport=websocket';

    let backoffMs = 4000;
    let activeMode = da.socketUrl ? 'socketio' : 'centrifugo';
    let cmdSeq = 0;

    function nextCmdId() {
      cmdSeq += 1;
      return cmdSeq;
    }

    function scheduleReconnect(targetMode, delayMs) {
      if (daClosedByPage) return;
      stopDonationAlertsTimers();
      daReconnectTimer = setTimeout(() => {
        daReconnectTimer = null;
        if (daClosedByPage) return;
        activeMode = targetMode;
        openConnection();
      }, delayMs);
    }

    async function fetchWidgetOAuthInfo(accessToken) {
      const res = await fetch('https://www.donationalerts.com/api/v1/user/oauth', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) throw new Error(`OAuth HTTP ${res.status}`);
      const json = await res.json();
      return json && json.data ? json.data : null;
    }

    async function fetchCentrifugeSubToken(accessToken, channel, clientUuid) {
      const res = await fetch('https://www.donationalerts.com/api/v1/centrifuge/subscribe', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ channels: [channel], client: clientUuid })
      });
      if (!res.ok) throw new Error(`Subscribe HTTP ${res.status}`);
      const json = await res.json();
      const first = json && Array.isArray(json.channels) ? json.channels[0] : null;
      return first && first.token ? first.token : '';
    }

    async function openCentrifugo() {
      if (daClosedByPage) return;
      stopDonationAlertsTimers();

      let connectToken = rawToken;
      let resolvedUserId = da.userId ? String(da.userId) : '';
      const accessToken = !isPlaceholder(da.oauthToken || da.accessToken)
        ? String(da.oauthToken || da.accessToken).trim()
        : '';

      if (accessToken) {
        try {
          const userData = await fetchWidgetOAuthInfo(accessToken);
          if (daClosedByPage) return;
          if (userData) {
            if (userData.id) resolvedUserId = String(userData.id);
            if (userData.socket_connection_token) connectToken = String(userData.socket_connection_token);
          }
        } catch (err) {
          warn('Не удалось получить socket_connection_token через OAuth, пробуем прямой socketToken:', err);
        }
      }

      if (!resolvedUserId) {
        const jwtPayload = decodeJwtPayload(connectToken);
        if (jwtPayload && jwtPayload.sub) {
          resolvedUserId = String(jwtPayload.sub);
        }
      }

      const ws = new WebSocket(centrifugoUrl);
      daSocket = ws;

      let connectCmdId = null;
      let subscribeCmdId = null;
      let isSubscribed = false;
      let switchingToFallback = false;

      function switchToSocketIoFallback(reason) {
        if (switchingToFallback || daClosedByPage) return;
        switchingToFallback = true;
        warn(`Centrifugo (${reason}) — переключение на резервный Socket.IO (${fallbackSocketUrl}).`);
        stopDonationAlertsTimers();
        try {
          ws.close();
        } catch (_) {
          // Игнорируем ошибку закрытия сокета
        }
        scheduleReconnect('socketio', 350);
      }

      ws.addEventListener('open', () => {
        if (daClosedByPage || ws !== daSocket) return;
        connectCmdId = nextCmdId();
        ws.send(JSON.stringify({
          params: { token: connectToken },
          id: connectCmdId
        }));
      });

      ws.addEventListener('message', async (event) => {
        if (daClosedByPage || ws !== daSocket) return;
        const lines = String(event.data || '').split(/\r?\n/);

        for (const rawLine of lines) {
          const line = rawLine.trim();
          if (!line) continue;

          // Серверный ping Centrifugo ({}) — отвечаем {} для удержания соединения
          if (line === '{}') {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send('{}');
            }
            continue;
          }

          let frame;
          try {
            frame = JSON.parse(line);
          } catch (_) {
            continue;
          }

          if (frame && typeof frame === 'object' && Object.keys(frame).length === 0) {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send('{}');
            }
            continue;
          }

          // Обработка ответа на авторизацию (connect)
          if (frame.id && frame.id === connectCmdId) {
            if (frame.error) {
              switchToSocketIoFallback(`auth error ${frame.error.code || ''}: ${frame.error.message || 'rejected'}`);
              return;
            }

            const result = frame.result || {};
            const clientUuid = result.client || '';
            const uidFromResult = result.user || (result.data && result.data.id) || (result.info && result.info.id);
            if (!resolvedUserId && uidFromResult) {
              resolvedUserId = String(uidFromResult);
            }

            stopDonationAlertsTimers();
            daPingTimer = setInterval(() => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.send('{}');
              }
            }, 25000);

            if (!resolvedUserId) {
              switchToSocketIoFallback('не получен user_id для канала $alerts:donation_<user_id>');
              return;
            }

            const channel = `$alerts:donation_${resolvedUserId}`;
            let subToken = da.channelToken ? String(da.channelToken).trim() : '';

            if (!subToken && accessToken && clientUuid) {
              try {
                subToken = await fetchCentrifugeSubToken(accessToken, channel, clientUuid);
              } catch (err) {
                warn('Не удалось получить centrifuge subscribe token:', err);
              }
            }

            if (daClosedByPage || ws.readyState !== WebSocket.OPEN) return;

            subscribeCmdId = nextCmdId();
            const subParams = subToken ? { channel, token: subToken } : { channel };
            ws.send(JSON.stringify({
              method: 1,
              params: subParams,
              id: subscribeCmdId
            }));
            continue;
          }

          // Обработка ответа на подписку (subscribe)
          if (frame.id && frame.id === subscribeCmdId) {
            if (frame.error) {
              switchToSocketIoFallback(`subscribe error ${frame.error.code || ''}: ${frame.error.message || 'denied'}`);
              return;
            }
            isSubscribed = true;
            backoffMs = 4000;
            log(`DonationAlerts Centrifugo подключен (канал $alerts:donation_${resolvedUserId}).`);
            continue;
          }

          // Обработка входящих публикаций (Centrifugo v2/v3 result или push)
          const pubContainer = frame.result || (frame.push && frame.push.pub ? {
            channel: frame.push.channel,
            data: frame.push.pub.data
          } : null);

          if (pubContainer && pubContainer.data) {
            const ch = String(pubContainer.channel || '');
            if (!ch || ch.startsWith('$alerts:donation')) {
              const donation = extractDonationPayload(pubContainer.data);
              if (donation) {
                enqueueAlert(donation);
              }
            }
          }
        }
      });

      ws.addEventListener('close', () => {
        stopDonationAlertsTimers();
        if (daClosedByPage || switchingToFallback || ws !== daSocket) return;
        if (!isSubscribed) {
          switchToSocketIoFallback('соединение закрыто до завершения подписки');
          return;
        }
        scheduleReconnect('centrifugo', backoffMs);
        backoffMs = Math.min(30000, backoffMs * 2);
      });

      ws.addEventListener('error', (err) => {
        warn('Ошибка DonationAlerts Centrifugo WebSocket:', err);
      });
    }

    function openSocketIoFallback() {
      if (daClosedByPage) return;
      stopDonationAlertsTimers();

      const ws = new WebSocket(fallbackSocketUrl);
      daSocket = ws;
      let isAuthed = false;

      ws.addEventListener('message', (event) => {
        if (daClosedByPage || ws !== daSocket) return;
        const raw = String(event.data || '');

        if (raw.startsWith('0')) {
          try {
            const meta = JSON.parse(raw.slice(1));
            const pingInterval = Math.max(10000, Number(meta.pingInterval) || 25000);
            stopDonationAlertsTimers();
            daPingTimer = setInterval(() => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.send('2');
              }
            }, pingInterval);
          } catch (_) {
            // Игнорируем ошибку разбора handshake
          }
          return;
        }

        if (raw === '2') {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send('3');
          }
          return;
        }

        if (raw === '40') {
          ws.send(`42${JSON.stringify(['add-user', { token: rawToken, type: 'alert_widget' }])}`);
          isAuthed = true;
          backoffMs = 4000;
          log('DonationAlerts Socket.IO fallback подключен.');
          return;
        }

        if (raw.startsWith('42')) {
          try {
            const payload = JSON.parse(raw.slice(2));
            if (Array.isArray(payload) && payload[0] === 'donation') {
              const donation = extractDonationPayload(payload[1]);
              if (donation) {
                enqueueAlert(donation);
              }
            }
          } catch (err) {
            warn('Ошибка парсинга DonationAlerts Socket.IO события:', err);
          }
        }
      });

      ws.addEventListener('close', () => {
        stopDonationAlertsTimers();
        if (daClosedByPage || ws !== daSocket) return;
        const nextMode = da.socketUrl ? 'socketio' : 'centrifugo';
        if (!isAuthed) {
          warn(`DonationAlerts fallback закрыт, повтор через ${backoffMs}мс.`);
        }
        scheduleReconnect(nextMode, backoffMs);
        backoffMs = Math.min(30000, backoffMs * 2);
      });

      ws.addEventListener('error', (err) => {
        warn('Ошибка DonationAlerts Socket.IO fallback:', err);
      });
    }

    function openConnection() {
      if (daClosedByPage) return;
      if (activeMode === 'socketio') {
        openSocketIoFallback();
      } else {
        openCentrifugo();
      }
    }

    openConnection();
    return true;
  }

  global.addEventListener('pagehide', () => {
    daClosedByPage = true;
    clearTimers();
    stopActiveAudio();
    stopDonationAlertsTimers();
    if (daSocket) {
      try {
        daSocket.close();
      } catch (_) {
        // Игнорируем ошибку закрытия
      }
    }
  });

  if (global.document.readyState === 'loading') {
    global.document.addEventListener('DOMContentLoaded', connectDonationAlerts);
  } else {
    connectDonationAlerts();
  }

  app.alerts = {
    enqueue: enqueueAlert,
    clear: clearQueue,
    getQueueLength: () => queue.length,
    isActive: () => isProcessing
  };
})(window);
