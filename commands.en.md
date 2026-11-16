# 🎮 Interactive Commands & Developer Console Reference

> **ETS2 / ATS Cockpit Telemetry Stream Overlay**  
> Complete technical reference for interactive Twitch chat commands, telemetry event triggers, and developer console testing methods.

[![Documentation](https://img.shields.io/badge/Documentation-Commands_Reference-blue?style=for-the-badge&logo=gitbook)](./commands.en.md)
[![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)](./README.en.md)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](./LICENSE)

---

> **Language:** **English** | [Русский (commands.ru.md)](./commands.ru.md) | [Bilingual Combined Document (commands.md)](./commands.md) | [Main README](./README.en.md)

---

## 1. Interactive Twitch Chat Commands

All interactive chat commands are processed by `assets/js/ets2-chat.js`. Command permissions, rate limits, and cooldowns are governed by the `chatCommands` configuration block in `config.js` (`config.example.js`).

> [!NOTE]
> The streamer (broadcaster) and channel moderators bypass all rate limits and cooldown timers.

| Command | Aliases | Minimum Role | Cooldown (Global / User) | Action & HUD Display | Sound Synthesizer Effect |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `!honk` | `!фафа`, `!клаксон` | `VIP & Above` | 60s / 120s | Displays purple greeting toast: `"HORN GREETING // @User"`. Shows pneumatic air horn SVG icon. | Dual-tone pneumatic truck horn (220 Hz + 277 Hz, rich harmonics, 550 ms). |
| `!cb <text>` | `!рация <текст>`, `!сиби <текст>` | `Followers` | 45s / 120s | Displays amber CB radio toast: `"CH 15 // @User"`. Shows CB microphone SVG icon. Strips URLs, 70 chars max. Blocked on `first-msg=1` for guests. | Radio squelch noise burst + filtered voiceband noise + Roger Beep (1046 Hz). |
| `!route` | `!job`, `!рейс`, `!маршрут`, `!груз` | `Everyone` | 30s / Global | Displays cyan GPS navigation toast showing current departure/destination cities, cargo name, and distance remaining. | Subtle electronic dashboard chime (harmonic triple pulse). |
| `!stats` | `!стата`, `!статистика`, `!стрим` | `Everyone` | 30s / Global | Displays cyan stream session card: completed deliveries, total revenue, km driven, and traffic fines tally. | Subtle electronic dashboard chime (harmonic triple pulse). |
| `!truck` | `!тягач`, `!автобус`, `!машина` | `Everyone` | 30s / Global | Displays cyan truck telemetry card: truck model, license plate number, fuel level, and estimated fuel range. | Subtle electronic dashboard chime (harmonic triple pulse). |
| `!driver` | `!водитель`, `!права`, `!рейтинг` | `Everyone` | 30s / Global | Displays cyan driver dossier card: driver handle, current Safety Score (100% scale), and stream max speed record. | Subtle electronic dashboard chime (harmonic triple pulse). |
| `!bet clean` | `!ставка чистый` | `Everyone` | None (Silent) | Registers viewer bet on clean delivery without traffic fines for the active job. | Silent registration (no screen spam). |
| `!bet fine` | `!ставка штраф` | `Everyone` | None (Silent) | Registers viewer bet on at least one traffic fine during the active job. | Silent registration (no screen spam). |

> [!TIP]
> When `config.chat.hideCommands: true` is enabled, valid command invocations are executed silently in the telemetry HUD without cluttering the chat viewport DOM.

---

## 2. Developer Console Test API

Open OBS Browser Source Developer Tools (`F12`) or open `ets2-desktop.html` directly in any Chromium-based browser to execute real-time diagnostic commands.

### 2.1 Complete Automated HUD Demonstration
```javascript
// Sequentially executes all toast notifications, SVG vector icons, and synthesized audio effects
window.demoAllTelemetryEvents();
```

### 2.2 Telemetry Event Dispatcher (`window.testTelemetryEvent`)

```javascript
// Syntax: window.testTelemetryEvent(type, subTypeOrOffence, customAmount)

// Traffic Fines (SCS Telemetry SDK gameplay offences)
window.testTelemetryEvent('fine', 'speeding', 550);                 // Speeding violation
window.testTelemetryEvent('fine', 'speeding_camera', 550);          // Speed enforcement camera
window.testTelemetryEvent('fine', 'red_signal', 350);              // Red light infraction
window.testTelemetryEvent('fine', 'crash', 400);                   // Vehicle traffic accident
window.testTelemetryEvent('fine', 'no_lights', 150);               // Driving with headlights off
window.testTelemetryEvent('fine', 'avoid_sleeping', 150);           // Tachograph rest violation
window.testTelemetryEvent('fine', 'wrong_way', 100);               // Driving in opposite lane
window.testTelemetryEvent('fine', 'avoid_weighing', 250);          // Weigh station evasion
window.testTelemetryEvent('fine', 'illegal_trailer', 600);         // Prohibited trailer configuration
window.testTelemetryEvent('fine', 'avoid_inspection', 300);        // Vehicle inspection skipped
window.testTelemetryEvent('fine', 'illegal_border_crossing', 750); // State border checkpoint violation
window.testTelemetryEvent('fine', 'hard_shoulder_violation', 300); // Emergency shoulder driving
window.testTelemetryEvent('fine', 'damaged_vehicle', 450);         // Critical vehicle mechanical defect
window.testTelemetryEvent('fine', 'generic', 250);                 // General traffic regulation violation

// Tollgate, Station & Crossings
window.testTelemetryEvent('tollgate', null, 48);                   // Highway toll payment
window.testTelemetryEvent('refuel', null, 240);                     // Refueling finished (+240 L)
window.testTelemetryEvent('ferry', null, 320);                      // Dover ➔ Calais maritime ferry
window.testTelemetryEvent('train', null, 260);                      // Folkestone ➔ Calais rail shuttle

// Job Life-Cycle & Summary Cards
window.testTelemetryEvent('job_delivered', null, 28400);            // Job completed with 7.0s delivery card
window.testTelemetryEvent('job_cancelled', null, 12000);            // Contract cancellation penalty

// Technical & Fleet Detectors
window.testTelemetryEvent('cargo_damage', null, '3.5');             // Cargo damage jump (+3.5%)
window.testTelemetryEvent('service');                              // Service station overhaul (100% restored)
window.testTelemetryEvent('low_fuel', null, 65);                    // Low fuel reserve warning (65 L)

// DLC Coaches Events
window.testTelemetryEvent('bus_stop', 'Berlin ZOB');               // Coach terminal passenger boarding
window.testTelemetryEvent('bus_comfort', null, 15);                // Passenger comfort rating decrease (-15%)

// Direct Chat Event Invocations
window.testTelemetryEvent('chat_honk', 'VipPilot');                // Interactive horn test
window.testTelemetryEvent('chat_cb', 'Trucker_77');                // CB radio transmission test
```

### 2.3 Simulated Twitch Chat Message Dispatcher (`window.testChatCommand`)

```javascript
// Syntax: window.testChatCommand(commandString, username, simulatedRole)
// Roles: 'viewer' | 'follower' | 'sub' | 'vip' | 'mod' | 'driver'

window.testChatCommand('!honk', 'VipPilot', 'vip');
window.testChatCommand('!cb 15 AM channel, road status on Paris?', 'Trucker_77', 'follower');
window.testChatCommand('!route', 'RegularViewer', 'viewer');
window.testChatCommand('!stats', 'RegularViewer', 'viewer');
window.testChatCommand('!truck', 'RegularViewer', 'viewer');
window.testChatCommand('!driver', 'RegularViewer', 'viewer');
window.testChatCommand('!bet clean', 'BetUser1', 'viewer');
window.testChatCommand('!bet fine', 'BetUser2', 'viewer');
```

### 2.4 General Overlay Control Functions

| Console Function | Default Argument | Description |
| :--- | :--- | :--- |
| `testAlert(type, overrides)` | `'donate'` | Triggers alert popup (`'donate'`, `'sub'`, `'follow'`, `'raid'`, `'all'`). |
| `testChat(count, text)` | `1` | Injects mock viewer messages into chat viewport. |
| `testTelemetry(payload)` | Sample Packet | Renders live cockpit telemetry packet; pass `false` for offline standby. |
| `testTrack(title, artist)` | `'Nightcall'` / `'Kavinsky'` | Sets currently playing media track. |
| `testRoute(text, meta, tag)` | Custom strings | Sets GPS route navigation bar values. |
| `setCockpitTheme(preset)` | `'amber'` | Switches instrument cluster palette (`'amber'` / `'ice'`). |
| `toggleWebcam(force)` | Toggle | Toggles webcam viewport border visibility. |
| `toggleGuides(force)` | Toggle | Displays OBS layout alignment reference guides. |
