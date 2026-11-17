# 🎮 Command Reference / Справочник команд

> **ETS2 / ATS Cockpit Telemetry Stream Overlay**  
> Complete technical reference for interactive Twitch chat commands and browser developer console testing methods.  
> Полное техническое руководство по интерактивным командам Twitch-чата и консольным методам тестирования оверлея.

[![Documentation](https://img.shields.io/badge/Documentation-Commands_Reference-blue?style=flat&logo=gitbook)](./commands.md)
[![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=flat)](./README.md)
[![License](https://img.shields.io/badge/License-MIT-purple?style=flat)](./LICENSE)

---

### 🌐 Language Navigation / Навигация по языкам

[![English Documentation](https://img.shields.io/badge/Documentation-English-2563eb?style=flat-square&logo=gitbook&logoColor=white)](#-english-documentation)
[![Русская документация](https://img.shields.io/badge/Документация-Русский-dc2626?style=flat-square&logo=gitbook&logoColor=white)](#-русская-документация)

*Dedicated language files / Отдельные файлы:* [English (`commands.en.md`)](./commands.en.md) • [Русский (`commands.ru.md`)](./commands.ru.md)

---

<a id="-english-documentation"></a>
## 🇬🇧 English Documentation

### 1. Interactive Twitch Chat Commands

All interactive chat commands are processed by `assets/js/ets2-chat.js`. Command permissions, rate limits, and cooldowns are governed by the `chatCommands` configuration block in `config.js` (`config.example.js`).

> [!NOTE]
> Streamer (broadcaster) and channel moderators bypass all rate limits and cooldown timers.

| Command | Aliases | Minimum Role | Cooldown (Global / User) | Action & HUD Display | Sound Synthesizer Effect |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `!honk` | `!гудок`, `!фафа`, `!клаксон` | `VIP & Above` | 60s / 120s | Displays purple greeting toast: `"HORN GREETING // @User"`. Shows pneumatic air horn SVG icon. | Dual-tone pneumatic truck horn (220 Hz + 277 Hz, rich harmonics, 550 ms). |
| `!cb <text>` | `!рация <текст>`, `!сиби <текст>` | `Followers` | 45s / 120s | Displays amber CB radio toast: `"CH 15 // @User"`. Shows CB microphone SVG icon. Strips URLs, 70 chars max. Blocked on `first-msg=1` for guests. | Radio squelch noise burst + filtered voiceband noise + Roger Beep (1046 Hz). |
| `!route` | `!job`, `!рейс`, `!маршрут`, `!груз` | `Everyone` | 30s / Global | Displays cyan GPS navigation toast showing current departure/destination cities, cargo name, and distance remaining. | Subtle electronic dashboard chime (harmonic triple pulse). |
| `!stats` | `!стата`, `!статистика`, `!стрим` | `Everyone` | 30s / Global | Displays cyan stream session card: completed deliveries, total revenue, km driven, and traffic fines tally. | Subtle electronic dashboard chime (harmonic triple pulse). |
| `!truck` | `!тягач`, `!автобус`, `!машина` | `Everyone` | 30s / Global | Displays cyan truck telemetry card: truck model, license plate number, fuel level, and estimated fuel range. | Subtle electronic dashboard chime (harmonic triple pulse). |
| `!driver` | `!водитель`, `!права`, `!рейтинг` | `Everyone` | 30s / Global | Displays cyan driver dossier card: driver handle, current Safety Score (100% scale), and stream max speed record. | Subtle electronic dashboard chime (harmonic triple pulse). |
| `!bet clean` | `!ставка чистый` | `Everyone` | None (Silent) | Registers viewer bet on clean delivery without traffic fines for the active job. | Silent registration (no screen spam). |
| `!bet fine` | `!ставка штраф` | `Everyone` | None (Silent) | Registers viewer bet on at least one traffic fine during the active job. | Silent registration (no screen spam). |

> [!TIP]
> When `config.chat.hideCommands: true` is enabled, valid command invocations are executed silently in the telemetry HUD without cluttering the chat viewport DOM.

---

### 2. Developer Console Test API

Open OBS Browser Source Developer Tools (`F12`) or open `ets2-desktop.html` directly in any Chromium-based browser to execute real-time diagnostic commands.

#### 2.1 Complete Automated HUD Demonstration
```javascript
// Sequentially executes all toast notifications, SVG vector icons, and synthesized audio effects
window.demoAllTelemetryEvents();
```

#### 2.2 Telemetry Event Dispatcher (`window.testTelemetryEvent`)

```javascript
// Syntax: window.testTelemetryEvent(type, subTypeOrOffence, customAmount)

// Traffic Fines (SCS Telemetry SDK gameplay offences)
window.testTelemetryEvent('update', 'v1.2.3');                      // Firmware update alert (CRT Power-On / Typewriter / Web Audio)
window.testTelemetryEvent('fine', 'speeding', 550);                 // Speeding violation
window.testTelemetryEvent('fine', 'speeding_camera', 550);          // Speed enforcement camera
window.testTelemetryEvent('fine', 'red_signal', 350);              // Red light infraction
window.testTelemetryEvent('fine', 'crash', 400);                   // Vehicle traffic accident
window.testTelemetryEvent('fine', 'no_lights', 150);               // Driving with headlights off
window.testTelemetryEvent('fine', 'avoid_sleeping', 150);           // Tachograph rest violation
window.testTelemetryEvent('fine', 'wrong_way', 100);               // Driving in opposite lane
window.testTelemetryEvent('fine', 'avoid_weighing', 250);          // Weigh station evasion
window.testTelemetryEvent('fine', 'illegal_trailer', 600);         // Prohibited trailer configuration
window.testTelemetryEvent('fine', 'avoid_inspection', 300);        // Vehicle inspection skipped
window.testTelemetryEvent('fine', 'illegal_border_crossing', 750); // State border checkpoint violation
window.testTelemetryEvent('fine', 'hard_shoulder_violation', 300); // Emergency shoulder driving
window.testTelemetryEvent('fine', 'damaged_vehicle', 450);         // Critical vehicle mechanical defect
window.testTelemetryEvent('fine', 'generic', 250);                 // General traffic regulation violation

// Tollgate, Station & Crossings
window.testTelemetryEvent('tollgate', null, 48);                   // Highway toll payment
window.testTelemetryEvent('refuel', null, 240);                     // Refueling finished (+240 L)
window.testTelemetryEvent('ferry', null, 320);                      // Dover ➔ Calais maritime ferry
window.testTelemetryEvent('train', null, 260);                      // Folkestone ➔ Calais rail shuttle

// Job Life-Cycle & Summary Cards
window.testTelemetryEvent('job_delivered', null, 28400);            // Job completed with 7.0s delivery card
window.testTelemetryEvent('job_cancelled', null, 12000);            // Contract cancellation penalty

// Technical & Fleet Detectors
window.testTelemetryEvent('cargo_damage', null, '3.5');             // Cargo damage jump (+3.5%)
window.testTelemetryEvent('service');                              // Service station overhaul (100% restored)
window.testTelemetryEvent('low_fuel', null, 65);                    // Low fuel reserve warning (65 L)

// DLC Coaches Events
window.testTelemetryEvent('bus_stop', 'Berlin ZOB');               // Coach terminal passenger boarding
window.testTelemetryEvent('bus_comfort', null, 15);                // Passenger comfort rating decrease (-15%)

// Direct Chat Event Invocations
window.testTelemetryEvent('chat_honk', 'VipPilot');                // Interactive horn test
window.testTelemetryEvent('chat_cb', 'Trucker_77');                // CB radio transmission test
```

#### 2.3 Simulated Twitch Chat Message Dispatcher (`window.testChatCommand`)

```javascript
// Syntax: window.testChatCommand(commandString, username, simulatedRole)
// Roles: 'viewer' | 'follower' | 'sub' | 'vip' | 'mod' | 'driver'

window.testChatCommand('!honk', 'VipPilot', 'vip');
window.testChatCommand('!cb 15 AM channel, road status on Paris?', 'Trucker_77', 'follower');
window.testChatCommand('!route', 'RegularViewer', 'viewer');
window.testChatCommand('!stats', 'RegularViewer', 'viewer');
window.testChatCommand('!truck', 'RegularViewer', 'viewer');
window.testChatCommand('!driver', 'RegularViewer', 'viewer');
window.testChatCommand('!bet clean', 'BetUser1', 'viewer');
window.testChatCommand('!bet fine', 'BetUser2', 'viewer');
```

#### 2.4 General Overlay Control Functions

| Console Function | Default Argument | Description |
| :--- | :--- | :--- |
| `testAlert(type, overrides)` | `'donate'` | Triggers alert popup (`'donate'`, `'sub'`, `'follow'`, `'raid'`, `'all'`). |
| `testChat(count, text)` | `1` | Injects mock viewer messages into chat viewport. |
| `testTelemetry(payload)` | Sample Packet | Renders live cockpit telemetry packet; pass `false` for offline standby. |
| `testTrack(title, artist)` | `'Nightcall'` / `'Kavinsky'` | Sets currently playing media track. |
| `testRoute(text, meta, tag)` | Custom strings | Sets GPS route navigation bar values. |
| `setCockpitTheme(preset)` | `'amber'` | Switches instrument cluster palette (`'amber'` / `'ice'`). |
| `toggleWebcam(force)` | Toggle | Toggles webcam viewport border visibility. |
| `toggleGuides(force)` | Toggle | Displays OBS layout alignment reference guides. |

---

<a id="-русская-документация"></a>
## 🇷🇺 Русская документация

### 1. Интерактивные команды Twitch-чата

Обработка интерактивных команд Twitch-чата выполняется модулем `assets/js/ets2-chat.js`. Настройки прав доступа, спам-фильтра и таймеров задержки настраиваются в секции `chatCommands` конфигурационного файла `config.js` (шаблон `config.example.js`).

> [!NOTE]
> Стример (владелец канала) и назначенные модераторы канала не ограничены кулдаунами и могут вызывать любые команды без задержки.

| Команда | Синонимы (Алиасы) | Минимальная роль | Кулдаун (Общий / Ник) | Действие на экране (HUD) | Звуковой эффект Web Audio API |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `!гудок` | `!honk`, `!фафа`, `!клаксон` | `VIP и выше` | 60 с / 120 с | Выводит фиолетовую карточку: `«ИНТЕРАКТИВНЫЙ КЛАКСОН // Приветственный гудок @User»`. Векторная иконка дудки. | Басовитый двухрожковый пневмогудок тягача (220 Гц + 277 Гц, богатые гармоники, 550 мс). |
| `!рация <текст>` | `!cb <text>`, `!сиби <текст>` | `Фолловеры` | 45 с / 120 с | Выводит янтарную карточку: `«15 КАНАЛ // @User»`. Векторная иконка тангенты. Удаление ссылок, лимит 70 знаков. Блок на `first-msg=1` без ролей. | Входной шумовой щелчок squelch + фоновый эфирный шум + сигнал Roger Beep (1046 Гц). |
| `!рейс` | `!route`, `!job`, `!маршрут`, `!груз` | `Все зрители` | 30 с / Общий | Выводит голубую карточку GPS: текущий город отправления и назначения, наименование груза и остаток пути. | Мягкий гармоничный сигнал бортового компьютера (тройной перезвон). |
| `!стата` | `!stats`, `!статистика`, `!стрим` | `Все зрители` | 30 с / Общий | Выводит голубую карточку статистики: завершено контрактов, заработок стрима, пробег за сессию и штрафы. | Мягкий гармоничный сигнал бортового компьютера (тройной перезвон). |
| `!тягач` | `!truck`, `!автобус`, `!машина` | `Все зрители` | 30 с / Общий | Выводит голубую карточку тягача: марка и модель машины, номерной знак, остаток топлива и запас хода в км. | Мягкий гармоничный сигнал бортового компьютера (тройной перезвон). |
| `!водитель` | `!driver`, `!права`, `!рейтинг` | `Все зрители` | 30 с / Общий | Выводит голубое досье водителя: позывной стримера, показатель безаварийности Safety Score (%) и рекорд скорости. | Мягкий гармоничный сигнал бортового компьютера (тройной перезвон). |
| `!ставка чистый` | `!bet clean` | `Все зрители` | Без кулдауна | Фиксирует ставку зрителя на завершение текущего рейса без единого штрафа за нарушения ПДД. | Тихая фиксация в памяти (без спама карточками). |
| `!ставка штраф` | `!bet fine` | `Все зрители` | Без кулдауна | Фиксирует ставку зрителя на то, что за текущую поездку будет получен хотя бы один штраф. | Тихая фиксация в памяти (без спама карточками). |

> [!TIP]
> При включённом параметре `config.chat.hideCommands: true` сообщения с командами автоматически скрываются из визуального окна чата, отображая результат только в виде карточки телеметрии в верхней зоне лобового стекла.

---

### 2. Консольный API разработчика

Для быстрой проверки откройте инструменты разработчика источника Браузер OBS (`F12`) либо откройте файл `ets2-desktop.html` в браузере с запущенным локальным мостом.

#### 2.1 Полная демонстрация всех уведомлений HUD
```javascript
// Последовательно запускает цепочку всех карточек, SVG-иконок и звуковых эффектов оверлея
window.demoAllTelemetryEvents();
```

#### 2.2 Генератор событий телеметрии (`window.testTelemetryEvent`)

```javascript
// Синтаксис: window.testTelemetryEvent(тип, подтипИлиНарушение, суммаИлиЗначение)

// Штрафы за нарушения ПДД (события SCS SDK)
window.testTelemetryEvent('update', 'v1.2.3');                      // Firmware update alert (CRT Power-On / Typewriter / Web Audio)
window.testTelemetryEvent('fine', 'speeding', 550);                 // Превышение скорости
window.testTelemetryEvent('fine', 'speeding_camera', 550);          // Камера контроля скорости
window.testTelemetryEvent('fine', 'red_signal', 350);              // Проезд на запрещающий сигнал
window.testTelemetryEvent('fine', 'crash', 400);                   // Дорожно-транспортное происшествие
window.testTelemetryEvent('fine', 'no_lights', 150);               // Движение без включённых фар
window.testTelemetryEvent('fine', 'avoid_sleeping', 150);           // Нарушение режима труда и отдыха
window.testTelemetryEvent('fine', 'wrong_way', 100);               // Выезд на полосу встречного движения
window.testTelemetryEvent('fine', 'avoid_weighing', 250);          // Пропуск весового контроля
window.testTelemetryEvent('fine', 'illegal_trailer', 600);         // Неразрешённая конфигурация прицепа
window.testTelemetryEvent('fine', 'avoid_inspection', 300);        // Пропуск пункта техинспекции
window.testTelemetryEvent('fine', 'illegal_border_crossing', 750); // Нарушение пограничного контроля
window.testTelemetryEvent('fine', 'hard_shoulder_violation', 300); // Несанкционированное движение по обочине
window.testTelemetryEvent('fine', 'damaged_vehicle', 450);         // Критическая неисправность автомобиля
window.testTelemetryEvent('fine', 'generic', 250);                 // Прочее нарушение правил ПДД

// Платные автомагистрали, АЗС и переправы
window.testTelemetryEvent('tollgate', null, 48);                   // Оплата пункта платной дороги
window.testTelemetryEvent('refuel', null, 240);                     // Заправка завершена (+240 л)
window.testTelemetryEvent('ferry', null, 320);                      // Паромная переправа Дувр — Кале
window.testTelemetryEvent('train', null, 260);                      // Ж/Д переправа Фолкстон — Кале

// Завершение и отмена рейсов
window.testTelemetryEvent('job_delivered', null, 28400);            // Сдача рейса (расширенная карточка 7.0 с)
window.testTelemetryEvent('job_cancelled', null, 12000);            // Аннулирование контракта и неустойка

// Технические и эксплуатационные детекторы
window.testTelemetryEvent('cargo_damage', null, '3.5');             // Скачок урона груза (+3.5%)
window.testTelemetryEvent('service');                              // Завершение ТО на СТО (100% восстановлено)
window.testTelemetryEvent('low_fuel', null, 65);                    // Резерв топлива (осталось 65 л)

// События пассажирских туров DLC Coaches
window.testTelemetryEvent('bus_stop', 'Berlin ZOB');               // Остановка и посадка пассажиров
window.testTelemetryEvent('bus_comfort', null, 15);                // Резкое падение комфорта (-15%)

// Прямой вызов чат-событий в оверлей
window.testTelemetryEvent('chat_honk', 'VipPilot');                // Тест интерактивного гудка
window.testTelemetryEvent('chat_cb', 'Trucker_77');                // Тест радиопередачи в 15 канале
```

#### 2.3 Эмулятор команд Twitch-чата (`window.testChatCommand`)

```javascript
// Синтаксис: window.testChatCommand(строкаКоманды, имяПользователя, роль)
// Доступные роли: 'viewer' | 'follower' | 'sub' | 'vip' | 'mod' | 'driver'

window.testChatCommand('!гудок', 'VipPilot', 'vip');
window.testChatCommand('!рация 15 канал, как обстановка на Варшаву?', 'Trucker_77', 'follower');
window.testChatCommand('!рейс', 'Viewer1', 'viewer');
window.testChatCommand('!стата', 'Viewer2', 'viewer');
window.testChatCommand('!тягач', 'Viewer3', 'viewer');
window.testChatCommand('!водитель', 'Viewer4', 'viewer');
window.testChatCommand('!ставка чистый', 'BetUser1', 'viewer');
window.testChatCommand('!ставка штраф', 'BetUser2', 'viewer');
```

#### 2.4 Общие сервисные команды консоли

| Консольная функция | Значение по умолчанию | Назначение |
| :--- | :--- | :--- |
| `testAlert(type, overrides)` | `'donate'` | Запуск тестового всплывающего алерта (`'donate'`, `'sub'`, `'follow'`, `'raid'`, `'all'`). |
| `testChat(count, text)` | `1` | Добавление тестовых сообщений зрителей в ленту чата. |
| `testTelemetry(payload)` | Демо-пакет | Принудительная отрисовка пакета приборки; вызов с `false` переводит приборку в режим офлайн. |
| `testTrack(title, artist)` | `'Nightcall'` / `'Kavinsky'` | Задание названия и исполнителя трека в музыкальном виджете. |
| `testRoute(text, meta, tag)` | Тестовые строки | Задание статического маршрута в центральной полосе. |
| `setCockpitTheme(preset)` | `'amber'` | Переключение палитры подсветки приборной панели (`'amber'` / `'ice'`). |
| `toggleWebcam(force)` | Переключение | Скрытие или отображение рамки веб-камеры. |
| `toggleGuides(force)` | Переключение | Включение или отключение вспомогательной монтажной сетки OBS. |
