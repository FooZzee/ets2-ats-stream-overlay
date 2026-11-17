# 📜 Project Version History / История версий проекта

> **ETS2 / ATS Cockpit Telemetry Stream Overlay**  
> All notable changes are documented in strict adherence to [Keep a Changelog](https://keepachangelog.com/) and [Semantic Versioning 2.0.0](https://semver.org/).  
> Все значимые изменения документируются в соответствии со стандартами [Keep a Changelog](https://keepachangelog.com/) и [Semantic Versioning 2.0.0](https://semver.org/).

[![Keep a Changelog](https://img.shields.io/badge/Changelog-Keep%20a%20Changelog%201.1.1-orange?style=flat&logo=git)](https://keepachangelog.com/)
[![SemVer](https://img.shields.io/badge/SemVer-2.0.0-blue?style=flat&logo=semver)](https://semver.org/)
[![Latest Release](https://img.shields.io/badge/Latest-v1.2.2-green?style=flat&logo=github)](https://github.com/FooZzee/ets2-ats-stream-overlay/releases/tag/v1.2.2)
[![License](https://img.shields.io/badge/License-MIT-purple?style=flat)](./LICENSE)

---

### 🌐 Quick Language Jump / Выбор языка

[![English Changelog](https://img.shields.io/badge/Changelog-English-2563eb?style=flat-square&logo=gitbook&logoColor=white)](#-english-changelog)
[![Русская история версий](https://img.shields.io/badge/История_версий-Русский-dc2626?style=flat-square&logo=gitbook&logoColor=white)](#-русская-история-версий)
[![Main README](https://img.shields.io/badge/Documentation-Main_README-10b981?style=flat-square&logo=github)](./README.md)

*Standalone files / Отдельные файлы:* [English (CHANGELOG.en.md)](./CHANGELOG.en.md) • [Русский (CHANGELOG.ru.md)](./CHANGELOG.ru.md)

---

<a id="-english-changelog"></a>
## 🇬🇧 English Changelog

### 📌 Version Index (EN)
* [v1.2.2 (2026-11-17) — Single Desktop Cockpit HUD, Auto-Update Notification, WPF Setup Wizard & 8-Bit Audio](#122---2026-11-17-en)
* [v1.2.1 (2026-11-16) — GUI Installer Documentation Viewers & Commands Quick Access](#121---2026-11-16-en)
* [v1.2.0 (2026-11-16) — In-Game Event Toast Notifications, SVG Icons & Web Audio API Sound Synthesizer](#120---2026-11-16-en)
* [v1.1.3 (2026-11-15) — Telemetry Stability, Native Plugin Renaming & 100% Bilingual HUD](#113---2026-11-15-en)
* [v1.1.2 (2026-11-15) — Pip-Boy 3000 Standalone Auto-Update Terminal, 100% Bilingual Localization & DLC Coaches](#112---2026-11-15-en)
* [v1.1.0 (2026-11-15) — ETS2 DLC Coaches Support, Solid Dashboard & Enhanced SCS Telemetry](#110---2026-11-15-en)
* [v1.0.0 (2026-11-12) — Initial Release (Native SCS Telemetry SDK 1.16 & Broadcast HUD)](#100---2026-11-12-en)

---

<a id="122---2026-11-17-en"></a>
### [1.2.2] - 2026-11-17

> [!IMPORTANT]
> **Release v1.2.2** delivers a complete transition to a unified desktop Cockpit HUD layout, resolves bus and truck job completion/cancellation state handling, revamps the in-game telemetry toast card design and kinematics, introduces an in-OBS auto-update notification with CRT animations and Web Audio sound effects, and completely redesigns the GUI Setup Wizard and standalone Pip-Boy 3000 update terminal with native WPF architecture and retro 8-bit audio.

#### 🚀 Added
* **🔔 In-OBS Auto-Update Notification (`assets/js/ets2-telemetry.js`, `assets/css/ets2-base.css`):**
  * Autonomous update check in OBS preview with GitHub API rate-limit protection (`HTTP 403` cache in `localStorage` with a 3-hour TTL).
  * Authentic Pip-Boy 3000 green phosphor aesthetic (`#22c55e`, `#15803d`, background `#070b09`, CRT scanlines).
  * CRT Power-On and Power-Off beam expansion/collapse animations (`crtPowerOn`, `crtPowerOff`).
  * Smooth 22ms teletype typewriter text printing with blinking green terminal cursor `▌` and min-height container.
  * Real-time Web Audio API sound synthesis: power relay click, high-voltage 15.6 kHz flyback transformer sweep, CRT degauss coil hum, and mechanical terminal keystroke clicks.
  * Interactive console test commands: `window.testTelemetryEvent('update')` and `window.testTelemetryEvent('update', 'v1.2.3')`.
* **🛠️ Standalone Pip-Boy 3000 Update Terminal (`Update-Overlay.bat` & `scripts/updater.ps1`):**
  * Native WPF terminal running in `-STA` (Single-Threaded Apartment) mode with enforced TLS 1.2 protocol.
  * Resilient network handling with 5-second timeout and graceful rate-limit fallback messages without crashing.
  * Full bilingual localization (`RU` / `EN`) with instant language switching and changelog viewer.
* **🚚 Graphical Setup Wizard Redesign (`Install-Overlay.bat` & `scripts/installer.ps1`):**
  * Complete overhaul in ETS2 / ATS Cockpit HUD style (`#0d1117`, `#151b24`, `#2a3444`, amber gold `#f59e0b`, cyan `#38bdf8`).
  * Standardized button control templates with `CornerRadius="8"`, hover gradient, and pressed state translation.
  * Prominent centered «SUPPORT PROJECT» button (`CornerRadius="10"`, `#ff5e5b` → `#e11d48`) with vector Material Design Heart path linking to DonationAlerts.
  * Dedicated GitHub Star card with vector Star path and direct repository link.
  * Compact in-memory 8-bit sound loop (268 KB, 22050 Hz Mono) generated in 6 ms via C# synthesis with header pause/resume speaker toggle.
  * Automatic package version display (`v1.2.2`) in window title, header badge, and footer status line.
* **🎯 Vector HUD Speed Limit Signs (30–130 km/h):**
  * Full vector speed limit sign coverage from 30 km/h to 130 km/h in 10 km/h increments with crisp typography and high-contrast red border.
* **😊 Dynamic Passenger Comfort Emojis (`busSat`):**
  * Added high-contrast vector SVG emojis for passenger satisfaction tiers (ecstatic, happy, neutral, unhappy, furious) with delta comfort change alerts.

#### 🔄 Changed
* **🖥️ Single Desktop HUD Architecture:**
  * Complete removal of `ets2-vertical.html` and dead vertical layout code; all resources and documentation now focus purely on the streamlined desktop HUD (`1920×1080` — `ets2-desktop.html`).
* **🎨 Toast Card Redesign & Kinematics:**
  * Increased toast card scale by +10% for enhanced legibility on high-resolution streams.
  * New kinematics: smooth slide-in from top to windscreen zone followed by stationary in-place fade out.
  * Unified Cockpit HUD dark chassis (`#0e131b`) with solid opacity and border status lights.

#### 🐛 Fixed
* **🛑 Job Completion & Cancellation Fallbacks (`plugin.cpp`, `ets2-telemetry.js`):**
  * Added interception for all SCS SDK job delivery and cancellation gameplay event IDs (including `job.delivered`, `job.cancelled`, `bus_job.*`, and `car_job.*`).
  * Blocked false «-100% comfort drop» alerts caused by SCS SDK resetting passenger satisfaction to 0 upon coach trip completion.
  * Implemented state-based fallback detection for trip finish when game telemetry resets job active flags.

---

<a id="121---2026-11-16-en"></a>
### [1.2.1] - 2026-11-16

> [!IMPORTANT]
> **Release v1.2.1** integrates native dark-themed documentation viewer windows directly into the GUI Setup Wizard (`Install-Overlay.bat` / `scripts/installer.ps1`), enabling instant access to the Changelog and Interactive Commands Reference in the user's active language before or after installation.

#### 🚀 Added
* **📖 Setup Wizard Documentation Viewers (`scripts/installer.ps1`):**
  * Added dedicated «📜 Changelog» and «📖 Commands» buttons in Group 4 of the GUI installer.
  * Launches clean modal viewer windows displaying the complete version history (`CHANGELOG.ru.md` / `CHANGELOG.en.md`) and commands reference (`commands.ru.md` / `commands.en.md`) strictly matching the installer's active language.
  * Resilient fallback file resolution searching across current directory, parent path, and target overlay folder.
  * Built-in «📄 Open in Notepad» button for external viewing or printing.

---

<a id="120---2026-11-16-en"></a>
### [1.2.0] - 2026-11-16

> [!IMPORTANT]
> **Release v1.2.0** introduces in-game telemetry event toast popups positioned at the upper windscreen area (14% from top, ~150px level), 100% bilingual badge localization, comprehensive SCS SDK traffic fines dictionary, procedural Web Audio API sound synthesizer, smart stream session statistics, and Twitch chat interactive viewer commands (`!honk`, `!cb`, `!route`, `!stats`, `!truck`, `!driver`, `!bet`).

#### 🚀 Added
* **🔔 Windscreen In-Game Toast Notifications (`.telemetry-event-toast`):**
  * Positioned at the top windscreen clear zone (`top: 14%; left: 50%`) with opaque background (`#0e131b`), accent glow borders, 4.5s holding duration, and sequential FIFO queue.
  * 100% language purity: localized badge tags (`FINE`, `TOLL`, `FUEL`, `FERRY`, `TRAIN`, `CONTRACT`, `CANCEL`, `CARGO`, `SERVICE`, `RESERVE`, `COACH`, `COMFORT`, `HORN`, `CB RADIO`, `STATS`, `WINNERS`).
* **⚡ Native SCS SDK Event Capture (`overlayobs_foozzee_telemetry.dll`):**
  * Interception of gameplay events: traffic fines (`player.fine.offence`), tollgates (`player.tollgate.paid`), ferries (`player.use.ferry`), trains (`player.use.train`), job delivered (`job.delivered`), and job cancelled (`job.cancelled`).
  * Full dictionary of rare SCS SDK offences: `illegal_trailer`, `damaged_vehicle`, `illegal_border_crossing`, `hard_shoulder_violation`, `generic` with unique SVG vector icons and sounds.
* **🛠️ Telemetry & Fleet Detectors:**
  * **Cargo & Chassis Damage:** Real-time monitoring of cargo damage delta (`>= 1%`) and chassis impact (`>= 3%`), red warning toast with cracked crate icon and blunt thud + computer beep audio.
  * **Service Station Complete:** Automated repair detection at speed < 1 km/h when wear drops to 0%, emerald toast with wrench icon and pneumatic impact wrench sound.
  * **Low Fuel Reserve:** Single alert per tank refill when fuel drops below 12% capacity, amber warning toast with fuel pump icon and Scania/Volvo warning chime.
  * **DLC Coaches Tours:** Support for passenger stops (`bus_stop`) with pneumatic door hiss + Ding-Dong chime, and passenger comfort drop alert (`bus_comfort`).
* **📊 Stream Session Statistics & Expanded Delivery Summary:**
  * Persistent tracking of jobs completed, km driven, maximum speed, total revenue, fines tally, and driver safety score.
  * Expanded 7.0s delivery summary card featuring route, distance, revenue, XP, trip fines, and viewer bet winners.
* **💬 Interactive Twitch Chat Commands (`ets2-chat.js`):**
  * `!honk` / `!гудок`: VIP, Sub, Mod, Broadcaster access, cooldown throttled, triggers loud pneumatic air horn and purple toast.
  * `!cb <message>` / `!рация <текст>`: Follower access, URL sanitizer, 70-char limit, triggers CB channel 15 toast with squelch and Roger Beep.
  * Info cards: `!route` / `!рейс`, `!stats` / `!стата`, `!truck` / `!тягач`, `!driver` / `!водитель`.
  * Trip Delivery Bet: `!bet clean` / `!ставка чистый` vs `!bet fine` / `!ставка штраф` with automatic payout announcement on delivery.
* **🧪 Test Tools & Demo Mode:**
  * `window.testTelemetryEvent()`, `window.testChatCommand()`, and `window.demoAllTelemetryEvents()` for full live demonstration of all cards and sound effects.

---

<a id="113---2026-11-15-en"></a>
### [1.1.3] - 2026-11-15

> [!IMPORTANT]
> **Release v1.1.3** delivers critical telemetry bridge stability, renames the native SCS SDK plugin to `overlayobs_foozzee_telemetry.dll` with elevated `NULL DACL` shared memory security descriptors, moves active cargo and DLC Coaches passenger trips directly into the primary dashboard HUD module, and guarantees 100% strict bilingual separation between English and Russian modes.

#### 🚀 Added
* **🗺️ Primary HUD Route & Trip Integration:**
  * Active cargo name and tonnage or passenger coach route now render directly inside the primary dashboard module (`#route-value` and `#lt-cargo`).
  * Live passenger comfort satisfaction rating (**`SATISFACTION: XX%`**) for ETS2 DLC Coaches displayed in the central cluster.
* **🌐 100% Strict Bilingual Separation (EN / RU):**
  * Complete linguistic purity: zero Cyrillic tokens leak into English mode, and zero raw Latin tokens leak into Russian mode regardless of game client language.
  * Comprehensive `CITIES_DB` dictionary with reverse lookup and phonetic transliteration fallback for mod maps and rare DLC cities.

#### 🛠 Fixed & Improved
* **Accurate Job Type Differentiation (Freight vs Coach):**
  * Fixed job classification across `overlayobs_foozzee_telemetry.dll`, `scripts/udp-bridge.ps1`, and `assets/js/ets2-telemetry.js`.
  * Standard freight deliveries (including trailerless chassis and mod vehicles) are guaranteed to display cargo name, tonnage, and freight status rather than falsely triggering passenger coach mode.
  * Bus stops and comfort ratings are now strictly isolated to authentic `DLC Coaches` tours (`bus_job`).
* **⚡ Telemetry Bridge Parsing Fix (`scripts/udp-bridge.ps1`):**
  * Resolved a PowerShell syntax evaluation error (`CommandNotFoundException`) inside `Clean-PlaceName` that previously triggered false `offline` telemetry states.
* **🛡️ Shared Memory Security Architecture (`Local\FooZzeeSCSTelemetry`):**
  * Configured an explicit Win32 `SECURITY_DESCRIPTOR` with `NULL DACL` in `native-plugin/plugin.cpp`, preventing `ERROR_ACCESS_DENIED` (Win32 Error 5) when ETS2 or Steam runs with elevated Administrator privileges.
* **🔄 Native Plugin Renaming & Hardening:**
  * Renamed the native telemetry plugin to `overlayobs_foozzee_telemetry.dll` across source code, build scripts, installers, and runtime scripts to avoid file naming collisions with other tools.
  * Disabled legacy file-based debug logging (`scs_sdk_dump.log`) to eliminate disk I/O overhead.
* **🧹 Automated Legacy File Cleanup:**
  * Updated `scripts/installer.ps1` and `build-and-install-plugin.bat` to automatically remove obsolete `scs_direct_telemetry.dll` from game directories while preserving third-party plugins.

---

<a id="112---2026-11-15-en"></a>
### [1.1.2] - 2026-11-15

> [!IMPORTANT]
> **Release v1.1.2** introduces a standalone GitHub update detector and notification system styled as an authentic Pip-Boy 3000 (Fallout) retro terminal with synthesized typewriter and CRT audio, 100% bilingual adaptation (EN/RU), built-in ETS2/ATS city & stops database with transliteration, an interactive project support button in the GUI installer, and updated OBS Studio integration guidelines.

#### 🚀 Added
* **📟 Standalone Pip-Boy 3000 Auto-Update Terminal:**
  * Automated GitHub API update detector (`assets/js/ets2-updater.js`) checking for new releases periodically without interrupting stream operations.
  * Retro CRT aesthetics: phosphor green bloom (`#00ff66`), scanlines, tube glass vignetting, and authentic cathode-ray power-on / collapse animations.
  * Built-in WebAudio retro synthesizer: procedural typewriter key clicks and CRT discharge capacitor hum.
  * Interactive action buttons: **`[ 🚀 UPDATE NOW ]`** (opens latest GitHub release in browser) and **`[ 💤 NEVERMIND ]`** (smooth CRT shutdown with session dismissal).
  * Smart bilingual changelog extraction: automatically parses and extracts English or Russian release notes from GitHub release descriptions.
  * Click anywhere on terminal text to skip typewriter animation.
  * Testable on-demand via `?test_update=1` URL parameter or `window.showPipBoyUpdateModal()`.
* **🌐 Bilingual Adaptation (EN / RU):**
  * Automatic synchronization with GUI installer language choice (`window.OVERLAY_CONFIG.lang`).
  * Direct test query overrides via `?test_update=1&lang=en` or `?test_update=1&lang=ru`.
* **💚 Custom Glowing Neon Pip-Boy Logo:**
  * Embedded custom glowing triangular logo (`assets/img/pipboy-logo.png`, 512×512, 157 KB) into the terminal header with a gentle breathing phosphor glow.
* **💖 «SUPPORT PROJECT» Button in Installer:**
  * Added interactive button in `Install-Overlay.bat` (`scripts/installer.ps1`) opening the author's DonationAlerts page: `https://www.donationalerts.com/r/foozzee`.
* **🎥 OBS Studio Interactive Setup Guidelines:**
  * Updated documentation across all README files: explicitly instructing users to **uncheck "Local file"** and add the overlay via **"URL"** (`D:\html\Overlay\ets2-desktop.html`) to preserve interactivity for cockpit buttons and the Pip-Boy terminal.

#### 🛠 Fixed & Improved
* **🗺️ Route Display & City Localization (ETS2, ATS, DLC Coaches):**
  * **Concrete Job in Primary HUD Module:** Fixed technical tokens (`city`, `viewpoints`, `stop`) leaking into labels; moved the active cargo name/tons or passenger route/comfort directly into the main cockpit module (`#route-value` and `#lt-cargo`).
  * **100% Strict Bilingual Separation:** No raw Latin remains in Russian mode, and no Cyrillic leaks in English mode regardless of game client language.
  * **Comprehensive ETS2 & ATS City Database (`CITIES_DB`):** Embedded dictionary covering hundreds of European and American cities across all expansions, with reverse Cyrillic lookup and phonetic transliteration fallback for mod maps.
  * **Bus Stop Prefix & Suffix Cleaning:** Automatically strips `stop.`, `_bus_station`, `_terminal`, and index tags (`.01`), displaying pure city and station names.
  * **SCS SDK Native Plugin & UDP Bridge ID Pipeline:** `overlayobs_foozzee_telemetry.dll` and `scripts/udp-bridge.ps1` now stream `cityId` / `companyId` tokens alongside localized UTF-8 names.

---

<a id="110---2026-11-15-en"></a>
### [1.1.0] - 2026-11-15

> [!IMPORTANT]
> **Release v1.1.0** introduces full native support for bus passenger trips from the new **DLC Coaches** in Euro Truck Simulator 2, expands the collection of SCS SDK telemetry channels, maximizes lower cockpit HUD legibility in OBS Studio, and adds stream-safe DonationAlerts configuration to the graphical installer.

#### 🚀 Added
* **🚌 Euro Truck Simulator 2 — DLC Coaches (Passenger Jobs):**
  * Seamless detection of bus passenger trips (`bus_job`) with 100% backwards compatibility for standard freight cargo hauling in ETS2 & ATS.
  * Direct extraction of origin and destination terminal names using official SCS SDK stop attributes (`source_stop.*` ➔ `destination_stop.*`).
  * Real-time passenger satisfaction comfort rating display: **`SATISFACTION: XX%`** in the onboard computer ticker.
  * Added `isBusJob` state flag and dedicated bus stop endpoint data in the bridge server and web overlay.
* **⚡ New SCS Telemetry SDK 1.16 Channels:**
  * Integrated 4 new native telemetry channels into `overlayobs_foozzee_telemetry.dll` and `scripts/udp-bridge.ps1`:
    * `bus_job.average_satisfaction` (`FLOAT`) — Live coach passenger satisfaction comfort rating (0.0 .. 1.0).
    * `rest.stop` (`S32`) — Mandatory driver rest / fatigue countdown timer (in minutes).
    * `truck.electric.enabled` (`BOOL`) — Onboard electrical system and ignition switch status.
    * `truck.engine.enabled` (`BOOL`) — Engine operational running state.
* **💳 DonationAlerts GUI Installer Wizard:**
  * Added a secret DonationAlerts socket token field in `Install-Overlay.bat` (`scripts/installer.ps1`).
  * Features stream-safe password masking (asterisks) with an interactive **Show / Hide** toggle.
  * Automatically writes your token into `channels.donationAlerts.socketToken` in `config.js` for instant live donation alerts above the dashboard.

#### 🔄 Changed
* **🎛️ 100% Solid Opacity Lower Cockpit HUD:**
  * Lower dashboard background in `assets/css/ets2-desktop.css` set to **100% solid opacity (`alpha = 1`)**.
  * Eliminates see-through distraction from bright asphalt textures, road lines, and headlights in OBS Studio.
  * Webcam frame, chat box, and alert popups retain their elegant semi-transparent styling.
* **🧹 Kick.com Deprecation (Twitch-Only):**
  * Fully purged legacy Kick.com links and references from `ets2-desktop.html`, `ets2-vertical.html`, stylesheet rules, and configuration templates.
  * Social media bar in the bottom-right corner aligned cleanly to a single Twitch channel.
* **🛡️ Plugin Rebuild & Repository Hardening:**
  * Clean Release x64 compilation of `overlayobs_foozzee_telemetry.dll` (210 KB, SHA256: `6E9B18395E41C99A46FA9643301805F1D340D64A9069250CC6CFEBB038728DF9`).
  * Added `.gitattributes` binary filters (`*.dll`, `*.ttf`, `*.zip`) to prevent CRLF corruption during Git checkouts.

---

<a id="100---2026-11-12-en"></a>
### [1.0.0] - 2026-11-12

> [!NOTE]
> Initial public release of ETS2 / ATS Cockpit Telemetry Stream Overlay.

#### 🚀 Initial Features
* ⚡ **Native SCS Telemetry SDK 1.16 C++ Plugin:** Direct Win32 Shared Memory pipeline (`Local\FooZzeeSCSTelemetry`) operating at 30–60 FPS with zero external proxy software.
* 🖥️ **2-Row Lower Dashboard ("Torpedo") (`1920×1080`):** Speedometer, cruise control, gear, tachometer, pedals, warning lights, 7 sensors, scrolling job ticker, trip progress, navigation.
* 📱 **Mobile Vertical Layout (`1080×1920`):** Native layout designed for TikTok Live, YouTube Shorts, and Reels safe zones.
* ⏱️ **Real-World ETA Calculation (`real-eta-panel`):** Automatically factors active map scale (`1:19`, `1:3`, `1:10`) to compute real-world time remaining.
* 💬 **Twitch IRC Chat & FIFO Alert Queue:** Sequential alert cards with DonationAlerts integration.
* ⚡ **1-Click GUI Setup Wizard (`Install-Overlay.bat`):** Bilingual wizard with automatic Steam game detection and Desktop shortcut creation.

---

<a id="-русская-история-версий"></a>
## 🇷🇺 Русская история версий

### 📌 Навигация по версиям (RU)
* [v1.2.2 (2026-11-17) — Единая десктопная сцена, автоуведомление об обновлениях, WPF-установщик и 8-bit музыка](#122---2026-11-17-ru)
* [v1.2.1 (2026-11-16) — Встроенные средства просмотра документации и справочник команд](#121---2026-11-16-ru)
* [v1.2.0 (2026-11-16) — Всплывающие уведомления о событиях, SVG-иконки и Web Audio API синтезатор звуков](#120---2026-11-16-ru)
* [v1.1.3 (2026-11-15) — Стабильность телеметрии, переименование плагина и 100% двуязычный HUD](#113---2026-11-15-ru)
* [v1.1.2 (2026-11-15) — Автономная проверка обновлений Pip-Boy 3000, 100% двуязычная локализация и DLC Coaches](#112---2026-11-15-ru)
* [v1.1.0 (2026-11-15) — Поддержка ETS2 DLC Coaches, непрозрачная торпеда и новые каналы SCS SDK](#110---2026-11-15-ru)
* [v1.0.0 (2026-11-12) — Первый публичный релиз (Нативный плагин SCS SDK 1.16 и приборный HUD)](#100---2026-11-12-ru)

---

<a id="122---2026-11-17-ru"></a>
### [1.2.2] - 2026-11-17

> [!IMPORTANT]
> **Релиз v1.2.2** обеспечивает полный переход на единую десктопную архитектуру Cockpit HUD, устраняет сбои завершения и отмены рейсов на автобусах и грузовиках, обновляет кинематику и дизайн карточек уведомлений, добавляет автоуведомление об обновлениях в предпросмотре OBS с ЭЛТ-анимацией и Web Audio эффектами, а также полностью перерабатывает графический установщик и терминал Pip-Boy 3000 на нативный WPF со встроенной 8-bit музыкой.

#### 🚀 Добавлено
* **🔔 Автоуведомление об обновлении в предпросмотре OBS (`assets/js/ets2-telemetry.js`, `assets/css/ets2-base.css`):**
  * Автономный опрос GitHub API с защитой от rate-лимитов (`HTTP 403`) через кэширование в `localStorage` (интервал 3 часа).
  * Аутентичный ретро-стиль зелёного люминофора Pip-Boy 3000 (`#22c55e`, `#15803d`, глубокий фон `#070b09`, сканлайны кинескопа).
  * Анимации включения и выключения ЭЛТ-монитора (`crtPowerOn` и `crtPowerOff`) с развёрткой луча из горизонтальной линии.
  * Побуквенная печать текста со скоростью 22 мс на символ, мигающим зелёным курсором `▌` и контейнером с фиксированной высотой (без скачков оверлея).
  * Синтез звуков через Web Audio API: щелчок тумблера питания, свист строчного трансформатора ТДКС (15.6 кГц), размагничивание и реалистичные щелчки клавиатуры терминала.
  * Интерактивные команды тестирования: `window.testTelemetryEvent('update')` и `window.testTelemetryEvent('update', 'v1.2.3')`.
* **🛠️ Автономный терминал обновлений Pip-Boy 3000 (`Update-Overlay.bat` и `scripts/updater.ps1`):**
  * Графический интерфейс на базе WPF, работающий строго в STA-потоке (`Single-Threaded Apartment`) с принудительной поддержкой TLS 1.2.
  * Защита от сбоев сети с 5-секундным таймаутом и информативным выводом сообщения при исчерпании лимитов GitHub API без падения приложения.
  * Двуязычная локализация (`RU` / `EN`) с мгновенным переключением и встроенным просмотром списка изменений.
* **🚚 Редизайн графического мастера установки (`Install-Overlay.bat` и `scripts/installer.ps1`):**
  * Полная переработка интерфейса на WPF в стиле приборной панели ETS2 / ATS (`#0d1117`, `#151b24`, `#2a3444`, золотой янтарь `#f59e0b`, циан `#38bdf8`).
  * Премиальные шаблоны кнопок со скруглением `CornerRadius="8"`, сменой градиента при наведении и тактильным сдвигом при клике.
  * Центральная кнопка «ПОДДЕРЖАТЬ ПРОЕКТ» (`CornerRadius="10"`, градиент `#ff5e5b` → `#e11d48`) с проверенной векторной иконкой сердца Material Design со ссылкой на DonationAlerts.
  * Блок «Поставить звезду на GitHub» с векторной иконкой звезды и прямым переходом в репозиторий.
  * Компактный 8-bit аудиолуп в памяти (268 КБ, 22050 Гц Mono), генерируемый через встроенный C#-код за 6 мс, с кнопкой паузы/воспроизведения в шапке.
  * Отображение актуальной версии пакета `v1.2.2` в заголовке окна, бейдже шапки и статусной строке футера.
* **🎯 Векторные знаки ограничения скорости (30–130 км/ч):**
  * Полный набор векторных знаков скорости с шагом 10 км/ч (30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130) с контрастной красной каймой и чётким шрифтом.
* **😊 Векторные эмодзи комфорта пассажиров (`busSat`):**
  * Пять уровней удовлетворенности пассажиров с динамическими векторными эмодзи и уведомлениями об изменении комфорта (`bus_comfort_up` / `bus_comfort_down`).

#### 🔄 Изменено
* **🖥️ Переход на единую десктопную версию:**
  * Полностью удалён файл `ets2-vertical.html` и специфичный мёртвый код вертикального режима; весь проект и документация сфокусированы на десктопной сцене `1920×1080` (`ets2-desktop.html`).
* **🎨 Масштаб и кинематика уведомлений:**
  * Размер карточек уведомлений увеличен на +10% для идеальной читаемости на трансляциях.
  * Новая кинематика: плавный выезд сверху вниз на лобовое стекло и последующее мягкое растворение на месте.
  * Плотная непрозрачная графитовая подложка (`#0e131b`) с контурным свечением статуса.

#### 🐛 Исправлено
* **🛑 Логика завершения и отмены рейсов (`plugin.cpp`, `ets2-telemetry.js`):**
  * Добавлен перехват всех вариантов событий завершения и аннулирования контрактов в SCS SDK (`job.delivered`, `job.cancelled`, `bus_job.*`, `car_job.*`).
  * Заблокировано ложное уведомление «-100% комфорта», возникавшее при сбросе значения `busSat` игрой в 0 при завершении путевого листа.
  * Реализован fallback по изменению состояния контракта в телеметрии при отсутствии явного события от игрового движка.

---

<a id="121---2026-11-16-ru"></a>
### [1.2.1] - 2026-11-16

> [!IMPORTANT]
> **Релиз v1.2.1** добавляет в графический установщик (`Install-Overlay.bat` / `scripts/installer.ps1`) встроенные модальные окна для чтения списка изменений и интерактивных команд на выбранном языке оверлея непосредственно перед или после установки.

#### 🚀 Добавлено
* **📖 Встроенный просмотр документации в мастере установки (`scripts/installer.ps1`):**
  * В группу 4 установщика добавлены кнопки «📜 Список изменений» и «📖 Список команд».
  * Открытие отдельных модальных окон в тёмной теме с отображением полной истории версий (`CHANGELOG.ru.md` / `CHANGELOG.en.md`) и справочника команд (`commands.ru.md` / `commands.en.md`) в соответствии с выбранным в установщике языком.
  * Умный поиск файлов документации по путям установки и родительским каталогам.
  * Кнопка «📄 Открыть в блокноте» для внешнего просмотра и копирования.

---

<a id="120---2026-11-16-ru"></a>
### [1.2.0] - 2026-11-16

> [!IMPORTANT]
> **Релиз v1.2.0** добавляет всплывающие игровые уведомления о событиях телеметрии в верхней зоне лобового стекла (14% сверху, уровень ~150px), 100% локализацию бейджей карточек без англицизмов, полный словарь редких штрафов SCS SDK, процедурный синтезатор звуков Web Audio API, сквозную статистику сессии стрима и интерактивные команды Twitch-чата (`!гудок`, `!рация`, `!рейс`, `!стата`, `!тягач`, `!водитель`, `!ставка`).

#### 🚀 Добавлено
* **🔔 Всплывающие уведомления в верхней части экрана (`.telemetry-event-toast`):**
  * Позиционирование в верхней зоне лобового стекла (`top: 14%; left: 50%`) с плотным непрозрачным фоном (`#0e131b`), акцентными рамками, показом 4.5 с и последовательной FIFO-очередью.
  * 100% чистота русской локализации: полностью русские бейджи (`ШТРАФ`, `ОПЛАТА`, `АЗС`, `ПАРОМ`, `ПОЕЗД`, `КОНТРАКТ`, `ОТМЕНА`, `ГРУЗ`, `СТО`, `РЕЗЕРВ`, `АВТОБУС`, `КОМФОРТ`, `СИГНАЛ`, `РАЦИЯ`, `СТАТИСТИКА`, `ПОБЕДИТЕЛИ`).
* **⚡ Захват игровых событий в плагине (`overlayobs_foozzee_telemetry.dll`):**
  * Перехват игровых событий `SCS_TELEMETRY_EVENT_gameplay`: штрафы за нарушения ПДД (`player.fine.offence`), оплата проезда по платным дорогам (`player.tollgate.paid`), паромная переправа (`player.use.ferry`), ж/д переправа (`player.use.train`), доставка груза (`job.delivered`) и отмена рейса (`job.cancelled`).
  * Полный словарь редких штрафов SCS SDK: `illegal_trailer` (неразрешённый прицеп), `damaged_vehicle` (критическая неисправность ТС), `illegal_border_crossing` (нарушение госграницы), `hard_shoulder_violation` (движение по обочине) и `generic` с уникальными векторными SVG-иконками и звуками.
* **🛠️ Телеметрические детекторы автопарка:**
  * **Урон груза и тягача:** отслеживание скачка урона груза (`>= 1%`) или удара тягача (`>= 3%`), красный тост с треснувшим ящиком и глухим ударом + тревожным писком компьютера.
  * **Техобслуживание на СТО:** автоматическое обнаружение ремонта на стоянке при сбросе износа до 0%, изумрудный тост с ключом и звуком пневмогайковёрта.
  * **Резерв топлива:** одиночное предупреждение за заправку при остатке топлива ниже 12%, янтарный тост с колонкой и предупреждающим сигналом Scania/Volvo.
  * **Рейсы пассажирских туров DLC Coaches:** фиксация остановок (`bus_stop`) со звуком пневмодверей и колокольчиком, а также предупреждение о дискомфорте пассажиров (`bus_comfort`).
* **📊 Статистика сессии стрима и расширенная карточка сдачи рейса:**
  * Сквозной учёт завершённых контрактов, пройденных километров, рекорда скорости, заработка, штрафов и индекса безопасности вождения.
  * Расширенная карточка сдачи груза (удержание 7.0 с) с отображением маршрута, километров, дохода, опыта, штрафов за поездку и победителей зрительских ставок.
* **💬 Интерактивные команды Twitch-чата (`ets2-chat.js`):**
  * `!гудок` / `!фафа` / `!honk`: доступ для VIP, подписчиков, модераторов и стримера, ролевой кулдаун, басовитый пневмогудок тягача.
  * `!рация <текст>` / `!сиби <текст>` / `!cb <текст>`: доступ для фолловеров, фильтрация ссылок, лимит 70 символов, карточка 15 канала со звуком squelch и Roger Beep.
  * Инфо-карточки: `!рейс`, `!стата`, `!тягач`, `!водитель`.
  * Тотализатор рейса: тихий приём ставок `!ставка чистый` / `!ставка штраф` с выводом победителей при сдаче груза.
* **🧪 Тестовые инструменты и демо-режим:**
  * Функции `window.testTelemetryEvent()`, `window.testChatCommand()` и `window.demoAllTelemetryEvents()` для интерактивной демонстрации всех уведомлений и звуков в браузере.

---

<a id="113---2026-11-15-ru"></a>
### [1.1.3] - 2026-11-15

> [!IMPORTANT]
> **Релиз v1.1.3** обеспечивает полную стабильность моста телеметрии, переименовывает нативный плагин SCS SDK в `overlayobs_foozzee_telemetry.dll` с дескриптором безопасности `NULL DACL` для разделяемой памяти, выводит активный груз и рейсы пассажирских автобусов DLC Coaches напрямую в основной блок приборной панели и гарантирует 100% строгое разделение русской и английской локализаций.

#### 🚀 Добавлено
* **🗺️ Интеграция рейса в основной блок HUD:**
  * Наименование и масса перевозимого груза либо автобусный маршрут теперь выводятся напрямую в центральном блоке маршрута приборной панели (`#route-value` и `#lt-cargo`).
  * В центральный кластер интегрирован вывод уровня комфорта пассажиров (**`КОМФОРТ: XX%`**) для ETS2 DLC Coaches.
* **🌐 100% строгое разделение языков (RU / EN):**
  * Полная языковая чистота: в английском режиме исключены любые кириллические токены, в русском режиме исключена необработанная латиница независимо от языка игры.
  * Встроенный словарь `CITIES_DB` с двусторонним поиском и фонетической транслитерацией для городов из дополнений и пользовательских карт.

#### 🛠 Исправлено и улучшено
* **Эталонное определение типа рейса (грузовой vs автобусный):**
  * Исправлена классификация рейсов в `overlayobs_foozzee_telemetry.dll`, `scripts/udp-bridge.ps1` и `assets/js/ets2-telemetry.js`.
  * При выполнении грузовых доставок (включая шасси без полуприцепа и моды техники) гарантированно выводятся название груза, масса и статус грузового рейса без ложного включения режима автобуса.
  * Поля автобусных остановок и комфорт пассажиров строго изолированы для туров `DLC Coaches` (`bus_job`).
* **⚡ Устранение ошибки парсера моста (`scripts/udp-bridge.ps1`):**
  * Исправлена синтаксическая ошибка вызова командлета PowerShell в функции `Clean-PlaceName`, приводившая к ложному статусу «offline» при приёме телеметрии.
* **🛡️ Архитектура безопасности разделяемой памяти (`Local\FooZzeeSCSTelemetry`):**
  * В `native-plugin/plugin.cpp` реализован явный дескриптор `SECURITY_DESCRIPTOR` с `NULL DACL`, предотвращающий ошибку `ERROR_ACCESS_DENIED` (Win32 Error 5) при запуске ETS2 или Steam с правами администратора.
* **🔄 Переименование и оптимизация нативного плагина:**
  * Плагин переименован в `overlayobs_foozzee_telemetry.dll` во всех исходниках, сборочных скриптах и установщиках для исключения конфликтов с другими инструментами.
  * Отключена избыточная запись отладочного лога (`scs_sdk_dump.log`) на диск для устранения лишней нагрузки на накопитель.
* **🧹 Автоматическая очистка устаревших файлов:**
  * В `scripts/installer.ps1` и `build-and-install-plugin.bat` добавлено автоматическое удаление устаревшей библиотеки `scs_direct_telemetry.dll` из папки плагинов игры без воздействия на сторонние DLL.

---

<a id="112---2026-11-15-ru"></a>
### [1.1.2] - 2026-11-15

> [!IMPORTANT]
> **Релиз v1.1.2** добавляет встроенную автономную систему проверки обновлений с GitHub в стилистике терминала Pip-Boy 3000 (Fallout) с синтезом звуков CRT и печатной машинки, полную 100% двуязычную адаптацию (RU/EN), встроенную базу городов и остановок ETS2/ATS, кнопку поддержки автора в графическом установщике и обновлённые инструкции интеграции в OBS Studio.

#### 🚀 Добавлено
* **📟 Автономный терминал обновлений в стиле Pip-Boy 3000:**
  * Модуль проверки (`assets/js/ets2-updater.js`) обращается к GitHub API (`releases/latest`), сравнивает версии и оповещает стримера без блокировки оверлея.
  * Аутентичный ретро-дизайн кинескопа: зелёный люминофор (`#00ff66`), горизонтальные скан-линии (scanlines), виньетирование стеклянной колбы и анимация луча CRT.
  * Встроенный WebAudio ретро-синтезатор: процедурная генерация звука щелчков клавиш печатной машинки и высоковольтного спадающего звука выключения кинескопа.
  * Кнопки **`[ 🚀 ОБНОВИТЬ ]`** (открывает страницу нового релиза на GitHub) и **`[ 💤 ДА НУ ЕГО НАФИГ ]`** (красиво гасит терминал с отметкой об отклонении).
  * Умный двуязычный парсинг описания релиза из GitHub: автоматическое извлечение русской или английской секции с очисткой служебной разметки.
  * Клик в область текста мгновенно завершает посимвольную печать.
  * Поддержка тестирования через параметр `?test_update=1` или вызов `window.showPipBoyUpdateModal()`.
* **🌐 Полная двуязычность Pip-Boy терминала (RU / EN):**
  * Автоматическая привязка к языку, выбранному в установщике `Install-Overlay.bat` (`window.OVERLAY_CONFIG.lang`).
  * Параметры тестирования в URL: `?test_update=1&lang=ru` и `?test_update=1&lang=en`.
* **💚 Фирменный неоновый логотип Pip-Boy:**
  * В шапку терминала интегрирован оптимизированный неоновый логотип (`assets/img/pipboy-logo.png`, 512×512, 157 КБ) с пульсирующим свечением.
* **💖 Кнопка «ПОДДЕРЖАТЬ ПРОЕКТ» в установщике:**
  * В нижнюю панель визарда `Install-Overlay.bat` (`scripts/installer.ps1`) добавлена кнопка **«💖 ПОДДЕРЖАТЬ ПРОЕКТ»** / **«💖 SUPPORT PROJECT»**, открывающая страницу DonationAlerts: `https://www.donationalerts.com/r/foozzee`.
* **🎥 Обновление руководства по OBS Studio:**
  * Добавлено обязательное указание снимать галочку **«Локальный файл»** и подключать оверлей через строку **«Ссылка» (URL)**, что сохраняет интерактивность кнопок приборной панели, окна Pip-Boy и ссылок.

#### 🛠 Исправлено и улучшено
* **🗺️ Отображение маршрута и локализация городов (ETS2, ATS, DLC Coaches):**
  * **Конкретный рейс в основном блоке приборной панели:** Исключено попадание технических токенов (`city`, `viewpoints`, `stop`); заказ и тип рейса (груз с массой или пассажирский рейс с комфортом) выводятся прямо в основном модуле маршрута (`#route-value` и `#lt-cargo`).
  * **100% строгое разделение языков RU и EN:** В русском оверлее исключена латиница (города и остановки переводятся или транслитерируются в кириллицу), в английском оверлее исключена кириллица.
  * **Обширная база городов ETS2 и ATS (`CITIES_DB`):** Встроен словарь сотен городов Европы и США со всеми дополнениями, с обратным словарем и фонетической транслитерацией для карт-модов.
  * **Очистка служебных префиксов автобусных остановок:** Автоматическое удаление токенов `stop.`, `_bus_station`, `_terminal`, цифровых индексов (`.01` / `_01`).
  * **Синхронизация передачи ID в плагине и мосту:** Плагин `overlayobs_foozzee_telemetry.dll` и скрипт `scripts/udp-bridge.ps1` передают `cityId` / `companyId` для точной идентификации городов независимо от языка игры.

---

<a id="110---2026-11-15-ru"></a>
### [1.1.0] - 2026-11-15

> [!IMPORTANT]
> **Релиз v1.1.0** добавляет полноценную нативную поддержку пассажирских автобусных перевозок из нового **DLC Coaches** для Euro Truck Simulator 2, расширяет набор считываемых каналов телеметрии SCS SDK, улучшает контрастность и читаемость приборной панели в OBS Studio, а также интегрирует настройку DonationAlerts в графический установщик.

#### 🚀 Добавлено
* **🚌 Euro Truck Simulator 2 — DLC Coaches (Пассажирские перевозки):**
  * Автоматическое определение рейса автобуса (`bus_job`) с сохранением 100% совместимости с грузовыми заказами в ETS2 и ATS.
  * Извлечение названий пунктов отправления и назначения через атрибуты остановок SCS SDK (`source_stop.*` ➔ `destination_stop.*`).
  * Отображение текущего уровня удовлетворённости пассажиров в реальном времени: **`КОМФОРТ: XX%`** в бегущей строке бортового компьютера.
  * Передача флага `isBusJob` и специализированной информации об остановках в скрипт моста и веб-интерфейс оверлея.
* **⚡ Новые каналы телеметрии SCS Telemetry SDK 1.16:**
  * В нативный C++ плагин `overlayobs_foozzee_telemetry.dll` и скрипт моста `scripts/udp-bridge.ps1` добавлена регистрация и передача 4 новых каналов:
    * `bus_job.average_satisfaction` (`FLOAT`) — Средний уровень комфорта пассажиров автобуса (шкала 0.0 .. 1.0).
    * `rest.stop` (`S32`) — Таймер обратного отсчёта времени до обязательного отдыха/сна водителя (в минутах).
    * `truck.electric.enabled` (`BOOL`) — Статус бортовой электросети и зажигания тягача / автобуса.
    * `truck.engine.enabled` (`BOOL`) — Статус работы двигателя.
* **💳 Настройка DonationAlerts в графическом установщике:**
  * В установщик `Install-Overlay.bat` (`scripts/installer.ps1`) добавлено поле для ввода секретного токена DonationAlerts.
  * Поле ввода защищено маскированием (звёздочки) с кнопкой **Показать / Скрыть**.
  * Токен автоматически сохраняется в `channels.donationAlerts.socketToken` генерируемого файла `config.js`.

#### 🔄 Изменено
* **🎛️ 100% непрозрачный фон приборной панели («торпеды»):**
  * Фон нижней приборной панели в `assets/css/ets2-desktop.css` сделан **на 100% сплошным и непрозрачным (`alpha = 1`, solid background)**.
  * Исключено просвечивание текстур дороги, яркой разметки и фар встречных машин сквозь спидометр и навигацию в OBS Studio.
  * Рамка веб-камеры, блок чата и всплывающие карточки оповещений сохраняют эстетичную прозрачность.
* **🧹 Очистка от Kick.com (Twitch-Only):**
  * Полностью удалены устаревшие ссылки и плашки Kick.com из оверлеев `ets2-desktop.html`, `ets2-vertical.html`, CSS-стилей и шаблонов конфигурации.
  * Блок социальных сетей в правом нижнем углу торпеды аккуратно выровнен под единый канал Twitch.
* **🛡️ Обновление плагина и защита репозитория:**
  * Выполнена чистая компиляция Release x64 библиотеки `overlayobs_foozzee_telemetry.dll` (размер: 210 КБ, SHA256: `6E9B18395E41C99A46FA9643301805F1D340D64A9069250CC6CFEBB038728DF9`).
  * В `.gitattributes` добавлена строгая защита бинарных файлов (`*.dll`, `*.ttf`, `*.zip`) от искажения окончаний строк при синхронизации через Git.

---

<a id="100---2026-11-12-ru"></a>
### [1.0.0] - 2026-11-12

> [!NOTE]
> Первый публичный релиз приборного комплекса ETS2 / ATS Cockpit Telemetry Stream Overlay.

#### 🚀 Базовые возможности
* ⚡ **Нативный C++ плагин SCS Telemetry SDK 1.16:** Прямое чтение телеметрии через Win32 Shared Memory (`Local\FooZzeeSCSTelemetry`) с частотой 30–60 FPS без сторонних программ-посредников.
* 🖥️ **Двухрядная приборная панель Desktop (`1920×1080`):** Спидометр, круиз-контроль, КПП, тахометр, педали и руль, индикаторы, 7 датчиков бортового компьютера, бегущая строка экономики и навигация.
* 📱 **Вертикальная мобильная сцена (`1080×1920`):** Адаптация под безопасные зоны TikTok Live, YouTube Shorts, Reels.
* ⏱️ **Реальное время в пути (`real-eta-panel`):** Автоматическая конвертация навигационного времени в реальные минуты до цели.
* 💬 **Интерактив Twitch IRC и FIFO-алерты:** Всплывающие карточки оповещений с поддержкой DonationAlerts.
* ⚡ **1-клик графический установщик (`Install-Overlay.bat`):** Двуязычный визард с автоматическим поиском установленных ETS2 / ATS в Steam.

---

### 👤 Автор проекта / Project Author — FooZzee
* **Website:** [foozzee.ru](https://foozzee.ru/)
* **Twitch:** [twitch.tv/foozzee](https://www.twitch.tv/foozzee)
* **YouTube:** [@foozzee](https://www.youtube.com/@foozzee)
* **Telegram:** [@foozzeestream](https://t.me/foozzeestream)
* **VK:** [vk.ru/gtfun](https://vk.ru/gtfun)

[1.2.1]: https://github.com/FooZzee/ets2-ats-stream-overlay/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/FooZzee/ets2-ats-stream-overlay/compare/v1.1.3...v1.2.0
[1.1.3]: https://github.com/FooZzee/ets2-ats-stream-overlay/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/FooZzee/ets2-ats-stream-overlay/compare/v1.1.0...v1.1.2
[1.1.0]: https://github.com/FooZzee/ets2-ats-stream-overlay/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/FooZzee/ets2-ats-stream-overlay/releases/tag/v1.0.0
