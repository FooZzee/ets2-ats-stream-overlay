# 🚛 Cockpit Telemetry Stream Overlay for ETS2 & ATS

> **Professional broadcast cockpit HUD for OBS Studio powered by native SCS Telemetry SDK 1.16**

[![Release](https://img.shields.io/badge/Release-v1.1.0-orange?style=for-the-badge&logo=github)](https://github.com/FooZzee/ets2-ats-stream-overlay/releases)
[![Platform](https://img.shields.io/badge/Platform-Windows%20x64-blue?style=for-the-badge&logo=windows)](https://www.microsoft.com/windows)
[![SCS SDK](https://img.shields.io/badge/SCS%20SDK-v1.16%20Native-yellow?style=for-the-badge)](https://modding.scssoft.com/wiki/Documentation/Tools/Telemetry_server)
[![DLC Coaches](https://img.shields.io/badge/ETS2-DLC%20Coaches%20Supported-green?style=for-the-badge)](https://scssoft.com/)
[![OBS Studio](https://img.shields.io/badge/OBS%20Studio-Browser%20Source-purple?style=for-the-badge&logo=obsstudio)](https://obsproject.com/)
[![License](https://img.shields.io/badge/License-MIT-success?style=for-the-badge)](./LICENSE)

---

> **Navigation:** **English** | [Русский](./README.ru.md) | [Bilingual Combined README](./README.md) | [Changelog](./CHANGELOG.md)

---

## 📌 Table of Contents

1. [Overview & Key Features](#-overview--key-features)
2. [What's New in v1.1.0](#-whats-new-in-v110)
3. [Architecture & Components](#-architecture--components)
4. [HUD Layout & Elements](#-hud-layout--elements)
5. [System Requirements](#-system-requirements)
6. [1-Click GUI Installation](#-1-click-gui-installation)
7. [Manual Configuration & Parameters](#-manual-configuration--parameters)
8. [OBS Studio Scene Configuration](#-obs-studio-scene-configuration)
9. [Troubleshooting Matrix](#-troubleshooting-matrix)
10. [Author & Community](#-author--community)

---

## 💎 Overview & Key Features

**ETS2 / ATS Cockpit Telemetry Stream Overlay** is an ultra-low latency, broadcast-grade telemetry HUD designed specifically for live streamers on Twitch, YouTube, and TikTok. Built around realistic amber/ice cockpit ergonomics, it provides comprehensive driving, vehicle, and trip telemetry while keeping the driver's windshield, mirrors, and in-game GPS completely unobstructed.

* ⚡ **Zero-Overhead Shared Memory:** Bundles a custom C++ plugin (`scs_direct_telemetry.dll`) that interfaces directly with SCS Telemetry SDK 1.16 via Win32 Shared Memory. Zero external proxy tools, third-party executables, or heavy Node runtimes required.
* 🖥️ **2-Row Lower Dashboard ("Torpedo"):** Occupies the lower edge of a `1920×1080` canvas, offering pristine visibility for natural simulation viewing.
* 📱 **Mobile Vertical Layout:** Native `1080×1920` vertical layout optimized for TikTok Live, YouTube Shorts, and Instagram Reels with built-in UI overlay safe zones.
* ⏱️ **Real-World Navigation ETA (`real-eta-panel`):** Automatically detects the active map scale (`1:19` highways, `1:3` cities, `1:10` UK) to convert in-game navigation time into precise real-world hours and minutes remaining.
* 💬 **Audience Engagement:** Integrated Twitch IRC chat client and sequential FIFO alert notifications (`donate`, `sub`, `follow`, `raid`) with optional DonationAlerts integration.
* 🌐 **Instant Bilingual Support:** Seamless English and Russian localization (`EN` / `RU`) across the entire HUD and installer.

---

## 🚀 What's New in v1.1.0

> [!IMPORTANT]
> **Release v1.1.0** introduces full native support for bus passenger trips from the new **DLC Coaches** in Euro Truck Simulator 2, alongside new telemetry metrics and an opaque dashboard background.

* 🚌 **Full Euro Truck Simulator 2 — DLC Coaches Support:**
  * Native recognition of coach passenger trips (`bus_job`) with 100% backwards compatibility for standard freight cargo hauling in ETS2 & ATS.
  * Automatic stop-to-stop route parsing (`source_stop.*` ➔ `destination_stop.*`).
  * Real-time passenger satisfaction rating: **`SATISFACTION: XX%`** displayed in the onboard computer ticker.
* ⚡ **New Native SCS Telemetry SDK Channels:**
  * `bus_job.average_satisfaction` (`FLOAT`) — average passenger comfort rating.
  * `rest.stop` (`S32`) — fatigue and mandatory rest countdown timer in minutes.
  * `truck.electric.enabled` (`BOOL`) — onboard electrical system & ignition status.
  * `truck.engine.enabled` (`BOOL`) — engine running state.
* 🎛️ **100% Solid Opacity Lower Cockpit HUD:**
  * The dashboard background in `ets2-desktop.html` has been set to 100% solid opacity (`alpha = 1`). Asphalt textures, road markings, and headlights no longer bleed through the speedometer and indicators in OBS Studio.
* 💳 **DonationAlerts Wizard Setup:**
  * Added a password-masked DonationAlerts secret token field in the GUI installer (`Install-Overlay.bat`) with a **Show / Hide** toggle.

---

## 🏛️ Architecture & Components

```mermaid
flowchart LR
    A["Euro Truck Simulator 2 / ATS\n(64-bit Game Engine)"] -->|"SCS Telemetry SDK 1.16"| B["scs_direct_telemetry.dll\n(Native C++ Release Plugin)"]
    B -->|"Shared Memory\nLocal\\FooZzeeSCSTelemetry"| C["udp-bridge.ps1\n(Local HTTP/JSON Server :30002)"]
    C -->|"JSON Polling (30-60 FPS)\n/telemetry"| D["OBS Studio Browser Source\n(ets2-desktop.html / ets2-vertical.html)"]
    E["Twitch IRC & DonationAlerts"] -->|"WebSockets\n(Alerts & Live Chat)"| D
```

| Component | Responsibility | Technology Stack |
|---|---|---|
| `scs_direct_telemetry.dll` | In-process telemetry hook & serialization | C++20, SCS Telemetry SDK 1.16, Win32 Shared Memory |
| `scripts/udp-bridge.ps1` | Ultra-fast local HTTP bridge server (`:30002`) | PowerShell 5.1+, `HttpListener`, JSON |
| `scripts/installer.ps1` | 1-click graphical setup wizard | Windows Forms / WPF, Steam Registry Discovery |
| `ets2-desktop.html` | Broadcast cockpit HUD (`1920×1080`) | HTML5, CSS Grid/Flexbox, Vanilla JS, WebAudio |
| `ets2-vertical.html` | Mobile broadcast scene (`1080×1920`) | Safe-Zone Responsive Layout, Vanilla JS |

---

## 🎛️ HUD Layout & Elements

### Desktop Cockpit HUD (`1920×1080` — `ets2-desktop.html`)

```text
+-----------------------------------------------------------------------------------+
| [ real-eta-panel ]                                                                 |
|   REAL REMAINING TRIP TIME                                                        |
|                                                                                   |
| +----------------+                                                                |
| |  WEBCAM FRAME  |                                                                |
| |  (346 x 195)   |                                                                |
| +----------------+                                                                |
|                                                     +---------------------------+ |
|                                                     | FIFO ALERTS / CHAT        | |
|                                                     | (Sub, Donate, Follow)     | |
|                                                     +---------------------------+ |
| ================================================================================= |
| ROW 1: [SPEED] [CRUISE] [GEAR] [RPM] [THROTTLE/BRAKE/STEER] [INDICATORS] [ROUTE]   |
| ROW 2: [TRUCK/BUS] [ODOMETER] [WEAR] [7 SENSORS] [SMOOTH TICKER] [TWITCH CHANNEL] |
+-----------------------------------------------------------------------------------+
```

* **Row 1 (Driving Dynamics & Navigation):**
  * Speedometer (`KM/H`), Cruise Control (`CC`), Transmission Gear, Tachometer bar (`RPM`), live **Throttle / Brake / Steering** physical input bars.
  * Comprehensive dashboard light cluster: turn blinkers, hazard, parking/low/high beams, beacon, wipers, parking brake, retarder/engine brake, differential lock, lift axles, critical warnings (fuel, air, oil, coolant, battery), and speed limit sign.
  * Route progress indicator, origin and destination cities, cargo mass or passenger count.
* **Row 2 (Onboard Computer & Trip Economy):**
  * Vehicle make, model, license plate, odometer, Truck/Trailer/Cargo wear status pills.
  * **7 In-Line Analog/Digital Telemetry Sensors:** Fuel level, dynamic fuel range (km), live consumption (l/100km), oil/water temperature, air brake pressure, AdBlue level, battery voltage.
  * **Scrolling Economy Ticker:** Job income, cargo companies, job type, passenger comfort rating, trip distance, fuel burned, trip average consumption, maximum speed recorded.

---

## 💻 System Requirements

* **OS:** Windows 10 / Windows 11 (64-bit).
* **Environment:** PowerShell 5.1+ (pre-installed on Windows).
* **Game:** Euro Truck Simulator 2 (64-bit) and/or American Truck Simulator (64-bit).
* **Streaming Software:** OBS Studio 28.0+ (*Browser Source*).

---

## ⚡ 1-Click GUI Installation

1. Download the latest release archive **`ETS2-ATS-Stream-Overlay-v1.1.0.zip`** from [Releases](https://github.com/FooZzee/ets2-ats-stream-overlay/releases).
2. Extract the archive into any permanent folder (e.g., `C:\ETS2-ATS-Stream-Overlay`).
3. Run **`Install-Overlay.bat`**:
   * Choose **`English (EN)`** or **`Русский (RU)`** in the top-right corner.
   * The installer auto-detects your Steam game directories.
   * Enter your **Streamer Nickname**, **Twitch Channel**, and optionally your secret **DonationAlerts Token**.
   * Click **`Install`**.
4. The wizard will automatically copy `scs_direct_telemetry.dll` into each game's `bin\win_x64\plugins` folder, generate your `config.js`, and create the **`ETS2-ATS Overlay Bridge`** Desktop shortcut.
   * You can also use the **«💖 SUPPORT PROJECT»** button in the installer's footer to support the creator on DonationAlerts.

---

## ⚙️ Manual Configuration & Parameters

To configure the overlay manually:

1. Copy `config.example.js` to `config.js`.
2. Copy `./redist/scs_direct_telemetry.dll` into:
   * `.../Euro Truck Simulator 2/bin/win_x64/plugins/scs_direct_telemetry.dll`
   * `.../American Truck Simulator/bin/win_x64/plugins/scs_direct_telemetry.dll`
3. Edit `config.js`:

```javascript
window.OVERLAY_CONFIG = {
  lang: 'en', // 'en' or 'ru'
  ets2: {
    driverName: 'STREAMER',
    speedUnit: 'kmh'
  },
  channels: {
    twitch: {
      enabled: true,
      channelName: 'your_twitch_channel'
    },
    donationAlerts: {
      enabled: true,
      socketToken: 'YOUR_SECRET_TOKEN' // from DonationAlerts Account Settings -> Secret Token
    }
  },
  theme: {
    cockpitPreset: 'amber' // 'amber' or 'ice'
  }
};
```

### URL Query Overrides for OBS Browser Source:
* `?lang=en` or `?lang=ru` — override language per scene.
* `?theme=ice` or `?theme=amber` — toggle cockpit color theme.
* `?cam=0` — hide webcam frame.
* `?test=1` — interactive test mode with animated gauges, simulated chat, and alerts.
* `?guides=1` — show HUD alignment guides and safe-zone grid.

---

## 🎥 OBS Studio Scene Configuration

1. **Start the Telemetry Bridge:** Double-click the Desktop shortcut **`ETS2-ATS Overlay Bridge`** (`start-telemetry.bat`). A terminal window will open hosting `http://127.0.0.1:30002/telemetry`.
2. **Add Browser Source in OBS (MUST USE "URL" — UNCHECK "LOCAL FILE"):**
   * In OBS Sources, click **`+`** and choose **Browser Source**.
   * > [!WARNING]
     > **CRITICAL OBS CONFIGURATION:** **UNCHECK the "Local file" (Локальный файл) checkbox!**  
     > The overlay must be added strictly via the **"URL" (Ссылка)** field. If loaded with "Local file" checked, OBS isolates the page in a restricted file sandbox: **interactive cockpit controls, Pip-Boy update buttons, and external links will NOT work**.
   * In the **`URL` (Ссылка)** field, enter the full path to the HTML file:  
     `D:\html\Overlay\ets2-desktop.html` *(or `C:\ETS2-ATS-Stream-Overlay\ets2-desktop.html`)*  
     *(for mobile vertical scene: path to `ets2-vertical.html`)*.
   * **Resolution:** Width **`1920`**, Height **`1080`** *(for vertical: **`1080`** × **`1920`**)*.
   * Check: **«Refresh browser when scene becomes active»** & **«Shutdown source when not visible»**.
   * **Interactive Controls:** To click buttons on the HUD (such as Pip-Boy update buttons or social links), right-click the Browser Source in OBS and select **«Interact» (Взаимодействовать)**.
3. **Webcam Positioning (Desktop Scene):**
   * Dimensions: Width **`346 px`**, Height **`195 px`** (`16:9` ratio).
   * Coordinates: X (Left) = **`24 px`**, Y (Top) = **`180 px`**.
   * In the OBS Sources list, order your webcam capture device **below** the Browser Source layer so HUD corner brackets neatly overlap the webcam feed.

---

## 🛠️ Troubleshooting Matrix

| Symptom | Probable Cause | Action |
|---|---|---|
| Speedometer shows `--` and `STANDBY` | Bridge not running or DLL missing | Start `start-telemetry.bat`. Confirm `scs_direct_telemetry.dll` is in `bin\win_x64\plugins\`. Visit `http://127.0.0.1:30002/health` in your browser. |
| Game is running but HUD doesn't update | 32-bit game or SDK declined | Run the 64-bit simulator. On initial startup, accept the in-game prompt granting SDK access. In the game main menu, telemetry remains in standby until a profile loads. |
| "Port 30002 already in use" | Duplicate bridge running | Close any extra command prompt window running `start-telemetry.bat`. |
| No donation alerts appearing | Invalid DonationAlerts token | Verify `socketToken` in `config.js` (copy the secret token from *Account Settings -> Secret Token*, not the widget URL). |
| Twitch chat is missing | Incorrect channel name | Ensure `channelName` in `config.js` contains only your username (e.g. `'your_channel'`), without URLs or `@`. |

---

## 👤 Author & Community

* **Creator:** FooZzee
* **Official Website:** [foozzee.ru](https://foozzee.ru/)
* **Twitch:** [twitch.tv/foozzee](https://www.twitch.tv/foozzee)
* **YouTube:** [@foozzee](https://www.youtube.com/@foozzee)
* **Telegram:** [@foozzeestream](https://t.me/foozzeestream)
* **VK:** [vk.ru/gtfun](https://vk.ru/gtfun)

Licensed under the [MIT License](./LICENSE). Free for streamers, content creators, and modders.
