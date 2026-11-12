# ETS2 / ATS Cockpit Telemetry Stream Overlay

> **Languages:** **English** | [Русский](./README.ru.md) | [Bilingual Combined README](./README.md)

A sleek, native **SCS Telemetry SDK 1.16** browser overlay for **OBS Studio**, purpose-built for **Euro Truck Simulator 2** and **American Truck Simulator**. Designed as a realistic amber/ice truck cockpit HUD that keeps your windshield, side mirrors, and F2 Route Advisor clear, powered by **Twitch** chat integration and a direct Shared Memory C++ plugin with no external telemetry proxy required.

---

## 1. Overview & Features

- **Direct Native SCS SDK 1.16 Telemetry (`scs_direct_telemetry.dll`)**
  - Streams truck gauges, warning lights, cruise control, trailer/cargo data, and job telemetry straight out of ETS2/ATS via Shared Memory (`Local\FooZzeeSCSTelemetry`) and the bundled local HTTP bridge (`http://127.0.0.1:30002/telemetry`).
- **Desktop 2-Row Cockpit Dashboard (`1920×1080` — `ets2-desktop.html`)**
  - **Row 1 (Driving & Route):** Speedometer (`KM/H`), Cruise Control (`CC`), Gear indicator, RPM bar, real-time **Throttle / Brake / Steering** inputs, full dashboard warning/light indicator cluster (turn signals, hazard, parking/low/high beams, beacon, wipers, parking brake, retarder/engine brake, diff lock, lift axles, fuel/air/oil/coolant/battery warnings, speed limit sign), active route progress bar, city-to-city route, cargo & trailer tonnage.
  - **Row 2 (Truck & Economy):** Truck make/model, license plate, odometer, Truck/Trailer/Cargo health badges, **7 live onboard computer sensors** (Fuel, Range, Fuel Avg, Oil/Water temps, Air pressure, AdBlue, Battery voltage), smooth **scrolling job & trip economy ticker** (income, source → destination companies, job type, trip distance, fuel burned, trip average consumption, max speed), dynamic `ETS2` / `ATS` status pill, and Twitch channel display.
- **Vertical Mobile Scene (`1080×1920` — `ets2-vertical.html`)**
  - Safe-zone layout for TikTok Live, YouTube Shorts, and Reels with webcam frame, live telemetry chip strip, onboard computer sensors, alerts, and Twitch chat.
- **Real Time En Route (`real-eta-panel`)**
  - Top-left HUD badge converting in-game navigation ETA using the active map scale (`1:19` highways / `1:3` cities / `1:10` UK) into **real-world remaining minutes/hours**.
- **Twitch Chat & FIFO Alert Queue**
  - Direct Twitch IRC (`wss://irc-ws.chat.twitch.tv`) and optional DonationAlerts support.
  - Sequential FIFO alert cards (`donate`, `sub`, `follow`, `raid`) positioned cleanly in the lower-right safe zone above the dashboard (`right: 24px; bottom: 200px`), sliding in from the right and fading smoothly without blocking gameplay.
- **Instant Bilingual Support (`EN` / `RU`)**
  - Switch language globally in `config.js` (`lang: 'en'` or `'ru'`) or per Browser Source via URL (`?lang=en` / `?lang=ru`).

---

## 2. Requirements

