/**
 * Модуль чата и входящих WebSocket-событий (Twitch IRC)
 * с защитой от утечек памяти и фильтрацией из window.OVERLAY_CONFIG.
 */
(function initETS2Chat(global) {
  'use strict';

  const app = global.ETS2Overlay;
  if (!app) return;

  const { config, isPlaceholder, log, warn } = app;

  const activeMessageTimers = new Map();
  const sockets = [];
  const reconnectTimers = [];
  let msgSeq = 0;

  function getViewport() {
    return global.document.getElementById('chat-viewport');
  }

  function isIgnoredUser(username) {
    const list = Array.isArray(config.chat.ignoredUsers) ? config.chat.ignoredUsers : [];
    const target = String(username || '').trim().toLowerCase();
    return list.some((u) => String(u || '').trim().toLowerCase() === target);
  }

  function removeMessageEl(el) {
    if (!el) return;
    const msgId = el.dataset.msgId;
    if (msgId && activeMessageTimers.has(msgId)) {
      clearTimeout(activeMessageTimers.get(msgId));
      activeMessageTimers.delete(msgId);
    }

    el.classList.remove('is-visible');
    el.classList.add('is-removing');
    setTimeout(() => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }, 300);
  }

  function pruneMessages(viewport) {
    const maxMessages = Math.max(5, Number(config.chat.maxMessages) || 30);
    while (viewport.children.length > maxMessages) {
      const oldest = viewport.firstElementChild;
      if (!oldest) break;
      const msgId = oldest.dataset.msgId;
      if (msgId && activeMessageTimers.has(msgId)) {
        clearTimeout(activeMessageTimers.get(msgId));
        activeMessageTimers.delete(msgId);
      }
      viewport.removeChild(oldest);
    }
  }

  function createEmoteImage(src, altText, fallbackText) {
    const doc = global.document;
    const img = doc.createElement('img');
    img.className = 'chat-emote';
    img.src = src;
    img.alt = altText;
    img.decoding = 'async';
    img.addEventListener('error', () => {
      if (img.parentNode) {
        img.parentNode.replaceChild(doc.createTextNode(fallbackText), img);
      }
    }, { once: true });
    return img;
  }

  function parseTwitchEmotesTag(emotesTag, codePointLength) {
    if (!emotesTag || typeof emotesTag !== 'string') return [];
    const occurrences = [];

    emotesTag.split('/').forEach((entry) => {
      if (!entry) return;
      const colonIdx = entry.indexOf(':');
      if (colonIdx <= 0) return;

      const emoteId = entry.slice(0, colonIdx).trim();
      if (!emoteId) return;

      const rangesStr = entry.slice(colonIdx + 1);
      rangesStr.split(',').forEach((rangeStr) => {
        const dashIdx = rangeStr.indexOf('-');
        if (dashIdx <= 0) return;

        const start = Number(rangeStr.slice(0, dashIdx));
        const end = Number(rangeStr.slice(dashIdx + 1));
        if (!Number.isInteger(start) || !Number.isInteger(end)) return;
        if (start < 0 || end < start || end >= codePointLength) return;

        occurrences.push({ start, end, emoteId });
      });
    });

    occurrences.sort((a, b) => a.start - b.start || a.end - b.end);

    const nonOverlapping = [];
    let cursor = 0;
    occurrences.forEach((item) => {
      if (item.start >= cursor) {
        nonOverlapping.push(item);
        cursor = item.end + 1;
      }
    });

    return nonOverlapping;
  }

  function appendTwitchEmoteNodes(parentEl, rawText, emotesTag) {
    const doc = global.document;
    const chars = Array.from(rawText);
    const occurrences = parseTwitchEmotesTag(emotesTag, chars.length);

    if (occurrences.length === 0) {
      parentEl.appendChild(doc.createTextNode(rawText.trim()));
      return;
    }

    let cursor = 0;
    occurrences.forEach((occ) => {
      if (occ.start > cursor) {
        parentEl.appendChild(doc.createTextNode(chars.slice(cursor, occ.start).join('')));
      }
      const emoteName = chars.slice(occ.start, occ.end + 1).join('');
      const src = `https://static-cdn.jtvnw.net/emoticons/v2/${encodeURIComponent(occ.emoteId)}/default/dark/1.0`;
      parentEl.appendChild(createEmoteImage(src, '', emoteName));
      cursor = occ.end + 1;
    });

    if (cursor < chars.length) {
      parentEl.appendChild(doc.createTextNode(chars.slice(cursor).join('')));
    }
  }

  function appendChatMessageText(parentEl, platform, rawText, emotesTag) {
    if (platform === 'twitch' && emotesTag) {
      appendTwitchEmoteNodes(parentEl, rawText, emotesTag);
      return;
    }
    const cleanText = rawText.trim();
    parentEl.appendChild(global.document.createTextNode(cleanText));
  }

  function pushMessage(payload) {
    const viewport = getViewport();
    if (!viewport || !payload) return false;

    const rawText = String(payload.text || '');
    const trimmedText = rawText.trim();
    if (!trimmedText) return false;

    if (config.chat.hideCommands && trimmedText.startsWith('!')) {
      return false;
    }

    const doc = global.document;
    const username = String(payload.username || 'Зритель').trim();
    if (isIgnoredUser(username)) {
      return false;
    }

    msgSeq += 1;
    const msgId = `msg-${msgSeq}`;
    const platform = String(payload.platform || 'twitch').toLowerCase();
    const safePlatformClass = /^[a-z0-9-]+$/.test(platform) ? platform : 'twitch';
    const role = payload.role ? String(payload.role).toUpperCase() : '';
    const userColor = payload.color || '';

    const el = doc.createElement('div');
    el.className = 'chat-msg';
    el.dataset.msgId = msgId;

    if (userColor) {
      el.style.setProperty('--msg-user-color', userColor);
      el.style.setProperty('--msg-accent', userColor);
    }

    const platformLabel = platform === 'vk' ? 'VK' : 'TW';

    const metaEl = doc.createElement('span');
    metaEl.className = 'chat-msg-meta';

    const platformTagEl = doc.createElement('span');
    platformTagEl.className = `chat-platform-tag chat-platform-tag--${safePlatformClass}`;
    platformTagEl.textContent = platformLabel;
    metaEl.appendChild(platformTagEl);

    if (role) {
      const roleEl = doc.createElement('span');
      roleEl.className = 'chat-role-badge';
      roleEl.textContent = role;
      metaEl.appendChild(roleEl);
    }

    const authorEl = doc.createElement('span');
    authorEl.className = 'chat-author';
    authorEl.textContent = username;

    const textEl = doc.createElement('span');
    textEl.className = 'chat-text';
    appendChatMessageText(textEl, platform, rawText, payload.emotes);

    el.appendChild(metaEl);
    el.appendChild(authorEl);
    el.appendChild(textEl);

    viewport.appendChild(el);
    pruneMessages(viewport);

    requestAnimationFrame(() => {
      el.classList.add('is-visible');
    });

    const lifetimeMs = Number(config.chat.messageLifetimeMs) || 0;
    if (lifetimeMs > 0) {
      const timerId = setTimeout(() => {
        activeMessageTimers.delete(msgId);
        removeMessageEl(el);
      }, lifetimeMs);
      activeMessageTimers.set(msgId, timerId);
    }

    return true;
  }

  function parseIrcTags(rawTags) {
    const tags = {};
    if (!rawTags) return tags;
    rawTags.split(';').forEach((pair) => {
      const eqIdx = pair.indexOf('=');
      if (eqIdx === -1) return;
      const key = pair.slice(0, eqIdx);
      const val = pair.slice(eqIdx + 1)
        .replace(/\\s/g, ' ')
        .replace(/\\:/g, ';')
        .replace(/\\\\/g, '\\');
      tags[key] = val;
    });
    return tags;
  }

  function resolveTwitchRole(tags) {
    const badges = String(tags.badges || '');
    if (badges.includes('broadcaster/')) return 'DRIVER';
    if (tags.mod === '1' || badges.includes('moderator/')) return 'MOD';
    if (tags.vip === '1' || badges.includes('vip/')) return 'VIP';
    if (tags.subscriber === '1' || badges.includes('subscriber/')) return 'SUB';
    return '';
  }

  function connectTwitchIRC() {
    const tw = config.channels && config.channels.twitch;
    if (!tw || !tw.enabled || isPlaceholder(tw.channelName)) return false;

    const channel = String(tw.channelName).trim().toLowerCase().replace(/^#/, '');
    if (!channel) return false;

    let backoffMs = 3000;
    let closedByPage = false;

    function openSocket() {
      if (closedByPage) return;
      const ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
      sockets.push(ws);

      ws.addEventListener('open', () => {
        backoffMs = 3000;
        log(`Twitch IRC подключен к каналу #${channel}`);
        ws.send('CAP REQ :twitch.tv/tags twitch.tv/commands');

        if (!isPlaceholder(tw.oauthToken)) {
          const token = String(tw.oauthToken).startsWith('oauth:')
            ? String(tw.oauthToken)
            : `oauth:${tw.oauthToken}`;
          ws.send(`PASS ${token}`);
          ws.send(`NICK ${channel}`);
        } else {
          const guestId = 10000 + Math.floor(Math.random() * 89999);
          ws.send(`NICK justinfan${guestId}`);
        }
        ws.send(`JOIN #${channel}`);
      });

      ws.addEventListener('message', (event) => {
        const lines = String(event.data || '').split('\r\n');
        lines.forEach((line) => {
          if (!line) return;
          if (line.startsWith('PING')) {
            ws.send(line.replace('PING', 'PONG'));
            return;
          }

          let cursor = line;
          let tags = {};
          if (cursor.startsWith('@')) {
            const spaceIdx = cursor.indexOf(' ');
            if (spaceIdx === -1) return;
            tags = parseIrcTags(cursor.slice(1, spaceIdx));
            cursor = cursor.slice(spaceIdx + 1);
          }

          const privMatch = cursor.match(/^:([^!]+)![^ ]+ PRIVMSG #[^ ]+ :(.*)$/);
          if (privMatch) {
            const username = tags['display-name'] || privMatch[1];
            let text = privMatch[2];
            if (text.startsWith('\x01ACTION ') && text.endsWith('\x01')) {
              text = text.slice(8, -1);
            }
            pushMessage({
              platform: 'twitch',
              username,
              text,
              color: tags.color || '',
              role: resolveTwitchRole(tags),
              emotes: tags.emotes || ''
            });
            return;
          }

          const noticeMatch = cursor.match(/^:[^ ]+ USERNOTICE #[^ ]+(?: :(.*))?$/);
          if (noticeMatch && app.alerts) {
            const msgId = tags['msg-id'];
            const username = tags['display-name'] || tags.login || 'Пилот';
            const message = noticeMatch[1] || '';

            if (msgId === 'sub' || msgId === 'resub' || msgId === 'subgift') {
              app.alerts.enqueue({
                type: 'sub',
                username,
                months: Number(tags['msg-param-cumulative-months']) || 1,
                message
              });
            } else if (msgId === 'raid') {
              app.alerts.enqueue({
                type: 'raid',
                username: tags['msg-param-displayName'] || username,
                viewers: Number(tags['msg-param-viewerCount']) || 0
              });
            }
          }
        });
      });

      ws.addEventListener('close', () => {
        if (closedByPage) return;
        warn(`Twitch IRC отключен, переподключение через ${backoffMs}мс`);
        const t = setTimeout(openSocket, backoffMs);
        reconnectTimers.push(t);
        backoffMs = Math.min(30000, backoffMs * 2);
      });

      ws.addEventListener('error', (err) => {
        warn('Ошибка Twitch IRC WebSocket:', err);
      });
    }

    global.addEventListener('pagehide', () => {
      closedByPage = true;
    });

    openSocket();
    return true;
  }

  function initConnections() {
    const twitchActive = connectTwitchIRC();

    const channelsLabel = global.document.getElementById('chat-channels-label');
    if (channelsLabel) {
      if (app.isTestMode) {
        channelsLabel.textContent = 'TEST // LIVE';
      } else if (twitchActive) {
        channelsLabel.textContent = 'TWITCH // LIVE';
      } else {
        channelsLabel.textContent = 'STANDBY';
      }
    }
  }

  function clearChat() {
    const viewport = getViewport();
    if (viewport) {
      viewport.replaceChildren();
    }
    activeMessageTimers.forEach((timerId) => clearTimeout(timerId));
    activeMessageTimers.clear();
  }

  global.addEventListener('pagehide', () => {
    activeMessageTimers.forEach((timerId) => clearTimeout(timerId));
    activeMessageTimers.clear();
    reconnectTimers.forEach((timerId) => clearTimeout(timerId));
    reconnectTimers.length = 0;
    sockets.forEach((ws) => {
      try {
        ws.close();
      } catch (_) {
        // Игнорируем ошибку закрытия сокета
      }
    });
  });

  app.chat = {
    push: pushMessage,
    clear: clearChat,
    initConnections
  };
})(window);
