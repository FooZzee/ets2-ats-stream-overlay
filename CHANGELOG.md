# 📜 Project Version History / История версий проекта

> **ETS2 / ATS Cockpit Telemetry Stream Overlay**  
> All notable changes are documented in strict adherence to [Keep a Changelog](https://keepachangelog.com/) and [Semantic Versioning 2.0.0](https://semver.org/).  
> Все значимые изменения документируются в соответствии со стандартами [Keep a Changelog](https://keepachangelog.com/) и [Semantic Versioning 2.0.0](https://semver.org/).

[![Keep a Changelog](https://img.shields.io/badge/Changelog-Keep%20a%20Changelog%201.1.1-orange?style=for-the-badge&logo=git)](https://keepachangelog.com/)
[![SemVer](https://img.shields.io/badge/SemVer-2.0.0-blue?style=for-the-badge&logo=semver)](https://semver.org/)
[![Latest Release](https://img.shields.io/badge/Latest-v1.1.2-green?style=for-the-badge&logo=github)](https://github.com/FooZzee/ets2-ats-stream-overlay/releases/tag/v1.1.2)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](./LICENSE)

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
* [v1.1.2 (2026-11-15) — Pip-Boy 3000 Standalone Auto-Update Terminal, 100% Bilingual Localization & DLC Coaches](#112---2026-11-15-en)
* [v1.1.0 (2026-11-15) — ETS2 DLC Coaches Support, Solid Dashboard & Enhanced SCS Telemetry](#110---2026-11-15-en)
* [v1.0.0 (2026-11-12) — Initial Release (Native SCS Telemetry SDK 1.16 & Broadcast HUD)](#100---2026-11-12-en)

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
  * **SCS SDK Native Plugin & UDP Bridge ID Pipeline:** `scs_direct_telemetry.dll` and `scripts/udp-bridge.ps1` now stream `cityId` / `companyId` tokens alongside localized UTF-8 names.

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
  * Integrated 4 new native telemetry channels into `scs_direct_telemetry.dll` and `scripts/udp-bridge.ps1`:
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
  * Clean Release x64 compilation of `scs_direct_telemetry.dll` (210 KB, SHA256: `6E9B18395E41C99A46FA9643301805F1D340D64A9069250CC6CFEBB038728DF9`).
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
* [v1.1.2 (2026-11-15) — Автономная проверка обновлений Pip-Boy 3000, 100% двуязычная локализация и DLC Coaches](#112---2026-11-15-ru)
* [v1.1.0 (2026-11-15) — Поддержка ETS2 DLC Coaches, непрозрачная торпеда и новые каналы SCS SDK](#110---2026-11-15-ru)
* [v1.0.0 (2026-11-12) — Первый публичный релиз (Нативный плагин SCS SDK 1.16 и приборный HUD)](#100---2026-11-12-ru)

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
  * **Синхронизация передачи ID в плагине и мосту:** Плагин `scs_direct_telemetry.dll` и скрипт `scripts/udp-bridge.ps1` передают `cityId` / `companyId` для точной идентификации городов независимо от языка игры.

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
  * В нативный C++ плагин `scs_direct_telemetry.dll` и скрипт моста `scripts/udp-bridge.ps1` добавлена регистрация и передача 4 новых каналов:
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
  * Выполнена чистая компиляция Release x64 библиотеки `scs_direct_telemetry.dll` (размер: 210 КБ, SHA256: `6E9B18395E41C99A46FA9643301805F1D340D64A9069250CC6CFEBB038728DF9`).
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

[1.1.2]: https://github.com/FooZzee/ets2-ats-stream-overlay/compare/v1.1.0...v1.1.2
[1.1.0]: https://github.com/FooZzee/ets2-ats-stream-overlay/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/FooZzee/ets2-ats-stream-overlay/releases/tag/v1.0.0
