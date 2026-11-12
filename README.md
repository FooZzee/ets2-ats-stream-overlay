# ETS2 / ATS Cockpit Telemetry Stream Overlay

> **Language / Язык:** [English](#english-documentation) | [Русский](#русская-документация)
> Separate files: [README.en.md](./README.en.md) • [README.ru.md](./README.ru.md)

---

<a id="english-documentation"></a>
## English Documentation

A bilingual (`EN` / `RU`), native **SCS Telemetry SDK 1.16** cockpit HUD overlay for **OBS Studio** built for **Euro Truck Simulator 2** and **American Truck Simulator** with Twitch chat integration, FIFO alerts, a 1-click GUI Setup Wizard, and zero third-party telemetry proxy dependencies.

### 1. Overview & Features
- **Native SCS SDK 1.16 Telemetry (`scs_direct_telemetry.dll`):** Reads live truck, trailer, job economy, and indicator telemetry directly from the simulator via Shared Memory (`Local\FooZzeeSCSTelemetry`) through the bundled local bridge (`http://127.0.0.1:30002/telemetry`).
- **2-Row Desktop Cockpit Dashboard (`1920×1080` — `ets2-desktop.html`):**
  - **Row 1:** Speedometer, Cruise Control (`CC`), Gear, RPM bar, **Throttle / Brake / Steering** inputs, full dashboard warning & light indicator cluster (blinkers, hazard, beams, beacon, wipers, park brake, retarder/motor brake, diff lock, lift axles, warnings, speed limit), route progress bar, cities, cargo & tonnage.
  - **Row 2:** Truck make/model, license plate, odometer, Truck/Trailer/Cargo health pills, **7 onboard computer sensors** (Fuel, Range, Fuel Avg, Oil/Water temps, Air, AdBlue, Battery), **smooth scrolling job & trip economy ticker**, `ETS2` / `ATS` status pill, and your Twitch channel link.
- **Vertical Scene (`1080×1920` — `ets2-vertical.html`):** Safe-zone layout for TikTok Live, YouTube Shorts, and Reels.
- **Real Time En Route (`real-eta-panel`):** Top-left widget converts in-game navigation ETA using the active map scale (`1:19`, `1:3`, `1:10`) into real-world time remaining.
- **Twitch Chat & FIFO Alerts:** Built-in Twitch IRC (`wss://irc-ws.chat.twitch.tv`) + optional DonationAlerts support, with sequential bottom-right alert cards (`right: 24px; bottom: 200px`) and full `EN` / `RU` switching.

### 2. Requirements
- **Windows 10 / 11** (64-bit) with PowerShell 5.1+
- **OBS Studio** (Browser Source)
- **Euro Truck Simulator 2** or **American Truck Simulator** (64-bit) with **`scs_direct_telemetry.dll`** (included in `./redist/scs_direct_telemetry.dll`)

### 3. 1-Click GUI Installation (`Install-Overlay.bat`)
1. Run **`Install-Overlay.bat`**.
2. Toggle **`English (EN)`** / **`Русский (RU)`** in the top header (switches wizard text immediately and writes `lang` to `config.js`).
3. Confirm the overlay installation directory (default: `C:\ETS2-ATS-Stream-Overlay`).
4. Keep **Euro Truck Simulator 2** and/or **American Truck Simulator** checked — the wizard auto-detects Steam libraries via Windows Registry (`HKCU:\Software\Valve\Steam`) & `libraryfolders.vdf` (or browse manually to the game root, `bin\win_x64`, or `plugins`) and copies **`scs_direct_telemetry.dll`** into `...\bin\win_x64\plugins\`.
5. Enter your **Streamer Nickname**, **Twitch Channel**, and optionally your **DonationAlerts Token** (masked by default with a **Show / Hide** toggle; found in DonationAlerts *Account Settings -> Secret Token*), keep the **`ETS2-ATS Overlay Bridge`** Desktop shortcut checked, and click **`Install`**.

### 4. Manual Setup & Configuration (`config.js`)
1. Copy `config.example.js` to **`config.js`** and edit `lang`, `ets2.driverName`, `channels.twitch.channelName`, `channels.donationAlerts` (`{ enabled: true, socketToken: 'YOUR_TOKEN' }` for live donation alerts above the dashboard), and `theme.cockpitPreset` (`'amber'` or `'ice'`).
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

Двуязычный (`EN` / `RU`) приборный HUD-оверлей для **OBS Studio** для **Euro Truck Simulator 2** и **American Truck Simulator** на базе нативного плагина **SCS Telemetry SDK 1.16** с чатом **Twitch**, FIFO-алертами, графическим установщиком и полным отказом от сторонних программ-посредников.

### 1. Описание и возможности
- **Нативный SCS SDK 1.16 (`scs_direct_telemetry.dll`):** считывает телеметрию тягача, прицепа, заказа и индикаторов напрямую из игры через Shared Memory (`Local\FooZzeeSCSTelemetry`) с помощью локального моста (`http://127.0.0.1:30002/telemetry`).
- **Двухрядная desktop-торпеда (`1920×1080` — `ets2-desktop.html`):**
  - **Ряд 1:** спидометр, круиз-контроль (`CC`), КПП, шкала оборотов (`RPM`), педали и руль (**ГАЗ / ТОРМ / РУЛЬ**), полный набор пиктограмм приборной панели, прогресс-бар маршрута, города, груз и масса прицепа.
  - **Ряд 2:** марка/модель и госномер тягача, одометр, бейджи состояния тягача/прицепа/груза, **7 датчиков бортового компьютера в одну линию**, **бегущая строка экономики заказа и поездки**, статус `ETS2` / `ATS` и ссылка на канал Twitch.
- **Вертикальная сцена (`1080×1920` — `ets2-vertical.html`):** адаптация под безопасные зоны мобильных стримов.
- **Реальное время в пути (`real-eta-panel`):** блок в левом верхнем углу пересчитывает навигационное время с учётом масштаба карты (`1:19`, `1:3`, `1:10`) в реальные минуты и часы.
- **Чат Twitch и FIFO-алерты:** Twitch IRC (`wss://irc-ws.chat.twitch.tv`) и опциональный DonationAlerts, оповещения справа над торпедой (`right: 24px; bottom: 200px`), переключение `EN` / `RU`.

### 2. Требования
- **Windows 10 / 11** (64-бит), PowerShell 5.1+
- **OBS Studio** (Browser Source)
- **Euro Truck Simulator 2** или **American Truck Simulator** (64-бит) с плагином **`scs_direct_telemetry.dll`** (входит в `./redist/scs_direct_telemetry.dll`)

### 3. Установка через графический установщик (`Install-Overlay.bat`)
1. Запустите **`Install-Overlay.bat`**.
2. В шапке окна выберите **`English (EN)`** или **`Русский (RU)`** (мгновенно переводит установщик и сохраняет `lang` в `config.js`).
3. Выберите папку установки (по умолчанию `C:\ETS2-ATS-Stream-Overlay`).
4. Отметьте **Euro Truck Simulator 2** и/или **American Truck Simulator** — установщик автоматически найдёт игры через реестр Steam и `libraryfolders.vdf` (или укажите корень игры / `bin\win_x64` / `plugins` через `Обзор...`) и установит **`scs_direct_telemetry.dll`** в `...\bin\win_x64\plugins\`.
5. Укажите **Никнейм стримера**, **Канал Twitch** и при желании **Токен DonationAlerts** (по умолчанию скрыт звёздочками, кнопка **Показать / Скрыть**; берётся в DonationAlerts: *Настройки аккаунта -> Секретный токен*), оставьте ярлык **`ETS2-ATS Overlay Bridge`** на Рабочем столе и нажмите **`Установить`**.

### 4. Ручная установка и настройка (`config.js`)
1. Скопируйте `config.example.js` в **`config.js`** и настройте `lang`, `ets2.driverName`, `channels.twitch.channelName`, `channels.donationAlerts` (`{ enabled: true, socketToken: 'ВАШ_ТОКЕН' }` для вывода донат-алертов над торпедой) и `theme.cockpitPreset` (`'amber'` или `'ice'`).
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
