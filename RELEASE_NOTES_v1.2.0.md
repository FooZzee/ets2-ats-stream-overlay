# 🚀 ETS2 / ATS Cockpit Telemetry Stream Overlay — Release v1.2.0

[![Release](https://img.shields.io/badge/Release-v1.2.0-orange.svg?style=flat-square)](https://github.com/FooZzee/ets2-ats-stream-overlay/releases/tag/v1.2.0)
[![SemVer](https://img.shields.io/badge/SemVer-2.0.0-blue.svg?style=flat-square)](https://semver.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

---

## [EN] English Release Notes

### Executive Summary
Release **v1.2.0** introduces a native C++ gameplay event extraction pipeline (`overlayobs_foozzee_telemetry.dll`), real-time windshield HUD toast cards, a zero-dependency procedural Web Audio synthesizer, interactive Twitch chat viewer engagement commands with role permissions, automated vehicle condition monitors, and dedicated standalone command documentation ([commands.en.md](https://github.com/FooZzee/ets2-ats-stream-overlay/blob/main/commands.en.md), [commands.ru.md](https://github.com/FooZzee/ets2-ats-stream-overlay/blob/main/commands.ru.md), [commands.md](https://github.com/FooZzee/ets2-ats-stream-overlay/blob/main/commands.md)).

> [!IMPORTANT]
> **Primary Upgrade Requirement:** Close Euro Truck Simulator 2 and American Truck Simulator before running `Install-Overlay.bat` or `build-and-install-plugin.bat`. The installer will automatically deploy the updated native module `overlayobs_foozzee_telemetry.dll` into `bin\win_x64\plugins\`.

---

### Key Architectural Changes

#### 1. Native Gameplay Event Pipeline & Windshield HUD Toasts
* **Native C++ SCS Telemetry Hook:** Integrated `SCS_TELEMETRY_EVENT_gameplay` callbacks in `native-plugin/plugin.cpp`.
* **Zero Frame Drop Guarantee:** Infractions (`player.fine.offence`), tollgate payments (`player.tollgate.paid`), nautical voyages (`player.use.ferry`), train shuttles (`player.use.train`), cargo deliveries (`job.delivered`), and job cancellations (`job.cancelled`) are serialized into Win32 Shared Memory (`Local\FooZzeeSCSTelemetry`) with an atomic monotonic sequence counter (`seq`).
* **Ergonomic Windshield Viewport:** Animated toast cards are anchored at `top: 14%; left: 50%` (~140px from the top border in 1080p), providing instant situational awareness without obstructing road visibility, cabin instruments, or side mirrors.
* **Opaque High-Performance Contrast:** Formatted with solid `#0e131b` backing and hardware-accelerated CSS transforms, preventing OBS Browser Source compositor slowdowns.

#### 2. Procedural Web Audio Synthesizer Engine (`TelemetrySoundEngine`)
* **Zero Audio File Dependencies:** Sound alerts are dynamically synthesized in real time via the browser Web Audio API using frequency oscillators, biquad filters, and exponential gain ramps. No external `.mp3` or `.wav` files required.
* **Distinct Acoustic Signatures:** Distinct procedural profiles for infractions, toll transactions, fuel pump shutoff, port departures, delivery handovers, CB transceiver squelch, and pneumatic horn.

#### 3. Interactive Twitch Chat Commands & Streamer Engagement
* **Direct WebSocket Connection:** Connects over encrypted TLS directly to `wss://irc-ws.chat.twitch.tv:443` without intermediary third-party relay servers.
* **Telemetry Query Commands:** `!job` / `!cargo` (active contract details), `!truck` (odometer, fuel, mechanical wear), `!stats` (session runtime and economy), `!driver` (driver credentials and current truck model).
* **Audience Engagement Commands:** `!cb <text>` (broadcasts viewer messages directly onto the cockpit radio HUD), `!honk` (honks the truck air horn live), `!bet clean` / `!bet fine` (stream chat delivery predictions).
* **Role-Based Access Control (RBAC):** Configurable privilege tiers (`Everyone`, `Followers`, `VIP & Above`, `Mod/Broadcaster`), sliding-window anti-spam protection, and individual cooldown timers.

#### 4. Real-Time Heuristic Telemetry Detectors
* **Smart Refuel Volume Monitor:** Automatically tracks cumulative fuel intake while stopped at a filling station (`speed < 1.0 km/h`) and displays net volume (`+XXX L`) after a 2-second stabilization barrier.
* **Instant Damage Warning:** Fires immediate visual and audio alerts when cargo damage increases by `>= 1%` or chassis wear spikes by `>= 3%`.
* **Workshop Overhaul Detector:** Detects complete vehicle restoration at service stations upon chassis wear resetting to `0%`.
* **Proactive Status Indicators:** Low fuel warnings (`< 15%`) and severe mechanical degradation alarms (`> 20%`).

---

## [RU] Русское описание релиза

### Краткое описание
Релиз **v1.2.0** добавляет нативный конвейер перехвата игровых событий через C++ плагин (`overlayobs_foozzee_telemetry.dll`), всплывающие уведомления в верхней зоне лобового стекла, процедурный звуковой синтезатор Web Audio без внешних файлов, интерактивные команды Twitch-чата с системой ролей, автоматические детекторы состояния автопоезда и отдельные подробные руководства по командам ([commands.ru.md](https://github.com/FooZzee/ets2-ats-stream-overlay/blob/main/commands.ru.md), [commands.en.md](https://github.com/FooZzee/ets2-ats-stream-overlay/blob/main/commands.en.md), [commands.md](https://github.com/FooZzee/ets2-ats-stream-overlay/blob/main/commands.md)).

---

### Ключевые изменения

#### 1. Нативный перехват игровых событий и всплывающие карточки (HUD Toasts)
* **Нативный хук SCS Telemetry SDK:** В модуль `native-plugin/plugin.cpp` интегрирована обработка системных обратных вызовов `SCS_TELEMETRY_EVENT_gameplay`.
* **Потокобезопасный конвейер:** Регистрация дорожных штрафов (`player.fine.offence`), оплаты проезда на терминалах (`player.tollgate.paid`), паромных рейсов (`player.use.ferry`), железнодорожных перевозок (`player.use.train`), сдачи рейса (`job.delivered`) и отмены контракта (`job.cancelled`).
* **Монотонный счётчик синхронизации:** События передаются в Shared Memory (`Local\FooZzeeSCSTelemetry`) с монотонно возрастающим счётчиком `seq`.
* **Эргономичное положение на лобовом стекле:** Карточки уведомлений расположены на уровне `top: 14%; left: 50%` (~140px от верха экрана при 1080p).

#### 2. Встроенный процедурный звуковой синтезатор (`TelemetrySoundEngine`)
* **100% автономность без звуковых файлов:** Звуковые сигналы генерируются на лету через Web Audio API с помощью частотных осцилляторов, полосовых фильтров и экспоненциального затухания.

#### 3. Интерактивные команды Twitch-чата
* **Прямое WebSocket-соединение:** Прямой коннект по TLS к `wss://irc-ws.chat.twitch.tv:443`.
* **Команды:** `!рейс`, `!тягач`, `!стата`, `!водитель`, `!рация <текст>`, `!гудок`, `!ставка чистый` / `!ставка штраф`.
* **Система уровней доступа (RBAC):** Настройка прав (`Everyone`, `Followers`, `VIP & Above`, `Mod/Broadcaster`), скользящее окно защиты от спама и раздельные кулдауны.

#### 4. Автоматические детекторы состояния автопоезда
* **Умный детектор заправки:** Отслеживает прирост топлива на АЗС (`+XXX л`).
* **Мгновенный детектор повреждений:** Сигнал при росте повреждений груза `>= 1%` или износа шасси `>= 3%`.
* **Фиксация техобслуживания на СТО:** Автоматическое распознавание ремонта при сбросе общего износа до `0%`.

---

### Checksums / Контрольные суммы (SHA-256)

| Файл / File | Размер / Size | Контрольная сумма SHA-256 / Checksum |
| :--- | :--- | :--- |
| `ETS2-ATS-Stream-Overlay-v1.2.0.zip` | 1.82 MB (1 906 847 B) | `994D4397584C62586EBD690E14FAFD5ADC887646E76E71EA8D0022C9FEBC1A03` |
| `overlayobs_foozzee_telemetry.dll` | 205 KB (209 920 B) | `8C65F458C010B5E8415B470561966D11F2B1DEB09FA84A65092DCC77E1BC1DAF` |
