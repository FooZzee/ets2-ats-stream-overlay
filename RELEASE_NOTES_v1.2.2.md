# 🚛 ETS2 / ATS Cockpit Telemetry Stream Overlay v1.2.2

[![Release](https://img.shields.io/badge/Release-v1.2.2-blue?style=flat&logo=github)](https://github.com/FooZzee/ets2-ats-stream-overlay/releases/tag/v1.2.2)
[![Platform](https://img.shields.io/badge/Platform-Windows%20x64-blue?style=flat&logo=windows)](https://www.microsoft.com/windows)
[![SCS SDK](https://img.shields.io/badge/SCS%20SDK-v1.16%20Native-yellow?style=flat)](https://modding.scssoft.com/wiki/Documentation/Tools/Telemetry_server)
[![OBS Studio](https://img.shields.io/badge/OBS%20Studio-Browser%20Source-purple?style=flat&logo=obsstudio)](https://obsproject.com/)
[![License](https://img.shields.io/badge/License-MIT-success?style=flat)](./LICENSE)

---

### 🌐 Quick Language Jump / Выбор языка

[![English Release Notes](https://img.shields.io/badge/Release_Notes-English-2563eb?style=flat&logo=gitbook&logoColor=white)](#-english-release-notes)
[![Русское описание релиза](https://img.shields.io/badge/Описание_релиза-Русский-dc2626?style=flat&logo=gitbook&logoColor=white)](#-русское-описание-релиза-v122)
[![Support Project](https://img.shields.io/badge/Support_Project-FF5E5B?style=for-the-badge&logo=heart&logoColor=white)](https://www.donationalerts.com/r/foozzee)

---

<a id="-english-release-notes"></a>
## 🇬🇧 English Release Notes

> [!IMPORTANT]
> **Primary Upgrade Requirement:** Close Euro Truck Simulator 2 and American Truck Simulator before installing. Run `Install-Overlay.bat` or `build-and-install-plugin.bat` to deploy the updated native module `overlayobs_foozzee_telemetry.dll` into your game's `bin\win_x64\plugins\` folder. Third-party `rtrucksim_telemetry.dll` remains completely untouched.

### 🚀 What's New & Key Highlights

1. **🖥️ Unified Desktop Cockpit HUD Architecture:**
   * Fully removed `ets2-vertical.html` and dead vertical layout code; streamlined focus purely on the flagship 16:9 desktop dashboard (`1920×1080` — `ets2-desktop.html`).
2. **🛑 Robust Job Completion & Cancellation Fallbacks:**
   * Native SCS SDK interception for all job finish and cancellation gameplay event variants (`job.delivered`, `job.cancelled`, `bus_job.*`, `car_job.*`).
   * Blocked false «-100% comfort drop» alerts caused by SCS SDK resetting passenger satisfaction to 0 upon coach route completion.
   * Telemetry state-based fallback triggers delivery summary even when the engine omits gameplay events.
3. **🔔 In-OBS Auto-Update Notification (`ets2-telemetry.js`, `ets2-base.css`):**
   * Autonomous update alert in OBS preview with GitHub API rate-limit protection (`HTTP 403` cache in `localStorage` with a 3-hour TTL).
   * Authentic Pip-Boy 3000 green phosphor aesthetic (`#22c55e`, `#15803d`, background `#070b09`, CRT scanlines).
   * CRT Power-On and Power-Off beam expansion/collapse animations (`crtPowerOn`, `crtPowerOff`).
   * Smooth 22ms teletype typewriter text printing with blinking green terminal cursor `▌` and fixed-height container.
   * Real-time Web Audio API sound synthesis: power relay click, high-voltage 15.6 kHz flyback transformer sweep, CRT degauss coil hum, and mechanical terminal keystroke clicks.
4. **🛠️ Standalone Pip-Boy 3000 Update Terminal (`Update-Overlay.bat` & `scripts/updater.ps1`):**
   * Autonomous WPF terminal operating strictly in `-STA` (Single-Threaded Apartment) mode with enforced TLS 1.2 protocol.
   * Rate-limit and network timeout protection (5-second timeout) displaying informative terminal output without crashing.
   * Full bilingual localization (`RU` / `EN`) with instant language switching and changelog viewer.
5. **🚚 Graphical Setup Wizard Redesign (`Install-Overlay.bat` & `scripts/installer.ps1`):**
   * Complete overhaul in ETS2 / ATS Cockpit HUD style (`#0d1117`, `#151b24`, `#2a3444`, amber gold `#f59e0b`, cyan `#38bdf8`).
   * Standardized button control templates with `CornerRadius="8"`, hover gradient, and pressed state translation.
   * Prominent centered «SUPPORT PROJECT» button (`CornerRadius="10"`, `#ff5e5b` → `#e11d48`) with vector Material Design Heart path linking to DonationAlerts.
   * Dedicated GitHub Star card with vector Star path and direct repository link.
   * Silent launch and operation: complete removal of synthesized audio loops and beep tones.
   * Automatic package version display (`v1.2.2`) in window title, header badge, and footer status line.
6. **🎯 Vector Speed Limit Signs (30–130 km/h) & Passenger Mood Emojis:**
   * Full vector speed limit sign coverage from 30 km/h to 130 km/h in 10 km/h increments with crisp typography and red border.
   * High-contrast vector SVG emojis for passenger satisfaction tiers with delta comfort alerts.

### 📦 Asset Verification & Checksums

| File / Component | Size | SHA-256 Checksum | MD5 Checksum |
| :--- | :--- | :--- | :--- |
| `OverlayOBS_FooZzee_v1.2.2.zip` | 1.76 MB (1 849 395 B) | `BFF58DE715CCA4CD1CA9507F548F18F43F67A67C791DE9C422C4BE70913D6B7C` | `41C70BFB5C394208129782CA4C618A6A` |
| `overlayobs_foozzee_telemetry.dll` | 211 KB (216 064 B) | `2226F63B289AB4B3C79A30421C256B00415CDB42C5EFCC80AA7E61FABCCB9C60` | `AC18CB3EA72EBDB00526C7253CD93A79` |

### ⚡ Quick Start Guide

1. Unpack the release archive into your desired folder (e.g. `D:\html\Overlay`).
2. Run `Install-Overlay.bat` to configure streamer nickname, Twitch channel, and automatically deploy the telemetry plugin.
3. In OBS Studio, add a Browser Source pointing to `ets2-desktop.html` (Width: `1920`, Height: `1080`, FPS: `60`).
4. Launch `start-telemetry.bat` (or Desktop shortcut `ETS2-ATS Overlay Bridge`) before launching ETS2 or ATS.

---

<a id="-русское-описание-релиза-v122"></a>
## 🇷🇺 Русское описание релиза v1.2.2

> [!IMPORTANT]
> **Главное требование обновления:** Перед установкой обязательно закройте Euro Truck Simulator 2 и American Truck Simulator. Запустите `Install-Overlay.bat` или `build-and-install-plugin.bat` для копирования обновлённого нативного модуля `overlayobs_foozzee_telemetry.dll` в папку `bin\win_x64\plugins\`. Сторонний файл `rtrucksim_telemetry.dll` строго не затрагивается.

### 🚀 Главные нововведения релиза

1. **🖥️ Единая десктопная архитектура Cockpit HUD:**
   * Полностью удалён файл `ets2-vertical.html` и неиспользуемый код вертикального режима; проект полностью сфокусирован на флагманской десктопной сцене 16:9 (`1920×1080` — `ets2-desktop.html`).
2. **🛑 Надёжная логика завершения и отмены рейсов:**
   * Нативный перехват всех вариантов событий завершения и отмены рейсов в SCS SDK (`job.delivered`, `job.cancelled`, `bus_job.*`, `car_job.*`).
   * Заблокировано ложное уведомление «-100% комфорта», возникавшее при сбросе значения `busSat` игрой в 0 при завершении путевого листа.
   * Реализован fallback по изменению состояния контракта в телеметрии при отсутствии явного события от игрового движка.
3. **🔔 Автоуведомление об обновлении в предпросмотре OBS (`ets2-telemetry.js`, `ets2-base.css`):**
   * Автономный опрос GitHub API с защитой от rate-лимитов (`HTTP 403`) через кэширование в `localStorage` (интервал 3 часа).
   * Аутентичный ретро-стиль зелёного люминофора Pip-Boy 3000 (`#22c55e`, `#15803d`, глубокий фон `#070b09`, сканлайны кинескопа).
   * Анимации включения и выключения ЭЛТ-монитора (`crtPowerOn` и `crtPowerOff`) с развёрткой луча из горизонтальной линии.
   * Побуквенная печать текста со скоростью 22 мс на символ, мигающим зелёным курсором `▌` и контейнером с фиксированной высотой (без скачков оверлея).
   * Синтез звуков через Web Audio API: щелчок тумблера питания, свист строчного трансформатора ТДКС (15.6 кГц), размагничивание и реалистичные щелчки клавиатуры терминала.
4. **🛠️ Автономный терминал обновлений Pip-Boy 3000 (`Update-Overlay.bat` и `scripts/updater.ps1`):**
   * Графический интерфейс на базе WPF, работающий строго в STA-потоке (`Single-Threaded Apartment`) с принудительной поддержкой TLS 1.2.
   * Защита от сбоев сети с 5-секундным таймаутом и информативным выводом сообщения при исчерпании лимитов GitHub API без падения приложения.
   * Двуязычная локализация (`RU` / `EN`) с мгновенным переключением и встроенным просмотром списка изменений.
5. **🚚 Редизайн графического мастера установки (`Install-Overlay.bat` и `scripts/installer.ps1`):**
   * Полная переработка интерфейса на WPF в стиле приборной панели ETS2 / ATS (`#0d1117`, `#151b24`, `#2a3444`, золотой янтарь `#f59e0b`, циан `#38bdf8`).
   * Премиальные шаблоны кнопок со скруглением `CornerRadius="8"`, сменой градиента при наведении и тактильным сдвигом при клике.
   * Центральная кнопка «ПОДДЕРЖАТЬ ПРОЕКТ» (`CornerRadius="10"`, градиент `#ff5e5b` → `#e11d48`) с проверенной векторной иконкой сердца Material Design со ссылкой на DonationAlerts.
   * Блок «Поставить звезду на GitHub» с векторной иконкой звезды и прямым переходом в репозиторий.
   * Бесшумный запуск и работа: полное удаление синтезатора 8-битного звука и звуковых сигналов.
   * Отображение актуальной версии пакета `v1.2.2` в заголовке окна, бейдже шапки и статусной строке футера.
6. **🎯 Векторные знаки ограничения скорости (30–130 км/ч) и эмодзи комфорта:**
   * Полный набор векторных знаков скорости с шагом 10 км/ч (30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130) с контрастной красной каймой и чётким шрифтом.
   * Пять уровней удовлетворенности пассажиров с динамическими векторными эмодзи и уведомлениями об изменении комфорта (`bus_comfort_up` / `bus_comfort_down`).

### 📦 Контрольные суммы архива релиза

| Файл / Компонент | Размер | Контрольная сумма SHA-256 | Контрольная сумма MD5 |
| :--- | :--- | :--- | :--- |
| `OverlayOBS_FooZzee_v1.2.2.zip` | 1.76 MB (1 849 395 B) | `BFF58DE715CCA4CD1CA9507F548F18F43F67A67C791DE9C422C4BE70913D6B7C` | `41C70BFB5C394208129782CA4C618A6A` |
| `overlayobs_foozzee_telemetry.dll` | 211 KB (216 064 B) | `2226F63B289AB4B3C79A30421C256B00415CDB42C5EFCC80AA7E61FABCCB9C60` | `AC18CB3EA72EBDB00526C7253CD93A79` |

### ⚡ Быстрая установка

1. Распакуйте архив релиза в рабочую папку (например, `D:\html\Overlay`).
2. Запустите `Install-Overlay.bat` для настройки никнейма стримера, канала Twitch и автоматической установки нативного плагина телеметрии.
3. В OBS Studio добавьте источник «Браузер», укажите файл `ets2-desktop.html` (Ширина: `1920`, Высота: `1080`, Частота кадров: `60`).
4. Запустите `start-telemetry.bat` (или ярлык на Рабочем столе `ETS2-ATS Overlay Bridge`) перед запуском игры.

---

### 👤 Автор проекта — FooZzee

* 🌐 **Официальный сайт:** [foozzee.ru](https://foozzee.ru)
* 📺 **Twitch:** [twitch.tv/foozzee](https://twitch.tv/foozzee)
* 🎥 **YouTube:** [youtube.com/@foozzee](https://youtube.com/@foozzee)
* 📢 **Telegram:** [t.me/foozzee_stream](https://t.me/foozzee_stream)
* 👥 **VK:** [vk.com/foozzee](https://vk.com/foozzee)
* 💖 **DonationAlerts:** [donationalerts.com/r/foozzee](https://www.donationalerts.com/r/foozzee)
