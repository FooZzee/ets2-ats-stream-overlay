/**
 * ETS2 / ATS Stream Overlay configuration template (Twitch-only, Native SCS SDK 1.16).
 * Copy to config.js and fill in your channel details (or run Install-Overlay.bat).
 *
 * Шаблон конфигурации оверлея ETS2 / ATS (только Twitch, прямой плагин SCS SDK 1.16).
 * Скопируйте в config.js и укажите свои данные (либо запустите Install-Overlay.bat).
 */
window.OVERLAY_CONFIG = {
  // Overlay UI language / Язык интерфейса оверлея ('en' | 'ru')
  lang: 'en',

  // Debug console logs & ?test=1 demo mode / Отладочные логи в OBS и разрешение ?test=1
  debug: false,

  // Channel & integration settings / Настройки каналов и интеграций
  channels: {
    twitch: {
      enabled: true,
      channelName: 'YOUR_TWITCH_CHANNEL',
      oauthToken: '', // Optional OAuth token for authenticated IRC / Опционально
      clientId: ''
    },
    vk: {
      enabled: false,
      channelUrl: '',
      token: ''
    },
    donationAlerts: {
      enabled: false,
      socketToken: ''
    },
    obsWebSocket: {
      enabled: false,
      url: 'ws://127.0.0.1:4455',
      password: ''
    }
  },

  // FIFO Alert Queue / Система последовательных алертов
  alerts: {
    volume: 0.65,               // Sound volume (0.0 .. 1.0) / Громкость (0.0 .. 1.0)
    displayDurationMs: 5000,    // Alert card duration (ms) / Длительность показа (мс)
    pauseBetweenMs: 800,        // Pause between queued alerts / Пауза между алертами
    fallbackTimeoutMs: 10000,   // Safety unlock timeout / Страховочный таймер очереди
    minDonateAmount: 1,         // Minimum donation amount / Минимальная сумма доната
    ttsEnabled: false,          // Donation text-to-speech / Озвучка донатов
    synthFallback: true,        // Built-in WebAudio chime if no .mp3 / Звуковой сигнал приборки
    sounds: {
      follow: './assets/sounds/follow.mp3',
      sub: './assets/sounds/sub.mp3',
      donate: './assets/sounds/donate.mp3',
      raid: './assets/sounds/raid.mp3'
    }
  },

  // Chat settings / Настройки чата Twitch
  chat: {
    maxMessages: 30,            // Max DOM nodes / Максимум сообщений в DOM
    messageLifetimeMs: 0,       // Auto-hide after N ms (0 = keep) / Автоскрытие (0 = откл.)
    hideCommands: true,         // Hide '!' bot commands / Скрывать команды '!'
    ignoredUsers: ['Nightbot', 'StreamElements', 'Moobot']
  },

  // Visual theme / Оформление приборной панели
  theme: {
    cockpitPreset: 'amber',     // 'amber' | 'ice' (янтарная | ледяная)
    cockpitAccentColor: '',     // Optional hex override / Опциональный hex-акцент
    safeZoneVertical: {
      topPx: 140,
      bottomPx: 370,
      rightPx: 110
    }
  },

  // Webcam HUD frame / Рамка веб-камеры (346x195, left: 24, top: 180)
  webcam: {
    enabled: true,
    cbChannel: 'CB 19'
  },

  // Onboard computer & Native SCS SDK Telemetry / Бортовой компьютер и телеметрия SCS SDK 1.16
  ets2: {
    driverName: 'STREAMER',
    routeTag: 'ETS2 // ATS',
    routeText: 'IN TRANSIT // LIVE',
    routeMeta: 'CRUISE',
    telemetryApi: {
      enabled: true,            // Poll local bridge ./scripts/udp-bridge.ps1 (Shared Memory -> HTTP)
      url: 'http://127.0.0.1:30002/telemetry',
      pollIntervalMs: 300,
      staleAfterMs: 9000,
      offlineBackoffMaxMs: 15000,
      speedUnit: 'auto',        // 'auto' | 'ms' | 'kmh'
      navDistUnit: 'auto',      // 'auto' | 'm' | 'km'
      navTimeUnit: 'auto',      // 'auto' | 's' | 'min'
      cargoDmgUnit: 'auto',     // 'auto' | 'ratio' | 'percent'
      maxRpm: 2500
    }
  },

  // Current music track widget / Виджет текущего трека (опционально OBS Tuna)
  music: {
    enabled: true,
    title: 'TRUCK CABIN FM',
    artist: 'LIVE STREAM',
    sourceUrl: '',
    pollIntervalMs: 3000
  },

  // Bottom strip socials / Ротатор соцсетей (оставьте пустым, чтобы не показывать лишнее)
  socials: {
    switchIntervalMs: 9000,
    items: []
  }
};