1. **Windows 10 / 11** (64-bit) with PowerShell 5.1+
2. **OBS Studio** (Browser Source)
3. **Euro Truck Simulator 2** or **American Truck Simulator** (64-bit)
4. **`scs_direct_telemetry.dll` native SCS SDK 1.16 plugin** installed in `...\bin\win_x64\plugins\` (bundled in `./redist/scs_direct_telemetry.dll` and installed automatically by `Install-Overlay.bat`)

---

## 3. 1-Click GUI Installation (`Install-Overlay.bat`)

1. Double-click **`Install-Overlay.bat`** in the overlay folder.
2. Pick **`English (EN)`** or **`Русский (RU)`** in the top-right header — the installer updates all text immediately and saves your language choice into `config.js`.
3. Choose the **Overlay Installation Folder** (default: `C:\ETS2-ATS-Stream-Overlay`).
4. Check **Euro Truck Simulator 2** and/or **American Truck Simulator** to install `scs_direct_telemetry.dll`:
   - The wizard automatically scans Windows Registry (`HKCU:\Software\Valve\Steam`) and Steam `libraryfolders.vdf` across all drives.
   - If browsing manually, you can select the game root folder, `bin\win_x64`, or `bin\win_x64\plugins` — the installer resolves `...\bin\win_x64\plugins` automatically and creates the `plugins` folder if missing.
5. Fill in your **Streamer Profile** (`Streamer Nickname`, `Twitch Channel`, and optionally `DonationAlerts Token` — masked for stream safety with a `Show` / `Hide` button; copy it from DonationAlerts *Account Settings -> Secret Token* to show live donation alerts above the dashboard).
6. Keep **`Create Desktop Shortcut ("ETS2-ATS Overlay Bridge")`** checked and click **`Install`**.

---

## 4. Manual Setup & Configuration (`config.js`)

If you prefer manual installation:

1. Copy `config.example.js` to **`config.js`** in the overlay root (or edit the existing `config.js`).
2. Copy `./redist/scs_direct_telemetry.dll` into:
   - ETS2: `<SteamLibrary>\steamapps\common\Euro Truck Simulator 2\bin\win_x64\plugins\scs_direct_telemetry.dll`
   - ATS: `<SteamLibrary>\steamapps\common\American Truck Simulator\bin\win_x64\plugins\scs_direct_telemetry.dll`
3. Open `config.js` and configure:
   - `lang`: `'en'` or `'ru'`
   - `ets2.driverName`: Your driver callsign shown on `CAM // ...` and `DRIVER: ...`
   - `channels.twitch`: `{ enabled: true, channelName: 'your_channel', oauthToken: '', clientId: '' }`
   - `channels.donationAlerts`: `{ enabled: true, socketToken: 'YOUR_SECRET_TOKEN' }` (optional, enables live donation alerts above the dashboard)
   - `theme.cockpitPreset`: `'amber'` or `'ice'`
4. Optional URL query parameters in OBS Browser Source:
   - `?lang=en` or `?lang=ru` — override language
   - `?theme=ice` or `?theme=amber` — switch cockpit lighting theme
   - `?cam=0` — hide the webcam HUD frame
   - `?test=1` — preview sample telemetry, chat, and alerts without launching the game
   - `?guides=1` — display OBS safe-zone alignment guides

---

## 5. OBS Studio Setup

1. Launch **`ETS2-ATS Overlay Bridge`** from your Desktop shortcut (or run `start-telemetry.bat`). It exposes live native Shared Memory telemetry at `http://127.0.0.1:30002/telemetry`.
2. In **OBS Studio**, add a **Browser Source**:
   - **Desktop Scene:** Local File -> `ets2-desktop.html`
     - Width: **`1920`** | Height: **`1080`**
   - **Vertical Scene:** Local File -> `ets2-vertical.html`
     - Width: **`1080`** | Height: **`1920`**
3. Align your **Webcam Source** (Video Capture Device) directly inside the desktop overlay frame:
   - **Aspect Ratio:** `16:9`
   - **Width:** **`346 px`**
   - **Height:** **`195 px`**
   - **Position (`left` / X):** **`24 px`**
   - **Position (`top` / Y):** **`180 px`**
   - Place the Webcam Source layer **below** the Browser Source layer so the cockpit corner brackets frame your camera cleanly.

---

## 6. Troubleshooting

| Symptom | Cause & Solution |
| --- | --- |
| Overlay shows `--` and `STANDBY // OFFLINE` | Ensure `start-telemetry.bat` (`127.0.0.1:30002`) is running and `scs_direct_telemetry.dll` is inside `bin\win_x64\plugins\`. Check `http://127.0.0.1:30002/health` in your browser. |
| Game launched, but gauges stay at `--` | Make sure you are running 64-bit ETS2/ATS and accepted the third-party SDK plugin warning dialog on game startup. Also drive into the cab (telemetry enters `connected: true` outside menus). |
| Bridge fails with port `30002` in use | Another `start-telemetry.bat` window is already running. Close duplicate console windows and keep only one running. |
| Alerts have no audio | Built-in WebAudio chimes play by default (`synthFallback: true`). For custom sounds, place `follow.mp3`, `sub.mp3`, `donate.mp3`, `raid.mp3` into `./assets/sounds/` and enable audio control in OBS Browser Source if needed. |
| Twitch chat does not appear | Verify `channels.twitch.enabled: true` and set your lowercase `channelName` in `config.js` without `https://twitch.tv/`. |

---

## Author & Community — FooZzee

- Website: https://foozzee.ru/
- Twitch: https://www.twitch.tv/foozzee
- YouTube: https://www.youtube.com/@foozzee
- Telegram: https://t.me/foozzeestream
- VK: https://vk.ru/gtfun
