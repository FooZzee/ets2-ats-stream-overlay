# 📜 Changelog / История версий проекта

> **ETS2 / ATS Cockpit Telemetry Stream Overlay**  
> Все значимые изменения документируются в соответствии со стандартами [Keep a Changelog](https://keepachangelog.com/) и [Semantic Versioning 2.0.0](https://semver.org/).

[![Keep a Changelog](https://img.shields.io/badge/Changelog-Keep%20a%20Changelog%201.1.0-orange?style=for-the-badge&logo=git)](https://keepachangelog.com/)
[![SemVer](https://img.shields.io/badge/SemVer-2.0.0-blue?style=for-the-badge&logo=semver)](https://semver.org/)
[![Latest Release](https://img.shields.io/badge/Latest-v1.1.0-green?style=for-the-badge&logo=github)](https://github.com/FooZzee/ets2-ats-stream-overlay/releases/tag/v1.1.0)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](./LICENSE)

---

### 🧭 Навигация по версиям / Version Index
* [v1.1.0 (2026-11-15) — ETS2 DLC Coaches, Solid Cockpit HUD & Enhanced SCS Telemetry](#110---2026-11-15)
* [v1.0.0 (2026-11-12) — Initial Release (Native SCS SDK 1.16 & Broadcast HUD)](#100---2026-11-12)

---

## [1.1.0] - 2026-11-15

> [!IMPORTANT]
> **Релиз v1.1.0** добавляет полноценную нативную поддержку пассажирских перевозок из **DLC Coaches** для Euro Truck Simulator 2, новые каналы SCS SDK, улучшает читаемость приборной панели в OBS Studio и расширяет установщик.

### ✨ Added / Добавлено

#### 🚌 Euro Truck Simulator 2 — DLC Coaches (Пассажирские рейсы)
* **RU:** Полная интеграция автобусных рейсов из нового **DLC Coaches** в ETS2 с сохранением 100% совместимости с грузоперевозками в ETS2 и ATS.
  * Автоматический разбор маршрута «Откуда ➔ Куда» через официальные атрибуты остановок SCS SDK (`source_stop.*` ➔ `destination_stop.*`).
  * Отображение показателя комфорта пассажиров в реальном времени: **`КОМФОРТ: XX%`** в бегущей строке бортового компьютера.
  * Передача флага `isBusJob` и специализированных данных остановок в веб-интерфейс оверлея.
* **EN:** Native bus passenger job detection (`bus_job`) from the new **DLC Coaches** with seamless backwards compatibility for standard freight cargo hauling in ETS2 & ATS.
  * Real-time stop-to-stop route extraction via official SCS SDK attributes (`source_stop.*` ➔ `destination_stop.*`).
  * Dynamic passenger satisfaction rating: **`SATISFACTION: XX%`** in the onboard computer ticker.
  * Propagation of `isBusJob` state and dedicated stop endpoints to the HUD frontend.

#### ⚡ New SCS Telemetry SDK Channels / Новые каналы телеметрии
* **RU / EN:** В C++ плагин `scs_direct_telemetry.dll` и скрипт моста `scripts/udp-bridge.ps1` добавлены 4 новых нативных канала телеметрии:

| Канал / SDK Channel | Тип / Type | Описание (RU) | Description (EN) |
|---|---|---|---|
| `bus_job.average_satisfaction` | `FLOAT` | Средний уровень комфорта пассажиров автобуса (0.0 .. 1.0) | Live coach passenger satisfaction comfort rating |
| `rest.stop` | `S32` | Оставшееся время до обязательного отдыха/сна водителя (в минутах) | Fatigue / mandatory driver rest countdown timer (minutes) |
| `truck.electric.enabled` | `BOOL` | Статус бортовой электросети и зажигания | Onboard electrical system & ignition status |
| `truck.engine.enabled` | `BOOL` | Статус работы двигателя тягача / автобуса | Engine running status |

#### 💳 DonationAlerts Wizard Integration / Интеграция DonationAlerts в установщик
* **RU:** В графический 1-клик установщик (`scripts/installer.ps1` / `Install-Overlay.bat`) добавлено поле для секретного токена DonationAlerts с маскированием звёздочками и кнопкой **Показать / Скрыть** (**Show / Hide**).
* **EN:** Added a password-masked DonationAlerts secret token field in the GUI installer wizard with stream-safe **Show / Hide** toggle and automatic `config.js` generation.

---

### 🔄 Changed / Изменено

#### 🎛️ 100% Solid Opacity Lower Cockpit HUD / Непрозрачность торпеды
* **RU:** Фон нижней приборной панели («торпеды») в `assets/css/ets2-desktop.css` сделан **на 100% сплошным и непрозрачным (`alpha = 1`)**. Дорожные текстуры, яркая разметка и фары больше не просвечивают сквозь шкалы спидометра, навигацию и датчики в OBS Studio. При этом рамка веб-камеры, чат и алерты сохраняют прозрачность.
* **EN:** Lower cockpit dashboard background in `assets/css/ets2-desktop.css` set to **100% solid opacity (`alpha = 1`)**. Eliminates asphalt and road texture bleed-through in OBS Studio while retaining transparent webcam, chat, and alert overlays.

#### 🧹 Twitch-Only Streamlining / Очистка от Kick
* **RU:** Из всех сцен (`ets2-desktop.html`, `ets2-vertical.html`), стилей и скриптов удалены устаревшие ссылки и упоминания Kick.com. Блок соцсетей в правом нижнем углу аккуратно выровнен под единый канал Twitch.
* **EN:** Completely removed legacy Kick.com badges and references across all HUD scenes and scripts, streamlining layout and alignment for single Twitch channel streaming (`twitch.tv/...`).

#### 🛡️ C++ Native Plugin & Repository Setup / Обновление плагина и репозитория
* **RU:** Скомпилирована чистая Release x64 сборка `scs_direct_telemetry.dll` (210 КБ, SHA256: `6E9B18395E41C99A46FA9643301805F1D340D64A9069250CC6CFEBB038728DF9`). В `.gitattributes` добавлена строгая защита бинарных файлов (`*.dll`, `*.ttf`, `*.zip`).
* **EN:** Cleanly rebuilt Release x64 `scs_direct_telemetry.dll` (210 KB). Added explicit binary file protection in `.gitattributes` (`*.dll`, `*.ttf`, `*.zip`).

---

## [1.0.0] - 2026-11-12

> [!NOTE]
> **Первый публичный релиз (Initial Public Release)** проекта ETS2 / ATS Cockpit Telemetry Stream Overlay.

### ✨ Initial Features / Базовые возможности
* ⚡ **Нативный C++ плагин SCS Telemetry SDK 1.16:** Прямое чтение телеметрии через Win32 Shared Memory (`Local\FooZzeeSCSTelemetry`) с частотой 30–60 FPS без сторонних утилит и серверов.
* 🖥️ **Двухрядная приборная панель Desktop (`1920×1080`):**
  * Спидометр (`КМ/Ч`), круиз-контроль, КПП, тахометр (`RPM`), индикаторы педалей и руля (**ГАЗ / ТОРМ / РУЛЬ**), полный блок приборных ламп.
  * 7 аналогово-цифровых датчиков бортового компьютера (Топливо, Запас хода, Расход, Масло/Вода, Воздух, AdBlue, АКБ).
  * Бегущая строка статистики рейса, прогресс-бар маршрута и навигация.
* 📱 **Вертикальная мобильная сцена (`1080×1920`):** Адаптация под безопасные зоны TikTok Live, YouTube Shorts, Reels.
* ⏱️ **Реальное время в пути (`real-eta-panel`):** Автоматическая конвертация навигационного времени с учётом масштаба карты (`1:19`, `1:3`, `1:10`) в реальные минуты до цели.
* 💬 **Интерактив Twitch IRC и FIFO-алерты:** Всплывающие карточки оповещений (`donate`, `sub`, `follow`, `raid`) с поддержкой DonationAlerts.
* ⚡ **1-клик графический установщик (`Install-Overlay.bat`):** Двуязычный визард с автоматическим поиском установленных ETS2 / ATS в Steam и созданием ярлыка на Рабочем столе.

---

### 👤 Автор проекта / Project Author — FooZzee
* **Website:** [foozzee.ru](https://foozzee.ru/)
* **Twitch:** [twitch.tv/foozzee](https://www.twitch.tv/foozzee)
* **YouTube:** [@foozzee](https://www.youtube.com/@foozzee)
* **Telegram:** [@foozzeestream](https://t.me/foozzeestream)
* **VK:** [vk.ru/gtfun](https://vk.ru/gtfun)

[1.1.0]: https://github.com/FooZzee/ets2-ats-stream-overlay/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/FooZzee/ets2-ats-stream-overlay/releases/tag/v1.0.0
