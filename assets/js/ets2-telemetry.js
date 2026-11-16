/**
 * Модуль телеметрии кабины ETS2 / ATS (overlayobs_foozzee_telemetry.dll SCS SDK 1.16 Shared Memory -> HTTP 30002),
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
      barUnit: 'бар',
      voltUnit: 'В',
      rpm: 'ОБ/МИН',
      rpmStandby: '-- ОБ/МИН',
      cruisePill: 'КК',
      cruiseStandby: 'КК --',
      cruiseOn: 'КК ВКЛ',
      fuel: 'ТОПЛИВО',
      range: 'ЗАПАС ХОДА',
      fuelAvg: 'РАСХОД',
      oilWater: 'МАСЛО/ВОДА',
      air: 'ВОЗДУХ',
      adblue: 'МОЧЕВИНА',
      battery: 'АКБ',
      route: 'МАРШРУТ',
      trailer: 'ПРИЦЕП',
      throttle: 'ГАЗ',
      brake: 'ТОРМ',
      steer: 'РУЛЬ',
      camTitle: 'КАМЕРА // FOOZZEE',
      camPrefix: 'КАМЕРА',
      cbDefault: 'РАЦИЯ 19',
      chatTitle: 'РАЦИЯ // ЧАТ',
      chatLive: 'TWITCH // В ЭФИРЕ',
      chatTest: 'ТЕСТ // В ЭФИРЕ',
      chatStandby: 'ОЖИДАНИЕ',
      chatOnline: 'В СЕТИ',
      chatOffline: 'НЕ В СЕТИ',
      chatConnecting: 'ПОДКЛЮЧЕНИЕ',
      driverPrefix: 'ВОДИТЕЛЬ',
      driverPill: 'ВОДИТЕЛЬ: FOOZZEE',
      liveRouteTag: 'ЭФИР // МАРШРУТ',
      truckPrefix: 'СОСТ:',
      trailerPrefix: 'ПРИЦЕП:',
      cargoPrefix: 'ГРУЗ:',
      truckStandby: 'ТЯГАЧ // ОЖИДАНИЕ',
      freeRoam: 'СВОБОДНЫЙ РЕЙС',
      freightJob: 'ГРУЗОВОЙ РЕЙС',
      freightJobTitle: 'Грузовой рейс',
      trailerAttachedEmpty: 'С ПРИЦЕПОМ (ПУСТОЙ)',
      noTrailer: 'БЕЗ ПРИЦЕПА',
      coachPassengerRoute: 'ПАССАЖИРСКИЙ РЕЙС',
      coachPassengerTitle: 'Пассажирский рейс DLC Coaches',
      comfortLabel: 'КОМФОРТ',
      gpsRouteNextStop: 'МАРШРУТ GPS // СЛЕДУЮЩАЯ ОСТАНОВКА',
      gpsRouteTitle: 'Навигация по маршруту GPS',
      statusInTransit: 'В РЕЙСЕ // В ЭФИРЕ',
      statusFreeRoam: 'СВОБОДНАЯ ЕЗДА // В СЕТИ',
      statusPaused: 'ПАУЗА // В МЕНЮ',
      statusStandby: 'ОЖИДАНИЕ // ОФЛАЙН',
      enRouteMeta: 'В РЕЙСЕ',
      liveMeta: 'В ЭФИРЕ',
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
      },
      eventCategoryFine: 'ШТРАФ // ПОЛИЦИЯ',
      eventCategoryToll: 'ОПЛАТА ДОРОГИ',
      eventCategoryRefuel: 'ДОЗАПРАВКА ТОПЛИВА',
      eventCategoryFerry: 'МОРСКАЯ ПЕРЕПРАВА',
      eventCategoryTrain: 'Ж/Д ПЕРЕПРАВА',
      eventCategoryJobDelivered: 'РЕЙС ЗАВЕРШЁН',
      eventCategoryJobCancelled: 'РЕЙС АННУЛИРОВАН',
      eventCategoryCargoDamage: 'ПОВРЕЖДЕНИЕ ГРУЗА',
      eventCargoDamageTitle: 'Зафиксирован урон груза',
      eventCategoryService: 'ТЕХОБСЛУЖИВАНИЕ',
      eventServiceTitle: 'Ремонт и обслуживание завершены',
      eventServiceValue: 'Восстановлено 100%',
      eventCategoryLowFuel: 'РЕЗЕРВ ТОПЛИВА',
      eventLowFuelTitle: 'Низкий остаток топлива',
      eventCategoryBusStop: 'ПАССАЖИРСКИЙ РЕЙС',
      eventBusStopTitle: 'Остановка // Посадка пассажиров',
      eventCategoryBusComfort: 'КОМФОРТ ПАССАЖИРОВ',
      eventBusComfortTitle: 'Резкое снижение комфорта',
      eventCategoryChatHonk: 'ИНТЕРАКТИВНЫЙ КЛАКСОН',
      eventChatHonkTitle: 'Приветственный гудок',
      eventChatHonkValue: 'Пневмосигнал тягача',
      eventCategoryChatCb: '15 КАНАЛ // РАЦИЯ СИ-БИ',
      eventCategoryChatRoute: 'GPS // ТЕКУЩИЙ МАРШРУТ',
      eventCategoryChatStats: 'СТАТИСТИКА СТРИМА',
      eventCategoryChatTruck: 'ТЯГАЧ // СОСТАВ',
      eventCategoryChatDriver: 'ВОДИТЕЛЬ // ДОСЬЕ',
      eventSummaryRoute: 'Маршрут:',
      eventSummaryDistance: 'Пройдено:',
      eventSummaryRevenue: 'Оплата:',
      eventSummaryXP: 'Опыт:',
      eventSummaryFines: 'Штрафы:',
      eventSummaryBetsWon: 'Ставки зашли:',
      eventSummaryNoBets: 'Ставок не было',
      badgeFine: 'ШТРАФ',
      badgeToll: 'ОПЛАТА',
      badgeFuel: 'АЗС',
      badgeFerry: 'ПАРОМ',
      badgeTrain: 'ПОЕЗД',
      badgeDelivered: 'КОНТРАКТ',
      badgeCancelled: 'ОТМЕНА',
      badgeDamage: 'ГРУЗ',
      badgeService: 'СТО',
      badgeLowFuel: 'РЕЗЕРВ',
      badgeCoach: 'АВТОБУС',
      badgeComfort: 'КОМФОРТ',
      badgeHonk: 'СИГНАЛ',
      badgeRadio: 'РАЦИЯ',
      badgeChat: 'ЧАТ',
      badgeTruck: 'ТЯГАЧ',
      badgeDriver: 'ВОДИТЕЛЬ',
      badgeStats: 'СТАТИСТИКА',
      badgeRoute: 'МАРШРУТ',
      badgeWinners: 'ПОБЕДИТЕЛИ',
      eventFineSpeeding: 'Превышение скорости',
      eventFineSpeedingCamera: 'Камера контроля скорости',
      eventFineRedSignal: 'Проезд на красный свет',
      eventFineCrash: 'ДТП // Столкновение',
      eventFineNoLights: 'Движение без фар',
      eventFineAvoidSleeping: 'Нарушение режима отдыха',
      eventFineWrongWay: 'Движение по встречной полосе',
      eventFineAvoidWeighing: 'Пропуск весового контроля',
      eventFineIllegalTrailer: 'Неразрешённый прицеп',
      eventFineAvoidInspection: 'Пропуск инспекции',
      eventFineIllegalBorderCrossing: 'Нарушение пограничного контроля',
      eventFineHardShoulderViolation: 'Движение по обочине',
      eventFineDamagedVehicleUsage: 'Критическая неисправность ТС',
      eventFineGeneric: 'Дорожный штраф',
      eventTollTitle: 'Платная автомагистраль',
      eventRefuelTitle: 'Заправка завершена',
      eventFerryTitle: 'Паромная переправа',
      eventTrainTitle: 'Железнодорожная переправа',
      eventJobDeliveredTitle: 'Груз успешно доставлен',
      eventJobCancelledTitle: 'Контракт аннулирован'
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
      barUnit: 'bar',
      voltUnit: 'V',
      rpm: 'RPM',
      rpmStandby: '-- RPM',
      cruisePill: 'CC',
      cruiseStandby: 'CC --',
      cruiseOn: 'CC ON',
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
      camTitle: 'CAM // FOOZZEE',
      camPrefix: 'CAM',
      cbDefault: 'CB 19',
      chatTitle: 'COMMS // CHAT',
      chatLive: 'TWITCH // LIVE',
      chatTest: 'TEST // LIVE',
      chatStandby: 'STANDBY',
      chatOnline: 'ONLINE',
      chatOffline: 'OFFLINE',
      chatConnecting: 'CONNECTING',
      driverPrefix: 'DRIVER',
      driverPill: 'DRIVER: FOOZZEE',
      liveRouteTag: 'LIVE // ROUTE',
      truckPrefix: 'TRUCK:',
      trailerPrefix: 'TRAILER:',
      cargoPrefix: 'CARGO:',
      truckStandby: 'TRUCK // STANDBY',
      freeRoam: 'FREE ROAM',
      freightJob: 'FREIGHT',
      freightJobTitle: 'Freight cargo trip',
      trailerAttachedEmpty: 'TRAILER ATTACHED (EMPTY)',
      noTrailer: 'NO TRAILER',
      coachPassengerRoute: 'PASSENGERS',
      coachPassengerTitle: 'DLC Coaches passenger route',
      comfortLabel: 'SATISFACTION',
      gpsRouteNextStop: 'GPS ROUTE // NEXT STOP',
      gpsRouteTitle: 'Active GPS route navigation',
      statusInTransit: 'IN TRANSIT // LIVE',
      statusFreeRoam: 'FREE ROAM // ONLINE',
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
      },
      eventCategoryFine: 'TRAFFIC FINE // POLICE',
      eventCategoryToll: 'TOLL PAYMENT',
      eventCategoryRefuel: 'REFUELING // STATION',
      eventCategoryFerry: 'FERRY TRANSIT',
      eventCategoryTrain: 'TRAIN TRANSIT',
      eventCategoryJobDelivered: 'JOB DELIVERED',
      eventCategoryJobCancelled: 'JOB CANCELLED',
      eventCategoryCargoDamage: 'CARGO DAMAGE',
      eventCargoDamageTitle: 'Cargo Damage Detected',
      eventCategoryService: 'VEHICLE SERVICE',
      eventServiceTitle: 'Repair & Service Completed',
      eventServiceValue: 'Restored 100%',
      eventCategoryLowFuel: 'LOW FUEL RESERVE',
      eventLowFuelTitle: 'Low Fuel Warning',
      eventCategoryBusStop: 'PASSENGER COACH',
      eventBusStopTitle: 'Bus Stop // Boarding',
      eventCategoryBusComfort: 'PASSENGER COMFORT',
      eventBusComfortTitle: 'Comfort Rating Drop',
      eventCategoryChatHonk: 'INTERACTIVE AIR HORN',
      eventChatHonkTitle: 'Horn Greeting',
      eventChatHonkValue: 'Truck Pneumatic Horn',
      eventCategoryChatCb: 'CH 15 // CB RADIO',
      eventCategoryChatRoute: 'GPS // CURRENT ROUTE',
      eventCategoryChatStats: 'STREAM SESSION STATS',
      eventCategoryChatTruck: 'TRUCK // FLEET',
      eventCategoryChatDriver: 'DRIVER // DOSSIER',
      eventSummaryRoute: 'Route:',
      eventSummaryDistance: 'Distance:',
      eventSummaryRevenue: 'Payment:',
      eventSummaryXP: 'XP:',
      eventSummaryFines: 'Fines:',
      eventSummaryBetsWon: 'Won Bets:',
      eventSummaryNoBets: 'No bets placed',
      badgeFine: 'FINE',
      badgeToll: 'TOLL',
      badgeFuel: 'FUEL',
      badgeFerry: 'FERRY',
      badgeTrain: 'TRAIN',
      badgeDelivered: 'CONTRACT',
      badgeCancelled: 'CANCEL',
      badgeDamage: 'CARGO',
      badgeService: 'SERVICE',
      badgeLowFuel: 'RESERVE',
      badgeCoach: 'COACH',
      badgeComfort: 'COMFORT',
      badgeHonk: 'HORN',
      badgeRadio: 'CB RADIO',
      badgeChat: 'CHAT',
      badgeTruck: 'TRUCK',
      badgeDriver: 'DRIVER',
      badgeStats: 'STATS',
      badgeRoute: 'GPS',
      badgeWinners: 'WINNERS',
      eventFineSpeeding: 'Speeding Violation',
      eventFineSpeedingCamera: 'Speed Camera Violation',
      eventFineRedSignal: 'Red Light Violation',
      eventFineCrash: 'Vehicle Collision',
      eventFineNoLights: 'Driving Without Lights',
      eventFineAvoidSleeping: 'Fatigue / Rest Violation',
      eventFineWrongWay: 'Wrong Way Driving',
      eventFineAvoidWeighing: 'Weigh Station Avoided',
      eventFineIllegalTrailer: 'Illegal Trailer',
      eventFineAvoidInspection: 'Inspection Avoided',
      eventFineIllegalBorderCrossing: 'Border Control Violation',
      eventFineHardShoulderViolation: 'Hard Shoulder Violation',
      eventFineDamagedVehicleUsage: 'Damaged Vehicle',
      eventFineGeneric: 'Traffic Violation',
      eventTollTitle: 'Highway Toll Paid',
      eventRefuelTitle: 'Refueling Completed',
      eventFerryTitle: 'Ferry Transit',
      eventTrainTitle: 'Train Transit',
      eventJobDeliveredTitle: 'Cargo Delivered',
      eventJobCancelledTitle: 'Contract Cancelled'
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

  const SAMPLE_CHAT_POOL_RU = [
    { platform: 'twitch', role: 'MOD', username: 'Alex_Trucker', color: '#ff9e1b', text: 'Отличный маршрут по автобану! Какой груз везёшь до Праги?' },
    { platform: 'twitch', role: 'VIP', username: 'DimaVolga', color: '#38bdf8', text: 'Картинка супер, панель вообще не перекрывает зеркала F2!' },
    { platform: 'twitch', role: 'SUB', username: 'Ksenia_Road', color: '#22c55e', text: 'Всем хорошего рейса и зелёных светофоров без штрафов' },
    { platform: 'vk', role: '', username: 'Sergey_48RU', color: '#93c5fd', text: 'Scania на подъёме уверенно тянет, сколько тонн в прицепе?' },
    { platform: 'twitch', role: '', username: 'Maverick_ETS', color: '#f59e0b', text: 'Круиз на 85 и погнали до разгрузки до заката!' },
    { platform: 'twitch', role: 'SUB', username: 'NordicHaul', color: '#86efac', text: 'Звук турбины и музыка в кабине прям кайф 🔥' }
  ];

  const SAMPLE_CHAT_POOL_EN = [
    { platform: 'twitch', role: 'MOD', username: 'Alex_Trucker', color: '#ff9e1b', text: 'Great highway route! What cargo are you hauling to Prague?' },
    { platform: 'twitch', role: 'VIP', username: 'HighwayKing', color: '#38bdf8', text: 'Layout is awesome, overlay does not block F2 mirrors at all!' },
    { platform: 'twitch', role: 'SUB', username: 'Sarah_Hauler', color: '#22c55e', text: 'Have a smooth haul everyone and keep the rubber side down!' },
    { platform: 'twitch', role: '', username: 'PeterbiltFan', color: '#93c5fd', text: 'Scania pulls uphill with ease, how many tons are in the trailer?' },
    { platform: 'twitch', role: '', username: 'Maverick_ETS', color: '#f59e0b', text: 'Cruise at 85 and let us roll into the sunset!' },
    { platform: 'twitch', role: 'SUB', username: 'NordicHaul', color: '#86efac', text: 'Turbo spool and cabin sound are so satisfying 🔥' }
  ];

  const SAMPLE_CHAT_POOL = lang === 'en' ? SAMPLE_CHAT_POOL_EN : SAMPLE_CHAT_POOL_RU;

  const SAMPLE_ALERTS = {
    donate: {
      type: 'donate',
      username: lang === 'en' ? 'Daniel_Trucker' : 'Даниил_Дальнобой',
      amount: lang === 'en' ? 10 : 500,
      currency: lang === 'en' ? '$' : '₽',
      message: lang === 'en'
        ? 'For a full diesel tank and endless coffee on the night highway!'
        : 'На полный бак дизеля и безлимитный кофе на ночной трассе!',
      force: true
    },
    sub: {
      type: 'sub',
      username: 'Ksenia_Road',
      months: 6,
      tier: 'TIER 1',
      message: lang === 'en'
        ? 'Renewed trucker license for 6 months!'
        : 'Продлила лицензию дальнобойщика на 6 месяцев!',
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
      cargo: lang === 'en' ? 'Electronics' : 'Электроника',
      source: { city: lang === 'en' ? 'Hamburg' : 'Гамбург', company: 'EuroGoodies' },
      destination: { city: lang === 'en' ? 'Prague' : 'Прага', company: 'Transinet' },
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
      source: { city: lang === 'en' ? 'Hamburg' : 'Гамбург', company: 'EuroGoodies' },
      destination: { city: lang === 'en' ? 'Prague' : 'Прага', company: 'Transinet' },
      cargo: { name: lang === 'en' ? 'Electronics' : 'Электроника', mass: 22100 },
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
      driverPill.textContent = `${t('driverPrefix')}: ${cleanName}`;
    }

    const camDriverEl = global.document.getElementById('cam-driver-label');
    if (camDriverEl) {
      camDriverEl.textContent = `${t('camPrefix')} // ${cleanName}`;
    }

    const cbEl = global.document.getElementById('cam-cb-badge');
    if (cbEl) {
      cbEl.textContent = (config.webcam && config.webcam.cbChannel && !app.isPlaceholder(config.webcam.cbChannel))
        ? String(config.webcam.cbChannel)
        : t('cbDefault');
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
    if (rpmTextEl) rpmTextEl.textContent = t('rpmStandby');
    if (rpmFillEl) {
      rpmFillEl.style.transform = 'scaleX(0)';
      rpmFillEl.classList.remove('is-redline');
    }
    if (limitEl) {
      limitEl.textContent = '--';
      limitEl.classList.add('is-inactive');
    }
    if (cruiseEl) {
      cruiseEl.textContent = t('cruiseStandby');
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

    if (truckModelEl) truckModelEl.textContent = t('truckStandby');
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

  const INVALID_PLACE_NAMES = new Set([
    'city', 'viewpoint', 'viewpoints', 'stop', 'stops', 'bus_stop',
    'station', 'landmark', 'scenic', 'null', 'undefined', 'none', 'n/a', '-', '--'
  ]);

  function cleanStopOrPlaceIdentifier(raw) {
    if (!raw || typeof raw !== 'string') return '';
    let s = raw.trim();

    // 1. Очистка технических префиксов автобусных остановок и станций (DLC Coaches)
    s = s.replace(/^(?:stop|station|terminal)[._\-\s]+/i, '');

    // 2. Очистка технических суффиксов остановок и терминалов
    s = s.replace(/[._\-\s]+(?:bus[._\-\s]*(?:station|stop)|terminal|station)$/i, '');

    // 3. Очистка завершающих цифровых индексов вроде .01, _01, .1
    s = s.replace(/[._\-\s]+\d+$/i, '');

    // 4. Очистка начальных цифровых индексов вроде 01. или 1_
    s = s.replace(/^\d+[._\-\s]+/i, '');

    // 5. Замена подчёркиваний на пробелы и нормализация пробелов
    s = s.replace(/_+/g, ' ').replace(/\s+/g, ' ').trim();

    if (INVALID_PLACE_NAMES.has(s.toLowerCase())) return '';
    return s;
  }

  function isValidPlaceName(str) {
    if (typeof str !== 'string') return false;
    const clean = str.trim();
    if (!clean) return false;
    const cleanedStop = cleanStopOrPlaceIdentifier(clean);
    if (!cleanedStop) return false;
    return !INVALID_PLACE_NAMES.has(clean.toLowerCase()) && !INVALID_PLACE_NAMES.has(cleanedStop.toLowerCase());
  }

  function pickValidPlaceText(candidates) {
    for (let i = 0; i < candidates.length; i += 1) {
      if (typeof candidates[i] !== 'string') continue;
      const clean = candidates[i].trim();
      if (isValidPlaceName(clean)) {
        return clean;
      }
    }
    return '';
  }

  /* ==========================================================================
     СЛОВАРЬ ГОРОДОВ И ОСТАНОВОК ETS2 / ATS (RU / EN)
     ========================================================================== */
  const CITIES_DB = {
    // Германия (ETS2)
    berlin: { ru: 'Берлин', en: 'Berlin' },
    hamburg: { ru: 'Гамбург', en: 'Hamburg' },
    munchen: { ru: 'Мюнхен', en: 'Munich' },
    munich: { ru: 'Мюнхен', en: 'Munich' },
    frankfurt: { ru: 'Франкфурт-на-Майне', en: 'Frankfurt am Main' },
    frankfurtammain: { ru: 'Франкфурт-на-Майне', en: 'Frankfurt am Main' },
    koln: { ru: 'Кёльн', en: 'Cologne' },
    cologne: { ru: 'Кёльн', en: 'Cologne' },
    stuttgart: { ru: 'Штутгарт', en: 'Stuttgart' },
    leipzig: { ru: 'Лейпциг', en: 'Leipzig' },
    dresden: { ru: 'Дрезден', en: 'Dresden' },
    nurnberg: { ru: 'Нюрнберг', en: 'Nuremberg' },
    nuremberg: { ru: 'Нюрнберг', en: 'Nuremberg' },
    bremen: { ru: 'Бремен', en: 'Bremen' },
    dortmund: { ru: 'Дортмунд', en: 'Dortmund' },
    dusseldorf: { ru: 'Дюссельдорф', en: 'Düsseldorf' },
    hannover: { ru: 'Ганновер', en: 'Hannover' },
    rostock: { ru: 'Росток', en: 'Rostock' },
    kiel: { ru: 'Киль', en: 'Kiel' },
    magdeburg: { ru: 'Магдебург', en: 'Magdeburg' },
    erfurt: { ru: 'Эрфурт', en: 'Erfurt' },
    kassel: { ru: 'Кассель', en: 'Kassel' },
    mannheim: { ru: 'Мангейм', en: 'Mannheim' },
    duisburg: { ru: 'Дуйсбург', en: 'Duisburg' },
    osnabruck: { ru: 'Оснабрюк', en: 'Osnabrück' },

    // Франция (ETS2)
    paris: { ru: 'Париж', en: 'Paris' },
    lyon: { ru: 'Лион', en: 'Lyon' },
    marseille: { ru: 'Марсель', en: 'Marseille' },
    toulouse: { ru: 'Тулуза', en: 'Toulouse' },
    nice: { ru: 'Ницца', en: 'Nice' },
    nantes: { ru: 'Нант', en: 'Nantes' },
    strasbourg: { ru: 'Страсбург', en: 'Strasbourg' },
    montpellier: { ru: 'Монпелье', en: 'Montpellier' },
    bordeaux: { ru: 'Бордо', en: 'Bordeaux' },
    lille: { ru: 'Лилль', en: 'Lille' },
    rennes: { ru: 'Ренн', en: 'Rennes' },
    reims: { ru: 'Реймс', en: 'Reims' },
    lehavre: { ru: 'Гавр', en: 'Le Havre' },
    brest: { ru: 'Брест', en: 'Brest' },
    calais: { ru: 'Кале', en: 'Calais' },
    dijon: { ru: 'Дижон', en: 'Dijon' },
    metz: { ru: 'Мец', en: 'Metz' },
    limoges: { ru: 'Лимож', en: 'Limoges' },
    clermontferrand: { ru: 'Клермон-Ферран', en: 'Clermont-Ferrand' },
    lemans: { ru: 'Ле-Ман', en: 'Le Mans' },
    larochelle: { ru: 'Ла-Рошель', en: 'La Rochelle' },
    bourges: { ru: 'Бурж', en: 'Bourges' },

    // Великобритания (ETS2)
    london: { ru: 'Лондон', en: 'London' },
    birmingham: { ru: 'Бирмингем', en: 'Birmingham' },
    manchester: { ru: 'Манчестер', en: 'Manchester' },
    glasgow: { ru: 'Глазго', en: 'Glasgow' },
    edinburgh: { ru: 'Эдинбург', en: 'Edinburgh' },
    liverpool: { ru: 'Ливерпуль', en: 'Liverpool' },
    bristol: { ru: 'Бристоль', en: 'Bristol' },
    sheffield: { ru: 'Шеффилд', en: 'Sheffield' },
    leeds: { ru: 'Лидс', en: 'Leeds' },
    newcastle: { ru: 'Ньюкасл', en: 'Newcastle' },
    aberdeen: { ru: 'Абердин', en: 'Aberdeen' },
    cardiff: { ru: 'Кардифф', en: 'Cardiff' },
    swansea: { ru: 'Суонси', en: 'Swansea' },
    plymouth: { ru: 'Плимут', en: 'Plymouth' },
    southampton: { ru: 'Саутгемптон', en: 'Southampton' },
    dover: { ru: 'Дувр', en: 'Dover' },
    felixstowe: { ru: 'Феликстоу', en: 'Felixstowe' },
    cambridge: { ru: 'Кембридж', en: 'Cambridge' },
    carlisle: { ru: 'Карлайл', en: 'Carlisle' },
    grimsby: { ru: 'Гримсби', en: 'Grimsby' },

    // Италия (ETS2)
    roma: { ru: 'Рим', en: 'Rome' },
    rome: { ru: 'Рим', en: 'Rome' },
    milano: { ru: 'Милан', en: 'Milan' },
    milan: { ru: 'Милан', en: 'Milan' },
    napoli: { ru: 'Неаполь', en: 'Naples' },
    naples: { ru: 'Неаполь', en: 'Naples' },
    torino: { ru: 'Турин', en: 'Turin' },
    turin: { ru: 'Турин', en: 'Turin' },
    firenze: { ru: 'Флоренция', en: 'Florence' },
    florence: { ru: 'Флоренция', en: 'Florence' },
    venezia: { ru: 'Венеция', en: 'Venice' },
    venice: { ru: 'Венеция', en: 'Venice' },
    bologna: { ru: 'Болонья', en: 'Bologna' },
    genova: { ru: 'Генуя', en: 'Genoa' },
    genoa: { ru: 'Генуя', en: 'Genoa' },
    verona: { ru: 'Верона', en: 'Verona' },
    palermo: { ru: 'Палермо', en: 'Palermo' },
    catania: { ru: 'Катания', en: 'Catania' },
    messina: { ru: 'Мессина', en: 'Messina' },
    bari: { ru: 'Бари', en: 'Bari' },
    taranto: { ru: 'Таранто', en: 'Taranto' },
    ancona: { ru: 'Анкона', en: 'Ancona' },
    trieste: { ru: 'Триест', en: 'Trieste' },
    parma: { ru: 'Парма', en: 'Parma' },
    livorno: { ru: 'Ливорно', en: 'Livorno' },
    cagliari: { ru: 'Кальяри', en: 'Cagliari' },
    sassari: { ru: 'Сассари', en: 'Sassari' },
    pescara: { ru: 'Пескара', en: 'Pescara' },

    // Чехия и Словакия (ETS2)
    praha: { ru: 'Прага', en: 'Prague' },
    prague: { ru: 'Прага', en: 'Prague' },
    brno: { ru: 'Брно', en: 'Brno' },
    ostrava: { ru: 'Острава', en: 'Ostrava' },
    plzen: { ru: 'Пльзень', en: 'Plzeň' },
    bratislava: { ru: 'Братислава', en: 'Bratislava' },
    kosice: { ru: 'Кошице', en: 'Košice' },
    banskabystrica: { ru: 'Банска-Бистрица', en: 'Banská Bystrica' },

    // Польша (ETS2)
    warszawa: { ru: 'Варшава', en: 'Warsaw' },
    warsaw: { ru: 'Варшава', en: 'Warsaw' },
    krakow: { ru: 'Краков', en: 'Kraków' },
    lodz: { ru: 'Лодзь', en: 'Łódź' },
    wroclaw: { ru: 'Вроцлав', en: 'Wrocław' },
    poznan: { ru: 'Познань', en: 'Poznań' },
    gdansk: { ru: 'Гданьск', en: 'Gdańsk' },
    szczecin: { ru: 'Щецин', en: 'Szczecin' },
    bydgoszcz: { ru: 'Быдгощ', en: 'Bydgoszcz' },
    lublin: { ru: 'Люблин', en: 'Lublin' },
    katowice: { ru: 'Катовице', en: 'Katowice' },
    bialystok: { ru: 'Белосток', en: 'Białystok' },
    olsztyn: { ru: 'Ольштын', en: 'Olsztyn' },

    // Австрия и Швейцария (ETS2)
    wien: { ru: 'Вена', en: 'Vienna' },
    vienna: { ru: 'Вена', en: 'Vienna' },
    graz: { ru: 'Грац', en: 'Graz' },
    linz: { ru: 'Линц', en: 'Linz' },
    salzburg: { ru: 'Зальцбург', en: 'Salzburg' },
    innsbruck: { ru: 'Инсбрук', en: 'Innsbruck' },
    klagenfurt: { ru: 'Клагенфурт', en: 'Klagenfurt' },
    bern: { ru: 'Берн', en: 'Bern' },
    zurich: { ru: 'Цюрих', en: 'Zurich' },
    geneve: { ru: 'Женева', en: 'Geneva' },
    geneva: { ru: 'Женева', en: 'Geneva' },
    basel: { ru: 'Базель', en: 'Basel' },

    // Скандинавия и Исландия (DLC Coaches & Nordic Horizons)
    stockholm: { ru: 'Стокгольм', en: 'Stockholm' },
    goteborg: { ru: 'Гётеборг', en: 'Gothenburg' },
    gothenburg: { ru: 'Гётеборг', en: 'Gothenburg' },
    malmo: { ru: 'Мальмё', en: 'Malmö' },
    uppsala: { ru: 'Уппсала', en: 'Uppsala' },
    jonkoping: { ru: 'Йёнчёпинг', en: 'Jönköping' },
    linkoping: { ru: 'Линчёпинг', en: 'Linköping' },
    orebro: { ru: 'Эребру', en: 'Örebro' },
    vasteras: { ru: 'Вестерос', en: 'Västerås' },
    oslo: { ru: 'Осло', en: 'Oslo' },
    bergen: { ru: 'Берген', en: 'Bergen' },
    stavanger: { ru: 'Ставангер', en: 'Stavanger' },
    kristiansand: { ru: 'Кристиансанн', en: 'Kristiansand' },
    kobenhavn: { ru: 'Копенгаген', en: 'Copenhagen' },
    copenhagen: { ru: 'Копенгаген', en: 'Copenhagen' },
    aarhus: { ru: 'Орхус', en: 'Aarhus' },
    odense: { ru: 'Оденсе', en: 'Odense' },
    aalborg: { ru: 'Ольборг', en: 'Aalborg' },
    helsinki: { ru: 'Хельсинки', en: 'Helsinki' },
    turku: { ru: 'Турку', en: 'Turku' },
    tampere: { ru: 'Тампере', en: 'Tampere' },
    lahti: { ru: 'Лахти', en: 'Lahti' },
    oulu: { ru: 'Оулу', en: 'Oulu' },
    vaasa: { ru: 'Вааса', en: 'Vaasa' },
    rovaniemi: { ru: 'Рованиеми', en: 'Rovaniemi' },
    reykjavik: { ru: 'Рейкьявик', en: 'Reykjavík' },
    akureyri: { ru: 'Акюрейри', en: 'Akureyri' },
    jokulsarlon: { ru: 'Йёкюльсаурлоун', en: 'Jökulsárlón' },
    seydisfjordur: { ru: 'Сейдисфьордюр', en: 'Seyðisfjörður' },
    vik: { ru: 'Вик', en: 'Vík' },
    keflavik: { ru: 'Кеблавик', en: 'Keflavík' },
    egilsstadir: { ru: 'Эгильсстадир', en: 'Egilsstaðir' },
    isafjordur: { ru: 'Исафьордюр', en: 'Ísafjörður' },

    // Страны Балтии (ETS2)
    tallinn: { ru: 'Таллин', en: 'Tallinn' },
    tartu: { ru: 'Тарту', en: 'Tartu' },
    parnu: { ru: 'Пярну', en: 'Pärnu' },
    narva: { ru: 'Нарва', en: 'Narva' },
    riga: { ru: 'Рига', en: 'Riga' },
    daugavpils: { ru: 'Даугавпилс', en: 'Daugavpils' },
    liepaja: { ru: 'Лиепая', en: 'Liepāja' },
    ventspils: { ru: 'Вентспилс', en: 'Ventspils' },
    valmiera: { ru: 'Валмиера', en: 'Valmiera' },
    vilnius: { ru: 'Вильнюс', en: 'Vilnius' },
    kaunas: { ru: 'Каунас', en: 'Kaunas' },
    klaipeda: { ru: 'Клайпеда', en: 'Klaipėda' },
    panevezys: { ru: 'Паневежис', en: 'Panevėžys' },
    siauliai: { ru: 'Шяуляй', en: 'Šiauliai' },
    utena: { ru: 'Утена', en: 'Utena' },

    // Балканы, Румыния, Болгария, Турция (ETS2)
    beograd: { ru: 'Белград', en: 'Belgrade' },
    belgrade: { ru: 'Белград', en: 'Belgrade' },
    zagreb: { ru: 'Загреб', en: 'Zagreb' },
    sarajevo: { ru: 'Сараево', en: 'Sarajevo' },
    ljubljana: { ru: 'Любляна', en: 'Ljubljana' },
    skopje: { ru: 'Скопье', en: 'Skopje' },
    podgorica: { ru: 'Подгорица', en: 'Podgorica' },
    pristina: { ru: 'Приштина', en: 'Pristina' },
    tirana: { ru: 'Тирана', en: 'Tirana' },
    sofia: { ru: 'София', en: 'Sofia' },
    plovdiv: { ru: 'Пловдив', en: 'Plovdiv' },
    varna: { ru: 'Варна', en: 'Varna' },
    burgas: { ru: 'Бургас', en: 'Burgas' },
    ruse: { ru: 'Русе', en: 'Ruse' },
    bucuresti: { ru: 'Бухарест', en: 'Bucharest' },
    bucharest: { ru: 'Бухарест', en: 'Bucharest' },
    clujnapoca: { ru: 'Клуж-Напока', en: 'Cluj-Napoca' },
    timisoara: { ru: 'Тимишоара', en: 'Timișoara' },
    iasi: { ru: 'Яссы', en: 'Iași' },
    constanta: { ru: 'Констанца', en: 'Constanța' },
    brasov: { ru: 'Брашов', en: 'Brașov' },
    craiova: { ru: 'Крайова', en: 'Craiova' },
    galati: { ru: 'Галац', en: 'Galați' },
    istanbul: { ru: 'Стамбул', en: 'Istanbul' },
    edirne: { ru: 'Эдирне', en: 'Edirne' },
    tekirdag: { ru: 'Текирдаг', en: 'Tekirdağ' },

    // Греция (ETS2)
    athens: { ru: 'Афины', en: 'Athens' },
    athina: { ru: 'Афины', en: 'Athens' },
    thessaloniki: { ru: 'Салоники', en: 'Thessaloniki' },
    patras: { ru: 'Патры', en: 'Patras' },
    patra: { ru: 'Патры', en: 'Patras' },
    heraklion: { ru: 'Ираклион', en: 'Heraklion' },
    irakleio: { ru: 'Ираклион', en: 'Heraklion' },
    larissa: { ru: 'Лариса', en: 'Larissa' },
    volos: { ru: 'Волос', en: 'Volos' },
    rhodes: { ru: 'Родос', en: 'Rhodes' },
    rodos: { ru: 'Родос', en: 'Rhodes' },
    chania: { ru: 'Ханья', en: 'Chania' },
    ioannina: { ru: 'Янина', en: 'Ioannina' },
    kavala: { ru: 'Кавала', en: 'Kavala' },

    // Пиренейский полуостров (Iberia)
    madrid: { ru: 'Мадрид', en: 'Madrid' },
    barcelona: { ru: 'Барселона', en: 'Barcelona' },
    valencia: { ru: 'Валенсия', en: 'Valencia' },
    sevilla: { ru: 'Севилья', en: 'Seville' },
    seville: { ru: 'Севилья', en: 'Seville' },
    zaragoza: { ru: 'Сарагоса', en: 'Zaragoza' },
    malaga: { ru: 'Малага', en: 'Málaga' },
    murcia: { ru: 'Мурсия', en: 'Murcia' },
    bilbao: { ru: 'Бильбао', en: 'Bilbao' },
    alicante: { ru: 'Аликанте', en: 'Alicante' },
    cordoba: { ru: 'Кордова', en: 'Córdoba' },
    valladolid: { ru: 'Вальядолид', en: 'Valladolid' },
    vigo: { ru: 'Виго', en: 'Vigo' },
    gijon: { ru: 'Хихон', en: 'Gijón' },
    granada: { ru: 'Гранада', en: 'Granada' },
    acoruna: { ru: 'Ла-Корунья', en: 'A Coruña' },
    santander: { ru: 'Сантандер', en: 'Santander' },
    burgos: { ru: 'Бургос', en: 'Burgos' },
    salamanca: { ru: 'Саламанка', en: 'Salamanca' },
    albacete: { ru: 'Альбасете', en: 'Albacete' },
    almeria: { ru: 'Альмерия', en: 'Almería' },
    badajoz: { ru: 'Бадахос', en: 'Badajoz' },
    huelva: { ru: 'Уэльва', en: 'Huelva' },
    lisboa: { ru: 'Лиссабон', en: 'Lisbon' },
    lisbon: { ru: 'Лиссабон', en: 'Lisbon' },
    porto: { ru: 'Порту', en: 'Porto' },
    coimbra: { ru: 'Коимбра', en: 'Coimbra' },
    faro: { ru: 'Фару', en: 'Faro' },
    braga: { ru: 'Брага', en: 'Braga' },
    evora: { ru: 'Эвора', en: 'Évora' },

    // Россия (Балтика / RusMap)
    saintpetersburg: { ru: 'Санкт-Петербург', en: 'Saint Petersburg' },
    spb: { ru: 'Санкт-Петербург', en: 'Saint Petersburg' },
    moscow: { ru: 'Москва', en: 'Moscow' },
    pskov: { ru: 'Псков', en: 'Pskov' },
    luga: { ru: 'Луга', en: 'Luga' },
    sosnovybor: { ru: 'Сосновый Бор', en: 'Sosnovy Bor' },
    vyborg: { ru: 'Выборг', en: 'Vyborg' },
    velikiynovgorod: { ru: 'Великий Новгород', en: 'Veliky Novgorod' },
    tver: { ru: 'Тверь', en: 'Tver' },
    smolensk: { ru: 'Смоленск', en: 'Smolensk' },
    kaluga: { ru: 'Калуга', en: 'Kaluga' },
    bryansk: { ru: 'Брянск', en: 'Bryansk' },
    oryol: { ru: 'Орёл', en: 'Oryol' },
    kursk: { ru: 'Курск', en: 'Kursk' },
    voronezh: { ru: 'Воронеж', en: 'Voronezh' },
    rostovondon: { ru: 'Ростов-на-Дону', en: 'Rostov-on-Don' },

    // США (American Truck Simulator)
    losangeles: { ru: 'Лос-Анджелес', en: 'Los Angeles' },
    sanfrancisco: { ru: 'Сан-Франциско', en: 'San Francisco' },
    sandiego: { ru: 'Сан-Диего', en: 'San Diego' },
    sacramento: { ru: 'Сакраменто', en: 'Sacramento' },
    fresno: { ru: 'Фресно', en: 'Fresno' },
    bakersfield: { ru: 'Бейкерсфилд', en: 'Bakersfield' },
    oakland: { ru: 'Окленд', en: 'Oakland' },
    sanjose: { ru: 'Сан-Хосе', en: 'San Jose' },
    lasvegas: { ru: 'Лас-Вегас', en: 'Las Vegas' },
    reno: { ru: 'Рино', en: 'Reno' },
    carsoncity: { ru: 'Карсон-Сити', en: 'Carson City' },
    elko: { ru: 'Элко', en: 'Elko' },
    phoenix: { ru: 'Финикс', en: 'Phoenix' },
    tucson: { ru: 'Тусон', en: 'Tucson' },
    flagstaff: { ru: 'Флагстафф', en: 'Flagstaff' },
    yuma: { ru: 'Юма', en: 'Yuma' },
    albuquerque: { ru: 'Альбукерке', en: 'Albuquerque' },
    santafe: { ru: 'Санта-Фе', en: 'Santa Fe' },
    lascruces: { ru: 'Лас-Крусес', en: 'Las Cruces' },
    roswell: { ru: 'Розуэлл', en: 'Roswell' },
    portland: { ru: 'Портленд', en: 'Portland' },
    salem: { ru: 'Сейлем', en: 'Salem' },
    eugene: { ru: 'Юджин', en: 'Eugene' },
    bend: { ru: 'Бенд', en: 'Bend' },
    medford: { ru: 'Медфорд', en: 'Medford' },
    seattle: { ru: 'Сиэтл', en: 'Seattle' },
    spokane: { ru: 'Спокан', en: 'Spokane' },
    tacoma: { ru: 'Такома', en: 'Tacoma' },
    olympia: { ru: 'Олимпия', en: 'Olympia' },
    yakima: { ru: 'Якима', en: 'Yakima' },
    bellingham: { ru: 'Беллингхем', en: 'Bellingham' },
    saltlakecity: { ru: 'Солт-Лейк-Сити', en: 'Salt Lake City' },
    provo: { ru: 'Прово', en: 'Provo' },
    ogden: { ru: 'Огден', en: 'Ogden' },
    stgeorge: { ru: 'Сент-Джордж', en: 'St. George' },
    boise: { ru: 'Бойсе', en: 'Boise' },
    idahofalls: { ru: 'Айдахо-Фолс', en: 'Idaho Falls' },
    pocatello: { ru: 'Покателло', en: 'Pocatello' },
    twinfalls: { ru: 'Твин-Фолс', en: 'Twin Falls' },
    denver: { ru: 'Денвер', en: 'Denver' },
    coloradosprings: { ru: 'Колорадо-Спрингс', en: 'Colorado Springs' },
    pueblo: { ru: 'Пуэбло', en: 'Pueblo' },
    fortcollins: { ru: 'Форт-Коллинз', en: 'Fort Collins' },
    grandjunction: { ru: 'Гранд-Джанкшен', en: 'Grand Junction' },
    cheyenne: { ru: 'Шайенн', en: 'Cheyenne' },
    casper: { ru: 'Каспер', en: 'Casper' },
    laramie: { ru: 'Ларами', en: 'Laramie' },
    billings: { ru: 'Биллингс', en: 'Billings' },
    missoula: { ru: 'Мизула', en: 'Missoula' },
    helena: { ru: 'Хелена', en: 'Helena' },
    bozeman: { ru: 'Бозмен', en: 'Bozeman' },
    greatfalls: { ru: 'Грейт-Фолс', en: 'Great Falls' },
    houston: { ru: 'Хьюстон', en: 'Houston' },
    dallas: { ru: 'Даллас', en: 'Dallas' },
    austin: { ru: 'Остин', en: 'Austin' },
    sanantonio: { ru: 'Сан-Антонио', en: 'San Antonio' },
    elpaso: { ru: 'Эль-Пасо', en: 'El Paso' },
    fortworth: { ru: 'Форт-Уэрт', en: 'Fort Worth' },
    lubbock: { ru: 'Лаббок', en: 'Lubbock' },
    amarillo: { ru: 'Амарилло', en: 'Amarillo' },
    corpuschristi: { ru: 'Корпус-Кристи', en: 'Corpus Christi' },
    laredo: { ru: 'Ларедо', en: 'Laredo' },
    oklahomacity: { ru: 'Оклахома-Сити', en: 'Oklahoma City' },
    tulsa: { ru: 'Талса', en: 'Tulsa' },
    lawton: { ru: 'Лотон', en: 'Lawton' },
    wichita: { ru: 'Уичито', en: 'Wichita' },
    topeka: { ru: 'Топика', en: 'Topeka' },
    kansascity: { ru: 'Канзас-Сити', en: 'Kansas City' },
    omaha: { ru: 'Омаха', en: 'Omaha' },
    lincoln: { ru: 'Линкольн', en: 'Lincoln' },
    littlerock: { ru: 'Литл-Рок', en: 'Little Rock' }
  };

  const RUSSIAN_TO_ENGLISH_CITIES_DB = Object.create(null);
  Object.keys(CITIES_DB).forEach((key) => {
    const entry = CITIES_DB[key];
    if (entry && entry.ru && entry.en) {
      RUSSIAN_TO_ENGLISH_CITIES_DB[entry.ru.toLowerCase()] = entry.en;
    }
  });

  /* ==========================================================================
     ФОНЕТИЧЕСКАЯ ТРАНСЛИТЕРАЦИЯ (LATIN <-> CYRILLIC) ДЛЯ РЕДКИХ ГОРОДОВ И МОДОВ
     ========================================================================== */
  function transliterateLatinToCyrillic(str) {
    if (!str || typeof str !== 'string') return '';
    let text = str;

    const multiMap = [
      [/tsch/gi, 'ч'],
      [/tion/gi, 'шн'],
      [/sion/gi, 'жн'],
      [/sch/gi, 'ш'],
      [/shh/gi, 'щ'],
      [/sh/gi, 'ш'],
      [/ch/gi, 'ч'],
      [/zh/gi, 'ж'],
      [/th/gi, 'т'],
      [/kh/gi, 'х'],
      [/ph/gi, 'ф'],
      [/ck/gi, 'к'],
      [/ts/gi, 'ц'],
      [/tz/gi, 'ц'],
      [/qu/gi, 'кв'],
      [/ee/gi, 'и'],
      [/oo/gi, 'у'],
      [/ya/gi, 'я'],
      [/yu/gi, 'ю'],
      [/yo/gi, 'ё'],
      [/ye/gi, 'е'],
      [/ei/gi, 'эй'],
      [/ai/gi, 'ай'],
      [/ay/gi, 'ай'],
      [/ey/gi, 'ей'],
      [/oy/gi, 'ой'],
      [/ij/gi, 'ей']
    ];

    multiMap.forEach(([regex, repl]) => {
      text = text.replace(regex, (match) => {
        if (match === match.toUpperCase()) return repl.toUpperCase();
        if (match[0] === match[0].toUpperCase()) return repl.charAt(0).toUpperCase() + repl.slice(1);
        return repl;
      });
    });

    const diacriticsMap = {
      'ä': 'э', 'Ä': 'Э', 'ö': 'ё', 'Ö': 'Ё', 'ü': 'ю', 'Ü': 'Ю',
      'å': 'о', 'Å': 'О', 'æ': 'э', 'Æ': 'Э', 'ø': 'ё', 'Ø': 'Ё',
      'é': 'е', 'É': 'Е', 'è': 'е', 'È': 'Е', 'ê': 'е', 'Ê': 'Е', 'ë': 'ё', 'Ë': 'Ё',
      'á': 'а', 'Á': 'А', 'à': 'а', 'À': 'А', 'í': 'и', 'Í': 'И', 'ó': 'о', 'Ó': 'О',
      'ú': 'у', 'Ú': 'У', 'ý': 'и', 'Ý': 'И', 'č': 'ч', 'Č': 'Ч', 'š': 'ш', 'Š': 'Ш',
      'ž': 'ж', 'Ž': 'Ж', 'ř': 'рж', 'Ř': 'Рж', 'ď': 'дь', 'Ď': 'Дь', 'ť': 'ть', 'Ť': 'Ть',
      'ň': 'нь', 'Ň': 'Нь', 'ł': 'л', 'Ł': 'Л', 'ń': 'нь', 'Ń': 'Нь', 'ś': 'сь', 'Ś': 'Сь',
      'ź': 'зь', 'Ź': 'Зь', 'ż': 'ж', 'Ż': 'Ж', 'ş': 'ш', 'Ş': 'Ш', 'ğ': 'г', 'Ğ': 'Г',
      'ç': 'ч', 'Ç': 'Ч', 'ð': 'д', 'Ð': 'Д', 'þ': 'т', 'Þ': 'Т'
    };

    text = text.replace(/[^\u0000-\u007F]/g, (char) => diacriticsMap[char] || char);

    const singleMap = {
      'a': 'а', 'b': 'б', 'c': 'к', 'd': 'д', 'e': 'е', 'f': 'ф', 'g': 'г',
      'h': 'х', 'i': 'и', 'j': 'й', 'k': 'к', 'l': 'л', 'm': 'м', 'n': 'н',
      'o': 'о', 'p': 'п', 'q': 'к', 'r': 'р', 's': 'с', 't': 'т', 'u': 'у',
      'v': 'в', 'w': 'в', 'x': 'кс', 'y': 'и', 'z': 'з',
      'A': 'А', 'B': 'Б', 'C': 'К', 'D': 'Д', 'E': 'Е', 'F': 'Ф', 'G': 'Г',
      'H': 'Х', 'I': 'И', 'J': 'Й', 'K': 'К', 'L': 'Л', 'M': 'М', 'N': 'Н',
      'O': 'О', 'P': 'П', 'Q': 'К', 'R': 'Р', 'S': 'С', 'T': 'Т', 'U': 'У',
      'V': 'В', 'W': 'В', 'X': 'Кс', 'Y': 'И', 'Z': 'З'
    };

    return text.replace(/[a-zA-Z]/g, (ch) => singleMap[ch] || ch);
  }

  function transliterateCyrillicToLatin(str) {
    if (!str || typeof str !== 'string') return '';
    let text = str;

    const multiMap = [
      [/щ/gi, 'shch'],
      [/ш/gi, 'sh'],
      [/ч/gi, 'ch'],
      [/ж/gi, 'zh'],
      [/х/gi, 'kh'],
      [/ц/gi, 'ts'],
      [/ю/gi, 'yu'],
      [/я/gi, 'ya'],
      [/ё/gi, 'yo']
    ];

    multiMap.forEach(([regex, repl]) => {
      text = text.replace(regex, (match) => {
        if (match === match.toUpperCase()) return repl.toUpperCase();
        if (match[0] === match[0].toUpperCase()) return repl.charAt(0).toUpperCase() + repl.slice(1);
        return repl;
      });
    });

    const singleMap = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'з': 'z',
      'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
      'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'ъ': '',
      'ы': 'y', 'ь': '', 'э': 'e',
      'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'З': 'Z',
      'И': 'I', 'Й': 'Y', 'К': 'K', 'L': 'L', 'М': 'M', 'N': 'N', 'О': 'O',
      'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Ъ': '',
      'Ы': 'Y', 'Ь': '', 'Э': 'E'
    };

    return text.replace(/[а-яА-ЯёЁ]/g, (ch) => singleMap[ch] !== undefined ? singleMap[ch] : ch);
  }

  function formatToTitleCase(str) {
    if (!str || typeof str !== 'string') return '';
    return str.replace(/\b[\wа-яА-ЯёЁ]+/g, (word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  }

  function normalizeCityKey(str) {
    if (!str || typeof str !== 'string') return '';
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  function localizePlaceName(rawDisplay, rawId, targetLang) {
    const rawClean = cleanStopOrPlaceIdentifier(rawDisplay);
    const idClean = cleanStopOrPlaceIdentifier(rawId);

    if (!rawClean && !idClean) return '';

    const effectiveTargetLang = (targetLang === 'en' || targetLang === 'ru') ? targetLang : 'ru';

    const keyCandidates = [
      normalizeCityKey(idClean),
      normalizeCityKey(rawClean),
      normalizeCityKey(rawId),
      normalizeCityKey(rawDisplay)
    ].filter(Boolean);

    let dictMatch = null;
    for (let i = 0; i < keyCandidates.length; i += 1) {
      const k = keyCandidates[i];
      if (CITIES_DB[k]) {
        dictMatch = CITIES_DB[k];
        break;
      }
    }

    const hasCyrillicInDisplay = /[а-яё]/i.test(rawClean);

    if (effectiveTargetLang === 'ru') {
      if (hasCyrillicInDisplay) {
        return rawClean;
      }
      if (dictMatch && dictMatch.ru) {
        return dictMatch.ru;
      }
      const baseStr = rawClean || idClean;
      return transliterateLatinToCyrillic(formatToTitleCase(baseStr));
    } else {
      if (dictMatch && dictMatch.en) {
        return dictMatch.en;
      }
      if (hasCyrillicInDisplay) {
        const ruLower = rawClean.toLowerCase();
        if (RUSSIAN_TO_ENGLISH_CITIES_DB[ruLower]) {
          return RUSSIAN_TO_ENGLISH_CITIES_DB[ruLower];
        }
        return formatToTitleCase(transliterateCyrillicToLatin(rawClean));
      }
      const baseStr = idClean || rawClean;
      return formatToTitleCase(baseStr);
    }
  }

  function cleanAndFormatStopOrCompany(rawText, targetLang) {
    if (!rawText || typeof rawText !== 'string') return '';
    const clean = rawText.trim();
    if (!isValidPlaceName(clean)) return '';

    const isStopToken = /^(?:stop|station|terminal)[._\-\s]+/i.test(clean) ||
                        /[._\-\s]+(?:bus[._\-\s]*(?:station|stop)|terminal|station)$/i.test(clean) ||
                        /^[a-z0-9]+_[a-z0-9]+$/i.test(clean);

    if (isStopToken) {
      const loc = localizePlaceName(clean, '', targetLang);
      if (loc) return loc;
    }

    if (targetLang === 'en') {
      if (/[а-яё]/i.test(clean)) {
        const ruLower = clean.toLowerCase();
        if (RUSSIAN_TO_ENGLISH_CITIES_DB[ruLower]) return RUSSIAN_TO_ENGLISH_CITIES_DB[ruLower];
        return formatToTitleCase(transliterateCyrillicToLatin(clean));
      }
      return clean.replace(/_+/g, ' ').trim();
    } else {
      const norm = normalizeCityKey(clean);
      if (CITIES_DB[norm] && CITIES_DB[norm].ru) {
        return CITIES_DB[norm].ru;
      }
      return clean.replace(/_+/g, ' ').trim();
    }
  }

  /* ==========================================================================
     СЛОВАРЬ ГРУЗОВ (CARGO TRANSLATIONS)
     ========================================================================== */
  const CARGO_TRANSLATIONS = {
    passengers: { ru: 'Пассажирский рейс', en: 'Passengers' },
    passenger: { ru: 'Пассажирский рейс', en: 'Passengers' },
    electronics: { ru: 'Электроника', en: 'Electronics' },
    apples: { ru: 'Яблоки', en: 'Apples' },
    cars: { ru: 'Автомобили', en: 'Cars' },
    diesel: { ru: 'Дизель', en: 'Diesel' },
    petrol: { ru: 'Бензин', en: 'Petrol' },
    gasoline: { ru: 'Бензин', en: 'Gasoline' },
    grain: { ru: 'Зерно', en: 'Grain' },
    wheat: { ru: 'Пшеница', en: 'Wheat' },
    barley: { ru: 'Ячмень', en: 'Barley' },
    milk: { ru: 'Молоко', en: 'Milk' },
    flour: { ru: 'Мука', en: 'Flour' },
    meat: { ru: 'Мясо', en: 'Meat' },
    pork: { ru: 'Свинина', en: 'Pork' },
    beef: { ru: 'Говядина', en: 'Beef' },
    chicken: { ru: 'Курица', en: 'Chicken' },
    fish: { ru: 'Рыба', en: 'Fish' },
    potatoes: { ru: 'Картофель', en: 'Potatoes' },
    tomatoes: { ru: 'Помидоры', en: 'Tomatoes' },
    sugar: { ru: 'Сахар', en: 'Sugar' },
    salt: { ru: 'Соль', en: 'Salt' },
    timber: { ru: 'Бревна', en: 'Timber' },
    logs: { ru: 'Бревна', en: 'Logs' },
    lumber: { ru: 'Пиломатериалы', en: 'Lumber' },
    wood: { ru: 'Древесина', en: 'Wood' },
    wood_chips: { ru: 'Древесная щепа', en: 'Wood Chips' },
    woodchips: { ru: 'Древесная щепа', en: 'Wood Chips' },
    gravel: { ru: 'Гравий', en: 'Gravel' },
    sand: { ru: 'Песок', en: 'Sand' },
    coal: { ru: 'Уголь', en: 'Coal' },
    iron: { ru: 'Железо', en: 'Iron' },
    steel: { ru: 'Сталь', en: 'Steel' },
    copper: { ru: 'Медь', en: 'Copper' },
    chemicals: { ru: 'Химикаты', en: 'Chemicals' },
    fertilizer: { ru: 'Удобрения', en: 'Fertilizer' },
    furniture: { ru: 'Мебель', en: 'Furniture' },
    glass: { ru: 'Стекло', en: 'Glass' },
    tires: { ru: 'Шины', en: 'Tires' },
    paper: { ru: 'Бумага', en: 'Paper' },
    beverages: { ru: 'Напитки', en: 'Beverages' },
    clothes: { ru: 'Одежда', en: 'Clothes' },
    toys: { ru: 'Игрушки', en: 'Toys' },
    explosives: { ru: 'Взрывчатка', en: 'Explosives' },
    fireworks: { ru: 'Фейерверки', en: 'Fireworks' },
    yacht: { ru: 'Яхта', en: 'Yacht' },
    tractor: { ru: 'Трактор', en: 'Tractor' },
    excavator: { ru: 'Экскаватор', en: 'Excavator' },
    bulldozer: { ru: 'Бульдозер', en: 'Bulldozer' },
    heavy_machinery: { ru: 'Тяжелая техника', en: 'Heavy Machinery' },
    medical_supplies: { ru: 'Медикаменты', en: 'Medical Supplies' },
    vaccines: { ru: 'Вакцины', en: 'Vaccines' }
  };

  const RUSSIAN_TO_ENGLISH_CARGO_DB = Object.create(null);
  Object.keys(CARGO_TRANSLATIONS).forEach((key) => {
    const entry = CARGO_TRANSLATIONS[key];
    if (entry && entry.ru && entry.en) {
      RUSSIAN_TO_ENGLISH_CARGO_DB[entry.ru.toLowerCase()] = entry.en;
    }
  });

  function localizeCargoName(rawCargo, targetLang) {
    if (!rawCargo || typeof rawCargo !== 'string') return '';
    const clean = rawCargo.trim();
    if (!clean) return '';

    const effectiveTargetLang = (targetLang === 'en' || targetLang === 'ru') ? targetLang : 'ru';
    const norm = clean.toLowerCase().replace(/[\s\-_]+/g, '_');
    const normAlpha = clean.toLowerCase().replace(/[^a-z0-9]/g, '');

    const dictMatch = CARGO_TRANSLATIONS[norm] || CARGO_TRANSLATIONS[normAlpha];
    const hasCyrillic = /[а-яё]/i.test(clean);

    if (effectiveTargetLang === 'ru') {
      if (hasCyrillic) return clean;
      if (dictMatch && dictMatch.ru) return dictMatch.ru;
      if (clean.toLowerCase() === 'passengers' || clean.toLowerCase() === 'passenger') return t('coachPassengerRoute');
      return transliterateLatinToCyrillic(formatToTitleCase(clean));
    } else {
      if (dictMatch && dictMatch.en) return dictMatch.en;
      if (hasCyrillic) {
        const ruLower = clean.toLowerCase();
        if (RUSSIAN_TO_ENGLISH_CARGO_DB[ruLower]) return RUSSIAN_TO_ENGLISH_CARGO_DB[ruLower];
        return formatToTitleCase(transliterateCyrillicToLatin(clean));
      }
      return formatToTitleCase(clean.replace(/_+/g, ' '));
    }
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

  function extractRawCargoName(data) {
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

  function extractCargoName(data) {
    const raw = extractRawCargoName(data);
    if (!raw) return '';
    return localizeCargoName(raw, lang);
  }

  function resolveTrailerAndCargoState(data, jobState) {
    const cargoName = extractCargoName(data);
    const cargoLower = (cargoName || '').toLowerCase();
    const isCargoPassengers = cargoLower.includes('пассажир') || cargoLower.includes('passenger');
    const massKg = jobState && jobState.massKg;
    const massText = (massKg !== null && massKg !== undefined && Number.isFinite(massKg) && massKg > 0)
      ? formatCargoMassTons(massKg)
      : '';

    // Эталонная проверка автобусного рейса (DLC Coaches / bus_job):
    // При наличии реального груза с массой (не пассажиры) - это всегда грузовой рейс!
    const isBusJob = Boolean(
      (jobState && jobState.isBusJob) ||
      (data && (data.isBusJob || data.busJob || (data.trip && (data.trip.isBusJob || data.trip.busJob || data.trip.marketType === 'bus_job')))) ||
      (data && data.cfg && data.cfg.job && (data.cfg.job.busJob || data.cfg.job.isBusJob || data.cfg.job.market === 'bus_job')) ||
      isCargoPassengers
    ) && (!cargoName || isCargoPassengers || (massKg === 0 && !cargoName));

    if (isBusJob) {
      const busSat = parseFiniteTelemetryNumber(
        data.busSat ?? (data.tel && data.tel.busSat) ?? (data.trip && data.trip.busSat) ?? (data.cfg && data.cfg.bus && data.cfg.bus.satisfaction)
      );
      let passengerText = t('coachPassengerRoute');
      if (busSat !== null && busSat > 0) {
        const satPct = Math.round(busSat > 1 ? busSat : busSat * 100);
        passengerText = `${t('coachPassengerRoute')} • ${t('comfortLabel')}: ${satPct}%`;
      }
      return {
        connected: true,
        hasCargo: true,
        text: passengerText,
        title: t('coachPassengerTitle'),
        statusClass: 'is-ok'
      };
    }

    if (cargoName) {
      const upperCargo = cargoName.toUpperCase();
      const cargoWithMass = massText ? `${upperCargo} • ${massText}` : upperCargo;
      return {
        connected: true,
        hasCargo: true,
        text: cargoWithMass,
        title: `${t('cargoPrefix')} ${upperCargo}${massText ? ' (' + massText + ')' : ''}`,
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

    let modelText = t('truckStandby');
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
    return `${barVal.toFixed(1)} ${t('barUnit')}`;
  }

  function formatAdblueLiters(rawAdblue) {
    const val = parseFiniteTelemetryNumber(rawAdblue);
    if (val === null || val < 0) return '--';
    return `${Math.round(val)} ${t('l')}`;
  }

  function formatBatteryVoltage(rawBattery) {
    const val = parseFiniteTelemetryNumber(rawBattery);
    if (val === null || val < 0) return '--';
    return `${val.toFixed(1)} ${t('voltUnit')}`;
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
        const picked = pickValidPlaceText([val]);
        if (picked) return picked;
      } else if (typeof node === 'string' && propName === 'city') {
        const picked = pickValidPlaceText([node]);
        if (picked) return picked;
      }
    }

    const flatPicked = pickValidPlaceText([
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

  function extractEndpointIdFromContainer(container, kind) {
    if (!container || typeof container !== 'object' || isContainerJobInactive(container)) {
      return '';
    }
    const stopKind = kind === 'source' ? 'source_stop' : 'destination_stop';
    const stopKindCamel = kind === 'source' ? 'sourceStop' : 'destinationStop';

    const candidates = [
      container[`${kind}CityId`],
      container[`${kind}.cityId`],
      container[`${kind}.id`],
      container[`${kind}Id`],
      container[`${stopKindCamel}CityId`],
      container[`${stopKind}.id`],
      container[`${stopKindCamel}.id`],
      container[kind] && (container[kind].cityId || container[kind].id),
      container[stopKind] && (container[stopKind].cityId || container[stopKind].id),
      container[stopKindCamel] && (container[stopKindCamel].cityId || container[stopKindCamel].id),
      container.bus && container.bus[stopKindCamel] && (container.bus[stopKindCamel].cityId || container.bus[stopKindCamel].id),
      container.bus && container.bus[kind] && (container.bus[kind].cityId || container.bus[kind].id)
    ];

    for (let i = 0; i < candidates.length; i += 1) {
      const val = candidates[i];
      if (typeof val === 'string' && val.trim()) {
        const cleaned = cleanStopOrPlaceIdentifier(val);
        if (cleaned && !INVALID_PLACE_NAMES.has(cleaned.toLowerCase())) {
          return cleaned;
        }
      }
    }

    const jobObj = container.job && typeof container.job === 'object' && !isContainerJobInactive(container.job)
      ? container.job
      : null;
    return jobObj ? extractEndpointIdFromContainer(jobObj, kind) : '';
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
    let srcCityId = '';
    let dstCityId = '';
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
      if (!srcCityId) srcCityId = extractEndpointIdFromContainer(c, 'source');
      if (!dstCityId) dstCityId = extractEndpointIdFromContainer(c, 'destination');
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

    // 100% раздельная локализация и очистка названий городов и остановок (RU / EN)
    srcCity = localizePlaceName(srcCity, srcCityId, lang);
    dstCity = localizePlaceName(dstCity, dstCityId, lang);
    srcCompany = cleanAndFormatStopOrCompany(srcCompany, lang);
    dstCompany = cleanAndFormatStopOrCompany(dstCompany, lang);

    const effectiveSrc = srcCity || srcCompany;
    const effectiveDst = dstCity || dstCompany;

    const cargoName = extractCargoName(data);
    const cargoLower = (cargoName || '').toLowerCase();
    const isCargoPassengers = cargoLower.includes('пассажир') || cargoLower.includes('passenger');

    // Сценарий 1: Рейс с заданным пунктом назначения/отправления (груз или автобусный маршрут)
    const hasJobFromEndpoints = Boolean(
      cargoName ||
      (effectiveSrc && effectiveDst) ||
      effectiveDst ||
      effectiveSrc ||
      (income !== null && income > 0) ||
      (plannedKm !== null && plannedKm > 0)
    );

    // Эталонная дифференциация типа рейса (SCS Telemetry SDK 1.16 / rtrucksim_telemetry):
    // При наличии реального груза (не пассажиры) с ненулевой массой — это всегда ГРУЗОВОЙ рейс,
    // даже если тягач из модов построен на автобусном шасси!
    let isBusJob = Boolean(
      (data.cfg && data.cfg.isBusJob) ||
      (data.cfg && data.cfg.job && (data.cfg.job.busJob || data.cfg.job.isBusJob || data.cfg.job.market === 'bus_job')) ||
      data.isBusJob ||
      data.busJob ||
      (data.trip && (data.trip.isBusJob || data.trip.busJob || data.trip.marketType === 'bus_job')) ||
      (data.job && (data.job.busJob || data.job.isBusJob || data.job.jobType === 'bus_job')) ||
      jobMarket === 'bus_job' ||
      isBusJobFlag ||
      isCargoPassengers
    );

    if (cargoName && !isCargoPassengers && (massKg === null || massKg > 0)) {
      isBusJob = false;
    }

    const apiCfg = (config.ets2 && config.ets2.telemetryApi) || {};
    const effectiveNavInputs = navInputs || resolveNavInputs(data);
    const navMeters = resolveNavDistanceMeters(effectiveNavInputs.navDist, apiCfg);

    // Сценарий 2: Маршрут GPS между промежуточными остановками или свободная навигация по GPS
    const isGpsRoute = !hasJobFromEndpoints && navMeters !== null && navMeters > 50;

    const hasJob = hasJobFromEndpoints || isGpsRoute;

    const metaText = plannedKm !== null ? `${formatIntWithSpaces(plannedKm)} ${t('km')}` : t('enRouteMeta');

    let routeText = t('freeRoam');
    let routeMeta = t('liveMeta');

    if (hasJobFromEndpoints) {
      if (srcCity && dstCity && srcCity.toLowerCase() !== dstCity.toLowerCase()) {
        routeText = `${srcCity.toUpperCase()} → ${dstCity.toUpperCase()}`;
        routeMeta = metaText;
      } else if (srcCompany && dstCompany && srcCompany.toLowerCase() !== dstCompany.toLowerCase()) {
        routeText = (srcCity && dstCity && srcCity.toLowerCase() === dstCity.toLowerCase())
          ? `${srcCity.toUpperCase()}: ${srcCompany.toUpperCase()} → ${dstCompany.toUpperCase()}`
          : `${srcCompany.toUpperCase()} → ${dstCompany.toUpperCase()}`;
        routeMeta = metaText;
      } else if (effectiveSrc && effectiveDst) {
        routeText = `${effectiveSrc.toUpperCase()} → ${effectiveDst.toUpperCase()}`;
        routeMeta = metaText;
      } else if (effectiveDst) {
        routeText = `→ ${effectiveDst.toUpperCase()}`;
        routeMeta = metaText;
      } else if (effectiveSrc) {
        routeText = `${effectiveSrc.toUpperCase()} →`;
        routeMeta = metaText;
      } else if (cargoName) {
        routeText = cargoName.toUpperCase();
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
    if (srcCompany && dstCompany) {
      const compRoute = `${srcCompany.toUpperCase()} → ${dstCompany.toUpperCase()}`;
      if (compRoute !== routeText) {
        companiesText = compRoute;
      } else if (isBusJob) {
        const busSat = parseFiniteTelemetryNumber(
          data.busSat ?? (data.tel && data.tel.busSat) ?? (data.trip && data.trip.busSat) ?? (data.cfg && data.cfg.bus && data.cfg.bus.satisfaction)
        );
        if (busSat !== null && busSat > 0) {
          const satPct = Math.round(busSat > 1 ? busSat : busSat * 100);
          companiesText = `${t('comfortLabel')}: ${satPct}%`;
        } else {
          companiesText = t('coachPassengerRoute');
        }
      } else {
        companiesText = srcCompany.toUpperCase();
      }
    } else if (srcCompany || dstCompany) {
      const singleComp = (srcCompany || dstCompany).toUpperCase();
      companiesText = singleComp !== routeText ? singleComp : '--';
    } else if (isBusJob) {
      const busSat = parseFiniteTelemetryNumber(
        data.busSat ?? (data.tel && data.tel.busSat) ?? (data.trip && data.trip.busSat) ?? (data.cfg && data.cfg.bus && data.cfg.bus.satisfaction)
      );
      if (busSat !== null && busSat > 0) {
        const satPct = Math.round(busSat > 1 ? busSat : busSat * 100);
        companiesText = `${t('comfortLabel')}: ${satPct}%`;
      }
    }

    const translatedMarket = translateJobMarket(jobMarket);
    let jobTypeText = t('freeRoam');
    if (hasJobFromEndpoints) {
      if (isBusJob) {
        jobTypeText = t('coachPassengerRoute');
      } else {
        jobTypeText = translatedMarket || t('freightJob');
      }
    } else if (isGpsRoute) {
      jobTypeText = t('gpsRouteNextStop');
    }

    const routeTag = hasJobFromEndpoints
      ? (isBusJob ? t('coachPassengerRoute') : (tag || defaultTag))
      : (isGpsRoute ? t('gpsRouteNextStop') : (tag || defaultTag));

    return {
      hasJob,
      isBusJob,
      isCoach: isBusJob,
      isGpsRoute,
      text: routeText,
      meta: routeMeta,
      tag: routeTag,
      massKg,
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

  /* ==========================================================================
     МОДУЛЬ ИГРОВЫХ СОБЫТИЙ, ЗВУКОВОГО СИНТЕЗАТОРА И ТОСТ-УВЕДОМЛЕНИЙ
     ========================================================================== */
  const EVENT_SVG_ICONS = {
    speeding: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="28" r="25" fill="#f8fafc" stroke="#ef4444" stroke-width="5"/>
      <text x="28" y="35" font-family="'Tektur', sans-serif" font-weight="900" font-size="20" fill="#0f172a" text-anchor="middle">80</text>
      <path d="M42 10 L48 4 M46 14 L52 14 M38 6 L42 2" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="43" cy="11" r="3" fill="#f59e0b"/>
    </svg>`,

    speeding_camera: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="28" r="25" fill="#f8fafc" stroke="#ef4444" stroke-width="5"/>
      <text x="28" y="35" font-family="'Tektur', sans-serif" font-weight="900" font-size="20" fill="#0f172a" text-anchor="middle">90</text>
      <path d="M42 10 L48 4 M46 14 L52 14 M38 6 L42 2" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="43" cy="11" r="3" fill="#f59e0b"/>
    </svg>`,

    red_signal: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="4" width="20" height="48" rx="8" fill="#1e293b" stroke="#334155" stroke-width="2"/>
      <path d="M16 14 Q28 8 40 14" stroke="#475569" stroke-width="2" fill="none"/>
      <path d="M16 28 Q28 22 40 28" stroke="#475569" stroke-width="2" fill="none"/>
      <path d="M16 42 Q28 36 40 42" stroke="#475569" stroke-width="2" fill="none"/>
      <circle cx="28" cy="14" r="8" fill="#ef4444" opacity="0.38"/>
      <circle cx="28" cy="14" r="6" fill="#ef4444"/>
      <circle cx="26" cy="12" r="2" fill="#fca5a5"/>
      <circle cx="28" cy="28" r="5" fill="#332a15" stroke="#78350f" stroke-width="1"/>
      <circle cx="28" cy="42" r="5" fill="#0f291e" stroke="#064e3b" stroke-width="1"/>
    </svg>`,

    crash: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M28 8 L32 20 L44 14 L36 24 L48 28 L36 32 L42 42 L30 35 L28 48 L24 35 L12 40 L18 30 L6 26 L19 23 L12 12 L24 20 Z" fill="#f59e0b" opacity="0.95"/>
      <path d="M28 14 L30 22 L38 18 L33 25 L40 28 L33 30 L37 37 L30 32 L28 39 L25 32 L18 35 L22 29 L14 27 L22 24 L18 18 L25 22 Z" fill="#fef08a"/>
      <path d="M6 38 L16 38 L21 33 L12 31 Z" fill="#ef4444"/>
      <path d="M50 38 L40 38 L35 33 L44 31 Z" fill="#94a3b8"/>
    </svg>`,

    no_lights: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 18 C12 18 24 16 26 28 C24 40 12 38 12 38 Z" fill="#334155" stroke="#94a3b8" stroke-width="2.5"/>
      <path d="M20 23 C22 25 22 31 20 33" stroke="#cbd5e1" stroke-width="2"/>
      <path d="M30 20 L44 14 M32 28 L46 28 M30 36 L44 42" stroke="#64748b" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="28" cy="28" r="22" stroke="#ef4444" stroke-width="3.5" fill="none"/>
      <line x1="12" y1="12" x2="44" y2="44" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`,

    avoid_sleeping: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="26" cy="30" r="19" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
      <circle cx="26" cy="30" r="2.5" fill="#f8fafc"/>
      <path d="M26 30 L26 18 M26 30 L35 34" stroke="#f8fafc" stroke-width="2.5" stroke-linecap="round"/>
      <rect x="23" y="7" width="6" height="4" rx="1.5" fill="#38bdf8"/>
      <text x="42" y="18" font-family="'Tektur', sans-serif" font-weight="900" font-size="14" fill="#f59e0b">Z</text>
      <text x="47" y="27" font-family="'Tektur', sans-serif" font-weight="900" font-size="10" fill="#f59e0b">z</text>
      <text x="50" y="35" font-family="'Tektur', sans-serif" font-weight="900" font-size="8" fill="#fbbf24">z</text>
    </svg>`,

    wrong_way: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="28" r="24" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
      <rect x="11" y="23" width="34" height="10" rx="2" fill="#ffffff"/>
      <path d="M28 8 L33 14 L23 14 Z M28 48 L23 42 L33 42 Z" fill="#ffffff" opacity="0.8"/>
    </svg>`,

    avoid_weighing: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="40" width="44" height="6" rx="2" fill="#334155" stroke="#64748b" stroke-width="1.5"/>
      <rect x="14" y="46" width="6" height="4" fill="#475569"/>
      <rect x="36" y="46" width="6" height="4" fill="#475569"/>
      <path d="M10 38 L10 24 L28 24 L36 30 L42 30 L42 38 Z" fill="#f59e0b" stroke="#d97706" stroke-width="1.5"/>
      <circle cx="16" cy="38" r="4" fill="#0f172a" stroke="#cbd5e1" stroke-width="1.5"/>
      <circle cx="36" cy="38" r="4" fill="#0f172a" stroke="#cbd5e1" stroke-width="1.5"/>
      <polygon points="28,6 38,22 18,22" fill="#ef4444" stroke="#ffffff" stroke-width="1.5"/>
      <text x="28" y="20" font-family="'Inter', sans-serif" font-weight="900" font-size="12" fill="#ffffff" text-anchor="middle">!</text>
    </svg>`,

    refuel: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="10" width="26" height="38" rx="4" fill="#0f172a" stroke="#10b981" stroke-width="2.5"/>
      <rect x="13" y="16" width="16" height="10" rx="2" fill="#064e3b" stroke="#34d399" stroke-width="1"/>
      <text x="21" y="23" font-family="'Tektur', sans-serif" font-weight="700" font-size="6" fill="#34d399" text-anchor="middle">GAS</text>
      <path d="M34 18 C42 18 44 26 44 32 C44 38 41 40 41 36 L41 24 L46 22" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <path d="M21 32 C21 32 27 39 27 42 C27 45.3 24.3 48 21 48 C17.7 48 15 45.3 15 42 C15 39 21 32 21 32 Z" fill="#34d399"/>
    </svg>`,

    tollgate: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="20" width="10" height="28" rx="2" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <circle cx="13" cy="24" r="3" fill="#38bdf8"/>
      <path d="M13 24 L50 16" stroke="#ef4444" stroke-width="5" stroke-linecap="round"/>
      <path d="M13 24 L50 16" stroke="#ffffff" stroke-width="5" stroke-dasharray="7 7" stroke-linecap="round"/>
      <circle cx="36" cy="38" r="11" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
      <text x="36" y="44" font-family="'Tektur', sans-serif" font-weight="900" font-size="14" fill="#ffffff" text-anchor="middle">€</text>
    </svg>`,

    ferry: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 34 L12 44 L44 44 L50 34 L38 34 L38 24 L30 24 L30 18 L24 18 L24 24 L14 24 L14 34 Z" fill="#f59e0b" stroke="#fbbf24" stroke-width="1.5"/>
      <rect x="25" y="14" width="5" height="5" fill="#ef4444"/>
      <circle cx="28" cy="10" r="2" fill="#94a3b8" opacity="0.6"/>
      <circle cx="32" cy="7" r="2.5" fill="#94a3b8" opacity="0.4"/>
      <circle cx="18" cy="29" r="1.5" fill="#0f172a"/>
      <circle cx="24" cy="29" r="1.5" fill="#0f172a"/>
      <circle cx="30" cy="29" r="1.5" fill="#0f172a"/>
      <path d="M4 48 C8 46 12 46 16 48 C20 50 24 50 28 48 C32 46 36 46 40 48 C44 50 48 50 52 48" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

    train: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="8" width="32" height="36" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="2.5"/>
      <rect x="17" y="14" width="22" height="12" rx="3" fill="#38bdf8" opacity="0.85"/>
      <circle cx="18" cy="36" r="3.5" fill="#fef08a" stroke="#f59e0b" stroke-width="1"/>
      <circle cx="38" cy="36" r="3.5" fill="#fef08a" stroke="#f59e0b" stroke-width="1"/>
      <circle cx="28" cy="11" r="2" fill="#fef08a"/>
      <path d="M8 48 L48 48 M14 44 L42 44 M16 52 L40 52" stroke="#64748b" stroke-width="2" stroke-linecap="round"/>
    </svg>`,

    job_delivered: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M28 4 L48 12 L48 28 C48 40 38 48 28 52 C18 48 8 40 8 28 L8 12 Z" fill="#15803d" stroke="#22c55e" stroke-width="2.5"/>
      <path d="M18 28 L25 35 L38 20" stroke="#f0fdf4" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    job_cancelled: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M28 4 L48 12 L48 28 C48 40 38 48 28 52 C18 48 8 40 8 28 L8 12 Z" fill="#991b1b" stroke="#ef4444" stroke-width="2.5"/>
      <path d="M20 20 L36 36 M36 20 L20 36" stroke="#fef2f2" stroke-width="4.5" stroke-linecap="round"/>
    </svg>`,

    generic_fine: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="28" r="24" fill="#1e293b" stroke="#ef4444" stroke-width="3"/>
      <polygon points="28,10 40,36 16,36" fill="#ef4444"/>
      <text x="28" y="32" font-family="'Inter', sans-serif" font-weight="900" font-size="16" fill="#ffffff" text-anchor="middle">!</text>
    </svg>`,

    illegal_trailer: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="16" width="32" height="22" rx="3" fill="#1e293b" stroke="#f59e0b" stroke-width="2"/>
      <line x1="38" y1="27" x2="48" y2="27" stroke="#94a3b8" stroke-width="4"/>
      <circle cx="16" cy="40" r="4.5" fill="#0f172a" stroke="#cbd5e1" stroke-width="2"/>
      <circle cx="28" cy="40" r="4.5" fill="#0f172a" stroke="#cbd5e1" stroke-width="2"/>
      <circle cx="40" cy="20" r="13" fill="#ef4444" stroke="#ffffff" stroke-width="2.5"/>
      <line x1="31" y1="29" x2="49" y2="11" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

    damaged_vehicle: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="14" width="28" height="26" rx="4" fill="#1e293b" stroke="#ef4444" stroke-width="2"/>
      <path d="M12 18 L24 30 M24 18 L12 30" stroke="#fca5a5" stroke-width="2"/>
      <circle cx="15" cy="42" r="4" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>
      <circle cx="29" cy="42" r="4" fill="#0f172a" stroke="#ef4444" stroke-width="2"/>
      <path d="M34 14 C38 8 44 8 46 14 C48 10 52 14 50 20 C54 24 50 30 44 28" fill="#94a3b8" opacity="0.65"/>
      <polygon points="42,32 52,48 32,48" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5"/>
      <text x="42" y="45" font-family="'Inter', sans-serif" font-weight="900" font-size="11" fill="#000000" text-anchor="middle">!</text>
    </svg>`,

    illegal_border_crossing: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="24" width="8" height="24" rx="2" fill="#334155" stroke="#64748b" stroke-width="1.5"/>
      <rect x="42" y="24" width="8" height="24" rx="2" fill="#334155" stroke="#64748b" stroke-width="1.5"/>
      <path d="M10 28 L46 28" stroke="#ef4444" stroke-width="6" stroke-linecap="round"/>
      <path d="M10 28 L46 28" stroke="#ffffff" stroke-width="6" stroke-dasharray="6 6" stroke-linecap="round"/>
      <circle cx="28" cy="14" r="10" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>
      <rect x="22" y="12" width="12" height="4" rx="1" fill="#ffffff"/>
    </svg>`,

    hard_shoulder_violation: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="8" width="44" height="40" rx="6" fill="#1e293b" stroke="#475569" stroke-width="2"/>
      <line x1="20" y1="8" x2="20" y2="48" stroke="#ffffff" stroke-width="2.5" stroke-dasharray="5 5"/>
      <line x1="36" y1="8" x2="36" y2="48" stroke="#f59e0b" stroke-width="3"/>
      <path d="M14 38 L14 26 L18 20 L22 20 L22 38 Z" fill="#38bdf8"/>
      <path d="M22 26 C26 26 34 24 38 18" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="2 3"/>
      <polygon points="38,14 43,20 35,21" fill="#ef4444"/>
    </svg>`,

    cargo_damage: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="12" width="40" height="36" rx="4" fill="#78350f" stroke="#b45309" stroke-width="2"/>
      <path d="M8 22 L48 22 M28 22 L28 48" stroke="#92400e" stroke-width="2"/>
      <path d="M22 12 L30 24 L24 32 L34 44" stroke="#ef4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="40,24 52,44 28,44" fill="#ef4444" stroke="#ffffff" stroke-width="1.5"/>
      <text x="40" y="41" font-family="'Inter', sans-serif" font-weight="900" font-size="13" fill="#ffffff" text-anchor="middle">!</text>
    </svg>`,

    service: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="28" r="22" fill="#064e3b" stroke="#10b981" stroke-width="2.5"/>
      <path d="M18 38 L32 24 M28 20 L36 28 M34 16 C38 12 44 14 46 16 C48 18 50 24 46 28 L40 22" stroke="#34d399" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="20" cy="36" r="4" fill="#10b981"/>
      <path d="M28 10 L30 14 M28 46 L30 42 M10 28 L14 30 M46 28 L42 30" stroke="#6ee7b7" stroke-width="2" stroke-linecap="round"/>
    </svg>`,

    low_fuel: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="10" width="26" height="38" rx="4" fill="#1e293b" stroke="#f59e0b" stroke-width="2.5"/>
      <rect x="13" y="16" width="16" height="10" rx="2" fill="#451a03" stroke="#f59e0b" stroke-width="1"/>
      <text x="21" y="23" font-family="'Tektur', sans-serif" font-weight="700" font-size="6" fill="#fbbf24" text-anchor="middle">LOW</text>
      <path d="M34 18 C42 18 44 26 44 32 C44 38 41 40 41 36 L41 24 L46 22" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" fill="none"/>
      <polygon points="21,30 27,42 15,42" fill="#ef4444"/>
      <text x="21" y="40" font-family="'Inter', sans-serif" font-weight="900" font-size="9" fill="#ffffff" text-anchor="middle">!</text>
    </svg>`,

    bus_stop: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="12" width="40" height="28" rx="5" fill="#134e4a" stroke="#14b8a6" stroke-width="2.5"/>
      <rect x="12" y="16" width="10" height="10" rx="2" fill="#2dd4bf" opacity="0.8"/>
      <rect x="24" y="16" width="10" height="10" rx="2" fill="#2dd4bf" opacity="0.8"/>
      <rect x="36" y="16" width="8" height="18" rx="1" fill="#0f766e" stroke="#5eead4" stroke-width="1"/>
      <circle cx="16" cy="42" r="4.5" fill="#0f172a" stroke="#2dd4bf" stroke-width="2"/>
      <circle cx="38" cy="42" r="4.5" fill="#0f172a" stroke="#2dd4bf" stroke-width="2"/>
      <line x1="4" y1="48" x2="52" y2="48" stroke="#64748b" stroke-width="2" stroke-linecap="round"/>
    </svg>`,

    bus_comfort: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="28" r="23" fill="#1e293b" stroke="#f97316" stroke-width="2.5"/>
      <path d="M20 16 C20 16 28 14 36 16 C36 24 34 32 34 36 L18 36 L18 20 Z" fill="#ea580c" opacity="0.4"/>
      <path d="M16 36 L36 36 C38 36 40 38 40 40 L14 40 C14 38 15 36 16 36 Z" fill="#fdba74"/>
      <path d="M22 16 C22 16 26 20 28 20 C30 20 34 16 34 16" stroke="#fed7aa" stroke-width="2" stroke-linecap="round"/>
      <polygon points="38,8 48,24 28,24" fill="#f97316" stroke="#ffffff" stroke-width="1.5"/>
      <text x="38" y="21" font-family="'Inter', sans-serif" font-weight="900" font-size="11" fill="#ffffff" text-anchor="middle">!</text>
    </svg>`,

    chat_honk: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 22 L24 22 L38 12 L38 34 L24 24 L8 24 Z" fill="#a855f7" stroke="#c084fc" stroke-width="2"/>
      <path d="M8 32 L24 32 L38 24 L38 44 L24 34 L8 34 Z" fill="#9333ea" stroke="#c084fc" stroke-width="2"/>
      <path d="M42 16 C46 20 46 36 42 40" stroke="#e9d5ff" stroke-width="3" stroke-linecap="round"/>
      <path d="M47 11 C53 17 53 39 47 45" stroke="#f3e8ff" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

    chat_cb: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="8" width="24" height="30" rx="10" fill="#1e293b" stroke="#eab308" stroke-width="2.5"/>
      <circle cx="28" cy="18" r="6" fill="#0f172a" stroke="#ca8a04" stroke-width="1"/>
      <circle cx="28" cy="18" r="2" fill="#facc15"/>
      <rect x="12" y="16" width="4" height="8" rx="2" fill="#eab308"/>
      <path d="M28 38 C28 44 24 46 28 50 C32 54 28 56 28 56" stroke="#facc15" stroke-width="3" stroke-linecap="round" fill="none"/>
    </svg>`,

    chat_route: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="40" height="40" rx="8" fill="#0c4a6e" stroke="#38bdf8" stroke-width="2.5"/>
      <path d="M16 40 L24 28 L32 34 L40 18" stroke="#7dd3fc" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="40,14 44,22 36,20" fill="#38bdf8"/>
      <circle cx="16" cy="40" r="3" fill="#38bdf8"/>
    </svg>`,

    chat_stats: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="8" width="44" height="40" rx="6" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <line x1="14" y1="40" x2="14" y2="30" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
      <line x1="24" y1="40" x2="24" y2="22" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
      <line x1="34" y1="40" x2="34" y2="16" stroke="#4ade80" stroke-width="4" stroke-linecap="round"/>
      <line x1="44" y1="40" x2="44" y2="26" stroke="#38bdf8" stroke-width="4" stroke-linecap="round"/>
      <polygon points="28,6 30,11 36,11 31,14 33,19 28,16 23,19 25,14 20,11 26,11" fill="#facc15"/>
    </svg>`,

    chat_truck: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="8" width="32" height="36" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
      <rect x="16" y="12" width="24" height="12" rx="2" fill="#0284c7" opacity="0.8"/>
      <rect x="18" y="28" width="20" height="10" rx="1" fill="#0f172a" stroke="#64748b" stroke-width="1"/>
      <circle cx="16" cy="38" r="2.5" fill="#fef08a"/>
      <circle cx="40" cy="38" r="2.5" fill="#fef08a"/>
      <line x1="8" y1="46" x2="48" y2="46" stroke="#64748b" stroke-width="2.5"/>
    </svg>`,

    chat_driver: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M28 6 L46 12 L46 28 C46 38 38 46 28 50 C18 46 10 38 10 28 L10 12 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
      <circle cx="28" cy="22" r="6" fill="#38bdf8"/>
      <path d="M18 36 C18 31 22 29 28 29 C34 29 38 31 38 36" fill="#38bdf8"/>
      <polygon points="28,34 30,38 34,38 31,40 32,44 28,42 24,44 25,40 22,38 26,38" fill="#facc15"/>
    </svg>`
  };

  const TelemetrySoundEngine = (() => {
    let ctx = null;

    function getAudioContext() {
      if (!ctx) {
        const AudioCtxClass = global.AudioContext || global.webkitAudioContext;
        if (AudioCtxClass) {
          ctx = new AudioCtxClass();
        }
      }
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      return ctx;
    }

    function createNoiseBuffer(c, durationSec) {
      const bufferSize = Math.max(1, Math.floor(c.sampleRate * durationSec));
      const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      return buffer;
    }

    function playSpeeding(vol) {
      const c = getAudioContext();
      if (!c) return;
      const t0 = c.currentTime + 0.01;
      const masterGain = c.createGain();
      masterGain.gain.setValueAtTime(vol * 0.9, t0);
      masterGain.connect(c.destination);

      const noiseBuf = createNoiseBuffer(c, 0.04);
      const click1 = c.createBufferSource();
      click1.buffer = noiseBuf;
      const bpf1 = c.createBiquadFilter();
      bpf1.type = 'bandpass';
      bpf1.frequency.setValueAtTime(2200, t0);
      bpf1.Q.setValueAtTime(3.0, t0);
      const g1 = c.createGain();
      g1.gain.setValueAtTime(0.8, t0);
      g1.gain.exponentialRampToValueAtTime(0.001, t0 + 0.035);
      click1.connect(bpf1);
      bpf1.connect(g1);
      g1.connect(masterGain);
      click1.start(t0);

      const tClick2 = t0 + 0.055;
      const click2 = c.createBufferSource();
      click2.buffer = noiseBuf;
      const bpf2 = c.createBiquadFilter();
      bpf2.type = 'bandpass';
      bpf2.frequency.setValueAtTime(1600, tClick2);
      bpf2.Q.setValueAtTime(2.5, tClick2);
      const g2 = c.createGain();
      g2.gain.setValueAtTime(0.9, tClick2);
      g2.gain.exponentialRampToValueAtTime(0.001, tClick2 + 0.04);
      click2.connect(bpf2);
      bpf2.connect(g2);
      g2.connect(masterGain);
      click2.start(tClick2);

      const tFlash = t0 + 0.06;
      const oscFlash = c.createOscillator();
      oscFlash.type = 'sine';
      oscFlash.frequency.setValueAtTime(3800, tFlash);
      oscFlash.frequency.exponentialRampToValueAtTime(7400, tFlash + 0.16);
      const gFlash = c.createGain();
      gFlash.gain.setValueAtTime(0.12, tFlash);
      gFlash.gain.exponentialRampToValueAtTime(0.001, tFlash + 0.22);
      oscFlash.connect(gFlash);
      gFlash.connect(masterGain);
      oscFlash.start(tFlash);
      oscFlash.stop(tFlash + 0.23);
    }

    function playRedSignal(vol) {
      const c = getAudioContext();
      if (!c) return;
      const t0 = c.currentTime + 0.01;
      const masterGain = c.createGain();
      masterGain.gain.setValueAtTime(vol * 0.85, t0);
      masterGain.connect(c.destination);

      [
        { start: t0, duration: 0.13 },
        { start: t0 + 0.18, duration: 0.28 }
      ].forEach((burst) => {
        const carrier = c.createOscillator();
        carrier.type = 'sine';
        carrier.frequency.setValueAtTime(2950, burst.start);

        const lfo = c.createOscillator();
        lfo.type = 'triangle';
        lfo.frequency.setValueAtTime(24, burst.start);
        const lfoGain = c.createGain();
        lfoGain.gain.setValueAtTime(280, burst.start);
        lfo.connect(carrier.frequency);

        const airOsc = c.createOscillator();
        airOsc.type = 'sine';
        airOsc.frequency.setValueAtTime(3320, burst.start);
        const airGain = c.createGain();
        airGain.gain.setValueAtTime(0.22, burst.start);

        const bpf = c.createBiquadFilter();
        bpf.type = 'bandpass';
        bpf.frequency.setValueAtTime(3000, burst.start);
        bpf.Q.setValueAtTime(4.0, burst.start);

        const burstGain = c.createGain();
        burstGain.gain.setValueAtTime(0.001, burst.start);
        burstGain.gain.linearRampToValueAtTime(0.7, burst.start + 0.015);
        burstGain.gain.setValueAtTime(0.7, burst.start + burst.duration - 0.02);
        burstGain.gain.exponentialRampToValueAtTime(0.001, burst.start + burst.duration);

        carrier.connect(bpf);
        airOsc.connect(airGain);
        airGain.connect(bpf);
        bpf.connect(burstGain);
        burstGain.connect(masterGain);

        carrier.start(burst.start);
        lfo.start(burst.start);
        airOsc.start(burst.start);
        carrier.stop(burst.start + burst.duration + 0.01);
        lfo.stop(burst.start + burst.duration + 0.01);
        airOsc.stop(burst.start + burst.duration + 0.01);
      });
    }

    function playCrash(vol) {
      const c = getAudioContext();
      if (!c) return;
      const t0 = c.currentTime + 0.01;
      const masterGain = c.createGain();
      masterGain.gain.setValueAtTime(vol * 0.9, t0);
      masterGain.connect(c.destination);

      [
        { start: t0, duration: 0.12 },
        { start: t0 + 0.16, duration: 0.14 }
      ].forEach((chirp) => {
        const osc = c.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(680, chirp.start);
        osc.frequency.exponentialRampToValueAtTime(1620, chirp.start + chirp.duration);

        const bpf = c.createBiquadFilter();
        bpf.type = 'bandpass';
        bpf.frequency.setValueAtTime(1100, chirp.start);
        bpf.Q.setValueAtTime(1.8, chirp.start);

        const g = c.createGain();
        g.gain.setValueAtTime(0.001, chirp.start);
        g.gain.linearRampToValueAtTime(0.65, chirp.start + 0.01);
        g.gain.setValueAtTime(0.65, chirp.start + chirp.duration - 0.015);
        g.gain.exponentialRampToValueAtTime(0.001, chirp.start + chirp.duration);

        osc.connect(bpf);
        bpf.connect(g);
        g.connect(masterGain);

        osc.start(chirp.start);
        osc.stop(chirp.start + chirp.duration + 0.01);
      });
    }

    function playNoLights(vol) {
      const c = getAudioContext();
      if (!c) return;
      const t0 = c.currentTime + 0.01;
      const masterGain = c.createGain();
      masterGain.gain.setValueAtTime(vol * 0.75, t0);
      masterGain.connect(c.destination);

      [
        { start: t0, duration: 0.10 },
        { start: t0 + 0.15, duration: 0.10 }
      ].forEach((pulse) => {
        const osc = c.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(460, pulse.start);

        const lpf = c.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.setValueAtTime(1400, pulse.start);

        const g = c.createGain();
        g.gain.setValueAtTime(0.45, pulse.start);
        g.gain.exponentialRampToValueAtTime(0.001, pulse.start + pulse.duration);

        osc.connect(lpf);
        lpf.connect(g);
        g.connect(masterGain);

        osc.start(pulse.start);
        osc.stop(pulse.start + pulse.duration + 0.01);
      });
    }

    function playTachograph(vol) {
      const c = getAudioContext();
      if (!c) return;
      const t0 = c.currentTime + 0.01;
      const masterGain = c.createGain();
      masterGain.gain.setValueAtTime(vol * 0.7, t0);
      masterGain.connect(c.destination);

      [
        { f: 880, start: t0, duration: 0.08 },
        { f: 1100, start: t0 + 0.12, duration: 0.10 }
      ].forEach((tone) => {
        const osc = c.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(tone.f, tone.start);

        const g = c.createGain();
        g.gain.setValueAtTime(0.55, tone.start);
        g.gain.exponentialRampToValueAtTime(0.001, tone.start + tone.duration);

        osc.connect(g);
        g.connect(masterGain);

        osc.start(tone.start);
        osc.stop(tone.start + tone.duration + 0.01);
      });
    }

    function playWrongWay(vol) {
      const c = getAudioContext();
      if (!c) return;
      const t0 = c.currentTime + 0.01;
      const masterGain = c.createGain();
      masterGain.gain.setValueAtTime(vol * 0.85, t0);
      masterGain.connect(c.destination);

      const duration = 0.28;
      [415, 311].forEach((f) => {
        const osc = c.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, t0);

        const lpf = c.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.setValueAtTime(1100, t0);

        const g = c.createGain();
        g.gain.setValueAtTime(0.001, t0);
        g.gain.linearRampToValueAtTime(0.4, t0 + 0.015);
        g.gain.setValueAtTime(0.4, t0 + duration - 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

        osc.connect(lpf);
        lpf.connect(g);
        g.connect(masterGain);

        osc.start(t0);
        osc.stop(t0 + duration + 0.01);
      });
    }

    function playWarningChime(vol) {
      const c = getAudioContext();
      if (!c) return;
      const t0 = c.currentTime + 0.01;
      const masterGain = c.createGain();
      masterGain.gain.setValueAtTime(vol * 0.75, t0);
      masterGain.connect(c.destination);

      [
        { f: 520, start: t0, duration: 0.08 },
        { f: 660, start: t0 + 0.10, duration: 0.08 },
        { f: 880, start: t0 + 0.20, duration: 0.12 }
      ].forEach((tone) => {
        const osc = c.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(tone.f, tone.start);

        const g = c.createGain();
        g.gain.setValueAtTime(0.5, tone.start);
        g.gain.exponentialRampToValueAtTime(0.001, tone.start + tone.duration);

        osc.connect(g);
        g.connect(masterGain);

        osc.start(tone.start);
        osc.stop(tone.start + tone.duration + 0.01);
      });
    }

    function playRefuel(vol) {
      const c = getAudioContext();
      if (!c) return;
      const t0 = c.currentTime + 0.01;
      const masterGain = c.createGain();
      masterGain.gain.setValueAtTime(vol * 0.8, t0);
      masterGain.connect(c.destination);

      [
        { f: 587.33, start: t0, duration: 0.14 },
        { f: 880.00, start: t0 + 0.13, duration: 0.32 }
      ].forEach((tone) => {
        const osc = c.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(tone.f, tone.start);

        const g = c.createGain();
        g.gain.setValueAtTime(0.001, tone.start);
        g.gain.linearRampToValueAtTime(0.55, tone.start + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, tone.start + tone.duration);

        osc.connect(g);
        g.connect(masterGain);

        osc.start(tone.start);
        osc.stop(tone.start + tone.duration + 0.01);
      });
    }

    function playTollgate(vol) {
      const c = getAudioContext();
      if (!c) return;
      const t0 = c.currentTime + 0.01;
      const masterGain = c.createGain();
      masterGain.gain.setValueAtTime(vol * 0.85, t0);
      masterGain.connect(c.destination);

      const osc = c.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1850, t0);

      const osc2 = c.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(3700, t0);
      const g2 = c.createGain();
      g2.gain.setValueAtTime(0.08, t0);

      const g = c.createGain();
      g.gain.setValueAtTime(0.001, t0);
      g.gain.linearRampToValueAtTime(0.6, t0 + 0.003);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.085);

      osc.connect(g);
      osc2.connect(g2);
      g2.connect(g);
      g.connect(masterGain);

      osc.start(t0);
      osc2.start(t0);
      osc.stop(t0 + 0.09);
      osc2.stop(t0 + 0.09);
    }

    function playFerry(vol) {
      const c = getAudioContext();
      if (!c) return;
      const t0 = c.currentTime + 0.01;
      const masterGain = c.createGain();
      masterGain.gain.setValueAtTime(vol * 0.9, t0);
      masterGain.connect(c.destination);

      const duration = 0.52;
      [146.8, 185.0, 220.0].forEach((f) => {
        const osc = c.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, t0);

        const lpf = c.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.setValueAtTime(750, t0);

        const g = c.createGain();
        g.gain.setValueAtTime(0.001, t0);
        g.gain.linearRampToValueAtTime(0.4, t0 + 0.06);
        g.gain.setValueAtTime(0.4, t0 + duration - 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

        osc.connect(lpf);
        lpf.connect(g);
        g.connect(masterGain);

        osc.start(t0);
        osc.stop(t0 + duration + 0.01);
      });
    }

    function playTrain(vol) {
      const c = getAudioContext();
      if (!c) return;
      const t0 = c.currentTime + 0.01;
      const masterGain = c.createGain();
      masterGain.gain.setValueAtTime(vol * 0.85, t0);
      masterGain.connect(c.destination);

      const duration = 0.40;
      [311.1, 369.9].forEach((f) => {
        const osc = c.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, t0);

        const lpf = c.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.setValueAtTime(950, t0);

        const g = c.createGain();
        g.gain.setValueAtTime(0.001, t0);
        g.gain.linearRampToValueAtTime(0.38, t0 + 0.035);
        g.gain.setValueAtTime(0.38, t0 + duration - 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

        osc.connect(lpf);
        lpf.connect(g);
        g.connect(masterGain);

        osc.start(t0);
        osc.stop(t0 + duration + 0.01);
      });
    }

    function playJobDelivered(vol) {
      const c = getAudioContext();
      if (!c) return;
      const t0 = c.currentTime + 0.01;
      const masterGain = c.createGain();
      masterGain.gain.setValueAtTime(vol * 0.8, t0);
      masterGain.connect(c.destination);

      [
        { f: 523.25, start: t0, duration: 0.18 },
        { f: 659.25, start: t0 + 0.09, duration: 0.18 },
        { f: 783.99, start: t0 + 0.18, duration: 0.22 },
        { f: 1046.50, start: t0 + 0.27, duration: 0.45 }
      ].forEach((note) => {
        const osc = c.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.f, note.start);

        const g = c.createGain();
        g.gain.setValueAtTime(0.001, note.start);
        g.gain.linearRampToValueAtTime(0.5, note.start + 0.015);
        g.gain.exponentialRampToValueAtTime(0.001, note.start + note.duration);

        osc.connect(g);
        g.connect(masterGain);

        osc.start(note.start);
        osc.stop(note.start + note.duration + 0.01);
      });
    }

    function playJobCancelled(vol) {
      const c = getAudioContext();
      if (!c) return;
      const t0 = c.currentTime + 0.01;
      const masterGain = c.createGain();
      masterGain.gain.setValueAtTime(vol * 0.8, t0);
      masterGain.connect(c.destination);

      const duration = 0.42;
      const osc = c.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, t0);
      osc.frequency.exponentialRampToValueAtTime(240, t0 + duration);

      const g = c.createGain();
      g.gain.setValueAtTime(0.001, t0);
      g.gain.linearRampToValueAtTime(0.55, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

      osc.connect(g);
      g.connect(masterGain);

      osc.start(t0);
      osc.stop(t0 + duration + 0.01);
    }

    function playCargoDamage(vol) {
      const c = getAudioContext();
      if (!c) return;
      const t0 = c.currentTime + 0.01;
      const masterGain = c.createGain();
      masterGain.gain.setValueAtTime(vol * 0.9, t0);
      masterGain.connect(c.destination);

      const oscThump = c.createOscillator();
      oscThump.type = 'sine';
      oscThump.frequency.setValueAtTime(95, t0);
      oscThump.frequency.exponentialRampToValueAtTime(32, t0 + 0.22);
      const gThump = c.createGain();
      gThump.gain.setValueAtTime(0.85, t0);
      gThump.gain.exponentialRampToValueAtTime(0.001, t0 + 0.24);
      oscThump.connect(gThump);
      gThump.connect(masterGain);
      oscThump.start(t0);
      oscThump.stop(t0 + 0.25);

      [t0 + 0.08, t0 + 0.20].forEach((pt) => {
        const oscBeep = c.createOscillator();
        oscBeep.type = 'sine';
        oscBeep.frequency.setValueAtTime(2400, pt);
        const gBeep = c.createGain();
        gBeep.gain.setValueAtTime(0.45, pt);
        gBeep.gain.exponentialRampToValueAtTime(0.001, pt + 0.07);
        oscBeep.connect(gBeep);
        gBeep.connect(masterGain);
        oscBeep.start(pt);
        oscBeep.stop(pt + 0.08);
      });
    }

    function playService(vol) {
      const c = getAudioContext();
      if (!c) return;
      const t0 = c.currentTime + 0.01;
      const masterGain = c.createGain();
      masterGain.gain.setValueAtTime(vol * 0.85, t0);
      masterGain.connect(c.destination);

      const noise = createNoiseBuffer(c, 0.03);
      for (let i = 0; i < 4; i++) {
        const nt = t0 + i * 0.055;
        const src = c.createBufferSource();
        src.buffer = noise;
        const bpf = c.createBiquadFilter();
        bpf.type = 'bandpass';
        bpf.frequency.setValueAtTime(1400, nt);
        bpf.Q.setValueAtTime(2.5, nt);
        const g = c.createGain();
        g.gain.setValueAtTime(0.7, nt);
        g.gain.exponentialRampToValueAtTime(0.001, nt + 0.045);
        src.connect(bpf);
        bpf.connect(g);
        g.connect(masterGain);
        src.start(nt);
      }

      [
        { f: 523.25, start: t0 + 0.28, dur: 0.12 },
        { f: 659.25, start: t0 + 0.36, dur: 0.25 }
      ].forEach((note) => {
        const osc = c.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, note.start);
        const g = c.createGain();
        g.gain.setValueAtTime(0.4, note.start);
        g.gain.exponentialRampToValueAtTime(0.001, note.start + note.dur);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(note.start);
        osc.stop(note.start + note.dur + 0.01);
      });
    }

    function playLowFuel(vol) {
      const c = getAudioContext();
      if (!c) return;
      const t0 = c.currentTime + 0.01;
      const masterGain = c.createGain();
      masterGain.gain.setValueAtTime(vol * 0.8, t0);
      masterGain.connect(c.destination);

      const osc = c.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, t0);
      const g = c.createGain();
      g.gain.setValueAtTime(0.001, t0);
      g.gain.linearRampToValueAtTime(0.65, t0 + 0.02);
      g.gain.setValueAtTime(0.65, t0 + 0.14);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.20);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(t0);
      osc.stop(t0 + 0.21);
    }

    function playBusDoors(vol) {
      const c = getAudioContext();
      if (!c) return;
      const t0 = c.currentTime + 0.01;
      const masterGain = c.createGain();
      masterGain.gain.setValueAtTime(vol * 0.8, t0);
      masterGain.connect(c.destination);

      const dur = 0.35;
      const noiseBuf = createNoiseBuffer(c, dur);
      const noiseSrc = c.createBufferSource();
      noiseSrc.buffer = noiseBuf;
      const lpf = c.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.setValueAtTime(700, t0);
      const gNoise = c.createGain();
      gNoise.gain.setValueAtTime(0.35, t0);
      gNoise.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
      noiseSrc.connect(lpf);
      lpf.connect(gNoise);
      gNoise.connect(masterGain);
      noiseSrc.start(t0);

      [
        { f: 659.25, start: t0 + 0.15, dur: 0.18 },
        { f: 523.25, start: t0 + 0.30, dur: 0.35 }
      ].forEach((bell) => {
        const osc = c.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(bell.f, bell.start);
        const g = c.createGain();
        g.gain.setValueAtTime(0.5, bell.start);
        g.gain.exponentialRampToValueAtTime(0.001, bell.start + bell.dur);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(bell.start);
        osc.stop(bell.start + bell.dur + 0.01);
      });
    }

    function playBusComfortWarn(vol) {
      const c = getAudioContext();
      if (!c) return;
      const t0 = c.currentTime + 0.01;
      const masterGain = c.createGain();
      masterGain.gain.setValueAtTime(vol * 0.75, t0);
      masterGain.connect(c.destination);

      const osc = c.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(392, t0);
      osc.frequency.exponentialRampToValueAtTime(330, t0 + 0.22);
      const g = c.createGain();
      g.gain.setValueAtTime(0.5, t0);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.25);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(t0);
      osc.stop(t0 + 0.26);
    }

    function playTruckPneumoHorn(vol) {
      const c = getAudioContext();
      if (!c) return;
      const t0 = c.currentTime + 0.01;
      const masterGain = c.createGain();
      masterGain.gain.setValueAtTime(vol * 0.9, t0);
      masterGain.connect(c.destination);

      const dur = 0.55;
      [220, 277.18].forEach((f) => {
        const osc = c.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, t0);
        const lpf = c.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.setValueAtTime(800, t0);
        const g = c.createGain();
        g.gain.setValueAtTime(0.001, t0);
        g.gain.linearRampToValueAtTime(0.45, t0 + 0.04);
        g.gain.setValueAtTime(0.45, t0 + dur - 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
        osc.connect(lpf);
        lpf.connect(g);
        g.connect(masterGain);
        osc.start(t0);
        osc.stop(t0 + dur + 0.01);
      });
    }

    function playCBRadio(vol) {
      const c = getAudioContext();
      if (!c) return;
      const t0 = c.currentTime + 0.01;
      const masterGain = c.createGain();
      masterGain.gain.setValueAtTime(vol * 0.8, t0);
      masterGain.connect(c.destination);

      const noiseBuf = createNoiseBuffer(c, 0.06);
      const src = c.createBufferSource();
      src.buffer = noiseBuf;
      const bpf = c.createBiquadFilter();
      bpf.type = 'bandpass';
      bpf.frequency.setValueAtTime(1200, t0);
      const gNoise = c.createGain();
      gNoise.gain.setValueAtTime(0.6, t0);
      gNoise.gain.exponentialRampToValueAtTime(0.001, t0 + 0.05);
      src.connect(bpf);
      bpf.connect(gNoise);
      gNoise.connect(masterGain);
      src.start(t0);

      const tBeep = t0 + 0.09;
      const osc = c.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.5, tBeep);
      const gBeep = c.createGain();
      gBeep.gain.setValueAtTime(0.45, tBeep);
      gBeep.gain.exponentialRampToValueAtTime(0.001, tBeep + 0.11);
      osc.connect(gBeep);
      gBeep.connect(masterGain);
      osc.start(tBeep);
      osc.stop(tBeep + 0.12);
    }

    return {
      playSpeeding,
      playRedSignal,
      playCrash,
      playNoLights,
      playTachograph,
      playWrongWay,
      playWarningChime,
      playRefuel,
      playTollgate,
      playFerry,
      playTrain,
      playJobDelivered,
      playJobCancelled,
      playCargoDamage,
      playService,
      playLowFuel,
      playBusDoors,
      playBusComfortWarn,
      playTruckPneumoHorn,
      playCBRadio
    };
  })();

  function playEventAudio(type, offence) {
    const etsCfg = config.ets2 || {};
    if (etsCfg.eventSoundEnabled === false) return;
    const vol = typeof etsCfg.eventSoundVolume === 'number'
      ? Math.max(0, Math.min(1, etsCfg.eventSoundVolume))
      : 0.65;
    if (vol <= 0) return;

    const soundKey = offence || type;
    const candidatePath = `./assets/sounds/${soundKey}.mp3`;

    try {
      const audio = new Audio(candidatePath);
      audio.volume = vol;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          synthesizeEventSound(type, offence, vol);
        });
      }
    } catch (_) {
      synthesizeEventSound(type, offence, vol);
    }
  }

  function synthesizeEventSound(type, offence, vol) {
    if (type === 'fine') {
      switch (offence) {
        case 'speeding':
        case 'speeding_camera':
          TelemetrySoundEngine.playSpeeding(vol);
          break;
        case 'red_signal':
          TelemetrySoundEngine.playRedSignal(vol);
          break;
        case 'crash':
          TelemetrySoundEngine.playCrash(vol);
          break;
        case 'no_lights':
          TelemetrySoundEngine.playNoLights(vol);
          break;
        case 'avoid_sleeping':
          TelemetrySoundEngine.playTachograph(vol);
          break;
        case 'wrong_way':
          TelemetrySoundEngine.playWrongWay(vol);
          break;
        case 'avoid_weighing':
        case 'illegal_trailer':
        case 'avoid_inspection':
        case 'illegal_border_crossing':
        case 'hard_shoulder_violation':
        case 'damaged_vehicle':
        case 'damaged_vehicle_usage':
        default:
          TelemetrySoundEngine.playWarningChime(vol);
          break;
      }
    } else if (type === 'tollgate') {
      TelemetrySoundEngine.playTollgate(vol);
    } else if (type === 'refuel') {
      TelemetrySoundEngine.playRefuel(vol);
    } else if (type === 'ferry') {
      TelemetrySoundEngine.playFerry(vol);
    } else if (type === 'train') {
      TelemetrySoundEngine.playTrain(vol);
    } else if (type === 'job_delivered') {
      TelemetrySoundEngine.playJobDelivered(vol);
    } else if (type === 'job_cancelled') {
      TelemetrySoundEngine.playJobCancelled(vol);
    } else if (type === 'cargo_damage') {
      TelemetrySoundEngine.playCargoDamage(vol);
    } else if (type === 'service') {
      TelemetrySoundEngine.playService(vol);
    } else if (type === 'low_fuel') {
      TelemetrySoundEngine.playLowFuel(vol);
    } else if (type === 'bus_stop') {
      TelemetrySoundEngine.playBusDoors(vol);
    } else if (type === 'bus_comfort') {
      TelemetrySoundEngine.playBusComfortWarn(vol);
    } else if (type === 'chat_honk') {
      TelemetrySoundEngine.playTruckPneumoHorn(vol);
    } else if (type === 'chat_cb') {
      TelemetrySoundEngine.playCBRadio(vol);
    } else if (type === 'chat_route' || type === 'chat_stats' || type === 'chat_truck' || type === 'chat_driver') {
      TelemetrySoundEngine.playWarningChime(vol * 0.7);
    }
  }

  function resolveEventDetails(event) {
    const type = event.type || 'fine';
    const offence = event.offence || '';
    const amount = Number(event.amount) || 0;
    const xp = Number(event.xp) || 0;
    const source = event.source || '';
    const target = event.target || '';

    let category = '';
    let title = '';
    let valueText = '';
    let subText = '';
    let badgeText = '';
    let svgIcon = '';
    let cardModifier = type;
    let summaryMetrics = null;
    let durationMs = 4500;

    if (type === 'fine') {
      category = t('eventCategoryFine');
      badgeText = t('badgeFine');
      cardModifier = 'fine';
      valueText = amount > 0 ? `− € ${formatIntWithSpaces(amount)}` : '';

      switch (offence) {
        case 'speeding':
          title = t('eventFineSpeeding');
          svgIcon = EVENT_SVG_ICONS.speeding;
          break;
        case 'speeding_camera':
          title = t('eventFineSpeedingCamera');
          svgIcon = EVENT_SVG_ICONS.speeding_camera;
          break;
        case 'red_signal':
          title = t('eventFineRedSignal');
          svgIcon = EVENT_SVG_ICONS.red_signal;
          break;
        case 'crash':
          title = t('eventFineCrash');
          svgIcon = EVENT_SVG_ICONS.crash;
          break;
        case 'no_lights':
          title = t('eventFineNoLights');
          svgIcon = EVENT_SVG_ICONS.no_lights;
          break;
        case 'avoid_sleeping':
          title = t('eventFineAvoidSleeping');
          svgIcon = EVENT_SVG_ICONS.avoid_sleeping;
          break;
        case 'wrong_way':
          title = t('eventFineWrongWay');
          svgIcon = EVENT_SVG_ICONS.wrong_way;
          break;
        case 'avoid_weighing':
          title = t('eventFineAvoidWeighing');
          svgIcon = EVENT_SVG_ICONS.avoid_weighing;
          break;
        case 'illegal_trailer':
          title = t('eventFineIllegalTrailer');
          svgIcon = EVENT_SVG_ICONS.illegal_trailer;
          break;
        case 'avoid_inspection':
          title = t('eventFineAvoidInspection');
          svgIcon = EVENT_SVG_ICONS.avoid_weighing;
          break;
        case 'illegal_border_crossing':
          title = t('eventFineIllegalBorderCrossing');
          svgIcon = EVENT_SVG_ICONS.illegal_border_crossing;
          break;
        case 'hard_shoulder_violation':
          title = t('eventFineHardShoulderViolation');
          svgIcon = EVENT_SVG_ICONS.hard_shoulder_violation;
          break;
        case 'damaged_vehicle':
        case 'damaged_vehicle_usage':
          title = t('eventFineDamagedVehicleUsage');
          svgIcon = EVENT_SVG_ICONS.damaged_vehicle;
          break;
        default:
          title = offence ? offence.replace(/_/g, ' ') : t('eventFineGeneric');
          svgIcon = EVENT_SVG_ICONS.generic_fine;
          break;
      }
    } else if (type === 'tollgate') {
      category = t('eventCategoryToll');
      title = t('eventTollTitle');
      badgeText = t('badgeToll');
      cardModifier = 'tollgate';
      valueText = amount > 0 ? `− € ${formatIntWithSpaces(amount)}` : `€ 0`;
      svgIcon = EVENT_SVG_ICONS.tollgate;
    } else if (type === 'refuel') {
      category = t('eventCategoryRefuel');
      title = t('eventRefuelTitle');
      badgeText = t('badgeFuel');
      cardModifier = 'refuel';
      valueText = `+ ${amount} ${t('l')}`;
      if (event.currentFuel) {
        subText = `(${event.currentFuel} ${t('l')})`;
      }
      svgIcon = EVENT_SVG_ICONS.refuel;
    } else if (type === 'ferry') {
      category = t('eventCategoryFerry');
      title = (source && target) ? `${source} ➔ ${target}` : t('eventFerryTitle');
      badgeText = t('badgeFerry');
      cardModifier = 'ferry';
      valueText = amount > 0 ? `− € ${formatIntWithSpaces(amount)}` : `€ 0`;
      if (source && target) {
        subText = t('eventFerryTitle');
      }
      svgIcon = EVENT_SVG_ICONS.ferry;
    } else if (type === 'train') {
      category = t('eventCategoryTrain');
      title = (source && target) ? `${source} ➔ ${target}` : t('eventTrainTitle');
      badgeText = t('badgeTrain');
      cardModifier = 'train';
      valueText = amount > 0 ? `− € ${formatIntWithSpaces(amount)}` : `€ 0`;
      if (source && target) {
        subText = t('eventTrainTitle');
      }
      svgIcon = EVENT_SVG_ICONS.train;
    } else if (type === 'job_delivered') {
      category = t('eventCategoryJobDelivered');
      title = t('eventJobDeliveredTitle');
      badgeText = t('badgeDelivered');
      cardModifier = 'job_delivered';
      valueText = amount > 0 ? `+ € ${formatIntWithSpaces(amount)}` : `+ € 0`;
      if (xp > 0) {
        subText = `(+ ${xp} XP)`;
      }
      svgIcon = EVENT_SVG_ICONS.job_delivered;
      if (event.summaryMetrics) {
        summaryMetrics = event.summaryMetrics;
        cardModifier = 'job_delivered event-toast-card--summary';
        durationMs = 7000;
      }
    } else if (type === 'job_cancelled') {
      category = t('eventCategoryJobCancelled');
      title = t('eventJobCancelledTitle');
      badgeText = t('badgeCancelled');
      cardModifier = 'job_cancelled';
      valueText = amount > 0 ? `− € ${formatIntWithSpaces(amount)}` : `€ 0`;
      svgIcon = EVENT_SVG_ICONS.job_cancelled;
    } else if (type === 'cargo_damage') {
      category = t('eventCategoryCargoDamage');
      title = event.title || t('eventCargoDamageTitle');
      badgeText = t('badgeDamage');
      cardModifier = 'cargo_damage';
      valueText = event.valueText || `+${event.amount || '1.0'}%`;
      svgIcon = EVENT_SVG_ICONS.cargo_damage;
    } else if (type === 'service') {
      category = t('eventCategoryService');
      title = event.title || t('eventServiceTitle');
      badgeText = t('badgeService');
      cardModifier = 'service';
      valueText = t('eventServiceValue');
      svgIcon = EVENT_SVG_ICONS.service;
    } else if (type === 'low_fuel') {
      category = t('eventCategoryLowFuel');
      title = event.title || t('eventLowFuelTitle');
      badgeText = t('badgeLowFuel');
      cardModifier = 'low_fuel';
      valueText = event.valueText || `${event.amount || 45} ${t('l')}`;
      if (event.subText) subText = event.subText;
      svgIcon = EVENT_SVG_ICONS.low_fuel;
    } else if (type === 'bus_stop') {
      category = t('eventCategoryBusStop');
      title = event.title || t('eventBusStopTitle');
      badgeText = t('badgeCoach');
      cardModifier = 'bus_stop';
      valueText = event.valueText || event.target || 'Station';
      svgIcon = EVENT_SVG_ICONS.bus_stop;
    } else if (type === 'bus_comfort') {
      category = t('eventCategoryBusComfort');
      title = event.title || t('eventBusComfortTitle');
      badgeText = t('badgeComfort');
      cardModifier = 'bus_comfort';
      valueText = event.valueText || `-${event.amount || 10}%`;
      svgIcon = EVENT_SVG_ICONS.bus_comfort;
    } else if (type === 'chat_honk') {
      category = t('eventCategoryChatHonk');
      title = event.title || `${t('eventChatHonkTitle')} @${event.user || 'Viewer'}`;
      badgeText = t('badgeHonk');
      cardModifier = 'chat_honk';
      valueText = t('eventChatHonkValue');
      svgIcon = EVENT_SVG_ICONS.chat_honk;
    } else if (type === 'chat_cb') {
      category = t('eventCategoryChatCb');
      title = `@${event.user || 'Driver'}`;
      badgeText = t('badgeRadio');
      cardModifier = 'chat_cb';
      valueText = event.text || event.valueText || '';
      svgIcon = EVENT_SVG_ICONS.chat_cb;
    } else if (type === 'chat_route') {
      category = t('eventCategoryChatRoute');
      title = event.title || t('noRouteTitle');
      badgeText = t('badgeRoute');
      cardModifier = 'chat_info';
      valueText = event.valueText || '';
      subText = event.subText || '';
      svgIcon = EVENT_SVG_ICONS.chat_route;
    } else if (type === 'chat_stats') {
      category = t('eventCategoryChatStats');
      title = event.title || 'Stats';
      badgeText = t('badgeStats');
      cardModifier = 'chat_info';
      valueText = event.valueText || '';
      subText = event.subText || '';
      svgIcon = EVENT_SVG_ICONS.chat_stats;
    } else if (type === 'chat_truck') {
      category = t('eventCategoryChatTruck');
      title = event.title || 'Truck';
      badgeText = t('badgeTruck');
      cardModifier = 'chat_info';
      valueText = event.valueText || '';
      subText = event.subText || '';
      svgIcon = EVENT_SVG_ICONS.chat_truck;
    } else if (type === 'chat_driver') {
      category = t('eventCategoryChatDriver');
      title = event.title || 'Driver';
      badgeText = t('badgeDriver');
      cardModifier = 'chat_info';
      valueText = event.valueText || '';
      subText = event.subText || '';
      svgIcon = EVENT_SVG_ICONS.chat_driver;
    }

    return {
      category,
      title,
      valueText,
      subText,
      badgeText,
      svgIcon,
      cardModifier,
      summaryMetrics,
      durationMs
    };
  }

  const eventToastQueue = [];
  let isEventToastShowing = false;
  let eventToastTimer = null;
  let eventToastLeaveTimer = null;

  function enqueueTelemetryEvent(eventData) {
    const etsCfg = config.ets2 || {};
    if (etsCfg.eventsEnabled === false) return;
    eventToastQueue.push(eventData);
    processNextTelemetryEvent();
  }

  function processNextTelemetryEvent() {
    if (isEventToastShowing || eventToastQueue.length === 0) return;
    const eventData = eventToastQueue.shift();
    isEventToastShowing = true;

    showTelemetryEventCard(eventData, () => {
      isEventToastShowing = false;
      setTimeout(processNextTelemetryEvent, 250);
    });
  }

  function getToastContainer() {
    let container = global.document.getElementById('telemetry-event-toast');
    if (!container) {
      container = global.document.createElement('div');
      container.id = 'telemetry-event-toast';
      container.className = 'telemetry-event-toast';
      container.setAttribute('aria-live', 'assertive');
      container.setAttribute('aria-atomic', 'true');
      const scene = global.document.querySelector('.scene-desktop') ||
                    global.document.querySelector('.scene-vertical') ||
                    global.document.body;
      scene.appendChild(container);
    }
    return container;
  }

  function showTelemetryEventCard(eventData, onComplete) {
    const container = getToastContainer();
    const details = resolveEventDetails(eventData);

    const card = global.document.createElement('div');
    card.className = `event-toast-card event-toast-card--${details.cardModifier}`;

    let summaryHtml = '';
    if (details.summaryMetrics) {
      const sm = details.summaryMetrics;
      summaryHtml = `
        <div class="event-toast-summary-metrics">
          ${sm.route ? `<div class="event-toast-metric-item"><span class="event-toast-metric-label">${escapeHtml(t('eventSummaryRoute'))}</span> <span class="event-toast-metric-val">${escapeHtml(sm.route)}</span></div>` : ''}
          ${sm.distance ? `<div class="event-toast-metric-item"><span class="event-toast-metric-label">${escapeHtml(t('eventSummaryDistance'))}</span> <span class="event-toast-metric-val">${escapeHtml(sm.distance)}</span></div>` : ''}
          ${sm.revenue ? `<div class="event-toast-metric-item"><span class="event-toast-metric-label">${escapeHtml(t('eventSummaryRevenue'))}</span> <span class="event-toast-metric-val event-toast-metric-val--accent">+ € ${escapeHtml(formatIntWithSpaces(sm.revenue))}</span></div>` : ''}
          ${sm.xp ? `<div class="event-toast-metric-item"><span class="event-toast-metric-label">${escapeHtml(t('eventSummaryXP'))}</span> <span class="event-toast-metric-val">+ ${escapeHtml(sm.xp)} XP</span></div>` : ''}
          ${sm.finesText ? `<div class="event-toast-metric-item"><span class="event-toast-metric-label">${escapeHtml(t('eventSummaryFines'))}</span> <span class="event-toast-metric-val event-toast-metric-val--warn">${escapeHtml(sm.finesText)}</span></div>` : ''}
        </div>
        ${sm.winners ? `<div class="event-toast-winners-row"><span class="event-toast-winners-tag">${escapeHtml(t('badgeWinners'))}:</span> <span>${escapeHtml(sm.winners)}</span></div>` : ''}
      `;
    }

    card.innerHTML = `
      <div class="event-toast-icon-wrap" aria-hidden="true">
        ${details.svgIcon}
      </div>
      <div class="event-toast-content">
        <div class="event-toast-head">
          <span class="event-toast-category">${escapeHtml(details.category)}</span>
          ${details.badgeText ? `<span class="event-toast-badge">${escapeHtml(details.badgeText)}</span>` : ''}
        </div>
        <div class="event-toast-title">${escapeHtml(details.title)}</div>
        <div class="event-toast-desc">
          ${details.valueText ? `<span class="event-toast-value">${escapeHtml(details.valueText)}</span>` : ''}
          ${details.subText ? `<span class="event-toast-sub">${escapeHtml(details.subText)}</span>` : ''}
        </div>
        ${summaryHtml}
      </div>
    `;

    container.innerHTML = '';
    container.appendChild(card);

    playEventAudio(eventData.type, eventData.offence);

    requestAnimationFrame(() => {
      card.classList.add('is-visible');
    });

    const displayMs = Math.max(3000, Number(details.durationMs) || 4500);

    if (eventToastTimer) clearTimeout(eventToastTimer);
    eventToastTimer = setTimeout(() => {
      card.classList.remove('is-visible');
      card.classList.add('is-leaving');

      if (eventToastLeaveTimer) clearTimeout(eventToastLeaveTimer);
      eventToastLeaveTimer = setTimeout(() => {
        if (card.parentNode === container) {
          container.removeChild(card);
        }
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }, 350);
    }, displayMs);
  }

  const sessionStats = {
    jobsCompleted: 0,
    kmDriven: 0,
    maxSpeed: 0,
    revenue: 0,
    finesCount: 0,
    finesTotal: 0,
    refuelsCount: 0,
    currentTripFines: 0,
    currentTripFinesAmount: 0,
    safetyScore: 100
  };

  const tripBets = new Map();

  let lastCargoDmg = null;
  let lastTruckWear = null;
  let lastCargoDmgAlertAt = 0;
  let lastServiceAlertAt = 0;
  let lowFuelAlerted = false;
  let lastBusStopId = null;
  let lastBusSat = null;
  let latestJobStateSnapshot = null;
  let latestIdentitySnapshot = null;

  function checkCargoAndDamageEvents(data, speedKmh) {
    const now = Date.now();
    const currentCargoDmg = parseFiniteTelemetryNumber(
      data.cargoDmg ?? data.jobDmg ?? (data.cargo && data.cargo.damage)
    );

    const wEng = Number(data.wEngine ?? (data.truck && data.truck.wearEngine) ?? 0);
    const wCh = Number(data.wChassis ?? (data.truck && data.truck.wearChassis) ?? 0);
    const wTr = Number(data.wTrans ?? (data.truck && data.truck.wearTransmission) ?? 0);
    const wCb = Number(data.wCabin ?? (data.truck && data.truck.wearCabin) ?? 0);
    const currentTruckWear = (wEng * 0.35 + wCh * 0.35 + wTr * 0.15 + wCb * 0.15);

    if (lastCargoDmg !== null && currentCargoDmg !== null) {
      const deltaCargo = currentCargoDmg - lastCargoDmg;
      if (deltaCargo >= 0.009 && (now - lastCargoDmgAlertAt >= 5000)) {
        lastCargoDmgAlertAt = now;
        enqueueTelemetryEvent({
          type: 'cargo_damage',
          amount: (deltaCargo * 100).toFixed(1),
          valueText: `+${(deltaCargo * 100).toFixed(1)}%`
        });
        sessionStats.safetyScore = Math.max(10, sessionStats.safetyScore - 8);
      }
    }

    if (lastTruckWear !== null) {
      const deltaWear = currentTruckWear - lastTruckWear;
      if (deltaWear >= 0.03 && (now - lastCargoDmgAlertAt >= 5000)) {
        lastCargoDmgAlertAt = now;
        enqueueTelemetryEvent({
          type: 'cargo_damage',
          title: t('eventCategoryCargoDamage'),
          amount: (deltaWear * 100).toFixed(1),
          valueText: `+${(deltaWear * 100).toFixed(1)}%`
        });
        sessionStats.safetyScore = Math.max(10, sessionStats.safetyScore - 5);
      }

      if (speedKmh < 1.0 && lastTruckWear >= 0.03 && currentTruckWear <= 0.005) {
        if (now - lastServiceAlertAt >= 10000) {
          lastServiceAlertAt = now;
          enqueueTelemetryEvent({ type: 'service' });
        }
      }
    }

    lastCargoDmg = currentCargoDmg;
    lastTruckWear = currentTruckWear;
  }

  function checkLowFuelWarning(currentFuel, data) {
    if (typeof currentFuel !== 'number' || !Number.isFinite(currentFuel) || currentFuel <= 0) return;
    const fuelCap = parseFiniteTelemetryNumber(data.fuelCapacity ?? (data.fuel && data.fuel.capacity)) || 600;
    const isWarn = isTruthyTelemetryFlag(data.fuelWarning ?? data.fuelWarn ?? (data.fuel && data.fuel.warning));

    if (currentFuel < fuelCap * 0.12 || isWarn) {
      if (!lowFuelAlerted) {
        lowFuelAlerted = true;
        const rawRange = data.fuelRange ?? (data.fuel && data.fuel.range);
        const rangeText = rawRange ? `(~${Math.round(rawRange)} ${t('km')})` : '';
        enqueueTelemetryEvent({
          type: 'low_fuel',
          amount: Math.round(currentFuel),
          valueText: `${Math.round(currentFuel)} ${t('l')}`,
          subText: rangeText
        });
      }
    } else if (currentFuel > fuelCap * 0.25) {
      lowFuelAlerted = false;
    }
  }

  function checkBusEvents(data) {
    const isBus = isTruthyTelemetryFlag(data.isBusJob) || data.jobMarket === 'bus_job' || data.jobMarket === 'coach';
    if (!isBus) return;

    const stopName = (data.destinationStop && (data.destinationStop.name || data.destinationStop.id)) ||
                     (data.sourceStop && (data.sourceStop.name || data.sourceStop.id));
    if (stopName && stopName !== lastBusStopId) {
      if (lastBusStopId !== null) {
        enqueueTelemetryEvent({
          type: 'bus_stop',
          target: stopName,
          valueText: stopName
        });
      }
      lastBusStopId = stopName;
    }

    const sat = parseFiniteTelemetryNumber(data.busSat);
    if (sat !== null) {
      if (lastBusSat !== null && sat < lastBusSat - 0.075) {
        const drop = Math.round((lastBusSat - sat) * 100);
        enqueueTelemetryEvent({
          type: 'bus_comfort',
          amount: drop,
          valueText: `-${drop}%`
        });
      }
      lastBusSat = sat;
    }
  }

  let prevFuel = null;
  const refuelTracking = {
    active: false,
    startFuel: 0,
    lastFuel: 0,
    lastIncreaseTime: 0
  };

  function checkRefuelProgress(currentFuel, speedKmh) {
    if (typeof currentFuel !== 'number' || !Number.isFinite(currentFuel) || currentFuel <= 0) return;

    if (prevFuel === null) {
      prevFuel = currentFuel;
      return;
    }

    const now = Date.now();

    if (speedKmh < 1.0) {
      const benchmarkFuel = refuelTracking.active ? refuelTracking.lastFuel : prevFuel;
      if (currentFuel > benchmarkFuel + 0.25) {
        if (!refuelTracking.active) {
          refuelTracking.active = true;
          refuelTracking.startFuel = prevFuel;
        }
        refuelTracking.lastFuel = currentFuel;
        refuelTracking.lastIncreaseTime = now;
      }
    }

    if (refuelTracking.active) {
      const timeSinceIncrease = now - refuelTracking.lastIncreaseTime;
      const speedMoved = speedKmh >= 1.0;
      const fuelStopped = timeSinceIncrease >= 2000;

      if (fuelStopped || speedMoved) {
        const addedLiters = Math.round(refuelTracking.lastFuel - refuelTracking.startFuel);
        refuelTracking.active = false;
        if (addedLiters >= 5) {
          sessionStats.refuelsCount += 1;
          enqueueTelemetryEvent({
            type: 'refuel',
            amount: addedLiters,
            currentFuel: Math.round(refuelTracking.lastFuel)
          });
        }
      }
    }

    prevFuel = currentFuel;
  }

  let lastProcessedEventSeq = 0;

  function handleIncomingTelemetryEvent(lastEvent) {
    if (!lastEvent || typeof lastEvent !== 'object') return;
    const seq = Number(lastEvent.seq);
    if (!Number.isFinite(seq) || seq <= 0) return;

    if (lastProcessedEventSeq === 0) {
      lastProcessedEventSeq = seq;
      return;
    }

    if (seq > lastProcessedEventSeq) {
      lastProcessedEventSeq = seq;

      if (lastEvent.type === 'fine') {
        const amt = Number(lastEvent.amount) || 0;
        sessionStats.finesCount += 1;
        sessionStats.finesTotal += amt;
        sessionStats.currentTripFines += 1;
        sessionStats.currentTripFinesAmount += amt;
        sessionStats.safetyScore = Math.max(10, sessionStats.safetyScore - 4);
      } else if (lastEvent.type === 'job_delivered') {
        const amt = Number(lastEvent.amount) || 0;
        sessionStats.jobsCompleted += 1;
        sessionStats.revenue += amt;

        const outcome = sessionStats.currentTripFines === 0 ? 'clean' : 'fine';
        const winningUsers = [];
        tripBets.forEach((bet, user) => {
          if (bet === outcome) winningUsers.push(`@${user}`);
        });

        const routeText = latestJobStateSnapshot ? latestJobStateSnapshot.routeText : '';
        const finesSummary = sessionStats.currentTripFines === 0
          ? (lang === 'ru' ? '0 (ЧИСТЫЙ РЕЙС)' : '0 (CLEAN TRIP)')
          : `${sessionStats.currentTripFines} (€ ${formatIntWithSpaces(sessionStats.currentTripFinesAmount)})`;

        lastEvent.summaryMetrics = {
          route: routeText,
          distance: latestJobStateSnapshot ? latestJobStateSnapshot.distanceText : '',
          revenue: amt,
          xp: Number(lastEvent.xp) || 0,
          finesText: finesSummary,
          winners: winningUsers.length > 0 ? winningUsers.join(', ') : t('eventSummaryNoBets')
        };

        tripBets.clear();
        sessionStats.currentTripFines = 0;
        sessionStats.currentTripFinesAmount = 0;
      }

      enqueueTelemetryEvent(lastEvent);
    }
  }

  app.triggerChatCommand = function(cmdType, username, text, meta) {
    const etsCfg = config.ets2 || {};
    if (etsCfg.eventsEnabled === false) return;

    if (cmdType === 'honk') {
      enqueueTelemetryEvent({
        type: 'chat_honk',
        user: username
      });
    } else if (cmdType === 'cb') {
      enqueueTelemetryEvent({
        type: 'chat_cb',
        user: username,
        text: text
      });
    } else if (cmdType === 'route') {
      const routeText = (latestJobStateSnapshot && latestJobStateSnapshot.routeText) || config.ets2.routeText || t('noRouteTitle');
      const dist = (latestJobStateSnapshot && latestJobStateSnapshot.distanceText) || '';
      enqueueTelemetryEvent({
        type: 'chat_route',
        title: routeText,
        valueText: dist ? `${t('range')}: ${dist}` : ''
      });
    } else if (cmdType === 'stats') {
      const revText = `€ ${formatIntWithSpaces(sessionStats.revenue)}`;
      const finesText = `${sessionStats.finesCount} (€ ${formatIntWithSpaces(sessionStats.finesTotal)})`;
      enqueueTelemetryEvent({
        type: 'chat_stats',
        title: lang === 'ru'
          ? `Рейсов: ${sessionStats.jobsCompleted} | Доход: ${revText}`
          : `Jobs: ${sessionStats.jobsCompleted} | Revenue: ${revText}`,
        valueText: lang === 'ru'
          ? `Пройдено: ${sessionStats.kmDriven} км | Штрафов: ${finesText}`
          : `Driven: ${sessionStats.kmDriven} km | Fines: ${finesText}`
      });
    } else if (cmdType === 'truck') {
      const model = (latestIdentitySnapshot && latestIdentitySnapshot.modelText) || 'MAN / SCANIA / VOLVO';
      const plate = (latestIdentitySnapshot && latestIdentitySnapshot.plateText) || '';
      const fuelStr = prevFuel ? `${Math.round(prevFuel)} ${t('l')}` : '';
      enqueueTelemetryEvent({
        type: 'chat_truck',
        title: model,
        valueText: plate ? `[${plate}] ${fuelStr}` : fuelStr
      });
    } else if (cmdType === 'driver') {
      const driver = config.ets2.driverName || 'FOOZZEE';
      enqueueTelemetryEvent({
        type: 'chat_driver',
        title: `${t('driverPrefix')}: ${driver}`,
        valueText: `Safety Score: ${sessionStats.safetyScore}% | Max: ${sessionStats.maxSpeed} ${t('kmh')}`
      });
    }
  };

  app.recordTripBet = function(username, betType) {
    if (!username) return;
    const cleanBet = (betType === 'clean' || betType === 'чистый') ? 'clean' :
                    (betType === 'fine' || betType === 'штраф') ? 'fine' : null;
    if (cleanBet) {
      tripBets.set(String(username).toLowerCase(), cleanBet);
      return true;
    }
    return false;
  };

  app.getSessionStats = function() {
    return { ...sessionStats, activeBets: tripBets.size };
  };

  global.testTelemetryEvent = function(type, offence, customAmount) {
    let tKind = String(type || 'fine').toLowerCase();
    let off = String(offence || '').toLowerCase();

    const knownOffences = [
      'speeding', 'speeding_camera', 'red_signal', 'crash', 'no_lights',
      'avoid_sleeping', 'wrong_way', 'avoid_weighing', 'illegal_trailer',
      'avoid_inspection', 'illegal_border_crossing', 'hard_shoulder_violation',
      'damaged_vehicle', 'damaged_vehicle_usage', 'generic'
    ];
    if (knownOffences.includes(tKind)) {
      off = tKind;
      tKind = 'fine';
    }

    const mock = {
      seq: Date.now(),
      type: tKind,
      offence: off,
      amount: Number(customAmount) || 0,
      xp: 0,
      source: '',
      target: ''
    };

    if (tKind === 'fine') {
      if (!off) off = 'speeding';
      mock.offence = off;
      mock.amount = customAmount ? Number(customAmount) :
                    (off === 'speeding' || off === 'speeding_camera') ? 550 :
                    (off === 'red_signal') ? 350 :
                    (off === 'crash') ? 400 :
                    (off === 'no_lights') ? 150 :
                    (off === 'avoid_sleeping') ? 150 :
                    (off === 'wrong_way') ? 100 : 250;
    } else if (tKind === 'tollgate') {
      mock.amount = customAmount ? Number(customAmount) : 45;
    } else if (tKind === 'refuel') {
      mock.amount = customAmount ? Number(customAmount) : 185;
      mock.currentFuel = 540;
    } else if (tKind === 'ferry') {
      mock.amount = customAmount ? Number(customAmount) : 320;
      mock.source = lang === 'ru' ? 'Дувр' : 'Dover';
      mock.target = lang === 'ru' ? 'Кале' : 'Calais';
    } else if (tKind === 'train') {
      mock.amount = customAmount ? Number(customAmount) : 260;
      mock.source = lang === 'ru' ? 'Фолкстон' : 'Folkestone';
      mock.target = lang === 'ru' ? 'Кале' : 'Calais';
    } else if (tKind === 'job_delivered') {
      mock.amount = customAmount ? Number(customAmount) : 14850;
      mock.xp = 980;
      mock.summaryMetrics = {
        route: lang === 'ru' ? 'Берлин → Париж (24Т)' : 'Berlin → Paris (24T)',
        distance: '1 050 км',
        revenue: mock.amount,
        xp: 980,
        finesText: lang === 'ru' ? '0 (ЧИСТЫЙ РЕЙС)' : '0 (CLEAN TRIP)',
        winners: '@VipViewer, @Trucker_77'
      };
    } else if (tKind === 'job_cancelled') {
      mock.amount = customAmount ? Number(customAmount) : 12000;
    } else if (tKind === 'cargo_damage') {
      mock.amount = customAmount || '2.5';
      mock.valueText = `+${mock.amount}%`;
    } else if (tKind === 'service') {
      mock.valueText = t('eventServiceValue');
    } else if (tKind === 'low_fuel') {
      mock.amount = customAmount || 55;
      mock.subText = '(~110 км)';
    } else if (tKind === 'bus_stop') {
      mock.target = off || 'Berlin ZOB';
    } else if (tKind === 'bus_comfort') {
      mock.amount = customAmount || 12;
      mock.valueText = `-${mock.amount}%`;
    } else if (tKind === 'chat_honk') {
      mock.user = off || 'VipFan';
    } else if (tKind === 'chat_cb') {
      mock.user = off || 'Trucker_99';
      mock.text = '15 канал, как дорожка на Мюнхен?';
    } else if (tKind === 'chat_route' || tKind === 'chat_stats' || tKind === 'chat_truck' || tKind === 'chat_driver') {
      mock.title = 'Test Card';
      mock.valueText = 'Test Value';
    }

    enqueueTelemetryEvent(mock);
    return `[ETS2 Event Test] Dispatched: type="${tKind}", offence="${mock.offence}", amount=${mock.amount}`;
  };

  global.demoAllTelemetryEvents = function() {
    const list = [
      { type: 'chat_honk', user: 'VipViewer' },
      { type: 'chat_cb', user: 'Trucker_77', text: 'Всем привет в 15 канале! На Париж чисто?' },
      { type: 'cargo_damage', amount: '2.5', valueText: '+2.5%' },
      { type: 'fine', offence: 'speeding', amount: 550 },
      { type: 'fine', offence: 'red_signal', amount: 350 },
      { type: 'tollgate', amount: 48 },
      { type: 'refuel', amount: 240, currentFuel: 680 },
      { type: 'service' },
      { type: 'low_fuel', amount: 65, subText: '(~120 км)' },
      { type: 'bus_stop', target: 'Berlin Hbf' },
      { type: 'bus_comfort', amount: 15, valueText: '-15%' },
      { type: 'ferry', amount: 320, source: 'Dover', target: 'Calais' },
      {
        type: 'job_delivered',
        amount: 28400,
        xp: 1450,
        summaryMetrics: {
          route: lang === 'ru' ? 'Берлин → Париж (24Т)' : 'Berlin → Paris (24T)',
          distance: '1 050 км',
          revenue: 28400,
          xp: 1450,
          finesText: lang === 'ru' ? '0 (ЧИСТЫЙ РЕЙС)' : '0 (CLEAN TRIP)',
          winners: '@VipViewer, @SubPilot, @Trucker_77'
        }
      }
    ];

    list.forEach((evt) => {
      enqueueTelemetryEvent(evt);
    });

    return `[Demo] Enqueued ${list.length} telemetry events sequentially!`;
  };

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

    if (rpmTextEl) rpmTextEl.textContent = `${rpm} ${t('rpm')}`;
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
        cruiseEl.textContent = ccSpeed > 0 ? `${t('cruisePill')} ${ccSpeed}` : t('cruiseOn');
        cruiseEl.classList.add('is-active');
      } else {
        cruiseEl.textContent = t('cruiseStandby');
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

    latestJobStateSnapshot = jobState;
    latestIdentitySnapshot = identity;

    if (speedKmh > sessionStats.maxSpeed) {
      sessionStats.maxSpeed = speedKmh;
    }
    const currentOdo = parseFiniteTelemetryNumber(data.tripDriven ?? (data.trip && data.trip.driven) ?? data.driven);
    if (currentOdo && currentOdo > sessionStats.kmDriven) {
      sessionStats.kmDriven = Math.round(currentOdo);
    }

    const currentFuel = Number(data.fuel);
    if (Number.isFinite(currentFuel) && currentFuel > 0) {
      checkRefuelProgress(currentFuel, speedKmh);
      checkLowFuelWarning(currentFuel, data);
    }

    checkCargoAndDamageEvents(data, speedKmh);
    checkBusEvents(data);

    const lastEvent = data.lastEvent || (data.tel && data.tel.lastEvent);
    if (lastEvent) {
      handleIncomingTelemetryEvent(lastEvent);
    }
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
    if (raw.lastEvent !== undefined && merged.lastEvent === undefined) {
      merged.lastEvent = raw.lastEvent;
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
