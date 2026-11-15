/**
 * Модуль телеметрии кабины ETS2 / ATS (scs_direct_telemetry.dll SCS SDK 1.16 Shared Memory -> HTTP 30002),
 * локализации RU/EN, синхронизации config.js, 2-рядной торпеды и тестового режима (?test=1).
 */
(function initETS2Telemetry(global) {
  'use strict';

  const app = global.ETS2Overlay;
  if (!app) return;

  const { config, isTestMode, showGuides, escapeHtml, log } = app;
  const lang = app.lang === 'en' ? 'en' : 'ru';

  const I18N = {
    ru: {
      days: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      realEtaLabel: 'РЕАЛЬНОЕ ВРЕМЯ В ПУТИ:',
      kmh: 'КМ/Ч',
      km: 'КМ',
      m: 'М',
      l: 'Л',
      l100: 'Л/100КМ',
      l100Short: 'Л/100',
      t: 'Т',
      min: 'МИН',
      h: 'Ч',
      hShort: 'ч',
      mShort: 'м',
      fuel: 'ТОПЛИВО',
      range: 'ЗАПАС ХОДА',
      fuelAvg: 'РАСХОД',
      oilWater: 'МАСЛО/ВОДА',
      air: 'ВОЗДУХ',
      adblue: 'ADBLUE',
      battery: 'АКБ',
      route: 'МАРШРУТ',
      trailer: 'ПРИЦЕП',
      throttle: 'ГАЗ',
      brake: 'ТОРМ',
      steer: 'РУЛЬ',
      truckPrefix: 'СОСТ:',
      trailerPrefix: 'ПРИЦЕП:',
      cargoPrefix: 'ГРУЗ:',
      freeRoam: 'СВОБОДНЫЙ РЕЙС',
      trailerAttachedEmpty: 'С ПРИЦЕПОМ (ПУСТОЙ)',
      noTrailer: 'БЕЗ ПРИЦЕПА',
      coachPassengerRoute: 'ПАССАЖИРСКИЙ РЕЙС',
      coachPassengerTitle: 'Пассажирский рейс DLC Coaches',
      gpsRouteNextStop: 'МАРШРУТ GPS // СЛЕДУЮЩАЯ ОСТАНОВКА',
      gpsRouteTitle: 'Навигация по маршруту GPS',
      statusInTransit: 'В РЕЙСЕ // ОНЛАЙН',
      statusFreeRoam: 'СВОБОДНАЯ ЕЗДА // ОНЛАЙН',
      statusPaused: 'ПАУЗА // В МЕНЮ',
      statusStandby: 'STANDBY // ОЖИДАНИЕ',
      enRouteMeta: 'В РЕЙСЕ',
      liveMeta: 'ОНЛАЙН',
      tickerIncome: 'ОПЛАТА:',
      tickerCompanies: 'КОМПАНИИ:',
      tickerJobType: 'ТИП ЗАКАЗА:',
      tickerTripDist: 'ПРОЙДЕНО ЗА РЕЙС:',
      tickerFuelUsed: 'СОЖЖЕНО:',
      tickerTripAvg: 'СРЕДНИЙ РАСХОД:',
      tickerMaxSpeed: 'МАКС. СКОРОСТЬ:',
      noTelemetryTitle: 'Нет связи с телеметрией',
      trailerEmptyTitle: 'Прицеп подключён (без груза)',
      noTrailerTitle: 'Прицеп не подключён',
      noRouteTitle: 'Маршрут не задан',
      truckHealthTitle: 'Техническое состояние тягача',
      trailerHealthTitle: 'Техническое состояние прицепа',
      cargoHealthTitle: 'Сохранность груза',
      jobMarkets: {
        freight_market: 'ПРЯМЫЕ ПЕРЕВОЗКИ',
        cargo_market: 'БИРЖА ГРУЗОВ',
        quick_job: 'АГЕНТСТВО',
        external_contracts: 'ВНЕШНИЕ КОНТРАКТЫ',
        external_market: 'ВНЕШНИЙ РЫНОК',
        special_transport: 'СПЕЦТРАНСПОРТ',
        owned_trailer: 'СВОЙ ПРИЦЕП',
        bus_job: 'РЕЙСОВЫЙ АВТОБУС',
        coach: 'РЕЙСОВЫЙ АВТОБУС',
        dispatch_job: 'ДИСПЕТЧЕРСКИЙ РЕЙС'
      }
    },
    en: {
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      realEtaLabel: 'REAL TIME EN ROUTE:',
      kmh: 'KM/H',
      km: 'KM',
      m: 'M',
      l: 'L',
      l100: 'L/100KM',
      l100Short: 'L/100',
      t: 'T',
      min: 'MIN',
      h: 'H',
      hShort: 'h',
      mShort: 'm',
      fuel: 'FUEL',
      range: 'RANGE',
      fuelAvg: 'FUEL AVG',
      oilWater: 'OIL/WATER',
      air: 'AIR',
      adblue: 'ADBLUE',
      battery: 'BATTERY',
      route: 'ROUTE',
      trailer: 'TRAILER',
      throttle: 'THR',
      brake: 'BRK',
      steer: 'STR',
      truckPrefix: 'TRUCK:',
      trailerPrefix: 'TRAILER:',
      cargoPrefix: 'CARGO:',
      freeRoam: 'FREE ROAM',
      trailerAttachedEmpty: 'TRAILER ATTACHED (EMPTY)',
      noTrailer: 'NO TRAILER',
      coachPassengerRoute: 'COACH // PASSENGER ROUTE',
      coachPassengerTitle: 'DLC Coaches passenger route',
      gpsRouteNextStop: 'GPS ROUTE // NEXT STOP',
      gpsRouteTitle: 'Active GPS route navigation',
      statusInTransit: 'IN TRANSIT // LIVE',
      statusFreeRoam: 'FREE ROAM // LIVE',
      statusPaused: 'PAUSED // IN MENU',
      statusStandby: 'STANDBY // OFFLINE',
      enRouteMeta: 'EN ROUTE',
      liveMeta: 'LIVE',
      tickerIncome: 'INCOME:',
      tickerCompanies: 'COMPANIES:',
      tickerJobType: 'JOB TYPE:',
      tickerTripDist: 'TRIP DISTANCE:',
      tickerFuelUsed: 'FUEL USED:',
      tickerTripAvg: 'TRIP AVG:',
      tickerMaxSpeed: 'MAX SPEED:',
      noTelemetryTitle: 'No telemetry connection',
      trailerEmptyTitle: 'Trailer attached (empty)',
      noTrailerTitle: 'No trailer attached',
      noRouteTitle: 'No active route',
      truckHealthTitle: 'Truck condition',
      trailerHealthTitle: 'Trailer condition',
      cargoHealthTitle: 'Cargo integrity',
      jobMarkets: {
        freight_market: 'FREIGHT MARKET',
        cargo_market: 'CARGO MARKET',
        quick_job: 'QUICK JOB',
        external_contracts: 'EXTERNAL CONTRACTS',
        external_market: 'EXTERNAL MARKET',
        special_transport: 'SPECIAL TRANSPORT',
        owned_trailer: 'OWNED TRAILER',
        bus_job: 'COACH ROUTE',
        coach: 'COACH ROUTE',
        dispatch_job: 'DISPATCH JOB'
      }
    }
  };

  function t(key) {
    const dict = I18N[lang] || I18N.ru;
    return dict[key] !== undefined ? dict[key] : (I18N.ru[key] ?? key);
  }

  const ATS_BRANDS = [
    'kenworth',
    'peterbilt',
    'mack',
    'freightliner',
    'western star',
    'international'
  ];

  const DEFAULT_TELEMETRY_STALE_MS = 9000;
  const MIN_TELEMETRY_STALE_MS = 8000;
  const TELEMETRY_RETAIN_KEYS = [
    'game', 'paused',
    'speed', 'speedLimit', 'cruise', 'rpm', 'gear', 'dgear',
    'fuel', 'fuelRange', 'scale',
    'truckBrand', 'truckName', 'licensePlate',
    'odometer', 'fuelAvg', 'oilTemp', 'waterTemp', 'air', 'adblue', 'battery',
    'wEngine', 'wTrans', 'wChassis', 'wWheels', 'wCabin', 'wTrailer',
    'cargoDmg', 'jobDmg'
  ];

  let clockTimer = null;
  let telemetryTimer = null;
  let musicTimer = null;
  let socialsTimer = null;
  let leavingTimer = null;
  let demoTimers = [];
  let lastClockText = '';
  let socialIndex = 0;
  let isPageClosed = false;

  let hasEverReceivedLivePacket = false;
  let telemetryPollInFlight = false;
  let telemetryMissCount = 0;
  let lastValidTelemetryPacket = null;
  let lastFreshTelemetryAt = 0;
  let bridgeOfflineNotified = false;
  let stickySpeedUnit = null; // 'ms' | 'kmh' для автоопределения единиц скорости
  let lastHazardLiveBlinkAt = 0;

  const tickerNodeCache = new Map();
  const lastTickerValues = Object.create(null);

  const SAMPLE_CHAT_POOL = [
    { platform: 'twitch', role: 'MOD', username: 'Alex_Trucker', color: '#ff9e1b', text: 'Отличный маршрут по автобану! Какой груз везёшь до Праги?' },
    { platform: 'twitch', role: 'VIP', username: 'DimaVolga', color: '#38bdf8', text: 'Картинка супер, панель вообще не перекрывает зеркала F2!' },
    { platform: 'twitch', role: 'SUB', username: 'Ksenia_Road', color: '#22c55e', text: 'Всем хорошего рейса и зелёных светофоров без штрафов' },
    { platform: 'vk', role: '', username: 'Sergey_48RU', color: '#93c5fd', text: 'Scania на подъёме уверенно тянет, сколько тонн в прицепе?' },
    { platform: 'twitch', role: '', username: 'Maverick_ETS', color: '#f59e0b', text: 'Круиз на 85 и погнали до разгрузки до заката!' },
    { platform: 'twitch', role: 'SUB', username: 'NordicHaul', color: '#86efac', text: 'Звук турбины и музыка в кабине прям кайф 🔥' }
  ];

  const SAMPLE_ALERTS = {
    donate: {
      type: 'donate',
      username: 'Даниил_Дальнобой',
      amount: 500,
      currency: '₽',
      message: 'На полный бак дизеля и безлимитный кофе на ночной трассе!',
      force: true
    },
    sub: {
      type: 'sub',
      username: 'Ksenia_Road',
      months: 6,
      tier: 'TIER 1',
      message: 'Продлила лицензию дальнобойщика на 6 месяцев!',
      force: true
    },
    follow: {
      type: 'follow',
      username: 'Pavel_FH16',
      force: true
    },
    raid: {
      type: 'raid',
      username: 'ConvoyMasters',
      viewers: 48,
      force: true
    }
  };

  const SAMPLE_TELEMETRY_PACKET = {
    game: 'ets2',
    paused: false,
    speed: 23.33,       // ~84 км/ч
    speedLimit: 25.0,   // 90 км/ч
    cruise: 23.61,      // CC 85 км/ч
    rpm: 1340,
    dgear: 'D12',
    throttle: 0.68,
    brake: 0.0,
    clutch: 0.0,
    steer: -0.08,
    fuel: 759,
    fuelRange: 3299,
    navDist: 245000,    // 245 км
    navTime: 11520,     // ~10 мин реал. времени при scale 19
    scale: 19,
    blinkL: false,
    blinkR: false,
    hazard: false,
    parkLight: true,
    lowBeam: true,
    highBeam: false,
    beacon: false,
    wipers: false,
    parkBrake: false,
    motorBrake: false,
    retarder: 0,
    diffLock: false,
    liftAxle: false,
    trailerLiftAxle: false,
    fuelWarn: false,
    airWarn: false,
    oilWarn: false,
    waterWarn: false,
    batteryWarn: false,
    trailer: { connected: true },
    trip: {
      cargo: 'Электроника',
      source: { city: 'Гамбург', company: 'EuroGoodies' },
      destination: { city: 'Прага', company: 'Transinet' },
      cargoMassKg: 22100,
      plannedDistanceKm: 642,
      income: 24850,
      jobMarket: 'freight_market',
      driven: 397,
      liters: 118,
      avg: 29.7,
      maxSpeed: 89
    },
    cfg: {
      game: 'ets2',
      source: { city: 'Гамбург', company: 'EuroGoodies' },
      destination: { city: 'Прага', company: 'Transinet' },
      cargo: { name: 'Электроника', mass: 22100 },
      planned_distance: { km: 642 },
      income: 24850,
      job: { market: 'freight_market' }
    },
    truckBrand: 'Scania',
    truckName: 'S',
    licensePlate: 'E777TS',
    odometer: 15551,
    fuelAvg: 29.4,
    oilTemp: 90,
    waterTemp: 75,
    air: 9.5,
    adblue: 66,
    battery: 27.4,
    wEngine: 0.01,
    wTrans: 0.01,
    wCabin: 0.01,
    wChassis: 0.01,
    wWheels: 0.01,
    wTrailer: 0.0,
    cargoDmg: 0.0,
    jobDmg: 0.0
  };

  function applyLocalization() {
    const nodes = global.document.querySelectorAll('[data-i18n]');
    nodes.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = t(key);
      }
    });
  }

  function updateClock() {
    const clockEl = global.document.getElementById('cam-clock');
    if (!clockEl) return;
    const now = new Date();
    const dayNames = t('days');
    const day = dayNames[now.getDay()] || '';
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const nextText = `${day} ${dd} · ${hh}:${mm}`;
    if (nextText !== lastClockText) {
      clockEl.textContent = nextText;
      lastClockText = nextText;
    }
  }

  function applyWebcamState(enabled) {
    const camBox = global.document.getElementById('cam-box');
    if (!camBox) return;
    camBox.classList.toggle('is-hidden', !enabled);
  }

  function pickValidChannelName(channelCfg) {
    if (!channelCfg || !channelCfg.channelName) return '';
    const raw = String(channelCfg.channelName).trim();
    if (!raw || app.isPlaceholder(raw)) return '';
    return raw;
  }

  function updateDriverLabels(driverNameOverride) {
    const cfgDriver = config.ets2 && config.ets2.driverName && !app.isPlaceholder(config.ets2.driverName)
      ? String(config.ets2.driverName).trim()
      : '';
    const twitchName = config.channels ? pickValidChannelName(config.channels.twitch) : '';

    const rawName = driverNameOverride || cfgDriver || twitchName || 'FOOZZEE';
    const cleanName = String(rawName).trim().toUpperCase();

    const driverPill = global.document.getElementById('driver-tag');
    if (driverPill) {
      driverPill.textContent = `DRIVER: ${cleanName}`;
    }

    const camDriverEl = global.document.getElementById('cam-driver-label');
    if (camDriverEl) {
      camDriverEl.textContent = `CAM // ${cleanName}`;
    }

    const cbEl = global.document.getElementById('cam-cb-badge');
    if (cbEl) {
      cbEl.textContent = (config.webcam && config.webcam.cbChannel) ? String(config.webcam.cbChannel) : 'CB 19';
    }
  }

  function updateDashboardSocials() {
    const twitchItem = global.document.getElementById('dash-twitch-item');
    const twitchText = global.document.getElementById('dash-twitch-text');
    const socialsBox = global.document.getElementById('dash-socials');

    if (!twitchText) return;

    const twitchCfg = config.channels && config.channels.twitch;
    const twitchName = pickValidChannelName(twitchCfg) || 'foozzee';
    const showTwitch = !twitchCfg || twitchCfg.enabled !== false;

    twitchText.textContent = `twitch.tv/${twitchName.toLowerCase()}`;
    if (twitchItem) twitchItem.classList.toggle('is-hidden', !showTwitch);

    if (socialsBox) {
      socialsBox.classList.toggle('is-hidden', !showTwitch);
    }
  }

  function setRouteDisplay(text, meta, tag) {
    const badgeEl = global.document.getElementById('route-badge');
    const valEl = global.document.getElementById('route-value');
    const metaEl = global.document.getElementById('route-meta');

    if (badgeEl && tag !== undefined) badgeEl.textContent = String(tag);
    if (valEl && text !== undefined) valEl.textContent = String(text);
    if (metaEl && meta !== undefined) metaEl.textContent = String(meta);
  }

  function setTrackDisplay(title, artist, isPlaying = true) {
    const trackRow = global.document.getElementById('track-row');
    const titleEl = global.document.getElementById('track-title');
    const artistEl = global.document.getElementById('track-artist');
    const eqEl = global.document.getElementById('eq-bars');

    if (trackRow) {
      trackRow.classList.toggle('is-hidden', config.music && config.music.enabled === false);
    }
    if (titleEl && title !== undefined) titleEl.textContent = String(title);
    if (artistEl) {
      artistEl.textContent = artist ? ` — ${artist}` : '';
    }
    if (eqEl) {
      eqEl.classList.toggle('is-paused', !isPlaying);
    }
  }

  function renderSocials(items) {
    const strip = global.document.getElementById('socials-strip');
    if (!strip) return;

    const validItems = Array.isArray(items)
      ? items.filter((item) => item && item.label && item.value && !app.isPlaceholder(item.value))
      : [];

    if (validItems.length === 0) {
      strip.classList.add('is-hidden');
      strip.replaceChildren();
      return;
    }

    strip.classList.remove('is-hidden');
    strip.replaceChildren();

    validItems.forEach((item, idx) => {
      const slide = global.document.createElement('div');
      slide.className = idx === 0 ? 'social-slide is-active' : 'social-slide';
      slide.innerHTML = `
        <span class="social-badge">${escapeHtml(item.label)}:</span>
        <span class="social-handle">${escapeHtml(item.value)}</span>
      `;
      strip.appendChild(slide);
    });

    socialIndex = 0;
    if (socialsTimer) {
      clearInterval(socialsTimer);
      socialsTimer = null;
    }

    if (validItems.length > 1) {
      const intervalMs = Math.max(3000, Number(config.socials && config.socials.switchIntervalMs) || 9000);
      socialsTimer = setInterval(() => {
        if (global.document.hidden) return;
        const slides = strip.querySelectorAll('.social-slide');
        if (slides.length <= 1) return;

        const prev = slides[socialIndex];
        socialIndex = (socialIndex + 1) % slides.length;
        const next = slides[socialIndex];

        if (leavingTimer) {
          clearTimeout(leavingTimer);
          leavingTimer = null;
        }

        prev.classList.remove('is-active');
        prev.classList.add('is-leaving');
        next.classList.remove('is-leaving');
        next.classList.add('is-active');

        leavingTimer = setTimeout(() => {
          prev.classList.remove('is-leaving');
          leavingTimer = null;
        }, 380);
      }, intervalMs);
    }
  }

  /* ==========================================================================
     УПРАВЛЕНИЕ СОСТОЯНИЕМ ТОРПЕДЫ И БЕГУЩЕЙ СТРОКОЙ
     ========================================================================== */
  function ensureTelemetryPanelVisible() {
    const panel = global.document.getElementById('live-telemetry-panel');
    if (!panel) return null;

    panel.classList.remove('is-hidden', 'is-fading-out');
    if (panel.hidden) {
      panel.hidden = false;
    }
    if (panel.hasAttribute('hidden')) {
      panel.removeAttribute('hidden');
    }
    if (panel.style.display === 'none') {
      panel.style.display = '';
    }
    return panel;
  }

  function updateTickerValues(valuesMap) {
    if (!valuesMap || typeof valuesMap !== 'object') return;

    Object.keys(valuesMap).forEach((key) => {
      const nextText = String(valuesMap[key] ?? '--');
      if (lastTickerValues[key] === nextText) return;
      lastTickerValues[key] = nextText;

      let nodes = tickerNodeCache.get(key);
      if (!nodes) {
        nodes = Array.from(global.document.querySelectorAll(`[data-ticker-key="${key}"]`));
        tickerNodeCache.set(key, nodes);
      }
      nodes.forEach((node) => {
        if (node.textContent !== nextText) {
          node.textContent = nextText;
        }
      });
    });
  }

  function applyHealthBadgeState(el, prefix, pctValue, emptyTitle, filledTitlePrefix) {
    if (!el) return;
    el.classList.remove('is-ok', 'is-warn', 'is-danger', 'is-detached');
    if (pctValue === null || pctValue === undefined) {
      el.textContent = `${prefix} --`;
      el.classList.add('is-detached');
      if (emptyTitle) el.title = emptyTitle;
      return;
    }
    let statusClass = 'is-ok';
    if (pctValue < 80) {
      statusClass = 'is-danger';
    } else if (pctValue < 95) {
      statusClass = 'is-warn';
    }
    el.textContent = `${prefix} ${pctValue}%`;
    el.classList.add(statusClass);
    if (filledTitlePrefix) {
      el.title = `${filledTitlePrefix}: ${pctValue}%`;
    }
  }

  function applyDashboardInputs(data) {
    const throttleEl = global.document.getElementById('lt-throttle-fill');
    const brakeEl = global.document.getElementById('lt-brake-fill');
    const steerEl = global.document.getElementById('lt-steer-knob');

    const normalizeUnit = (val) => {
      const num = parseFiniteTelemetryNumber(val);
      if (num === null) return 0;
      const scaled = num > 1.01 && num <= 100 ? num / 100 : num;
      return Math.max(0, Math.min(1, scaled));
    };

    if (!data || typeof data !== 'object') {
      if (throttleEl) throttleEl.style.transform = 'scaleX(0)';
      if (brakeEl) brakeEl.style.transform = 'scaleX(0)';
      if (steerEl) steerEl.style.transform = 'translate3d(0, 0, 0)';
      return;
    }

    if (throttleEl) {
      const thr = normalizeUnit(data.throttle ?? (data.input && data.input.throttle));
      throttleEl.style.transform = `scaleX(${thr.toFixed(3)})`;
    }
    if (brakeEl) {
      const brk = normalizeUnit(data.brake ?? (data.input && data.input.brake));
      brakeEl.style.transform = `scaleX(${brk.toFixed(3)})`;
    }
    if (steerEl) {
      const rawSteer = parseFiniteTelemetryNumber(data.steer ?? (data.input && data.input.steer));
      const clamped = rawSteer !== null ? Math.max(-1, Math.min(1, rawSteer)) : 0;
      // В SCS SDK положительный steer — поворот влево; смещаем маркер по треку [-56px..+56px]
      const offsetPx = Math.round(-clamped * 56);
      steerEl.style.transform = `translate3d(${offsetPx}px, 0, 0)`;
    }
  }

  function applyGameStatusBadge(data, isStandby, gameId, hasActiveJob) {
    const badgeEl = global.document.getElementById('game-badge');
    const pillEl = global.document.getElementById('game-status-pill');
    const textEl = global.document.getElementById('game-status-text');
    const offlineState = Boolean(
      isStandby || !data || data.connected === false || data.ok === false
    );

    if (badgeEl) {
      if (offlineState) {
        badgeEl.textContent = '--';
        badgeEl.classList.add('is-standby');
      } else {
        badgeEl.textContent = gameId || 'ETS2';
        badgeEl.classList.remove('is-standby');
      }
    }
    if (pillEl) {
      pillEl.classList.remove('is-standby', 'is-paused', 'is-transit', 'is-freeroam');
      if (offlineState) {
        pillEl.classList.add('is-standby');
      } else if (isTruthyTelemetryFlag(data && (data.paused ?? (data.srv && data.srv.paused)))) {
        pillEl.classList.add('is-paused');
      } else if (hasActiveJob) {
        pillEl.classList.add('is-transit');
      } else {
        pillEl.classList.add('is-freeroam');
      }
    }
    if (textEl) {
      if (offlineState) {
        textEl.textContent = t('statusStandby');
      } else if (isTruthyTelemetryFlag(data && (data.paused ?? (data.srv && data.srv.paused)))) {
        textEl.textContent = t('statusPaused');
      } else if (hasActiveJob) {
        textEl.textContent = t('statusInTransit');
      } else {
        textEl.textContent = t('statusFreeRoam');
      }
    }
  }

  function showLiveTelemetry() {
    const panel = ensureTelemetryPanelVisible();
    if (panel) {
      panel.classList.remove('is-offline');
    }
    const truckBoard = global.document.getElementById('truck-board');
    if (truckBoard) {
      truckBoard.classList.remove('is-offline');
    }
  }

  function showTelemetryStandby() {
    stickySpeedUnit = null;
    const panel = ensureTelemetryPanelVisible();
    if (panel) {
      panel.classList.add('is-offline');
    }
    const truckBoard = global.document.getElementById('truck-board');
    if (truckBoard) {
      truckBoard.classList.add('is-offline');
    }

    const speedEl = global.document.getElementById('lt-speed');
    const speedBlockEl = global.document.getElementById('lt-speed-block');
    const rpmTextEl = global.document.getElementById('lt-rpm-text');
    const rpmFillEl = global.document.getElementById('lt-rpm-fill');
    const limitEl = global.document.getElementById('lt-limit');
    const cruiseEl = global.document.getElementById('lt-cruise');
    const gearEl = global.document.getElementById('lt-gear');
    const fuelEl = global.document.getElementById('lt-fuel');
    const sensorFuelEl = global.document.getElementById('lt-sensor-fuel');
    const navEl = global.document.getElementById('lt-nav');
    const routeProgressEl = global.document.getElementById('lt-route-progress-fill');
    const cargoChipEl = global.document.getElementById('lt-cargo-chip');
    const cargoEl = global.document.getElementById('lt-cargo');

    const truckModelEl = global.document.getElementById('lt-truck-model');
    const truckPlateEl = global.document.getElementById('lt-truck-plate');
    const truckHealthEl = global.document.getElementById('lt-truck-health');
    const trailerHealthEl = global.document.getElementById('lt-trailer-health');
    const cargoHealthEl = global.document.getElementById('lt-cargo-health');
    const truckOdoEl = global.document.getElementById('lt-truck-odometer');
    const fuelAvgEl = global.document.getElementById('lt-sensor-fuel-avg');
    const tempsEl = global.document.getElementById('lt-sensor-temps');
    const airEl = global.document.getElementById('lt-sensor-air');
    const adblueEl = global.document.getElementById('lt-sensor-adblue');
    const batteryEl = global.document.getElementById('lt-sensor-battery');
    const rangeEl = global.document.getElementById('lt-sensor-range');

    if (speedEl) speedEl.textContent = '--';
    if (speedBlockEl) speedBlockEl.classList.remove('is-overspeed');
    if (rpmTextEl) rpmTextEl.textContent = '-- RPM';
    if (rpmFillEl) {
      rpmFillEl.style.transform = 'scaleX(0)';
      rpmFillEl.classList.remove('is-redline');
    }
    if (limitEl) {
      limitEl.textContent = '--';
      limitEl.classList.add('is-inactive');
    }
    if (cruiseEl) {
      cruiseEl.textContent = 'CC --';
      cruiseEl.classList.remove('is-active');
    }
    if (gearEl) gearEl.textContent = '--';
    if (fuelEl) fuelEl.textContent = '--';
    if (sensorFuelEl) sensorFuelEl.textContent = '--';
    if (navEl) navEl.textContent = '--';
    if (routeProgressEl) routeProgressEl.style.transform = 'scaleX(0)';
    if (cargoChipEl) {
      cargoChipEl.classList.remove('is-ok', 'is-warn', 'is-danger');
      cargoChipEl.classList.add('is-detached');
      cargoChipEl.title = t('noTelemetryTitle');
    }
    if (cargoEl) cargoEl.textContent = '--';

    applyDashboardInputs(null);
    applyDashboardIndicators(null);
    applyRealEtaDisplay(null);

    if (config.ets2 && config.ets2.telemetryApi && config.ets2.telemetryApi.enabled) {
      setRouteDisplay('--', '--', (config.ets2 && config.ets2.routeTag) || 'ETS2 // ATS');
    }

    if (truckModelEl) truckModelEl.textContent = 'TRUCK // STANDBY';
    if (truckPlateEl) {
      truckPlateEl.textContent = '';
      truckPlateEl.classList.add('is-empty');
    }
    applyHealthBadgeState(truckHealthEl, t('truckPrefix'), null, t('truckHealthTitle'));
    applyHealthBadgeState(trailerHealthEl, t('trailerPrefix'), null, t('trailerHealthTitle'));
    applyHealthBadgeState(cargoHealthEl, t('cargoPrefix'), null, t('cargoHealthTitle'));

    if (truckOdoEl) truckOdoEl.textContent = `-- ${t('km')}`;
    if (fuelAvgEl) fuelAvgEl.textContent = '--';
    if (tempsEl) tempsEl.textContent = '--';
    if (airEl) airEl.textContent = '--';
    if (adblueEl) adblueEl.textContent = '--';
    if (batteryEl) batteryEl.textContent = '--';
    if (rangeEl) rangeEl.textContent = '--';

    updateTickerValues({
      income: '--',
      companies: '--',
      jobType: '--',
      driven: '--',
      liters: '--',
      avg: '--',
      maxSpeed: '--'
    });
    applyGameStatusBadge(null, true, '--', false);
  }

  /* ==========================================================================
     ПАРСЕРЫ И КОНВЕРТЕРЫ ДАННЫХ TELEMETRY / R-TRUCKSIM
     ========================================================================== */
  function resolveRawGear(data) {
    if (!data || typeof data !== 'object') return 0;
    if (data.dgear !== undefined && data.dgear !== null && String(data.dgear).trim() !== '') {
      return data.dgear;
    }
    if (data.gear !== undefined && data.gear !== null && String(data.gear).trim() !== '') {
      return data.gear;
    }
    return 0;
  }

  function parseNumericGear(rawGear) {
    if (typeof rawGear === 'number' && Number.isFinite(rawGear)) return rawGear;
    const match = String(rawGear ?? '').match(/-?\d+/);
    return match ? Number(match[0]) : 0;
  }

  function formatGearLabel(rawGear) {
    if (typeof rawGear === 'string') {
      const trimmed = rawGear.trim().toUpperCase();
      if (trimmed && !/^-?\d+$/.test(trimmed)) {
        return trimmed;
      }
    }
    const num = Number(rawGear);
    if (!Number.isFinite(num) || num === 0) return 'N';
    if (num < 0) return `R${Math.abs(Math.trunc(num))}`;
    return `D${Math.trunc(num)}`;
  }

  function detectSpeedMultiplier(data, unitPref) {
    if (unitPref === 'ms') return 3.6;
    if (unitPref === 'kmh') return 1;

    if (stickySpeedUnit) {
      return stickySpeedUnit === 'ms' ? 3.6 : 1;
    }

    const limit = Number(data.speedLimit);
    const cruise = Number(data.cruise);
    const speed = Math.abs(Number(data.speed) || 0);
    const rpm = Number(data.rpm) || 0;
    const gearNum = Math.abs(parseNumericGear(resolveRawGear(data)));

    if (Number.isFinite(limit) && limit > 0) {
      if (limit < 29 || (limit <= 40 && !Number.isInteger(limit))) {
        stickySpeedUnit = 'ms';
        return 3.6;
      }
      if (limit >= 40 && Number.isInteger(limit)) {
        stickySpeedUnit = 'kmh';
        return 1;
      }
    }

    if (Number.isFinite(cruise) && cruise > 0 && cruise <= 35 && !Number.isInteger(cruise)) {
      stickySpeedUnit = 'ms';
      return 3.6;
    }

    if (rpm > 950 && gearNum >= 8 && speed > 0 && speed < 38) {
      stickySpeedUnit = 'ms';
      return 3.6;
    }

    if (speed > 45) {
      stickySpeedUnit = 'kmh';
      return 1;
    }

    return 1;
  }

  function parseFuelValue(rawFuel) {
    const val = typeof rawFuel === 'object' && rawFuel !== null
      ? Number(rawFuel.amount ?? rawFuel.current ?? rawFuel.value)
      : Number(rawFuel);
    return Number.isFinite(val) && val >= 0 ? val : null;
  }

  function formatFuelLitersOnly(rawFuel) {
    const fuelVal = parseFuelValue(rawFuel);
    if (fuelVal === null) return '--';
    return `${Math.round(fuelVal)} ${t('l')}`;
  }

  function formatFuelText(rawFuel, rawRange) {
    const fuelVal = parseFuelValue(rawFuel);
    const rangeVal = Number(rawRange);

    const hasFuel = fuelVal !== null;
    const hasRange = Number.isFinite(rangeVal) && rangeVal >= 0;

    if (hasFuel && hasRange) {
      return `${Math.round(fuelVal)} ${t('l')} · ${Math.round(rangeVal)} ${t('km')}`;
    }
    if (hasRange) {
      return `${Math.round(rangeVal)} ${t('km')}`;
    }
    if (hasFuel) {
      return `${Math.round(fuelVal)} ${t('l')}`;
    }
    return '--';
  }

  function resolveNavDistanceMeters(rawDist, apiCfg) {
    const dist = Number(rawDist);
    if (!Number.isFinite(dist) || dist <= 0) return null;
    const distUnit = (apiCfg && apiCfg.navDistUnit) || 'auto';
    const isMeters = distUnit === 'm' || (distUnit === 'auto' && dist > 2500);
    return isMeters ? dist : dist * 1000;
  }

  function formatNavText(rawDist, rawTime, apiCfg) {
    const meters = resolveNavDistanceMeters(rawDist, apiCfg);
    const time = Number(rawTime);
    const hasDist = meters !== null && meters > 0;
    const hasTime = Number.isFinite(time) && time > 0;

    if (!hasDist && !hasTime) return '--';

    let distText = '';
    if (hasDist) {
      if (meters >= 10000) {
        distText = `${formatIntWithSpaces(meters / 1000)} ${t('km')}`;
      } else if (meters >= 1000) {
        distText = `${(meters / 1000).toFixed(1)} ${t('km')}`;
      } else {
        distText = `${Math.round(meters)} ${t('m')}`;
      }
    }

    if (global.document.querySelector('.cockpit-dashboard')) {
      return distText || '--';
    }

    let timeText = '';
    if (hasTime) {
      const timeUnit = (apiCfg && apiCfg.navTimeUnit) || 'auto';
      const isSeconds = timeUnit === 's' || (timeUnit === 'auto' && time > 180);
      const totalMins = Math.max(1, Math.round(isSeconds ? time / 60 : time));
      const hrs = Math.floor(totalMins / 60);
      const mins = totalMins % 60;
      timeText = hrs > 0
        ? `${hrs}${t('hShort')} ${String(mins).padStart(2, '0')}${t('mShort')}`
        : `${mins}${t('mShort')}`;
    }

    if (distText && timeText) return `${distText} · ${timeText}`;
    return distText || timeText;
  }

  function isExplicitlyFalseTelemetryFlag(val) {
    if (val === false || val === 0) return true;
    if (typeof val === 'string') {
      const normalized = val.trim().toLowerCase();
      return normalized === 'false' || normalized === '0' ||
        normalized === 'no' || normalized === 'off';
    }
    return false;
  }

  function isTruthyTelemetryFlag(val) {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'number') return Number.isFinite(val) && val > 0;
    if (typeof val === 'string') {
      const normalized = val.trim().toLowerCase();
      if (!normalized || normalized === 'false' || normalized === '0' ||
          normalized === 'no' || normalized === 'off' || normalized === 'null') {
        return false;
      }
      if (normalized === 'true' || normalized === 'yes' || normalized === 'on') {
        return true;
      }
      const num = Number(normalized);
      return Number.isFinite(num) && num > 0;
    }
    return false;
  }

  function isTrailerFlagActive(val) {
    if (val && typeof val === 'object') {
      if (val.connected !== undefined) return isTruthyTelemetryFlag(val.connected);
      if (val.attached !== undefined) return isTruthyTelemetryFlag(val.attached);
      return false;
    }
    return isTruthyTelemetryFlag(val);
  }

  function isTrailerConnected(data) {
    if (!data || typeof data !== 'object') return false;
    return Boolean(
      isTrailerFlagActive(data.trailer) ||
      isTrailerFlagActive(data.trailerOld) ||
      isTrailerFlagActive(data.trailerConnected) ||
      isTrailerFlagActive(data.hasTrailer) ||
      (Array.isArray(data.trailers) && isTrailerFlagActive(data.trailers[0]))
    );
  }

  function isContainerJobInactive(container) {
    if (!container || typeof container !== 'object') return false;
    return (
      isExplicitlyFalseTelemetryFlag(container.active) ||
      isExplicitlyFalseTelemetryFlag(container.onJob) ||
      isExplicitlyFalseTelemetryFlag(container.hasJob) ||
      isExplicitlyFalseTelemetryFlag(container.jobActive)
    );
  }

  function hasExplicitContainerActiveFlag(container) {
    if (!container || typeof container !== 'object') return false;
    return (
      isTruthyTelemetryFlag(container.active) ||
      isTruthyTelemetryFlag(container.onJob) ||
      isTruthyTelemetryFlag(container.hasJob) ||
      isTruthyTelemetryFlag(container.jobActive)
    );
  }

  function pickValidCargoText(candidates) {
    for (let i = 0; i < candidates.length; i += 1) {
      if (typeof candidates[i] !== 'string') continue;
      const clean = candidates[i].trim();
      const lower = clean.toLowerCase();
      if (clean && lower !== 'true' && lower !== 'false' && lower !== '0' &&
          lower !== 'null' && lower !== 'undefined' && lower !== 'none' &&
          lower !== 'n/a' && clean !== '-' && clean !== '--') {
        return clean;
      }
    }
    return '';
  }

  function extractCargoFromContainer(container) {
    if (!container) return '';
    if (typeof container === 'string') {
      return pickValidCargoText([container]);
    }
    if (typeof container !== 'object' || isContainerJobInactive(container)) {
      return '';
    }

    const cargoObj = container.cargo && typeof container.cargo === 'object' && !isContainerJobInactive(container.cargo)
      ? container.cargo
      : null;
    const jobObj = container.job && typeof container.job === 'object' && !isContainerJobInactive(container.job)
      ? container.job
      : null;
    const jobCargoObj = jobObj && jobObj.cargo && typeof jobObj.cargo === 'object' && !isContainerJobInactive(jobObj.cargo)
      ? jobObj.cargo
      : null;

    return pickValidCargoText([
      container.cargoName,
      typeof container.cargo === 'string' ? container.cargo : null,
      cargoObj ? (cargoObj.cargoName ?? cargoObj.name ?? cargoObj.cargo) : null,
      jobObj ? jobObj.cargoName : null,
      jobObj && typeof jobObj.cargo === 'string' ? jobObj.cargo : null,
      jobCargoObj ? (jobCargoObj.cargoName ?? jobCargoObj.name ?? jobCargoObj.cargo) : null,
      container.jobName
    ]);
  }

  function hasMeaningfulCargoOrJob(val) {
    if (val === undefined || val === null || val === false || val === '') return false;
    if (typeof val === 'number') return Number.isFinite(val) && val > 0;
    if (typeof val === 'string') {
      return Boolean(pickValidCargoText([val]));
    }
    if (Array.isArray(val)) return val.some(hasMeaningfulCargoOrJob);
    if (typeof val === 'object') {
      if (isContainerJobInactive(val)) return false;
      return Object.keys(val).some((key) => {
        if (key === 'damage' || key === 'cargoDamage') return false;
        return hasMeaningfulCargoOrJob(val[key]);
      });
    }
    return false;
  }

  function extractCargoName(data) {
    if (!data || typeof data !== 'object') return '';
    if (isContainerJobInactive(data)) return '';

    const tripCargo = extractCargoFromContainer(data.trip);
    if (tripCargo) return tripCargo;

    const tripExplicitlyInactive = Boolean(
      data.trip && typeof data.trip === 'object' && isContainerJobInactive(data.trip)
    );
    const allowCfgCargo = !tripExplicitlyInactive || hasExplicitContainerActiveFlag(data.cfg);
    if (allowCfgCargo) {
      const cfgCargo = extractCargoFromContainer(data.cfg);
      if (cfgCargo) return cfgCargo;
    }

    const telCargo = extractCargoFromContainer(data);
    if (telCargo) return telCargo;

    if (data.tel && typeof data.tel === 'object') {
      return extractCargoFromContainer(data.tel);
    }
    return '';
  }

  function resolveTrailerAndCargoState(data, jobState) {
    const cargoName = extractCargoName(data);
    if (cargoName) {
      const upperCargo = cargoName.toUpperCase();
      return {
        connected: true,
        hasCargo: true,
        text: upperCargo,
        title: `${t('cargoPrefix')} ${upperCargo}`,
        statusClass: 'is-ok'
      };
    }

    const isCoachOrPassenger = Boolean(
      (jobState && (jobState.isCoach || (jobState.hasJob && !isTrailerConnected(data)))) ||
      (data && data.cfg && data.cfg.job && (data.cfg.job.busJob || data.cfg.job.market === 'bus_job')) ||
      (data && (data.jobMarket === 'bus_job' || data.isBusJob))
    );

    if (isCoachOrPassenger) {
      return {
        connected: true,
        hasCargo: true,
        text: t('coachPassengerRoute'),
        title: t('coachPassengerTitle'),
        statusClass: 'is-ok'
      };
    }

    if (isTrailerConnected(data)) {
      return {
        connected: true,
        hasCargo: false,
        text: t('trailerAttachedEmpty'),
        title: t('trailerEmptyTitle'),
        statusClass: 'is-warn'
      };
    }

    return {
      connected: false,
      hasCargo: false,
      text: t('noTrailer'),
      title: t('noTrailerTitle'),
      statusClass: 'is-detached'
    };
  }

  function parseFiniteTelemetryNumber(val) {
    if (val === undefined || val === null || val === '') return null;
    const num = Number(val);
    return Number.isFinite(num) ? num : null;
  }

  function formatIntWithSpaces(num) {
    const rounded = Math.round(num);
    return String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function sanitizeTruckText(val) {
    if (typeof val !== 'string') return '';
    const clean = val.trim();
    const lower = clean.toLowerCase();
    if (!clean || lower === 'null' || lower === 'undefined' ||
        lower === 'none' || lower === 'n/a' || clean === '-' || clean === '--') {
      return '';
    }
    return clean;
  }

  function resolveTruckIdentity(data) {
    const cfg = data && data.cfg && typeof data.cfg === 'object' ? data.cfg : null;
    const cfgTruck = cfg && cfg.truck && typeof cfg.truck === 'object' ? cfg.truck : null;
    const dataTruck = data && data.truck && typeof data.truck === 'object' ? data.truck : null;

    const brand = sanitizeTruckText(
      data.truckBrand ??
      (dataTruck && dataTruck.brand) ??
      (cfgTruck && cfgTruck.brand) ??
      (cfg && cfg['truck.brand']) ??
      (cfg && cfg.truckBrand)
    );
    const name = sanitizeTruckText(
      data.truckName ??
      (dataTruck && dataTruck.name) ??
      (cfgTruck && cfgTruck.name) ??
      (cfg && cfg['truck.name']) ??
      (cfg && cfg.truckName)
    );
    const plate = sanitizeTruckText(
      data.licensePlate ??
      (dataTruck && dataTruck.license && dataTruck.license.plate) ??
      (dataTruck && dataTruck.licensePlate) ??
      (cfgTruck && cfgTruck.license && cfgTruck.license.plate) ??
      (cfgTruck && cfgTruck.licensePlate) ??
      (cfg && cfg['truck.license.plate']) ??
      (cfg && cfg.licensePlate)
    );

    let modelText = 'TRUCK // STANDBY';
    if (brand && name) {
      modelText = name.toLowerCase().startsWith(brand.toLowerCase())
        ? name.toUpperCase()
        : `${brand} ${name}`.toUpperCase();
    } else if (brand || name) {
      modelText = (brand || name).toUpperCase();
    }

    return {
      brand,
      name,
      modelText,
      plateText: plate ? plate.toUpperCase() : ''
    };
  }

  function resolveGameId(data, brandText) {
    const rawGame = sanitizeTruckText(
      (data && (data.game ?? (data.srv && data.srv.game) ?? (data.cfg && (data.cfg.game ?? data.cfg['game.id'])))) || ''
    ).toLowerCase();

    if (rawGame === 'ats' || rawGame.includes('american')) return 'ATS';
    if (rawGame === 'ets2' || rawGame.includes('euro')) return 'ETS2';

    const probe = String(brandText || '').toLowerCase();
    if (probe && ATS_BRANDS.some((b) => probe.includes(b))) {
      return 'ATS';
    }
    return 'ETS2';
  }

  function formatTruckFuelAvg(rawFuelAvg, speedKmh) {
    const val = parseFiniteTelemetryNumber(rawFuelAvg);
    if (val === null || val <= 0 || speedKmh <= 0) return '—';
    return `${val.toFixed(1)} ${t('l100Short')}`;
  }

  function formatOilWaterTemps(rawOil, rawWater) {
    const oil = parseFiniteTelemetryNumber(rawOil);
    const water = parseFiniteTelemetryNumber(rawWater);
    if (oil === null && water === null) return '--';
    const oilText = oil !== null ? `${Math.round(oil)}°` : '--';
    const waterText = water !== null ? `${Math.round(water)}°` : '--';
    return `${oilText} / ${waterText}`;
  }

  function formatAirPressure(rawAir) {
    const air = parseFiniteTelemetryNumber(rawAir);
    if (air === null || air < 0) return '--';
    const barVal = air > 20 ? air * 0.0689476 : air;
    return `${barVal.toFixed(1)} bar`;
  }

  function formatAdblueLiters(rawAdblue) {
    const val = parseFiniteTelemetryNumber(rawAdblue);
    if (val === null || val < 0) return '--';
    return `${Math.round(val)} ${t('l')}`;
  }

  function formatBatteryVoltage(rawBattery) {
    const val = parseFiniteTelemetryNumber(rawBattery);
    if (val === null || val < 0) return '--';
    return `${val.toFixed(1)} V`;
  }

  function formatFuelRangeKm(rawRange) {
    const val = parseFiniteTelemetryNumber(rawRange);
    if (val === null || val < 0) return '--';
    return `${formatIntWithSpaces(val)} ${t('km')}`;
  }

  function resolveActiveJobContainers(data) {
    if (!data || typeof data !== 'object' || isContainerJobInactive(data)) return [];
    const containers = [];
    const tripExplicitlyInactive = Boolean(
      data.trip && typeof data.trip === 'object' && isContainerJobInactive(data.trip)
    );
    if (data.trip && typeof data.trip === 'object' && !tripExplicitlyInactive) {
      containers.push(data.trip);
    }
    const allowCfg = !tripExplicitlyInactive || hasExplicitContainerActiveFlag(data.cfg);
    if (allowCfg && data.cfg && typeof data.cfg === 'object' && !isContainerJobInactive(data.cfg)) {
      containers.push(data.cfg);
    }
    if (!tripExplicitlyInactive) {
      containers.push(data);
    }
    return containers;
  }

  function extractEndpointFieldFromContainer(container, kind, propName) {
    if (!container || typeof container !== 'object' || isContainerJobInactive(container)) {
      return '';
    }
    const capProp = propName.charAt(0).toUpperCase() + propName.slice(1);
    const stopKind = kind === 'source' ? 'source_stop' : 'destination_stop';
    const stopKindCamel = kind === 'source' ? 'sourceStop' : 'destinationStop';

    const candidates = [
      container[kind],
      container[stopKind],
      container[stopKindCamel],
      container.bus && container.bus[stopKindCamel],
      container.bus && container.bus[kind],
      container.bus_job && (container.bus_job[stopKind] || container.bus_job[stopKindCamel] || container.bus_job[kind])
    ];

    for (let i = 0; i < candidates.length; i += 1) {
      const node = candidates[i];
      if (node && typeof node === 'object') {
        const val = node[propName] ?? (propName === 'city' ? (node.name || node.city_name) : (node.company || node.station));
        const picked = pickValidCargoText([val]);
        if (picked) return picked;
      } else if (typeof node === 'string' && propName === 'city') {
        const picked = pickValidCargoText([node]);
        if (picked) return picked;
      }
    }

    const flatPicked = pickValidCargoText([
      container[`${kind}.${propName}`],
      container[`${kind}${capProp}`],
      container[`${stopKind}.${propName}`],
      container[`${stopKindCamel}${capProp}`],
      container[`${stopKindCamel}.${propName}`],
      container[`${stopKind}_${propName}`]
    ]);
    if (flatPicked) return flatPicked;

    const jobObj = container.job && typeof container.job === 'object' && !isContainerJobInactive(container.job)
      ? container.job
      : null;
    return jobObj ? extractEndpointFieldFromContainer(jobObj, kind, propName) : '';
  }

  function extractJobStringFromContainer(container, flatKeys, nestedObjKey, nestedPropKey) {
    if (!container || typeof container !== 'object' || isContainerJobInactive(container)) {
      return '';
    }
    for (let i = 0; i < flatKeys.length; i += 1) {
      const candidate = pickValidCargoText([container[flatKeys[i]]]);
      if (candidate) return candidate;
    }
    const nestedObj = container[nestedObjKey];
    if (nestedObj && typeof nestedObj === 'object' && !isContainerJobInactive(nestedObj)) {
      const nestedCandidate = pickValidCargoText([nestedObj[nestedPropKey]]);
      if (nestedCandidate) return nestedCandidate;
    }
    const jobObj = container.job;
    if (jobObj && typeof jobObj === 'object' && !isContainerJobInactive(jobObj)) {
      return extractJobStringFromContainer(jobObj, flatKeys, nestedObjKey, nestedPropKey);
    }
    return '';
  }

  function extractPositiveJobMetric(container, flatKeys, nestedObjKey, nestedPropKey) {
    if (!container || typeof container !== 'object' || isContainerJobInactive(container)) {
      return null;
    }
    for (let i = 0; i < flatKeys.length; i += 1) {
      const val = parseFiniteTelemetryNumber(container[flatKeys[i]]);
      if (val !== null && val > 0) return val;
    }
    const nestedObj = container[nestedObjKey];
    if (nestedObj && typeof nestedObj === 'object' && !isContainerJobInactive(nestedObj)) {
      const nestedVal = parseFiniteTelemetryNumber(nestedObj[nestedPropKey]);
      if (nestedVal !== null && nestedVal > 0) return nestedVal;
    }
    const jobObj = container.job;
    if (jobObj && typeof jobObj === 'object' && !isContainerJobInactive(jobObj)) {
      return extractPositiveJobMetric(jobObj, flatKeys, nestedObjKey, nestedPropKey);
    }
    return null;
  }

  function formatCargoMassTons(massKg) {
    if (massKg === null || !Number.isFinite(massKg) || massKg <= 0) return '';
    const roundedTons = Math.round((massKg / 1000) * 10) / 10;
    if (roundedTons <= 0) return '';
    const tonsStr = Number.isInteger(roundedTons) ? String(roundedTons) : roundedTons.toFixed(1);
    return `${tonsStr} ${t('t')}`;
  }

  function translateJobMarket(rawMarket) {
    const clean = sanitizeTruckText(rawMarket);
    if (!clean) return '';
    const normalizedKey = clean.toLowerCase().replace(/[\s-]+/g, '_');
    const dict = (I18N[lang] && I18N[lang].jobMarkets) || I18N.ru.jobMarkets;
    if (dict[normalizedKey]) return dict[normalizedKey];
    return clean.replace(/_/g, ' ').toUpperCase();
  }

  function resolveJobAndRouteState(data, gameId, navInputs) {
    const defaultTag = (config.ets2 && config.ets2.routeTag) || 'ETS2 // ATS';
    if (!data || typeof data !== 'object') {
      return {
        hasJob: false,
        isCoach: false,
        isGpsRoute: false,
        text: '--',
        meta: '--',
        tag: defaultTag,
        plannedKm: null,
        incomeText: '--',
        companiesText: '--',
        jobTypeText: '--'
      };
    }

    const rawGame = sanitizeTruckText(data.game ?? (data.cfg && data.cfg.game));
    const tag = rawGame ? rawGame.toUpperCase() : (gameId || defaultTag);

    const containers = resolveActiveJobContainers(data);
    let srcCity = '';
    let dstCity = '';
    let srcCompany = '';
    let dstCompany = '';
    let massKg = null;
    let plannedKm = null;
    let income = null;
    let jobMarket = '';
    let isBusJobFlag = false;

    containers.forEach((c) => {
      if (!srcCity) srcCity = extractEndpointFieldFromContainer(c, 'source', 'city');
      if (!dstCity) dstCity = extractEndpointFieldFromContainer(c, 'destination', 'city');
      if (!srcCompany) srcCompany = extractEndpointFieldFromContainer(c, 'source', 'company');
      if (!dstCompany) dstCompany = extractEndpointFieldFromContainer(c, 'destination', 'company');
      if (massKg === null) {
        massKg = extractPositiveJobMetric(c, ['cargo.mass', 'cargoMassKg', 'cargoMass', 'mass'], 'cargo', 'mass');
      }
      if (plannedKm === null) {
        plannedKm = extractPositiveJobMetric(c, ['planned_distance.km', 'plannedDistanceKm', 'plannedDistance'], 'planned_distance', 'km');
      }
      if (income === null) {
        income = extractPositiveJobMetric(c, ['income', 'revenue', 'job.income', 'job.revenue'], 'job', 'income');
      }
      if (!jobMarket) {
        jobMarket = extractJobStringFromContainer(c, ['job.market', 'jobMarket', 'market'], 'job', 'market');
      }
      if (!isBusJobFlag) {
        if (c.job && (c.job.busJob || c.job.isBusJob)) isBusJobFlag = true;
        if (c.busJob || c.isBusJob) isBusJobFlag = true;
      }
    });

    const truckIdProbe = String((data.cfg && data.cfg.truck && data.cfg.truck.id) || (data.truck && data.truck.id) || '').toLowerCase();
    const truckNameProbe = String((data.cfg && data.cfg.truck && data.cfg.truck.name) || (data.truck && data.truck.name) || data.truckName || '').toLowerCase();
    const isCoachVehicle = truckIdProbe.includes('touring') || truckIdProbe.includes('coach') || truckIdProbe.includes('bus') ||
                          truckNameProbe.includes('touring') || truckNameProbe.includes('coach') || truckNameProbe.includes('bus');
    if (isCoachVehicle) {
      isBusJobFlag = true;
    }

    const cargoName = extractCargoName(data);

    // Сценарий 1: Рейс с заданным пунктом назначения/отправления (груз или автобусный маршрут)
    const hasJobFromEndpoints = Boolean(
      cargoName ||
      (srcCity && dstCity) ||
      dstCity ||
      srcCity ||
      (income !== null && income > 0) ||
      (plannedKm !== null && plannedKm > 0)
    );

    const isCoach = Boolean(
      hasJobFromEndpoints &&
      (!cargoName || massKg === 0 || isBusJobFlag || jobMarket === 'bus_job' || jobMarket === 'coach')
    );

    const apiCfg = (config.ets2 && config.ets2.telemetryApi) || {};
    const effectiveNavInputs = navInputs || resolveNavInputs(data);
    const navMeters = resolveNavDistanceMeters(effectiveNavInputs.navDist, apiCfg);

    // Сценарий 2: Маршрут GPS между промежуточными остановками или свободная навигация по GPS
    const isGpsRoute = !hasJobFromEndpoints && navMeters !== null && navMeters > 50;

    const hasJob = hasJobFromEndpoints || isGpsRoute;

    const massText = (!isCoach && massKg !== null) ? formatCargoMassTons(massKg) : '';
    const suffix = massText ? ` • ${massText}` : '';
    const metaText = plannedKm !== null ? `${formatIntWithSpaces(plannedKm)} ${t('km')}` : t('enRouteMeta');

    let routeText = t('freeRoam');
    let routeMeta = t('liveMeta');

    if (hasJobFromEndpoints) {
      if (srcCity && dstCity) {
        routeText = `${srcCity.toUpperCase()} → ${dstCity.toUpperCase()}${suffix}`;
        routeMeta = metaText;
      } else if (dstCity && !srcCity) {
        routeText = `→ ${dstCity.toUpperCase()}${suffix}`;
        routeMeta = metaText;
      } else if (srcCity && !dstCity) {
        routeText = `${srcCity.toUpperCase()} →${suffix}`;
        routeMeta = metaText;
      } else if (cargoName) {
        routeText = `${cargoName.toUpperCase()}${suffix}`;
        routeMeta = metaText;
      }
    } else if (isGpsRoute) {
      routeText = t('gpsRouteNextStop');
      routeMeta = formatNavText(effectiveNavInputs.navDist, effectiveNavInputs.navTime, apiCfg);
    }

    const currency = gameId === 'ATS' ? '$' : '€';
    const incomeText = hasJobFromEndpoints && income !== null
      ? `${currency} ${formatIntWithSpaces(income)}`
      : (hasJobFromEndpoints ? '--' : (isGpsRoute ? '--' : t('freeRoam')));

    let companiesText = hasJob ? '--' : t('freeRoam');
    if (hasJobFromEndpoints && (srcCompany || dstCompany)) {
      if (srcCompany && dstCompany) {
        companiesText = `${srcCompany.toUpperCase()} → ${dstCompany.toUpperCase()}`;
      } else {
        companiesText = (srcCompany || dstCompany).toUpperCase();
      }
    } else if (isCoach) {
      const busSat = parseFiniteTelemetryNumber(
        data.busSat ?? (data.tel && data.tel.busSat) ?? (data.trip && data.trip.busSat) ?? (data.cfg && data.cfg.bus && data.cfg.bus.satisfaction)
      );
      if (busSat !== null && busSat > 0) {
        const satPct = Math.round(busSat > 1 ? busSat : busSat * 100);
        const satLabel = lang === 'en' ? 'SATISFACTION' : 'КОМФОРТ';
        companiesText = `${satLabel}: ${satPct}%`;
      }
    }

    const translatedMarket = translateJobMarket(jobMarket);
    let jobTypeText = t('freeRoam');
    if (hasJobFromEndpoints) {
      jobTypeText = translatedMarket || (isCoach ? t('coachPassengerRoute') : '--');
    } else if (isGpsRoute) {
      jobTypeText = t('gpsRouteNextStop');
    }

    return {
      hasJob,
      isCoach: isCoach || isCoachVehicle || (isGpsRoute && !isTrailerConnected(data)),
      isCoachVehicle,
      isGpsRoute,
      text: routeText,
      meta: routeMeta,
      tag,
      plannedKm,
      incomeText,
      companiesText,
      jobTypeText
    };
  }

  const TRUCK_WEAR_KEYS = ['wEngine', 'wTrans', 'wChassis', 'wWheels', 'wCabin'];

  function normalizeWearToHealthPct(rawWear) {
    const raw = parseFiniteTelemetryNumber(rawWear);
    if (raw === null || raw < 0) return null;
    const ratio = raw > 1 ? Math.min(1, raw / 100) : Math.min(1, raw);
    return Math.max(0, Math.min(100, Math.round((1 - ratio) * 100)));
  }

  function resolveTruckHealthPct(data) {
    if (!data || typeof data !== 'object') return null;
    let maxWear = null;
    TRUCK_WEAR_KEYS.forEach((key) => {
      const raw = parseFiniteTelemetryNumber(data[key]);
      if (raw === null || raw < 0) return;
      const ratio = raw > 1 ? Math.min(1, raw / 100) : Math.min(1, raw);
      if (maxWear === null || ratio > maxWear) {
        maxWear = ratio;
      }
    });
    if (maxWear === null) return null;
    return Math.max(0, Math.min(100, Math.round((1 - maxWear) * 100)));
  }

  function resolveTrailerHealthPct(data, trailerConnected) {
    if (!data || typeof data !== 'object' || !trailerConnected) return null;
    const rawTrailerWear = data.wTrailer ??
      data.trailerWear ??
      (data.trailer && typeof data.trailer === 'object' && data.trailer.wear
        ? (data.trailer.wear.chassis ?? data.trailer.wear.body)
        : undefined);
    return normalizeWearToHealthPct(rawTrailerWear);
  }

  function resolveCargoHealthPct(data, hasActiveJobOrCargo) {
    if (!data || typeof data !== 'object' || !hasActiveJobOrCargo) return null;
    const rawCargoDmg = parseFiniteTelemetryNumber(data.cargoDmg);
    const rawJobDmg = parseFiniteTelemetryNumber(data.jobDmg);
    const candidates = [rawCargoDmg, rawJobDmg].filter((v) => v !== null && v >= 0);
    if (candidates.length === 0) return null;
    const maxDmg = Math.max(...candidates);
    return normalizeWearToHealthPct(maxDmg);
  }

  function applyDashboardIndicators(data) {
    const active = Boolean(data && typeof data === 'object');
    const blinkL = active && isTruthyTelemetryFlag(data.blinkL);
    const blinkR = active && isTruthyTelemetryFlag(data.blinkR);
    const hazardOn = active && isTruthyTelemetryFlag(data.hazard);

    if (!active || !hazardOn) {
      lastHazardLiveBlinkAt = 0;
    } else if (blinkL || blinkR) {
      lastHazardLiveBlinkAt = Date.now();
    }

    // Если hazard=true, но реальные каналы blinkL/blinkR не мигают (например, в демо-режиме),
    // включаем CSS-мигание .is-blinking, иначе стрелки синхронно повторяют импульсы движка.
    const fallbackHazardBlink =
      hazardOn &&
      !blinkL &&
      !blinkR &&
      (lastHazardLiveBlinkAt === 0 || (Date.now() - lastHazardLiveBlinkAt) > 1000);

    const retarderNum = active ? parseFiniteTelemetryNumber(data.retarder) : null;
    const retarderOn = active && (
      (retarderNum !== null ? retarderNum > 0 : isTruthyTelemetryFlag(data.retarder)) ||
      isTruthyTelemetryFlag(data.motorBrake)
    );

    const ccRawInd = active
      ? (data.cruise ?? data.cc ?? data.cruiseControl ?? (data.tel && (data.tel.cruise ?? data.tel.cc ?? data.tel.cruiseControl)) ?? 0)
      : 0;
    const ccSpeedInd = typeof ccRawInd === 'object' && ccRawInd !== null
      ? Number(ccRawInd.speed ?? ccRawInd.value ?? 0)
      : Number(ccRawInd);
    const isCcIndActive = active && Boolean(
      isTruthyTelemetryFlag(data.cruiseOn) ||
      (data.tel && isTruthyTelemetryFlag(data.tel.cruiseOn)) ||
      isTruthyTelemetryFlag(data.cruise) ||
      (Number.isFinite(ccSpeedInd) && ccSpeedInd > 0)
    );

    const states = [
      ['lt-ind-blink-l', blinkL],
      ['lt-ind-blink-r', blinkR],
      ['lt-ind-park', active && isTruthyTelemetryFlag(data.parkLight)],
      ['lt-ind-low', active && isTruthyTelemetryFlag(data.lowBeam)],
      ['lt-ind-high', active && isTruthyTelemetryFlag(data.highBeam)],
      ['lt-ind-beacon', active && isTruthyTelemetryFlag(data.beacon)],
      ['lt-ind-cruise', isCcIndActive],
      ['lt-ind-wipers', active && isTruthyTelemetryFlag(data.wipers ?? data.wipersActive)],
      ['lt-ind-park-brake', active && isTruthyTelemetryFlag(data.parkBrake)],
      ['lt-ind-retarder', retarderOn],
      ['lt-ind-difflock', active && isTruthyTelemetryFlag(data.diffLock ?? data.differentialLock)],
      ['lt-ind-lift-axle', active && (isTruthyTelemetryFlag(data.liftAxle) || isTruthyTelemetryFlag(data.trailerLiftAxle))],
      ['lt-ind-fuel-warn', active && isTruthyTelemetryFlag(data.fuelWarn)],
      ['lt-ind-air-warn', active && isTruthyTelemetryFlag(data.airWarn)],
      ['lt-ind-oil-warn', active && isTruthyTelemetryFlag(data.oilWarn ?? data.oilPressureWarning)],
      ['lt-ind-water-warn', active && isTruthyTelemetryFlag(data.waterWarn ?? data.waterTempWarning)],
      ['lt-ind-battery-warn', active && isTruthyTelemetryFlag(data.batteryWarn ?? data.batteryVoltageWarning)]
    ];

    states.forEach(([id, isOn]) => {
      const el = global.document.getElementById(id);
      if (el) {
        el.classList.toggle('is-active', Boolean(isOn));
        if (id === 'lt-ind-blink-l' || id === 'lt-ind-blink-r') {
          el.classList.toggle('is-blinking', fallbackHazardBlink);
        }
      }
    });
  }

  function resolveNavInputs(data) {
    if (!data || typeof data !== 'object') {
      return { navDist: undefined, navTime: undefined, scale: 0 };
    }
    const trip = data.trip && typeof data.trip === 'object' ? data.trip : null;
    const cfg = data.cfg && typeof data.cfg === 'object' ? data.cfg : null;
    const tel = data.tel && typeof data.tel === 'object' ? data.tel : null;
    const navDist = data.navDist !== undefined ? data.navDist : (trip && trip.navDist !== undefined ? trip.navDist : (tel && tel.navDist !== undefined ? tel.navDist : undefined));
    const navTime = data.navTime !== undefined ? data.navTime : (trip && trip.navTime !== undefined ? trip.navTime : (tel && tel.navTime !== undefined ? tel.navTime : undefined));
    const rawScale = data.scale ?? (cfg && (cfg.scale ?? cfg['game.scale'])) ?? (trip && trip.scale) ?? (tel && tel.scale);
    const parsedScale = parseFiniteTelemetryNumber(rawScale);
    return {
      navDist,
      navTime,
      scale: parsedScale !== null ? parsedScale : 0
    };
  }

  function resolveRealEtaState(navInputs, apiCfg) {
    if (!navInputs || typeof navInputs !== 'object') {
      return { active: false, text: '--', title: t('noRouteTitle') };
    }
    const distNum = parseFiniteTelemetryNumber(navInputs.navDist);
    const timeNum = parseFiniteTelemetryNumber(navInputs.navTime);

    if (distNum === null || distNum <= 0 || timeNum === null || timeNum <= 0) {
      return { active: false, text: '--', title: t('noRouteTitle') };
    }

    const navTimeSeconds = (apiCfg && apiCfg.navTimeUnit === 'min') ? timeNum * 60 : timeNum;
    const scale = Number(navInputs.scale) || 0;
    const effectiveScale = (scale && scale > 5) ? scale : 19;
    const realSeconds = navTimeSeconds / effectiveScale;

    if (!Number.isFinite(realSeconds) || realSeconds <= 0) {
      return { active: false, text: '--', title: t('noRouteTitle') };
    }

    let text;
    if (realSeconds < 60) {
      text = `< 1 ${t('min')}`;
    } else {
      const totalMins = Math.max(1, Math.round(realSeconds / 60));
      const hrs = Math.floor(totalMins / 60);
      const mins = totalMins % 60;
      text = hrs > 0
        ? `~${hrs} ${t('h')} ${String(mins).padStart(2, '0')} ${t('min')}`
        : `~${mins} ${t('min')}`;
    }

    return {
      active: true,
      text,
      title: `${t('realEtaLabel')} (~${Math.round(realSeconds)}s @ 1:${effectiveScale})`
    };
  }

  function applyRealEtaDisplay(etaState) {
    const panelEl = global.document.getElementById('real-eta-panel');
    const valEl = global.document.getElementById('real-eta-value');
    const isActive = Boolean(etaState && etaState.active);
    if (panelEl) {
      panelEl.classList.remove('is-hidden', 'is-fading-out');
      panelEl.classList.toggle('is-offline', !isActive);
      if (etaState && etaState.title) {
        panelEl.title = etaState.title;
      }
    }
    if (valEl) {
      valEl.textContent = (etaState && etaState.text) || '--';
    }
  }

  function resolveTripStats(data, speedMult) {
    const trip = data && data.trip && typeof data.trip === 'object' ? data.trip : null;

    const rawDriven = parseFiniteTelemetryNumber(
      data.tripDriven ?? (trip && (trip.driven ?? trip.distance)) ?? data.driven
    );
    const rawLiters = parseFiniteTelemetryNumber(
      data.tripLiters ?? (trip && (trip.liters ?? trip.fuelUsed)) ?? data.liters
    );
    const rawAvg = parseFiniteTelemetryNumber(
      data.tripAvg ?? (trip && (trip.avg ?? trip.fuelAvg)) ?? data.avg
    );
    const rawMaxSpeed = parseFiniteTelemetryNumber(
      data.tripMaxSpeed ?? (trip && trip.maxSpeed) ?? data.maxSpeed
    );

    const drivenText = rawDriven !== null && rawDriven >= 0
      ? `${formatIntWithSpaces(rawDriven)} ${t('km')}`
      : '--';
    const litersText = rawLiters !== null && rawLiters >= 0
      ? `${formatIntWithSpaces(rawLiters)} ${t('l')}`
      : '--';
    const avgText = rawAvg !== null && rawAvg > 0
      ? `${rawAvg.toFixed(1)} ${t('l100')}`
      : '—';

    let maxSpeedText = '--';
    if (rawMaxSpeed !== null && rawMaxSpeed >= 0) {
      const kmh = rawMaxSpeed > 0 && speedMult === 3.6 && rawMaxSpeed < 50
        ? Math.round(rawMaxSpeed * speedMult)
        : Math.round(rawMaxSpeed);
      maxSpeedText = `${kmh} ${t('kmh')}`;
    }

    return { drivenText, litersText, avgText, maxSpeedText };
  }

  function renderTelemetryPacket(rawData) {
    const data = unwrapTelemetryPayload(rawData);
    if (!data || typeof data !== 'object') return;
    if (data.ok === false || data.connected === false || data._offline === true) {
      showTelemetryStandby();
      return;
    }

    const apiCfg = (config.ets2 && config.ets2.telemetryApi) || {};
    const speedMult = detectSpeedMultiplier(data, apiCfg.speedUnit || 'auto');

    const speedKmh = Math.max(0, Math.round(Math.abs(Number(data.speed) || 0) * speedMult));
    const limitRaw = Number(data.speedLimit);
    const limitKmh = Number.isFinite(limitRaw) && limitRaw > 0
      ? Math.round(limitRaw * speedMult)
      : 0;

    const ccSource =
      data.cruise ??
      data.cc ??
      data.cruiseControl ??
      (data.tel && (data.tel.cruise ?? data.tel.cc ?? data.tel.cruiseControl)) ??
      0;
    const ccNumeric = typeof ccSource === 'object' && ccSource !== null
      ? Number(ccSource.speed ?? ccSource.value ?? 0)
      : Number(ccSource);
    const ccSpeed = Number.isFinite(ccNumeric) && ccNumeric > 0
      ? Math.round(ccNumeric * speedMult)
      : 0;
    const isCcActive = Boolean(
      isTruthyTelemetryFlag(data.cruiseOn) ||
      (data.tel && isTruthyTelemetryFlag(data.tel.cruiseOn)) ||
      data.cruise === true ||
      ccSpeed > 0
    );

    const rpm = Math.max(0, Math.round(Number(data.rpm) || 0));
    const maxRpm = Math.max(1500, Number(apiCfg.maxRpm) || 2500);
    const rpmRatio = Math.max(0, Math.min(1, rpm / maxRpm));

    const speedEl = global.document.getElementById('lt-speed');
    const speedBlockEl = global.document.getElementById('lt-speed-block');
    const rpmTextEl = global.document.getElementById('lt-rpm-text');
    const rpmFillEl = global.document.getElementById('lt-rpm-fill');
    const limitEl = global.document.getElementById('lt-limit');
    const cruiseEl = global.document.getElementById('lt-cruise');
    const gearEl = global.document.getElementById('lt-gear');
    const fuelEl = global.document.getElementById('lt-fuel');
    const sensorFuelEl = global.document.getElementById('lt-sensor-fuel');
    const navEl = global.document.getElementById('lt-nav');
    const routeProgressEl = global.document.getElementById('lt-route-progress-fill');
    const cargoChipEl = global.document.getElementById('lt-cargo-chip');
    const cargoEl = global.document.getElementById('lt-cargo');

    const truckModelEl = global.document.getElementById('lt-truck-model');
    const truckPlateEl = global.document.getElementById('lt-truck-plate');
    const truckHealthEl = global.document.getElementById('lt-truck-health');
    const trailerHealthEl = global.document.getElementById('lt-trailer-health');
    const cargoHealthEl = global.document.getElementById('lt-cargo-health');
    const truckOdoEl = global.document.getElementById('lt-truck-odometer');
    const fuelAvgEl = global.document.getElementById('lt-sensor-fuel-avg');
    const tempsEl = global.document.getElementById('lt-sensor-temps');
    const airEl = global.document.getElementById('lt-sensor-air');
    const adblueEl = global.document.getElementById('lt-sensor-adblue');
    const batteryEl = global.document.getElementById('lt-sensor-battery');
    const rangeEl = global.document.getElementById('lt-sensor-range');

    const rawRange = data.fuelRange ??
      (data.fuel && typeof data.fuel === 'object' ? data.fuel.range : undefined);

    if (speedEl) speedEl.textContent = String(speedKmh);
    if (speedBlockEl) {
      speedBlockEl.classList.toggle('is-overspeed', limitKmh > 0 && speedKmh > limitKmh + 4);
    }

    if (rpmTextEl) rpmTextEl.textContent = `${rpm} RPM`;
    if (rpmFillEl) {
      rpmFillEl.style.transform = `scaleX(${rpmRatio.toFixed(3)})`;
      rpmFillEl.classList.toggle('is-redline', rpmRatio >= 0.84);
    }

    if (limitEl) {
      limitEl.textContent = limitKmh > 0 ? String(limitKmh) : '--';
      limitEl.classList.toggle('is-inactive', limitKmh <= 0);
    }

    if (cruiseEl) {
      if (isCcActive) {
        cruiseEl.textContent = ccSpeed > 0 ? `CC ${ccSpeed}` : 'CC ON';
        cruiseEl.classList.add('is-active');
      } else {
        cruiseEl.textContent = 'CC --';
        cruiseEl.classList.remove('is-active');
      }
    }

    if (gearEl) {
      gearEl.textContent = formatGearLabel(resolveRawGear(data));
    }

    applyDashboardInputs(data);
    applyDashboardIndicators(data);

    if (fuelEl) {
      fuelEl.textContent = formatFuelText(data.fuel, rawRange);
    }
    if (sensorFuelEl) {
      sensorFuelEl.textContent = formatFuelLitersOnly(data.fuel);
    }

    const identity = resolveTruckIdentity(data);
    const gameId = resolveGameId(data, identity.brand || identity.modelText);

    const navInputs = resolveNavInputs(data);
    if (navEl) {
      navEl.textContent = formatNavText(navInputs.navDist, navInputs.navTime, apiCfg);
    }
    applyRealEtaDisplay(resolveRealEtaState(navInputs, apiCfg));

    const jobState = resolveJobAndRouteState(data, gameId, navInputs);
    setRouteDisplay(jobState.text, jobState.meta, jobState.tag);

    const trailerState = resolveTrailerAndCargoState(data, jobState);
    if (cargoChipEl && cargoEl) {
      cargoChipEl.classList.remove('is-ok', 'is-warn', 'is-danger', 'is-detached');
      cargoChipEl.classList.add(trailerState.statusClass);
      cargoChipEl.title = trailerState.title;
      cargoEl.textContent = trailerState.text;
    }

    if (routeProgressEl) {
      const navMeters = resolveNavDistanceMeters(navInputs.navDist, apiCfg);
      const navKm = navMeters !== null ? navMeters / 1000 : null;
      let progressRatio = 0;
      if (jobState.hasJob && jobState.plannedKm && jobState.plannedKm > 0 && navKm !== null) {
        progressRatio = Math.max(0, Math.min(1, (jobState.plannedKm - navKm) / jobState.plannedKm));
      }
      routeProgressEl.style.transform = `scaleX(${progressRatio.toFixed(3)})`;
    }

    if (truckModelEl) truckModelEl.textContent = identity.modelText;
    if (truckPlateEl) {
      truckPlateEl.textContent = identity.plateText;
      truckPlateEl.classList.toggle('is-empty', !identity.plateText);
    }

    const truckPct = resolveTruckHealthPct(data);
    const trailerPct = resolveTrailerHealthPct(data, trailerState.connected);
    const cargoPct = resolveCargoHealthPct(data, jobState.hasJob || trailerState.hasCargo);

    applyHealthBadgeState(truckHealthEl, t('truckPrefix'), truckPct, t('truckHealthTitle'), t('truckHealthTitle'));
    applyHealthBadgeState(trailerHealthEl, t('trailerPrefix'), trailerPct, t('trailerHealthTitle'), t('trailerHealthTitle'));
    applyHealthBadgeState(cargoHealthEl, t('cargoPrefix'), cargoPct, t('cargoHealthTitle'), t('cargoHealthTitle'));

    if (truckOdoEl) {
      const odoVal = parseFiniteTelemetryNumber(
        data.odometer ?? (data.truck && data.truck.odometer) ?? (data.cfg && data.cfg.odometer)
      );
      truckOdoEl.textContent = odoVal !== null && odoVal >= 0
        ? `${formatIntWithSpaces(odoVal)} ${t('km')}`
        : `-- ${t('km')}`;
    }
    if (fuelAvgEl) fuelAvgEl.textContent = formatTruckFuelAvg(data.fuelAvg, speedKmh);
    if (tempsEl) tempsEl.textContent = formatOilWaterTemps(data.oilTemp, data.waterTemp);
    if (airEl) airEl.textContent = formatAirPressure(data.air);
    if (adblueEl) adblueEl.textContent = formatAdblueLiters(data.adblue);
    if (batteryEl) batteryEl.textContent = formatBatteryVoltage(data.battery);
    if (rangeEl) rangeEl.textContent = formatFuelRangeKm(rawRange);

    const tripStats = resolveTripStats(data, speedMult);
    updateTickerValues({
      income: jobState.incomeText,
      companies: jobState.companiesText,
      jobType: jobState.jobTypeText,
      driven: tripStats.drivenText,
      liters: tripStats.litersText,
      avg: tripStats.avgText,
      maxSpeed: tripStats.maxSpeedText
    });

    applyGameStatusBadge(data, false, gameId, jobState.hasJob);
  }

  /* ==========================================================================
     ОПРОС ЛОКАЛЬНОГО HTTP-МОСТА И ЗАЩИТА ОТ ЗАЛИПАНИЯ
     ========================================================================== */
  function resolvePacketAgeMs(data, ageHeader) {
    if (data && data.ageMs !== undefined && data.ageMs !== null && data.ageMs !== '') {
      const bodyAge = Number(data.ageMs);
      if (Number.isFinite(bodyAge)) return bodyAge;
    }
    if (ageHeader !== null && ageHeader !== '') {
      const hdrAge = Number(ageHeader);
      if (Number.isFinite(hdrAge)) return hdrAge;
    }
    if (data && data.updatedAtMs !== undefined && data.updatedAtMs !== null) {
      const updatedAt = Number(data.updatedAtMs);
      if (Number.isFinite(updatedAt) && updatedAt > 0) {
        return Math.max(0, Date.now() - updatedAt);
      }
    }
    return null;
  }

  function mergeTelemetryFields(packet, fallbackPacket) {
    if (!fallbackPacket || typeof fallbackPacket !== 'object') {
      return { ...packet };
    }
    const merged = { ...packet };
    TELEMETRY_RETAIN_KEYS.forEach((key) => {
      if (merged[key] === undefined && fallbackPacket[key] !== undefined) {
        merged[key] = fallbackPacket[key];
      }
    });
    return merged;
  }

  function unwrapTelemetryPayload(raw) {
    if (!raw || typeof raw !== 'object') return raw;
    if (!raw.tel || typeof raw.tel !== 'object') return raw;

    const merged = {
      ...(raw.srv && typeof raw.srv === 'object' ? { srv: raw.srv } : {}),
      ...(raw.trip && typeof raw.trip === 'object' ? { trip: raw.trip } : {}),
      ...(raw.cfg && typeof raw.cfg === 'object' ? { cfg: raw.cfg } : {}),
      ...raw.tel
    };
    if (raw.ok !== undefined) merged.ok = raw.ok;
    if (raw.connected !== undefined) merged.connected = raw.connected;
    if (raw.updatedAtMs !== undefined && merged.updatedAtMs === undefined) {
      merged.updatedAtMs = raw.updatedAtMs;
    }
    if (raw.ageMs !== undefined && merged.ageMs === undefined) {
      merged.ageMs = raw.ageMs;
    }
    if (raw.game !== undefined && merged.game === undefined) {
      merged.game = raw.game;
    }
    if (raw.paused !== undefined && merged.paused === undefined) {
      merged.paused = raw.paused;
    }

    if (raw.cfg && typeof raw.cfg === 'object') {
      const cfgTruck = raw.cfg.truck && typeof raw.cfg.truck === 'object' ? raw.cfg.truck : null;
      const cfgBrand = (cfgTruck && cfgTruck.brand) ?? raw.cfg['truck.brand'] ?? raw.cfg.truckBrand;
      const cfgName = (cfgTruck && cfgTruck.name) ?? raw.cfg['truck.name'] ?? raw.cfg.truckName;
      const cfgPlate = (cfgTruck && cfgTruck.license && cfgTruck.license.plate) ??
        (cfgTruck && cfgTruck.licensePlate) ??
        raw.cfg['truck.license.plate'] ??
        raw.cfg.licensePlate;
      if (merged.truckBrand === undefined && cfgBrand !== undefined) merged.truckBrand = cfgBrand;
      if (merged.truckName === undefined && cfgName !== undefined) merged.truckName = cfgName;
      if (merged.licensePlate === undefined && cfgPlate !== undefined) merged.licensePlate = cfgPlate;
    }

    [
      'sourceCity', 'sourceCompany', 'destinationCity', 'destinationCompany',
      'cargoMassKg', 'plannedDistanceKm', 'income', 'jobMarket', 'scale',
      'tripDriven', 'tripLiters', 'tripAvg', 'tripMaxSpeed',
      'busSat', 'restStop', 'electric', 'engine', 'sourceStop', 'destinationStop', 'isBusJob'
    ].forEach((key) => {
      if (raw[key] !== undefined && merged[key] === undefined) {
        merged[key] = raw[key];
      }
    });

    return merged;
  }

  function hasTelemetryPluginFields(data) {
    return Boolean(
      data && typeof data === 'object' &&
      data.ok !== false &&
      data.connected !== false &&
      !data._offline && (
        data.speed !== undefined ||
        data.rpm !== undefined ||
        data.gear !== undefined ||
        data.dgear !== undefined ||
        data.fuel !== undefined ||
        data.fuelRange !== undefined ||
        data.odometer !== undefined ||
        data.fuelAvg !== undefined ||
        data.oilTemp !== undefined ||
        data.waterTemp !== undefined ||
        data.air !== undefined ||
        data.adblue !== undefined ||
        data.battery !== undefined ||
        data.wEngine !== undefined ||
        data.wTrans !== undefined ||
        data.wChassis !== undefined ||
        data.wWheels !== undefined ||
        data.wCabin !== undefined ||
        data.wTrailer !== undefined ||
        data.parkBrake !== undefined ||
        data.lowBeam !== undefined ||
        data.blinkL !== undefined ||
        data.blinkR !== undefined ||
        data.truckBrand !== undefined ||
        data.truckName !== undefined ||
        data.navDist !== undefined ||
        data.navTime !== undefined ||
        data.trailer !== undefined ||
        data.trailerOld !== undefined ||
        data.cargoDmg !== undefined ||
        data.jobDmg !== undefined ||
        hasMeaningfulCargoOrJob(data.cargo) ||
        hasMeaningfulCargoOrJob(data.cfg) ||
        hasMeaningfulCargoOrJob(data.trip)
      )
    );
  }

  function canHoldPreviousTelemetry(staleAfterMs, nowMs = Date.now()) {
    return Boolean(
      lastValidTelemetryPacket &&
      lastFreshTelemetryAt > 0 &&
      (nowMs - lastFreshTelemetryAt) < staleAfterMs
    );
  }

  function scheduleNextTelemetryPoll(delayMs) {
    if (isPageClosed) return;
    if (telemetryTimer !== null) {
      clearTimeout(telemetryTimer);
      telemetryTimer = null;
    }
    telemetryTimer = setTimeout(pollETS2Telemetry, delayMs);
  }

  async function pollETS2Telemetry() {
    if (isPageClosed || telemetryPollInFlight) return;

    const api = config.ets2 && config.ets2.telemetryApi;
    if (!api || !api.enabled || !api.url) {
      showTelemetryStandby();
      return;
    }

    if (global.document.hidden) {
      scheduleNextTelemetryPoll(1500);
      return;
    }

    const activeIntervalMs = Math.max(150, Number(api.pollIntervalMs) || 300);
    const staleAfterMs = Math.max(
      MIN_TELEMETRY_STALE_MS,
      Number(api.staleAfterMs) || DEFAULT_TELEMETRY_STALE_MS
    );
    const offlineBackoffMaxMs = Math.max(3000, Number(api.offlineBackoffMaxMs) || 15000);
    const fetchTimeoutMs = Math.max(2000, activeIntervalMs + 1700);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), fetchTimeoutMs);
    telemetryPollInFlight = true;
    let nextPollDelayMs = activeIntervalMs;

    try {
      const res = await fetch(api.url, { signal: controller.signal, cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const ageHeader = res.headers.get('X-Telemetry-Age-Ms');
      const rawData = await res.json();
      if (isPageClosed) return;

      const data = unwrapTelemetryPayload(rawData);
      const nowMs = Date.now();
      const packetAgeMs = resolvePacketAgeMs(data, ageHeader);
      const isExplicitDisconnected = Boolean(
        !data ||
        typeof data !== 'object' ||
        data.ok === false ||
        data.connected === false ||
        data._offline === true
      );
      const hasPluginFields = !isExplicitDisconnected && hasTelemetryPluginFields(data);
      const isBridgeUninitialized = isExplicitDisconnected || (packetAgeMs !== null && packetAgeMs < 0);
      const isPacketExpired = packetAgeMs !== null && packetAgeMs > staleAfterMs;

      if (hasPluginFields && !isBridgeUninitialized && !isPacketExpired) {
        telemetryMissCount = 0;
        bridgeOfflineNotified = false;

        const effectiveAgeMs = packetAgeMs !== null ? Math.max(0, packetAgeMs) : 0;
        lastFreshTelemetryAt = nowMs - effectiveAgeMs;

        const mergedPacket = mergeTelemetryFields(data, lastValidTelemetryPacket);
        lastValidTelemetryPacket = mergedPacket;
        hasEverReceivedLivePacket = true;

        renderTelemetryPacket(mergedPacket);
        showLiveTelemetry();
        nextPollDelayMs = activeIntervalMs;
      } else if (isExplicitDisconnected) {
        telemetryMissCount = 0;
        lastFreshTelemetryAt = 0;
        lastValidTelemetryPacket = null;
        if (!isTestMode || hasEverReceivedLivePacket) {
          showTelemetryStandby();
        }
        nextPollDelayMs = 1000;
      } else if (!isPacketExpired && canHoldPreviousTelemetry(staleAfterMs, nowMs)) {
        telemetryMissCount = 0;
        showLiveTelemetry();
        nextPollDelayMs = activeIntervalMs;
      } else {
        telemetryMissCount = 0;
        if (isPacketExpired) {
          lastFreshTelemetryAt = 0;
        }
        if (!isTestMode || hasEverReceivedLivePacket) {
          showTelemetryStandby();
        }
        nextPollDelayMs = 1000;
      }
    } catch (_) {
      if (isPageClosed) return;

      const nowMs = Date.now();
      if (canHoldPreviousTelemetry(staleAfterMs, nowMs)) {
        showLiveTelemetry();
        nextPollDelayMs = Math.max(activeIntervalMs, Math.min(800, activeIntervalMs + 200));
      } else {
        telemetryMissCount += 1;

        if (!bridgeOfflineNotified) {
          bridgeOfflineNotified = true;
          log('Мост телеметрии не запущен — отображаются прочерки ожидания, переход в тихий режим опроса.');
        }

        if (!isTestMode || hasEverReceivedLivePacket) {
          showTelemetryStandby();
        }

        nextPollDelayMs = Math.min(
          offlineBackoffMaxMs,
          Math.round(1500 * Math.pow(2, Math.min(telemetryMissCount - 1, 4)))
        );
      }
    } finally {
      clearTimeout(timeoutId);
      telemetryPollInFlight = false;
      if (!isPageClosed) {
        scheduleNextTelemetryPoll(global.document.hidden ? 1500 : nextPollDelayMs);
      }
    }
  }

  async function pollMusicApi() {
    const music = config.music;
    if (!music || !music.enabled || !music.sourceUrl || app.isPlaceholder(music.sourceUrl)) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1100);
    try {
      const res = await fetch(music.sourceUrl, { signal: controller.signal, cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (!data) return;

      const title = data.title || music.title;
      const artist = Array.isArray(data.artists) ? data.artists.join(', ') : (data.artist || '');
      const playing = data.status ? data.status === 'playing' : true;
      setTrackDisplay(title, artist, playing);
    } catch (_) {
      // Музыкальный локальный сервер недоступен — сохраняем статическое отображение
    } finally {
      clearTimeout(timeoutId);
    }
  }

  function startTestMode() {
    log('Активирован тестовый режим (?test=1).');

    const driverFromConfig = config.ets2 && config.ets2.driverName;
    if (!driverFromConfig || driverFromConfig === 'DRIVER') {
      updateDriverLabels('FOOZZEE');
    }

    setTrackDisplay('Midnight Highway', 'FM-84', true);

    renderTelemetryPacket(SAMPLE_TELEMETRY_PACKET);
    showLiveTelemetry();

    const configuredSocials = config.socials && Array.isArray(config.socials.items)
      ? config.socials.items.filter((i) => i && !app.isPlaceholder(i.value))
      : [];
    if (configuredSocials.length === 0) {
      renderSocials([
        { label: 'ROUTE', value: 'A2 AUTOBAHN // NO DAMAGE' },
        { label: 'RADIO', value: 'TRUCKERS FM · CH 19' }
      ]);
    }

    if (app.chat) {
      SAMPLE_CHAT_POOL.forEach((msg) => app.chat.push(msg));
    }

    if (app.alerts) {
      demoTimers.push(setTimeout(() => {
        app.alerts.enqueue(SAMPLE_ALERTS.donate);
      }, 650));

      demoTimers.push(setTimeout(() => {
        app.alerts.enqueue(SAMPLE_ALERTS.sub);
      }, 1250));
    }

    console.info(
      '%c[ETS2 OVERLAY // TEST MODE]%c Доступные консольные команды:\n' +
      "  testAlert('donate' | 'sub' | 'follow' | 'raid' | 'all')\n" +
      '  testChat(count)\n' +
      '  testTelemetry({ speed: 24, dgear: "D12" }) / testTelemetry(false)\n' +
      "  testTrack('Название', 'Исполнитель')\n" +
      "  testRoute('Маршрут', '85 КМ/Ч', 'ETS2')\n" +
      "  setCockpitTheme('amber' | 'ice')\n" +
      '  toggleWebcam(true | false)\n' +
      '  toggleGuides(true | false)',
      'color: #ff9e1b; font-weight: bold;',
      'color: inherit;'
    );
  }

  function registerConsoleCommands() {
    global.testAlert = function testAlert(type = 'donate', overrides = {}) {
      if (!app.alerts) return false;
      if (type === 'all') {
        ['donate', 'sub', 'follow', 'raid'].forEach((kind) => {
          app.alerts.enqueue({ ...SAMPLE_ALERTS[kind], ...overrides, type: kind, force: true });
        });
        return true;
      }
      const preset = SAMPLE_ALERTS[type] || SAMPLE_ALERTS.donate;
      return app.alerts.enqueue({ ...preset, ...overrides, type: preset.type, force: true });
    };

    let chatSampleIdx = 0;
    global.testChat = function testChat(count = 1, customText = null) {
      if (!app.chat) return 0;
      const total = Math.max(1, Math.min(30, Number(count) || 1));
      let pushed = 0;
      for (let i = 0; i < total; i += 1) {
        const sample = SAMPLE_CHAT_POOL[chatSampleIdx % SAMPLE_CHAT_POOL.length];
        chatSampleIdx += 1;
        const ok = app.chat.push({
          ...sample,
          text: customText ? String(customText) : sample.text
        });
        if (ok) pushed += 1;
      }
      return pushed;
    };

    global.testTelemetry = function testTelemetry(payload = {}) {
      if (payload === false) {
        lastValidTelemetryPacket = null;
        lastFreshTelemetryAt = 0;
        showTelemetryStandby();
        return false;
      }
      const merged = typeof payload === 'object' && payload !== null
        ? { ...SAMPLE_TELEMETRY_PACKET, ...payload }
        : SAMPLE_TELEMETRY_PACKET;
      stickySpeedUnit = null;
      renderTelemetryPacket(merged);
      showLiveTelemetry();
      return true;
    };

    global.testTrack = function testTrack(title = 'Nightcall', artist = 'Kavinsky', isPlaying = true) {
      setTrackDisplay(title, artist, isPlaying);
    };

    global.testRoute = function testRoute(text = 'Мюнхен → Вена', meta = '88 КМ/Ч', tag = 'ETS2 // ATS') {
      setRouteDisplay(text, meta, tag);
    };

    global.setCockpitTheme = function setCockpitTheme(preset = 'amber') {
      app.applyThemeVariables(preset);
    };

    global.toggleWebcam = function toggleWebcam(forceState) {
      const camBox = global.document.getElementById('cam-box');
      if (!camBox) return false;
      const nextVisible = typeof forceState === 'boolean'
        ? forceState
        : camBox.classList.contains('is-hidden');
      applyWebcamState(nextVisible);
      return nextVisible;
    };

    global.toggleGuides = function toggleGuides(forceState) {
      const next = typeof forceState === 'boolean'
        ? forceState
        : !global.document.body.classList.contains('show-guides');
      global.document.body.classList.toggle('show-guides', next);
      return next;
    };
  }

  function stopAllTimers() {
    isPageClosed = true;
    if (clockTimer) { clearInterval(clockTimer); clockTimer = null; }
    if (telemetryTimer) { clearTimeout(telemetryTimer); telemetryTimer = null; }
    if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
    if (socialsTimer) { clearInterval(socialsTimer); socialsTimer = null; }
    if (leavingTimer) { clearTimeout(leavingTimer); leavingTimer = null; }
    demoTimers.forEach((id) => clearTimeout(id));
    demoTimers = [];
  }

  function bootstrap() {
    applyLocalization();
    applyWebcamState(!config.webcam || config.webcam.enabled !== false);
    updateDriverLabels();
    updateDashboardSocials();
    showTelemetryStandby();

    if (config.ets2 && !(config.ets2.telemetryApi && config.ets2.telemetryApi.enabled)) {
      setRouteDisplay(config.ets2.routeText, config.ets2.routeMeta, config.ets2.routeTag);
    }

    if (config.music) {
      setTrackDisplay(config.music.title, config.music.artist, true);
    }

    renderSocials(config.socials ? config.socials.items : []);
    updateClock();

    if (showGuides) {
      global.document.body.classList.add('show-guides');
    }

    clockTimer = setInterval(updateClock, 1000);

    if (config.music && config.music.sourceUrl && !app.isPlaceholder(config.music.sourceUrl)) {
      const interval = Math.max(1000, Number(config.music.pollIntervalMs) || 3000);
      pollMusicApi();
      musicTimer = setInterval(pollMusicApi, interval);
    }

    if (app.chat) {
      app.chat.initConnections();
    }

    registerConsoleCommands();

    if (isTestMode) {
      startTestMode();
    }

    if (config.ets2 && config.ets2.telemetryApi && config.ets2.telemetryApi.enabled) {
      pollETS2Telemetry();
    }
  }

  global.addEventListener('DOMContentLoaded', bootstrap);
  global.addEventListener('visibilitychange', () => {
    if (!global.document.hidden) {
      updateClock();
      if (config.ets2 && config.ets2.telemetryApi && config.ets2.telemetryApi.enabled) {
        telemetryMissCount = 0;
        if (!telemetryPollInFlight) {
          scheduleNextTelemetryPoll(50);
        }
      }
    }
  });
  global.addEventListener('pagehide', stopAllTimers);
})(window);
