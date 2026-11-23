# 🚛 ETS2 / ATS Cockpit Telemetry Stream Overlay v1.2.3

[![Release](https://img.shields.io/badge/Release-v1.2.3-blue?style=flat&logo=github)](https://github.com/FooZzee/ets2-ats-stream-overlay/releases/tag/v1.2.3)
[![Platform](https://img.shields.io/badge/Platform-Windows%20x64-blue?style=flat&logo=windows)](https://www.microsoft.com/windows)
[![SCS SDK](https://img.shields.io/badge/SCS%20SDK-v1.16%20Native-yellow?style=flat)](https://modding.scssoft.com/wiki/Documentation/Tools/Telemetry_server)
[![OBS Studio](https://img.shields.io/badge/OBS%20Studio-Browser%20Source-purple?style=flat&logo=obsstudio)](https://obsproject.com/)
[![License](https://img.shields.io/badge/License-All_Rights_Reserved-ef4444?style=flat)](./LICENSE)

---

### 🌐 Quick Language Jump / Выбор языка

[![English Release Notes](https://img.shields.io/badge/Release_Notes-English-2563eb?style=flat&logo=gitbook&logoColor=white)](#-english-release-notes)
[![Русское описание релиза](https://img.shields.io/badge/Описание_релиза-Русский-dc2626?style=flat&logo=gitbook&logoColor=white)](#-русское-описание-релиза-v123)
[![Support Project](https://img.shields.io/badge/Support_Project-FF5E5B?style=for-the-badge&logo=heart&logoColor=white)](https://www.donationalerts.com/r/foozzee)

---

<a id="-english-release-notes"></a>
## 🇬🇧 English Release Notes

> [!IMPORTANT]
> **Primary Upgrade Requirement:** Close Euro Truck Simulator 2 and American Truck Simulator before installing. Run `Install-Overlay.bat` or `build-and-install-plugin.bat` to ensure the native telemetry plugin is updated and deployed properly.

### 🌟 What's New in v1.2.3

#### 1. 🛡️ Proprietary Freeware License & Legal Attribution
* **Full Transition to Proprietary Freeware License (All Rights Reserved):** The project is licensed under a proprietary freeware model allowing free personal usage for streaming and broadcasting while strictly prohibiting commercial resale, unauthorized redistribution, rebranding, and public distribution of modified builds without prior written permission.
* **Removal of Open-Source References:** All legacy references to permissive open-source licenses (open-source) have been completely removed across the codebase, documentation, and build scripts.
* **Standardized Copyright:** Added explicit copyright notices `Copyright (c) 2026 FooZzee. All Rights Reserved.` across all source files, documentation, and GUI interfaces.

#### 2. 🔒 Credential Security Audit
* **Socket Token Sanitization:** Cleaned pre-filled placeholder tokens in `assets/js/ets2-config.js` (`donationAlerts.socketToken = ''`), preventing accidental exposure or leakage of personal streaming service keys during repository cloning and distribution.
* **Template Integrity:** Local credentials remain isolated in `config.js` (untracked by Git), while `config.example.js` provides secure, clean placeholders for initial configuration.

#### 3. 🧹 Repository Sanitization & Clean Source Tree
* **Intermediate Artifacts Purged:** Completely cleaned temporary MSVC and CMake build artifacts from `native-plugin/build/`.
* **Production-Ready Native Plugin:** The compiled 64-bit C++ telemetry plugin is cleanly distributed via `redist/overlayobs_foozzee_telemetry.dll` for reliable zero-configuration installation.

#### 4. ⚙️ PowerShell Automation Quality Standard
* **Strict UTF-8 with BOM Standard:** Standardized all PowerShell scripts (`scripts/installer.ps1`, `scripts/updater.ps1`, `scripts/configurator.ps1`, `scripts/udp-bridge.ps1`, `scripts/build-plugin.ps1`) to UTF-8 with BOM, resolving potential PowerShell parse anomalies on localized Windows systems.
* **Verified AST Syntax Integrity:** All automation scripts pass abstract syntax tree validation with `AST_ERRORS = 0`.
* **Reliable Path Resolution:** Standardized script execution path calculation via `$MyInvocation.MyCommand.Path` and `$PSScriptRoot`.

#### 5. 🔄 Synchronized Repository & Update Endpoints
* **Unified Repository Endpoints:** All update checks (`assets/js/ets2-updater.js`, `scripts/updater.ps1`, `scripts/installer.ps1`) are synchronized to point directly to `https://github.com/FooZzee/ets2-ats-stream-overlay`.
* **Automated Package Versioning:** Package version `v1.2.3` is dynamically reflected in installer headers, badges, and CRT updater terminals.

---

### 📦 Release Checksums / Контрольные суммы архива релиза

| File / Component | Size | SHA-256 Checksum | MD5 Checksum |
| :--- | :--- | :--- | :--- |
| `ets2-ats-stream-overlay-v1.2.3.zip` | 1.94 MB (2,031,166 B) | `DEF780E8E4E4C8A16D16B92C59E1EB77053917A8E4BDC4E5C7F1F9E572982873` | `FA525BD2041F3F04B3029411FCA7134B` |
| `overlayobs_foozzee_telemetry.dll` | 211 KB (216 064 B) | `2226F63B289AB4B3C79A30421C256B00415CDB42C5EFCC80AA7E61FABCCB9C60` | `AC18CB3EA72EBDB00526C7253CD93A79` |

---

### ⚡ Quick Start Guide (EN)

1. **Extract Archive:** Extract `ets2-ats-stream-overlay-v1.2.3.zip` into your desired directory (e.g., `C:\Stream_Overlay_Cockpit` or `D:\html\Overlay`).
2. **Run Installer:** Execute `Install-Overlay.bat` to select your theme, configure streamer nickname, Twitch channel, and auto-deploy the native SCS telemetry plugin to ETS2 and ATS directories.
3. **Add OBS Browser Source:** In OBS Studio, add a new **Browser Source**, set URL to `file:///C:/Stream_Overlay_Cockpit/ets2-desktop.html` (or your chosen path), Width: `1920`, Height: `1080`, FPS: `60`.
4. **Launch Telemetry Bridge:** Run `start-telemetry.bat` (or desktop shortcut `ETS2-ATS Overlay Bridge`) before launching the game.

---

<a id="-русское-описание-релиза-v123"></a>
## 🇷🇺 Русское описание релиза v1.2.3

> [!IMPORTANT]
> **Главное требование при установке:** Обязательно закройте Euro Truck Simulator 2 и American Truck Simulator перед установкой. Запустите `Install-Overlay.bat` или `build-and-install-plugin.bat` для корректного развёртывания нативного плагина телеметрии.

### 🌟 Главные нововведения v1.2.3

#### 1. 🛡️ Проприетарная лицензия (Proprietary Freeware License)
* **Переход на Proprietary Freeware License (All Rights Reserved):** Проект переведён на проприетарную лицензию бесплатного личного использования на стримах и трансляциях. Коммерческая перепродажа, включение в платные сборки, выдача за свой продукт и публичное распространение модифицированных копий без письменного согласия автора строго запрещены.
* **Полное исключение ссылок на open-source лицензии:** Из всех файлов проекта, скриптов и документации удалены устаревшие упоминания open-source.
* **Единый копирайт:** В исходный код, документацию и графические интерфейсы интегрирован обязательный копирайт: `Copyright (c) 2026 FooZzee. All Rights Reserved.`

#### 2. 🔒 Аудит безопасности конфигурации
* **Очистка ключей сервисов:** В файле `assets/js/ets2-config.js` очищен токен подключения DonationAlerts (`donationAlerts.socketToken = ''`), исключающий утечку персональных ключей стримера при публичном распространении.
* **Безопасность config.js:** Реальные ключи пользователя хранятся исключительно в локальном `config.js` (исключённом из Git), а файл `config.example.js` содержит безопасные пустые шаблоны.

#### 3. 🧹 Очистка дерева исходного кода
* **Удаление временных файлов компиляции:** Из публичного дерева полностью удалены промежуточные каталоги сборки CMake/MSVC из `native-plugin/build/`.
* **Готовый к работе нативный плагин:** Проверенный 64-битный плагин поставляется через `redist/overlayobs_foozzee_telemetry.dll` для автоматической установки в один клик.

#### 4. ⚙️ Инженерный стандарт скриптов PowerShell
* **Стандартизация UTF-8 with BOM:** Все системные сценарии (`scripts/installer.ps1`, `scripts/updater.ps1`, `scripts/configurator.ps1`, `scripts/udp-bridge.ps1`, `scripts/build-plugin.ps1`) сохранены в кодировке UTF-8 с BOM, что гарантирует стабильное чтение кириллических строк и XAML-разметки на любых сборках Windows.
* **100% верификация AST:** Все сценарии проходят проверку парсера синтаксического дерева с результатом `AST_ERRORS = 0`.
* **Безопасное определение путей:** Все вызовы используют надёжные методы `$MyInvocation.MyCommand.Path` и `$PSScriptRoot`.

#### 5. 🔄 Синхронизация репозитория и системы обновлений
* **Единый адрес репозитория:** Во всех скриптах проверки обновлений (`assets/js/ets2-updater.js`, `scripts/updater.ps1`, `scripts/installer.ps1`) зафиксирован репозиторий `https://github.com/FooZzee/ets2-ats-stream-overlay`.
* **Автоматическое версионирование:** Актуальная версия `v1.2.3` отображается в шапке установщика, заголовках окон и ретро-терминале обновлений Pip-Boy 3000.

---

### 📦 Контрольные суммы архива релиза

| Файл / Компонент | Размер | Контрольная сумма SHA-256 | Контрольная сумма MD5 |
| :--- | :--- | :--- | :--- |
| `ets2-ats-stream-overlay-v1.2.3.zip` | 1.94 MB (2,031,166 B) | `DEF780E8E4E4C8A16D16B92C59E1EB77053917A8E4BDC4E5C7F1F9E572982873` | `FA525BD2041F3F04B3029411FCA7134B` |
| `overlayobs_foozzee_telemetry.dll` | 211 KB (216 064 B) | `2226F63B289AB4B3C79A30421C256B00415CDB42C5EFCC80AA7E61FABCCB9C60` | `AC18CB3EA72EBDB00526C7253CD93A79` |

---

### ⚡ Быстрая установка (RU)

1. **Распаковка:** Распакуйте архив `ets2-ats-stream-overlay-v1.2.3.zip` в рабочую папку (например, `C:\Stream_Overlay_Cockpit` или `D:\html\Overlay`).
2. **Мастер установки:** Запустите `Install-Overlay.bat` для выбора оформления приборной панели, ввода никнейма стримера, канала Twitch и автоматической установки нативного плагина телеметрии в ETS2 и ATS.
3. **Настройка OBS Studio:** Добавьте источник «Браузер», укажите локальный URL `file:///C:/Stream_Overlay_Cockpit/ets2-desktop.html` (или путь к вашей папке), разрешение `1920x1080`, FPS `60`.
4. **Запуск моста телеметрии:** Запустите `start-telemetry.bat` (или созданный ярлык `ETS2-ATS Overlay Bridge` на Рабочем столе) перед запуском игры.

---

### 👤 Автор проекта — FooZzee (стример и разработчик)

* 🌐 **Официальный сайт:** [foozzee.ru](https://foozzee.ru)
* 📺 **Twitch:** [twitch.tv/foozzee](https://twitch.tv/foozzee)
* 🎥 **YouTube:** [youtube.com/@foozzee](https://youtube.com/@foozzee)
* 📢 **Telegram:** [t.me/foozzeestream](https://t.me/foozzeestream)
* 👥 **VK:** [vk.ru/gtfun](https://vk.ru/gtfun)
* 📹 **VK Video Live:** *(в разработке / in development)*
* 💖 **DonationAlerts:** [donationalerts.com/r/foozzee](https://www.donationalerts.com/r/foozzee)

[![Поддержать проект](https://img.shields.io/badge/Поддержать_проект-FF5E5B?style=for-the-badge&logo=heart&logoColor=white)](https://www.donationalerts.com/r/foozzee)

---

Copyright (c) 2026 FooZzee. All Rights Reserved.
