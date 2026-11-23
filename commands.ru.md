# 🎮 Интерактивные команды и консольный API разработчика

> **ETS2 / ATS Cockpit Telemetry Stream Overlay**  
> Полное техническое руководство по интерактивным командам Twitch-чата, триггерам событий телеметрии и методам консольного тестирования оверлея.

[![Документация](https://img.shields.io/badge/Документация-Справочник_команд-blue?style=flat&logo=gitbook)](./commands.ru.md)
[![Статус](https://img.shields.io/badge/Статус-Готов_к_эфиру-success?style=flat)](./README.ru.md)
[![Лицензия](https://img.shields.io/badge/Лицензия-All_Rights_Reserved-red?style=flat)](./LICENSE)

---

> **Язык:** **Русский** | [English (commands.en.md)](./commands.en.md) | [Двуязычный сводный документ (commands.md)](./commands.md) | [Главный README](./README.md)

---

## 1. Интерактивные команды Twitch-чата

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

## 2. Консольный API разработчика

Для быстрой проверки откройте инструменты разработчика источника Браузер OBS (`F12`) либо откройте файл `ets2-desktop.html` в браузере с запущенным локальным мостом.

### 2.1 Полная демонстрация всех уведомлений HUD
```javascript
// Последовательно запускает цепочку всех карточек, SVG-иконок и звуковых эффектов оверлея
window.demoAllTelemetryEvents();
```

### 2.2 Генератор событий телеметрии (`window.testTelemetryEvent`)

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

### 2.3 Эмулятор команд Twitch-чата (`window.testChatCommand`)

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

### 2.4 Общие сервисные команды консоли

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

---

Copyright (c) 2026 FooZzee. All Rights Reserved.
