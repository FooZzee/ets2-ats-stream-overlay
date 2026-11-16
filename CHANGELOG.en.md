# 📜 Project Version History (Changelog)

> **ETS2 / ATS Cockpit Telemetry Stream Overlay**  
> All notable changes are documented in strict adherence to [Keep a Changelog](https://keepachangelog.com/) and [Semantic Versioning 2.0.0](https://semver.org/).

[![Keep a Changelog](https://img.shields.io/badge/Changelog-Keep%20a%20Changelog%201.1.1-orange?style=for-the-badge&logo=git)](https://keepachangelog.com/)
[![SemVer](https://img.shields.io/badge/SemVer-2.0.0-blue?style=for-the-badge&logo=semver)](https://semver.org/)
[![Latest Release](https://img.shields.io/badge/Latest-v1.1.3-green?style=for-the-badge&logo=github)](https://github.com/FooZzee/ets2-ats-stream-overlay/releases/tag/v1.1.3)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](./LICENSE)

---

> **Language:** **English** | [Русский (CHANGELOG.ru.md)](./CHANGELOG.ru.md) | [Bilingual Combined Changelog](./CHANGELOG.md) | [Main README](./README.md)

---

## 📌 Version Index

* [v1.2.0 (2026-11-16) — In-Game Event Toast Notifications, SVG Icons & Web Audio API Sound Synthesizer](#120---2026-11-16)
* [v1.1.3 (2026-11-15) — Telemetry Stability, Native Plugin Renaming & 100% Bilingual HUD](#113---2026-11-15)
* [v1.1.2 (2026-11-15) — Pip-Boy 3000 Standalone Auto-Update Terminal, 100% Bilingual Localization & DLC Coaches](#112---2026-11-15)
* [v1.1.0 (2026-11-15) — ETS2 DLC Coaches Support, Solid Dashboard & Enhanced SCS Telemetry](#110---2026-11-15)
* [v1.0.0 (2026-11-12) — Initial Release (Native SCS Telemetry SDK 1.16 & Broadcast HUD)](#100---2026-11-12)

---

## [1.2.0] - 2026-11-16

> [!IMPORTANT]
> **Release v1.2.0** introduces in-game telemetry event toast popups positioned at the upper windscreen area (14% from top, ~150px level), 100% bilingual badge localization, comprehensive SCS SDK traffic fines dictionary, procedural Web Audio API sound synthesizer, smart stream session statistics, and Twitch chat interactive viewer commands (`!honk`, `!cb`, `!route`, `!stats`, `!truck`, `!driver`, `!bet`).

### 🚀 Added

#### 🔔 Windscreen In-Game Toast Notifications (`.telemetry-event-toast`)
* **Upper Windscreen HUD Placement:**
  * Fixed positioning at the upper windscreen zone (`top: 14%; left: 50%`) with opaque cockpit background (`#0e131b`), accent glow borders, 4.5s holding duration, and sequential FIFO queue.
  * 100% language purity: fully localized badge tags (`FINE`, `TOLL`, `FUEL`, `FERRY`, `TRAIN`, `CONTRACT`, `CANCEL`, `CARGO`, `SERVICE`, `RESERVE`, `COACH`, `COMFORT`, `HORN`, `CB RADIO`, `STATS`, `WINNERS`).

#### ⚡ Native SCS SDK Event Capture (`overlayobs_foozzee_telemetry.dll`)
* **Real-time Gameplay Event Interception:**
  * Captures traffic fines (`player.fine.offence`), tollgates (`player.tollgate.paid`), ferries (`player.use.ferry`), trains (`player.use.train`), job delivered (`job.delivered`), and job cancelled (`job.cancelled`).
  * Full dictionary of rare SCS SDK offences: `illegal_trailer`, `damaged_vehicle`, `illegal_border_crossing`, `hard_shoulder_violation`, `generic` with unique SVG vector icons and sounds.

#### 🛠️ Telemetry & Fleet Detectors
* **Cargo & Chassis Damage:**
  * Real-time monitoring of cargo damage delta (`>= 1%`) and chassis impact (`>= 3%`), red warning toast with cracked crate icon and blunt thud + computer beep audio.
* **Service Station Complete:**
  * Automated repair detection at speed < 1 km/h when wear drops to 0%, emerald toast with wrench icon and pneumatic impact wrench sound.
* **Low Fuel Reserve:**
  * Single alert per tank refill when fuel drops below 12% capacity, amber warning toast with fuel pump icon and Scania/Volvo warning chime.
* **DLC Coaches Tours:**
  * Support for passenger stops (`bus_stop`) with pneumatic door hiss + Ding-Dong chime, and passenger comfort drop alert (`bus_comfort`).

#### 📊 Stream Session Statistics & Expanded Delivery Summary
* **Full Stream Run Tracking:**
  * Persistent tracking of jobs completed, km driven, maximum speed, total revenue, fines tally, and driver safety score.
  * Expanded 7.0s delivery summary card featuring route, distance, revenue, XP, trip fines, and viewer bet winners.

#### 💬 Interactive Twitch Chat Commands (`ets2-chat.js`)
* **Role-Based Live Interactions:**
  * `!honk` / `!гудок`: VIP, Sub, Mod, Broadcaster access, cooldown throttled, triggers loud pneumatic air horn and purple toast.
  * `!cb <message>` / `!рация <текст>`: Follower access, URL sanitizer, 70-char limit, triggers CB channel 15 toast with squelch and Roger Beep.
  * Info cards: `!route` / `!рейс`, `!stats` / `!стата`, `!truck` / `!тягач`, `!driver` / `!водитель`.
  * Trip Delivery Bet: `!bet clean` / `!ставка чистый` vs `!bet fine` / `!ставка штраф` with automatic payout announcement on delivery.

#### 🧪 Test Tools & Demo Mode
* **Instant Verification Functions:**
  * `window.testTelemetryEvent()`, `window.testChatCommand()`, and `window.demoAllTelemetryEvents()` for full live demonstration of all cards and sound effects.

#### 🔊 Autonomous Web Audio API Sound Synthesizer (`TelemetrySoundEngine`)
* **Zero External Dependencies:**
  * Fully code-generated procedural sound effects: mechanical dual shutter click with flash whine, police whistle with pea trill modulation, police Yelp horn sweep, tachograph beeps, car horn blast, refuel chime, transponder ping, ship horn, train air horn, and job chords.
  * Transparent fallback to `./assets/sounds/<event>.mp3` if custom audio files are provided.

#### 🧪 Developer Console Test Helper
* **Browser Test API:**
  * Global function `window.testTelemetryEvent(type, offence)` to test and preview all notification types, icons, and audio effects directly from the browser console.

---

## [1.1.3] - 2026-11-15

> [!IMPORTANT]
> **Release v1.1.3** delivers critical telemetry bridge stability, renames the native SCS SDK plugin to `overlayobs_foozzee_telemetry.dll` with elevated `NULL DACL` shared memory security descriptors, moves active cargo and DLC Coaches passenger trips directly into the primary dashboard HUD module, and guarantees 100% strict bilingual separation between English and Russian modes.

### 🚀 Added

#### 🗺️ Primary HUD Route & Trip Integration
* **Primary Dashboard Route Module:**
  * Active cargo name and tonnage or passenger coach route now render directly inside the primary dashboard module (`#route-value` and `#lt-cargo`).
  * Live passenger comfort satisfaction rating (**`SATISFACTION: XX%`**) for ETS2 DLC Coaches displayed in the central cluster.
* **100% Strict Bilingual Separation (EN / RU):**
  * Complete linguistic purity: zero Cyrillic tokens leak into English mode, and zero raw Latin tokens leak into Russian mode regardless of game client language.
  * Comprehensive `CITIES_DB` dictionary with reverse lookup and phonetic transliteration fallback for mod maps and rare DLC cities.

### 🛠 Fixed & Improved

#### ⚡ Telemetry Bridge & Native Plugin Stability
* **Accurate Job Type Differentiation (Freight vs Coach):**
  * Fixed job classification across `overlayobs_foozzee_telemetry.dll`, `scripts/udp-bridge.ps1`, and `assets/js/ets2-telemetry.js`.
  * Standard freight deliveries (including trailerless chassis and mod vehicles) are guaranteed to display cargo name, tonnage, and freight status rather than falsely triggering passenger coach mode.
  * Bus stops and comfort ratings are now strictly isolated to authentic `DLC Coaches` tours (`bus_job`).
* **Telemetry Bridge Parsing Fix (`scripts/udp-bridge.ps1`):**
  * Resolved a PowerShell syntax evaluation error (`CommandNotFoundException`) inside `Clean-PlaceName` that previously triggered false `offline` telemetry states.
* **Shared Memory Security Architecture (`Local\FooZzeeSCSTelemetry`):**
  * Configured an explicit Win32 `SECURITY_DESCRIPTOR` with `NULL DACL` in `native-plugin/plugin.cpp`, preventing `ERROR_ACCESS_DENIED` (Win32 Error 5) when ETS2 or Steam runs with elevated Administrator privileges.
* **Native Plugin Renaming & Hardening:**
  * Renamed the native telemetry plugin to `overlayobs_foozzee_telemetry.dll` across source code, build scripts, installers, and runtime scripts to avoid file naming collisions with other tools.
  * Disabled legacy file-based debug logging (`scs_sdk_dump.log`) to eliminate disk I/O overhead.
* **Automated Legacy File Cleanup:**
  * Updated `scripts/installer.ps1` and `build-and-install-plugin.bat` to automatically remove obsolete `scs_direct_telemetry.dll` from game directories while preserving third-party plugins.

---

## [1.1.2] - 2026-11-15

> [!IMPORTANT]
> **Release v1.1.2** introduces a standalone GitHub update detector and notification system styled as an authentic Pip-Boy 3000 (Fallout) retro terminal with synthesized typewriter and CRT audio, 100% bilingual adaptation (EN/RU), built-in ETS2/ATS city & stops database with transliteration, an interactive project support button in the GUI installer, and updated OBS Studio integration guidelines.

### 🚀 Added

#### 📟 Standalone Pip-Boy 3000 Auto-Update Terminal
* **Automated GitHub Release Detection:** Integrated standalone update detector (`assets/js/ets2-updater.js`) that queries the official GitHub API (`releases/latest`), checks semantic versions, and alerts streamers to new updates without interrupting live broadcast operations.
* **Authentic CRT Phosphor Design:** Retro terminal aesthetics featuring green phosphor bloom (`#00ff66`), horizontal scanlines, glass tube vignetting, and authentic CRT power-on and collapse animations.
* **Built-in WebAudio Retro Synthesizer:** Real-time procedural audio synthesis simulating vintage typewriter key clatter during text printing and high-voltage capacitor discharge hum upon display shutdown.
* **Interactive Control Commands:**
  * **`[ 🚀 UPDATE NOW ]`** — Opens the new GitHub release page in your default browser.
  * **`[ 💤 NEVERMIND ]`** — Smoothly shuts down the terminal with CRT power-off animation and saves dismissal to session storage so the streamer is never interrupted again during the run.
* **Intelligent Bilingual Changelog Extraction:** Automatically parses release bodies on GitHub to isolate the language-matching section (English or Russian), stripping out raw Markdown markup.
* **Click-to-Skip Typewriter:** Clicking anywhere inside the terminal body immediately finishes text typing.
* **Testing & Diagnostic Modes:** Full support for simulation testing via `?test_update=1` in OBS or browser URLs, as well as the global `window.showPipBoyUpdateModal()` console helper.

#### 🌐 Full Bilingual Architecture (EN / RU)
* Automatically adapts its interface language according to the option chosen during setup in `Install-Overlay.bat` (`window.OVERLAY_CONFIG.lang`).
* Supports test query overrides: `?test_update=1&lang=en` and `?test_update=1&lang=ru`.

#### 💚 Custom Glowing Neon Pip-Boy Logo
* Integrated custom glowing triangle logo (`assets/img/pipboy-logo.png`, 512×512, 157 KB) into the terminal header with a gentle breathing green phosphor glow.

#### 💖 «SUPPORT PROJECT» Button in Installer
* Added interactive button **«💖 SUPPORT PROJECT»** (in English) / **«💖 ПОДДЕРЖАТЬ ПРОЕКТ»** (in Russian) to the bottom action bar of `Install-Overlay.bat` (`scripts/installer.ps1`), linking directly to the author's DonationAlerts page: `https://www.donationalerts.com/r/foozzee`.

#### 🎥 OBS Studio Interactive Setup Guidelines
* Updated documentation across all README files: explicitly instructing users to **uncheck "Local file"** and add the overlay strictly via the **"URL"** field (`D:\html\Overlay\ets2-desktop.html`). This bypasses OBS sandbox restrictions and enables full interactivity for HUD buttons, links, and the Pip-Boy terminal.

### 🛠 Fixed & Improved

#### 🗺️ Route Display & City Localization (ETS2, ATS, DLC Coaches)
* **Concrete Job Display in Main Dashboard Route Module:**
  * Eliminated internal engine debug tokens (`city`, `viewpoints`, `stop`, etc.) from polluting origin and destination labels.
  * Moved the active job title, cargo mass, and passenger comfort rating directly into the primary cockpit module (`#route-value` and `#lt-cargo`), reserving the scrolling ticker strictly for trip telemetry and economy summaries.
* **100% Bilingual Language Separation:**
  * In Russian mode (`lang: 'ru'`), no raw Latin city or cargo strings remain; unknown/mod cities are cleanly phonetically transliterated into Cyrillic.
  * In English mode (`lang: 'en'`), no Cyrillic leaks even when the game is played in Russian; names are converted into clean English Title Case.
* **Comprehensive ETS2 & ATS City Database (`CITIES_DB`):**
  * Embedded dictionary covering hundreds of European and American cities across all expansions (Scandinavia, Iberia, West Balkans, Greece, Nordic Horizons, and US states in ATS), featuring reverse lookup and transliteration fallback.
* **Bus Stop Prefix & Suffix Sanitation (DLC Coaches):**
  * Automatically strips internal stop tags (`stop.`, `_bus_station`, `_terminal`, indices like `.01` or `_01`) leaving pure city and station names.
* **SCS SDK Native Plugin & UDP Bridge ID Pipeline:**
  * `overlayobs_foozzee_telemetry.dll` and `scripts/udp-bridge.ps1` now extract and stream `cityId` / `companyId` tokens alongside localized UTF-8 names, ensuring flawless city resolution regardless of the game client's language.

---

## [1.1.0] - 2026-11-15

> [!IMPORTANT]
> **Release v1.1.0** introduces full native support for bus passenger trips from the new **DLC Coaches** in Euro Truck Simulator 2, expands the collection of SCS SDK telemetry channels, maximizes lower cockpit HUD legibility in OBS Studio, and adds stream-safe DonationAlerts configuration to the graphical installer.

### 🚀 Added

#### 🚌 Euro Truck Simulator 2 — DLC Coaches (Passenger Jobs)
* **Native Bus Passenger Detection (`bus_job`):** Seamless detection of bus passenger trips with 100% backwards compatibility for standard freight cargo hauling in ETS2 & ATS.
* **Stop-to-Stop Route Parsing:** Direct extraction of origin and destination terminal names using official SCS SDK stop attributes (`source_stop.*` ➔ `destination_stop.*`).
* **Live Passenger Satisfaction Metric:** Real-time passenger satisfaction comfort rating display: **`SATISFACTION: XX%`** in the onboard computer ticker.
* **Specialized Telemetry Payload:** Added `isBusJob` state flag and dedicated bus stop endpoint data in the bridge server and web overlay.

#### ⚡ New SCS Telemetry SDK 1.16 Channels
Integrated 4 new native telemetry channels into the C++ plugin (`overlayobs_foozzee_telemetry.dll`) and bridge script (`scripts/udp-bridge.ps1`):

| SDK Telemetry Channel | Data Type | Description |
|---|---|---|
| `bus_job.average_satisfaction` | `FLOAT` | Live coach passenger satisfaction comfort rating (scale 0.0 .. 1.0) |
| `rest.stop` | `S32` | Mandatory driver rest / fatigue countdown timer (in minutes) |
| `truck.electric.enabled` | `BOOL` | Onboard electrical system and ignition switch status |
| `truck.engine.enabled` | `BOOL` | Engine operational running state |

#### 💳 DonationAlerts GUI Installer Wizard
* Added a secret DonationAlerts socket token field in `Install-Overlay.bat` (`scripts/installer.ps1`).
* Features stream-safe password masking (asterisks) with an interactive **Show / Hide** toggle.
* Automatically writes your token into `channels.donationAlerts.socketToken` in `config.js` for instant live donation alerts above the dashboard.

---

### 🔄 Changed

#### 🎛️ 100% Solid Opacity Lower Cockpit HUD
* Lower dashboard background in `assets/css/ets2-desktop.css` set to **100% solid opacity (`alpha = 1`)**.
* Eliminates see-through distraction from bright asphalt textures, road lines, and headlights in OBS Studio.
* Webcam frame, chat box, and alert popups retain their elegant semi-transparent styling.

#### 🧹 Kick.com Deprecation (Twitch-Only)
* Fully purged legacy Kick.com links and references from `ets2-desktop.html`, `ets2-vertical.html`, stylesheet rules, and configuration templates.
* Social media bar in the bottom-right corner aligned cleanly to a single Twitch channel.

#### 🛡️ Plugin Rebuild & Repository Hardening
* Clean Release x64 compilation of `overlayobs_foozzee_telemetry.dll` (210 KB, SHA256: `6E9B18395E41C99A46FA9643301805F1D340D64A9069250CC6CFEBB038728DF9`).
* Added `.gitattributes` binary filters (`*.dll`, `*.ttf`, `*.zip`) to prevent CRLF corruption during Git checkouts.

---

## [1.0.0] - 2026-11-12

> [!NOTE]
> Initial public release of ETS2 / ATS Cockpit Telemetry Stream Overlay.

### ✨ Initial Features
* ⚡ **Native SCS Telemetry SDK 1.16 C++ Plugin:** Direct Win32 Shared Memory pipeline (`Local\FooZzeeSCSTelemetry`) operating at 30–60 FPS with zero external proxy software.
* 🖥️ **2-Row Lower Dashboard ("Torpedo") (`1920×1080`):**
  * Speedometer (`KM/H`), cruise control, gear indicator, tachometer (`RPM`), physical pedal & steering gauges (**THROTTLE / BRAKE / STEER**), complete cluster warning lights.
  * 7 analog/digital sensors (Fuel, Range, Economy, Oil/Water Temp, Air Pressure, AdBlue, Battery Voltage).
  * Smooth scrolling job ticker, trip progress bar, and navigation status.
* 📱 **Mobile Vertical Layout (`1080×1920`):** Native layout designed for TikTok Live, YouTube Shorts, and Reels safe zones.
* ⏱️ **Real-World ETA (`real-eta-panel`):** Automatically computes real-world travel time based on map scale (`1:19`, `1:3`, `1:10`).
* 💬 **Twitch IRC Chat & FIFO Alerts:** Sequential popup alert queue (`donate`, `sub`, `follow`, `raid`) with optional DonationAlerts integration.
* ⚡ **1-Click GUI Setup Wizard (`Install-Overlay.bat`):** Automated Steam library detection, DLL installation, and Desktop shortcut creation.

---

### 👤 Author & Credits — FooZzee
* **Website:** [foozzee.ru](https://foozzee.ru/)
* **Twitch:** [twitch.tv/foozzee](https://www.twitch.tv/foozzee)
* **YouTube:** [@foozzee](https://www.youtube.com/@foozzee)
* **Telegram:** [@foozzeestream](https://t.me/foozzeestream)
* **VK:** [vk.ru/gtfun](https://vk.ru/gtfun)

[1.1.3]: https://github.com/FooZzee/ets2-ats-stream-overlay/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/FooZzee/ets2-ats-stream-overlay/compare/v1.1.0...v1.1.2
[1.1.0]: https://github.com/FooZzee/ets2-ats-stream-overlay/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/FooZzee/ets2-ats-stream-overlay/releases/tag/v1.0.0
