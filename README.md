# ETS2 / ATS Cockpit Telemetry Stream Overlay

> **Language / Язык:** [English](#english-documentation) | [Русский](#русская-документация) | [Changelog / История изменений](./CHANGELOG.md)
> Separate files: [README.en.md](./README.en.md) • [README.ru.md](./README.ru.md)

---

<a id="english-documentation"></a>
## English Documentation

A bilingual (`EN` / `RU`), native **SCS Telemetry SDK 1.16** cockpit HUD overlay for **OBS Studio** built for **Euro Truck Simulator 2** (including **DLC Coaches**) and **American Truck Simulator** with Twitch chat integration, FIFO alerts, a 1-click GUI Setup Wizard, and zero third-party telemetry proxy dependencies.

### 1. Overview & Features
- **Native SCS SDK 1.16 Telemetry (`scs_direct_telemetry.dll`):** Reads live truck/coach, trailer, job economy, and indicator telemetry directly from the simulator via Shared Memory (`Local\FooZzeeSCSTelemetry`) through the bundled local bridge (`http://127.0.0.1:30002/telemetry`). Added channels: `bus_job.average_satisfaction`, `rest.stop`, `truck.electric.enabled`, `truck.engine.enabled`.
- **Full Support for ETS2 DLC Coaches (Passenger Jobs):** Automatic detection of coach passenger trips, stop routing (`source_stop` → `destination_stop`), and real-time passenger satisfaction rating (`SATISFACTION: XX%`).
- **2-Row Desktop Cockpit Dashboard with 100% Solid Opacity (`1920×1080` — `ets2-desktop.html`):**
  - **100% Solid Opacity (`alpha = 1`):** Completely opaque dashboard background eliminates see-through road distractions in OBS Studio.
  - **Row 1:** Speedometer, Cruise Control (`CC`), Gear, RPM bar, **Throttle / Brake / Steering** inputs, full dashboard warning & light indicator cluster, route progress bar, cities, cargo/passengers & tonnage.
  - **Row 2:** Truck/coach make/model, license plate, odometer, Truck/Trailer/Cargo health pills, **7 onboard computer sensors** (Fuel, Range, Fuel Avg, Oil/Water temps, Air, AdBlue, Battery), **smooth scrolling job & trip economy ticker** (with passenger satisfaction), `ETS2` / `ATS` status pill, and your Twitch channel link.
- **Vertical Scene (`1080×1920` — `ets2-vertical.html`):** Safe-zone layout for TikTok Live, YouTube Shorts, and Reels.
- **Real Time En Route (`real-eta-panel`):** Top-left widget converts in-game navigation ETA using the active map scale (`1:19`, `1:3`, `1:10`) into real-world time remaining.
- **Twitch Chat & FIFO Alerts:** Built-in Twitch IRC (`wss://irc-ws.chat.twitch.tv`) + DonationAlerts support, with sequential bottom-right alert cards (`right: 24px; bottom: 200px`) and full `EN` / `RU` switching.
- **Changelog:** Detailed version history in [CHANGELOG.md](./CHANGELOG.md).

### 2. Requirements
- **Windows 10 / 11** (64-bit) with PowerShell 5.1+
- **OBS Studio** (Browser Source)
- **Euro Truck Simulator 2** or **American Truck Simulator** (64-bit) with **`scs_direct_telemetry.dll`** (included in `./redist/scs_direct_telemetry.dll`)

### 3. 1-Click GUI Installation (`Install-Overlay.bat`)
1. Run **`Install-Overlay.bat`**.
2. Toggle **`English (EN)`** / **`Русский (RU)`** in the top header.
3. Confirm the overlay installation directory (default: `C:\ETS2-ATS-Stream-Overlay`).
4. Keep **Euro Truck Simulator 2** and/or **American Truck Simulator** checked — the wizard auto-detects Steam libraries and copies **`scs_direct_telemetry.dll`** into `...\bin\win_x64\plugins\`.
5. Enter your **Streamer Nickname**, **Twitch Channel**, and optionally your **DonationAlerts Token** (password-masked with Show/Hide toggle), keep Desktop shortcut checked, and click **`Install`**.

### 4. Manual Setup & Configuration (`config.js`)
1. Copy `config.example.js` to **`config.js`** and edit `lang`, `ets2.driverName`, `channels.twitch.channelName`, `channels.donationAlerts.socketToken`, and `theme.cockpitPreset` (`'amber'` or `'ice'`).
2. Copy `./redist/scs_direct_telemetry.dll` to `<GameDir>\bin\win_x64\plugins\scs_direct_telemetry.dll`.
3. URL query overrides: `?lang=en|ru`, `?theme=amber|ice`, `?cam=0`, `?test=1`, `?guides=1`.

### 5. OBS Studio Setup
- Before streaming, launch the **`ETS2-ATS Overlay Bridge`** Desktop shortcut (`start-telemetry.bat`).
- **Desktop Browser Source:** `ets2-desktop.html` at **`1920 × 1080`**.
- **Vertical Browser Source:** `ets2-vertical.html` at **`1080 × 1920`**.
- **Webcam Coordinates (Desktop):** Width **`346 px`**, Height **`195 px`** (`16:9`), Left **`24 px`**, Top **`180 px`** (layer behind the overlay).

### 6. Troubleshooting
- **Shows `--` / `STANDBY`:** Ensure `start-telemetry.bat` is running, confirm `scs_direct_telemetry.dll` is inside `...\bin\win_x64\plugins\`, accept the SDK prompt when launching the 64-bit game, and check `http://127.0.0.1:30002/health`.
- **Port `30002` error:** Close any duplicate `start-telemetry.bat` console window.

---

<a id="русская-документация"></a>
## Русская документация

Двуязычный (`EN` / `RU`) приборный HUD-оверлей для **OBS Studio** для **Euro Truck Simulator 2** (включая **DLC Coaches**) и **American Truck Simulator** на базе нативного плагина **SCS Telemetry SDK 1.16** с чатом **Twitch**, FIFO-алертами, графическим установщиком и полным отказом от сторонних программ-посредников.

### 1. Описание и возможности
- **Нативный SCS SDK 1.16 (`scs_direct_telemetry.dll`):** считывает телеметрию тягача, автобуса, прицепа, заказа, остановок и индикаторов напрямую из игры через Shared Memory (`Local\FooZzeeSCSTelemetry`) с помощью локального моста (`http://127.0.0.1:30002/telemetry`). Новые каналы: `bus_job.average_satisfaction`, `rest.stop`, `truck.electric.enabled`, `truck.engine.enabled`.
- **Полная поддержка ETS2 DLC Coaches (Пассажирские перевозки):** автоматическое определение рейса автобуса, маршрут остановок (`source_stop` → `destination_stop`) и уровень удовлетворённости пассажиров (`КОМФОРТ: XX%`).
- **Двухрядная desktop-торпеда со 100% непрозрачным фоном (`1920×1080` — `ets2-desktop.html`):**
  - **100% непрозрачность фона (`alpha = 1`):** устраняет просвечивание дорожного полотна под приборами и навигацией в OBS Studio.
  - **Ряд 1:** спидометр, круиз-контроль (`CC`), КПП, шкала оборотов (`RPM`), педали и руль (**ГАЗ / ТОРМ / РУЛЬ**), полный набор пиктограмм приборной панели, прогресс-бар маршрута, города, груз/пассажиры и масса прицепа.
  - **Ряд 2:** марка/модель и госномер тягача/автобуса, одометр, бейджи состояния, **7 датчиков бортового компьютера в одну линию**, **бегущая строка заказа и статистики** (с комфортом пассажиров), статус `ETS2` / `ATS` и ссылка на канал Twitch.
- **Вертикальная сцена (`1080×1920` — `ets2-vertical.html`):** адаптация под безопасные зоны мобильных стримов.
- **Реальное время в пути (`real-eta-panel`):** блок в левом верхнем углу пересчитывает навигационное время с учётом масштаба карты (`1:19`, `1:3`, `1:10`) в реальные минуты и часы.
- **Чат Twitch и FIFO-алерты:** Twitch IRC (`wss://irc-ws.chat.twitch.tv`) и DonationAlerts, оповещения справа над торпедой (`right: 24px; bottom: 200px`), переключение `EN` / `RU`.
- **История изменений:** подробное описание всех версий в [CHANGELOG.md](./CHANGELOG.md).

### 2. Требования
- **Windows 10 / 11** (64-бит), PowerShell 5.1+
- **OBS Studio** (Browser Source)
- **Euro Truck Simulator 2** или **American Truck Simulator** (64-бит) с плагином **`scs_direct_telemetry.dll`** (входит в `./redist/scs_direct_telemetry.dll`)

### 3. Установка через графический установщик (`Install-Overlay.bat`)
1. Запустите **`Install-Overlay.bat`**.
2. В шапке окна выберите **`English (EN)`** или **`Русский (RU)`**.
3. Выберите папку установки (по умолчанию `C:\ETS2-ATS-Stream-Overlay`).
4. Отметьте **Euro Truck Simulator 2** и/или **American Truck Simulator** — установщик автоматически найдёт игры и установит **`scs_direct_telemetry.dll`** в `...\bin\win_x64\plugins\`.
5. Укажите **Никнейм стримера**, **Канал Twitch** и при желании **Токен DonationAlerts** (скрыт звёздочками, кнопка Показать/Скрыть), оставьте ярлык на Рабочем столе и нажмите **`Установить`**.

### 4. Ручная установка и настройка (`config.js`)
1. Скопируйте `config.example.js` в **`config.js`** и настройте `lang`, `ets2.driverName`, `channels.twitch.channelName`, `channels.donationAlerts.socketToken` и `theme.cockpitPreset` (`'amber'` или `'ice'`).
2. Скопируйте `./redist/scs_direct_telemetry.dll` в `<Папка игры>\bin\win_x64\plugins\scs_direct_telemetry.dll`.
3. URL-параметры в OBS: `?lang=ru|en`, `?theme=amber|ice`, `?cam=0`, `?test=1`, `?guides=1`.

### 5. Настройка в OBS Studio
- Перед стримом запустите ярлык **`ETS2-ATS Overlay Bridge`** (`start-telemetry.bat`).
- **Desktop Browser Source:** `ets2-desktop.html` — **`1920 × 1080`**.
- **Vertical Browser Source:** `ets2-vertical.html` — **`1080 × 1920`**.
- **Рамка веб-камеры (Desktop):** ширина **`346 px`**, высота **`195 px`** (`16:9`), отступ слева **`24 px`**, сверху **`180 px`** (слой камеры ниже оверлея).

### 6. Решение частых проблем
- **Показывает `--` / `STANDBY`:** запустите `start-telemetry.bat`, проверьте наличие `scs_direct_telemetry.dll` в `...\bin\win_x64\plugins\`, подтвердите предупреждение SDK на старте 64-битной игры и откройте `http://127.0.0.1:30002/health`.
- **Порт `30002` занят:** закройте второе окно `start-telemetry.bat`.

---

### Author / Автор проекта — FooZzee
- Website: https://foozzee.ru/
- Twitch: https://www.twitch.tv/foozzee
- YouTube: https://www.youtube.com/@foozzee
- Telegram: https://t.me/foozzeestream
- VK: https://vk.ru/gtfun
