# ETS2 / ATS Cockpit Telemetry Stream Overlay

> **Languages:** **English** | [Русский](./README.ru.md) | [Bilingual Combined README](./README.md) | [Changelog](./CHANGELOG.md)

A sleek, native **SCS Telemetry SDK 1.16** browser overlay for **OBS Studio**, purpose-built for **Euro Truck Simulator 2** (including **DLC Coaches**) and **American Truck Simulator**. Designed as a realistic amber/ice cockpit HUD that keeps your windshield, side mirrors, and F2 Route Advisor clear, powered by **Twitch** chat integration and a direct Shared Memory C++ plugin with no external telemetry proxy required.

---

## 1. Overview & Features

- **Direct Native SCS SDK 1.16 Telemetry (`scs_direct_telemetry.dll`)**
  - Streams truck/coach gauges, warning lights, cruise control, trailer/cargo data, and job telemetry straight out of ETS2/ATS via Shared Memory (`Local\FooZzeeSCSTelemetry`) and the bundled local HTTP bridge (`http://127.0.0.1:30002/telemetry`).
  - Added new telemetry channels: passenger comfort (`bus_job.average_satisfaction`), rest countdown timer (`rest.stop`), electrical system/ignition (`truck.electric.enabled`), and engine status (`truck.engine.enabled`).
- **Full Euro Truck Simulator 2 — DLC Coaches Support (Passenger Jobs)**
  - Native detection for coach passenger trips from the new **DLC Coaches** while retaining 100% compatibility with standard cargo hauling.
  - Automatic bus route parsing from origin to destination stops (`source_stop` → `destination_stop`).
  - Real-time passenger satisfaction rating: **`SATISFACTION: XX%`** (`EN`) / **`КОМФОРТ: XX%`** (`RU`) displayed in the onboard computer ticker.
- **Desktop 2-Row Cockpit Dashboard with 100% Solid Opacity (`1920×1080` — `ets2-desktop.html`)**
  - **100% Solid Opacity (`alpha = 1`):** Completely opaque dashboard background eliminates transparent see-through distractions against asphalt and bright road markings, ensuring maximum contrast and legibility in OBS Studio. Webcam frame, chat, and alert popups remain transparent.
  - **Row 1 (Driving & Route):** Speedometer (`KM/H`), Cruise Control (`CC`), Gear indicator, RPM bar, real-time **Throttle / Brake / Steering** inputs, full dashboard warning/light indicator cluster (turn signals, hazard, parking/low/high beams, beacon, wipers, parking brake, retarder/engine brake, diff lock, lift axles, fuel/air/oil/coolant/battery warnings, speed limit sign), active route progress bar, city-to-city route, cargo & trailer tonnage or passenger count.
  - **Row 2 (Truck & Economy):** Truck/coach make/model, license plate, odometer, Truck/Trailer/Cargo health badges, **7 live onboard computer sensors** (Fuel, Range, Fuel Avg, Oil/Water temps, Air pressure, AdBlue, Battery voltage), smooth **scrolling job & trip economy ticker** (income, source → destination companies, job type, passenger satisfaction, trip distance, fuel burned, trip average consumption, max speed), dynamic `ETS2` / `ATS` status pill, and Twitch channel display.
- **Vertical Mobile Scene (`1080×1920` — `ets2-vertical.html`)**
  - Safe-zone layout for TikTok Live, YouTube Shorts, and Reels with webcam frame, live telemetry chip strip, onboard computer sensors, alerts, and Twitch chat.
- **Real Time En Route (`real-eta-panel`)**
  - Top-left HUD badge converting in-game navigation ETA using the active map scale (`1:19` highways / `1:3` cities / `1:10` UK) into **real-world remaining minutes/hours**.
- **Twitch Chat & FIFO Alert Queue**
  - Direct Twitch IRC (`wss://irc-ws.chat.twitch.tv`) and DonationAlerts integration.
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
5. Fill in your **Streamer Profile**:
   - `Streamer Nickname`
   - `Twitch Channel`
   - `DonationAlerts Token` (optional, password-masked with a `Show` / `Hide` toggle; found in DonationAlerts *Account Settings -> Secret Token* to display live donation alerts).
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

1. Launch the telemetry bridge via the **`ETS2-ATS Overlay Bridge`** Desktop shortcut (`start-telemetry.bat`).
2. In OBS Studio, add a new **Browser Source**:
   - **Desktop Scene:**
     - Select `ets2-desktop.html`
     - Width: **`1920`**, Height: **`1080`**
   - **Vertical Scene:**
     - Select `ets2-vertical.html`
     - Width: **`1080`**, Height: **`1920`**
3. Configure your Webcam Frame (Desktop):
   - Dimensions: Width **`346 px`**, Height **`195 px`** (`16:9` aspect ratio).
   - Position: Left **`24 px`**, Top **`180 px`**.
   - Place your webcam video capture layer **below** the Browser Source in OBS layer hierarchy so HUD brackets neatly frame the webcam feed.

---

## 6. Troubleshooting

| Symptom | Cause & Solution |
| --- | --- |
| Overlay shows `--` / `STANDBY` | Verify `start-telemetry.bat` is running (`127.0.0.1:30002`) and `scs_direct_telemetry.dll` is in `...\bin\win_x64\plugins\`. Check bridge status at `http://127.0.0.1:30002/health`. |
| Game is running but dashboard doesn't update | Launch 64-bit ETS2/ATS and accept the SDK warning on the game's startup screen. Telemetry enters standby on the profile selection screen until a save game loads. |
| Port `30002` error | Another instance of `start-telemetry.bat` is already running. Close duplicate command prompt windows. |
| No alert sounds | Built-in WebAudio synthesizer is used by default (`synthFallback: true`). To use custom audio, place `follow.mp3`, `sub.mp3`, `donate.mp3`, `raid.mp3` in `./assets/sounds/`. |
| Twitch chat doesn't appear | Verify `channels.twitch.enabled: true` in `config.js` and ensure `channelName` contains only your username without `https://twitch.tv/`. |

---

## Changelog

For a full list of additions and changes across versions, see [CHANGELOG.md](./CHANGELOG.md).

---

## Author — FooZzee

- Website: https://foozzee.ru/
- Twitch: https://www.twitch.tv/foozzee
- YouTube: https://www.youtube.com/@foozzee
- Telegram: https://t.me/foozzeestream
- VK: https://vk.ru/gtfun
