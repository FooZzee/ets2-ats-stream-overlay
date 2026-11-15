# 📜 Project Version History (Changelog)

> **ETS2 / ATS Cockpit Telemetry Stream Overlay**  
> All notable changes are documented in strict adherence to [Keep a Changelog](https://keepachangelog.com/) and [Semantic Versioning 2.0.0](https://semver.org/).

[![Keep a Changelog](https://img.shields.io/badge/Changelog-Keep%20a%20Changelog%201.1.0-orange?style=for-the-badge&logo=git)](https://keepachangelog.com/)
[![SemVer](https://img.shields.io/badge/SemVer-2.0.0-blue?style=for-the-badge&logo=semver)](https://semver.org/)
[![Latest Release](https://img.shields.io/badge/Latest-v1.1.0-green?style=for-the-badge&logo=github)](https://github.com/FooZzee/ets2-ats-stream-overlay/releases/tag/v1.1.0)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](./LICENSE)

---

> **Language:** **English** | [Русский (CHANGELOG.ru.md)](./CHANGELOG.ru.md) | [Bilingual Combined Changelog](./CHANGELOG.md) | [Main README](./README.md)

---

## 📌 Version Index

* [v1.1.0 (2026-11-15) — ETS2 DLC Coaches Support, Solid Dashboard & Enhanced SCS Telemetry](#110---2026-11-15)
* [v1.0.0 (2026-11-12) — Initial Release (Native SCS Telemetry SDK 1.16 & Broadcast HUD)](#100---2026-11-12)

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
Integrated 4 new native telemetry channels into the C++ plugin (`scs_direct_telemetry.dll`) and bridge script (`scripts/udp-bridge.ps1`):

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

#### 🧹 Twitch-Only Streamlining
* Completely removed legacy Kick.com links, badges, and code references from `ets2-desktop.html`, `ets2-vertical.html`, CSS stylesheets, and configuration templates.
* Neatly aligned the lower-right social badge exclusively for single-channel Twitch streaming.

#### 🛡️ C++ Native Plugin & Repository Hardening
* Clean Release x64 compilation of `scs_direct_telemetry.dll` (210 KB, SHA256: `6E9B18395E41C99A46FA9643301805F1D340D64A9069250CC6CFEBB038728DF9`).
* Strict `.gitattributes` configuration guaranteeing binary file protection (`*.dll`, `*.ttf`, `*.zip`) against Git line-ending modification.

---

## [1.0.0] - 2026-11-12

> [!NOTE]
> Initial public release of the ETS2 / ATS Cockpit Telemetry Stream Overlay system.

### ✨ Initial Features
* ⚡ **Native SCS SDK 1.16 C++ Plugin:** Direct telemetry acquisition via Win32 Shared Memory (`Local\FooZzeeSCSTelemetry`) at 30–60 FPS with zero external proxy dependencies.
* 🖥️ **2-Row Desktop Cockpit Dashboard (`1920×1080`):**
  * Speedometer (`KM/H`), Cruise Control (`CC`), Gear, Tachometer (`RPM`), physical input bars (**THROTTLE / BRAKE / STEER**), full warning light cluster.
  * 7 analog/digital onboard computer sensors (Fuel, Range, Consumption, Oil/Water Temp, Air, AdBlue, Battery).
  * Smooth scrolling job economy ticker, route progress bar, and trip statistics.
* 📱 **Mobile Vertical Layout (`1080×1920`):** Purpose-built safe-zone layout for TikTok Live, YouTube Shorts, and Reels.
* ⏱️ **Real-World ETA Calculation (`real-eta-panel`):** Automatically factors active map scale (`1:19`, `1:3`, `1:10`) to compute real-world time remaining.
* 💬 **Twitch IRC Chat & FIFO Alert Queue:** Sequential alert cards (`donate`, `sub`, `follow`, `raid`) with DonationAlerts integration.
* ⚡ **1-Click GUI Setup Wizard (`Install-Overlay.bat`):** Bilingual wizard with automatic Steam game detection and Desktop shortcut creation.

---

### 👤 Author & Credits — FooZzee
* **Website:** [foozzee.ru](https://foozzee.ru/)
* **Twitch:** [twitch.tv/foozzee](https://www.twitch.tv/foozzee)
* **YouTube:** [@foozzee](https://www.youtube.com/@foozzee)
* **Telegram:** [@foozzeestream](https://t.me/foozzeestream)
* **VK:** [vk.ru/gtfun](https://vk.ru/gtfun)

[1.1.0]: https://github.com/FooZzee/ets2-ats-stream-overlay/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/FooZzee/ets2-ats-stream-overlay/releases/tag/v1.0.0
