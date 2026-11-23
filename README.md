# 🚛 Cockpit Telemetry Stream Overlay for ETS2 & ATS

> **Professional broadcast cockpit HUD for OBS Studio powered by native SCS Telemetry SDK 1.16**  
> **Профессиональный бортовой HUD-оверлей для OBS Studio на базе нативного SCS Telemetry SDK 1.16**

[![Release](https://img.shields.io/badge/Release-v1.2.3-blue?style=flat&logo=github)](https://github.com/FooZzee/ets2-ats-stream-overlay/releases)
[![Platform](https://img.shields.io/badge/Platform-Windows%20x64-blue?style=flat&logo=windows)](https://www.microsoft.com/windows)
[![SCS SDK](https://img.shields.io/badge/SCS%20SDK-v1.16%20Native-yellow?style=flat)](https://modding.scssoft.com/wiki/Documentation/Tools/Telemetry_server)
[![DLC Coaches](https://img.shields.io/badge/ETS2-DLC%20Coaches-green?style=flat)](https://scssoft.com/)
[![OBS Studio](https://img.shields.io/badge/OBS%20Studio-Browser%20Source-purple?style=flat&logo=obsstudio)](https://obsproject.com/)
[![License](https://img.shields.io/badge/License-All_Rights_Reserved-ef4444?style=flat)](./LICENSE)

[![Support Project](https://img.shields.io/badge/Support_Project-FF5E5B?style=for-the-badge&logo=heart&logoColor=white)](https://www.donationalerts.com/r/foozzee)
[![Поддержать проект](https://img.shields.io/badge/Поддержать_проект-FF5E5B?style=for-the-badge&logo=heart&logoColor=white)](https://www.donationalerts.com/r/foozzee)

---

### 🌐 Quick Language Jump / Выбор языка

[![English Documentation](https://img.shields.io/badge/Documentation-English-2563eb?style=flat-square&logo=gitbook&logoColor=white)](#-english-documentation)
[![Русская документация](https://img.shields.io/badge/Документация-Русский-dc2626?style=flat-square&logo=gitbook&logoColor=white)](#-русская-документация)
[![Changelog](https://img.shields.io/badge/Changelog-v1.2.3-10b981?style=flat-square&logo=github)](./CHANGELOG.md)
[![Commands](https://img.shields.io/badge/Commands-Reference-9333ea?style=flat-square&logo=gitbook)](./commands.md)

*Standalone files:* [English (README.en.md)](./README.en.md) • [Русский (README.ru.md)](./README.ru.md) • [Commands (commands.md)](./commands.md) • [Commands EN (commands.en.md)](./commands.en.md) • [Справочник команд RU (commands.ru.md)](./commands.ru.md)

---

## 📸 Live HUD Preview / Витрина интерфейса

![Cockpit HUD — Amber Theme (Default)](./docs/screenshots/hud-amber.png)

| ❄️ Ice Blue Theme (`?theme=ice&lang=en`) | 📟 In-Game Event Toasts & Pip-Boy 3000 (`?test_update=1`) |
| :---: | :---: |
| [![Cockpit HUD Ice Theme](./docs/screenshots/hud-ice.png)](./docs/screenshots/hud-ice.png) | [![Pip-Boy 3000 CRT Updater](./docs/screenshots/hud-events-pipboy.png)](./docs/screenshots/hud-events-pipboy.png) |

---


<a id="-english-documentation"></a>
## 🇬🇧 English Documentation

**ETS2 / ATS Cockpit Telemetry Stream Overlay** is an ultra-low latency, broadcast-grade telemetry HUD designed specifically for live streamers on Twitch, YouTube, and TikTok. Built around realistic amber/ice cockpit ergonomics, it provides comprehensive driving, vehicle, and trip telemetry while keeping the driver's windshield, mirrors, and in-game GPS completely unobstructed.

### ✨ Key Highlights & v1.2.3 Features
* 🛡️ **Proprietary Freeware License (All Rights Reserved — v1.2.3):** Full proprietary freeware model for streaming and broadcasts with zero open-source references.
* 🔒 **Credential Security Audit (v1.2.3):** Default DonationAlerts socket tokens cleaned in `assets/js/ets2-config.js` to prevent streaming key exposure.
* ⚙️ **PowerShell Script Quality Standard (v1.2.3):** All scripts standardized to UTF-8 with BOM and verified with `AST_ERRORS = 0`.
* 🖥️ **Full HD Single Desktop Cockpit HUD (`1920×1080` — `ets2-desktop.html` — v1.2.2):** Unified desktop scene layout with opaque gauge base, live chat, and audio alerts.
* 📟 **Pip-Boy 3000 Autonomous CRT Update Terminal (v1.2.2):** Retro green phosphor updater with CRT scanlines and typewriter audio.
* 🚨 **Native SCS Gameplay Event Toasts & Sound Engine:** Real-time HUD toast alerts anchored in the upper windshield view (`top: 14%`) for traffic fines, tollgates, ferry voyages, train shuttles, and contract deliveries, powered by a zero-dependency procedural Web Audio synthesizer.
* 💬 **Twitch IRC Chat & Interactive Viewer Commands:** Built-in direct WebSocket IRC connection with audience commands (`!job`, `!truck`, `!stats`, `!driver`, `!cb <text>`, `!honk`, `!bet`). Documented in full in [commands.en.md](./commands.en.md) and [commands.ru.md](./commands.ru.md).
* 🗺️ **Primary HUD Route & Trip Integration:** Active cargo name and tonnage or passenger coach route now render directly inside the primary dashboard module (`#route-value` and `#lt-cargo`), with live passenger comfort rating (**`SATISFACTION: XX%`**).
* 🌐 **100% Strict Bilingual Separation (EN / RU):** Pure English and Russian modes without cross-lingual leakage, powered by the comprehensive `CITIES_DB` geographic dictionary and phonetic transliteration.
* ⚡ **Ultra-Stable Telemetry Bridge & Plugin:** Powered by `overlayobs_foozzee_telemetry.dll` with `NULL DACL` Win32 Shared Memory architecture (`Local\FooZzeeSCSTelemetry`) and fixed high-speed PowerShell HTTP bridge (`:30002`).
* 📟 **Pip-Boy 3000 Auto-Update Terminal:** Autonomous GitHub update checker with authentic green CRT phosphor styling, scanlines, WebAudio procedural typewriter sound effects, CRT shutdown audio, and full EN/RU bilingual support.
* 💖 **Project Support Integration:** One-click «💖 SUPPORT PROJECT» button in the GUI installer linking directly to DonationAlerts.
* 🚌 **Full ETS2 DLC Coaches Support:** Native coach passenger job detection (`bus_job`), stop-to-stop routing (`source_stop.*` ➔ `destination_stop.*`), and live passenger satisfaction rating.
* 🎛️ **100% Solid Opacity Lower Cockpit HUD (`1920×1080` — `ets2-desktop.html`):** Opaque dashboard background eliminates road texture bleed-through in OBS Studio while keeping webcam, chat, and alert popups transparent.
* 🖥️ **Full HD Desktop Cockpit HUD (`1920×1080` — `ets2-desktop.html`):** Broadcast-grade 2-row dashboard optimized for standard 16:9 streams with integrated webcam cutout, live chat, and audio alerts.
* ⏱️ **Real-World ETA (`real-eta-panel`):** Automatically detects active map scale (`1:19` highways, `1:3` cities, `1:10` UK) to compute real-world time remaining.
* 💬 **Twitch IRC Chat & FIFO Alerts:** Built-in sequential alert queue (`donate`, `sub`, `follow`, `raid`) with stream-safe DonationAlerts token configuration.
* ⚡ **1-Click GUI Wizard (`Install-Overlay.bat`):** Auto-detects Steam libraries, installs the C++ plugin, cleans legacy files, and creates a Desktop shortcut.

### 🏛️ Architecture Overview
```mermaid
flowchart LR
    A["Euro Truck Simulator 2 / ATS\n(64-bit Game Engine)"] -->|"SCS Telemetry SDK 1.16"| B["overlayobs_foozzee_telemetry.dll\n(Native C++ Release Plugin)"]
    B -->|"Shared Memory\nLocal\\FooZzeeSCSTelemetry"| C["udp-bridge.ps1\n(Local HTTP/JSON Server :30002)"]
    C -->|"JSON Polling (30-60 FPS)\n/telemetry"| D["OBS Studio Browser Source\n(ets2-desktop.html)"]
    E["Twitch IRC & DonationAlerts"] -->|"WebSockets\n(Alerts & Live Chat)"| D
    F["GitHub Releases API"] -->|"Periodic Check (Pip-Boy 3000)"| D
```

### ⚡ Quick Start
1. Download **`ets2-ats-stream-overlay-v1.2.3.zip`** from [Releases](https://github.com/FooZzee/ets2-ats-stream-overlay/releases).
2. Extract the archive into any folder (e.g. `C:\ETS2-ATS-Stream-Overlay`).
3. Run **`Install-Overlay.bat`**, enter your Twitch username and DonationAlerts token, and click **Install**.
4. Double-click the **`ETS2-ATS Overlay Bridge`** Desktop shortcut before streaming.
5. In OBS Studio, add a **Browser Source** (1920×1080):
   * > [!WARNING]
     > **CRITICAL OBS SETTING:** **UNCHECK "Local file" (Локальный файл)!** Add the overlay strictly via the **"URL" (Ссылка)** field (`D:\html\Overlay\ets2-desktop.html`). If "Local file" is checked, OBS sandbox restrictions will **break interactive cockpit controls, Pip-Boy update buttons, and external links**.
   * Use OBS **Interact (Взаимодействовать)** to click buttons on the HUD.
   * Support the project anytime via the **«💖 SUPPORT PROJECT»** button in the installer.

### 🎥 OBS Studio Placement
* **Webcam Dimensions:** Width **`346 px`**, Height **`195 px`** (`16:9`).
* **Webcam Coordinates:** Left **`24 px`**, Top **`180 px`** (place capture layer **below** the browser overlay).

---

<a id="-русская-документация"></a>
## 🇷🇺 Русская документация

**Cockpit Telemetry Stream Overlay** — это высокопроизводительный приборный комплекс для стримеров Euro Truck Simulator 2 и American Truck Simulator. Оверлей разработан с акцентом на реалистичность, отсутствие визуального мусора в лобовом стекле и нулевую задержку передачи телеметрии.

### ✨ Ключевые возможности и релиз v1.2.3
* 🛡️ **Защитная лицензия Proprietary Freeware License (v1.2.3):** Бесплатное личное использование на стримах, запрет коммерческой перепродажи и модифицированных сборок.
* 🔒 **Аудит безопасности учетных данных (v1.2.3):** Очищен токен DonationAlerts в `assets/js/ets2-config.js`, исключающий утечку ключей стримера.
* ⚙️ **Инженерный стандарт PowerShell (v1.2.3):** Кодировка UTF-8 with BOM и валидация `AST_ERRORS = 0` во всех системных сценариях.
* 🖥️ **Единая десктопная сцена Cockpit HUD (`1920×1080` — `ets2-desktop.html` — v1.2.2):** Полноэкранный приборный комплекс с непрозрачной подложкой.
* 📟 **Автономный терминал обновлений Pip-Boy 3000 (v1.2.2):** ЭЛТ-анимация сканлайнов, звуки пишущей машинки и автопроверка на GitHub.
* 🚨 **Всплывающие игровые уведомления HUD и процедурный звук:** Анимированные уведомления в верхней зоне лобового стекла (`top: 14%`) о штрафах, пунктах оплаты, паромах, поездах и сдаче рейса с процедурным звуковым движком Web Audio API без внешних аудиофайлов.
* 💬 **Интерактивные команды Twitch-чата:** Прямое подключение по WebSocket к Twitch IRC и поддержка команд взаимодействия (`!рейс`, `!тягач`, `!стата`, `!водитель`, `!рация <текст>`, `!гудок`, `!ставка`). Полный справочник приведён в [commands.ru.md](./commands.ru.md) и [commands.en.md](./commands.en.md).
* 🗺️ **Интеграция рейса в основной блок HUD:** Реальный перевозимый груз и тоннаж либо маршрут автобуса отображаются напрямую в центральном модуле кабины (`#route-value` и `#lt-cargo`), включая комфорт пассажиров (**`КОМФОРТ: XX%`**).
* 🌐 **100% строгое разделение языков (RU / EN):** Полная изоляция русской и английской локализаций без смешения языков на базе встроенного географического словаря `CITIES_DB` и транслитерации.
* ⚡ **Сверхстабильный мост телеметрии и нативный плагин:** Библиотека `overlayobs_foozzee_telemetry.dll` с архитектурой `NULL DACL` для разделяемой памяти `Local\FooZzeeSCSTelemetry` и исправленным скоростным PowerShell HTTP-мостом (`:30002`).
* 📟 **Автономный терминал обновлений Pip-Boy 3000:** Встроенный модуль проверки релизов на GitHub в аутентичном стиле зелёного кинескопа Fallout со звуками механической печатной машинки, выключением CRT и полной поддержкой русского и английского языков.
* 💖 **Поддержка проекта:** Интерактивная кнопка «💖 ПОДДЕРЖАТЬ ПРОЕКТ» в мастере установки со ссылкой на DonationAlerts автора.
* 🚌 **Полная поддержка ETS2 DLC Coaches:** Нативное распознавание автобусных рейсов (`bus_job`), остановок отправления и назначения (`source_stop.*` ➔ `destination_stop.*`) и вывод комфорта пассажиров.
* 🎛️ **100% непрозрачный фон приборной панели («торпеды»):** Фон нижней панели в `ets2-desktop.html` сделан полностью непрозрачным (`alpha = 1`), исключая просвечивание текстур асфальта под приборами в OBS Studio.
* 🖥️ **Полноэкранная десктопная сцена (`1920×1080` — `ets2-desktop.html`):** Профессиональный 2-рядный HUD-оверлей для стандартных стримов 16:9 со встроенным вырезом под веб-камеру, чатом и звуковыми алертами.
* ⏱️ **Реальное время в пути (`real-eta-panel`):** Конвертирует навигационное время симулятора с учётом масштаба карты (`1:19`, `1:3`, `1:10`) в реальные минуты до цели.
* 💬 **Чат Twitch IRC и FIFO-алерты:** Всплывающие карточки оповещений (`donate`, `sub`, `follow`, `raid`) с поддержкой DonationAlerts.
* ⚡ **1-клик графический установщик (`Install-Overlay.bat`):** Автоматический поиск игр в Steam, установка плагина, очистка устаревших файлов, защищённое поле токена DonationAlerts и ярлык на Рабочем столе.

### ⚡ Быстрый старт
1. Скачайте архив **`ets2-ats-stream-overlay-v1.2.3.zip`** из раздела [Releases](https://github.com/FooZzee/ets2-ats-stream-overlay/releases).
2. Распакуйте архив в удобную папку (например, `C:\ETS2-ATS-Stream-Overlay`).
3. Запустите **`Install-Overlay.bat`**, введите никнейм Twitch и токен DonationAlerts, затем нажмите **Установить**.
4. Перед началом стрима запустите ярлык на Рабочем столе: **`ETS2-ATS Overlay Bridge`**.
5. В OBS Studio создайте источник **Браузер (Browser Source)** (`1920 × 1080`):
   * > [!WARNING]
     > **ОБЯЗАТЕЛЬНО СНИМИТЕ ГАЛОЧКУ «Локальный файл»!** Добавляйте оверлей строго через строку **«Ссылка» (URL)** (`D:\html\Overlay\ets2-desktop.html`). Если оставить галочку «Локальный файл», OBS заблокирует песочницу, и **интерактивная приборная панель, окно обновлений Pip-Boy и ссылки работать НЕ БУДУТ**.
   * Для нажатия на кнопки используйте пункт меню OBS **«Взаимодействовать» (Interact)**.
   * Поддержать проект можно в любой момент прямо из установщика по кнопке **«💖 ПОДДЕРЖАТЬ ПРОЕКТ»**.

### 🎥 Размещение веб-камеры в OBS Studio
* **Размеры камеры:** Ширина **`346 px`**, Высота **`195 px`** (`16:9`).
* **Координаты:** Слева **`24 px`**, Сверху **`180 px`** (разместите слой камеры **ниже** слоя браузерного оверлея).

---

### 👤 Автор и контакты / Author & Credits — FooZzee (стример и разработчик)

* 🌐 **Официальный сайт / Website:** [foozzee.ru](https://foozzee.ru)
* 📺 **Twitch:** [twitch.tv/foozzee](https://twitch.tv/foozzee)
* 🎥 **YouTube:** [youtube.com/@foozzee](https://youtube.com/@foozzee)
* 📢 **Telegram:** [t.me/foozzeestream](https://t.me/foozzeestream)
* 👥 **VK:** [vk.ru/gtfun](https://vk.ru/gtfun)
* 📹 **VK Video Live:** *(в разработке / in development)*
* 💖 **DonationAlerts:** [donationalerts.com/r/foozzee](https://www.donationalerts.com/r/foozzee)

[![Поддержать проект](https://img.shields.io/badge/Поддержать_проект-FF5E5B?style=for-the-badge&logo=heart&logoColor=white)](https://www.donationalerts.com/r/foozzee)

Лицензия: [Proprietary Freeware License (All Rights Reserved)](./LICENSE) — бесплатное личное использование на стримах и в видеороликах; коммерческая перепродажа и публикация модифицированных сборок запрещены.

---

Copyright (c) 2026 FooZzee. All Rights Reserved.
