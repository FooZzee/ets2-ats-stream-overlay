# 🚀 ETS2 / ATS Cockpit Telemetry Stream Overlay — Release v1.2.1

[![Release](https://img.shields.io/badge/Release-v1.2.1-orange.svg?style=flat-square)](https://github.com/FooZzee/ETS2-ATS-Cockpit-Stream-Overlay/releases/tag/v1.2.1)
[![SemVer](https://img.shields.io/badge/SemVer-2.0.0-blue.svg?style=flat-square)](https://semver.org/)
[![License](https://img.shields.io/badge/License-All_Rights_Reserved-ef4444?style=flat)](./LICENSE)

---

## [EN] English Release Notes

### Executive Summary
Release **v1.2.1** integrates native dark-themed documentation viewer windows directly into the GUI Setup Wizard (`Install-Overlay.bat` / `scripts/installer.ps1`), enabling instant access to the Changelog and Interactive Commands Reference in the user's active language before or after installation.

> [!IMPORTANT]
> **Primary Upgrade Requirement:** Close Euro Truck Simulator 2 and American Truck Simulator before running `Install-Overlay.bat` or `build-and-install-plugin.bat`. The installer will automatically deploy the updated native module `overlayobs_foozzee_telemetry.dll` into `bin\win_x64\plugins\`.

---

### Key Highlights & Changes

#### 1. Setup Wizard Documentation Viewers (`scripts/installer.ps1`)
* **Interactive Document Access:** Added dedicated «📜 Changelog» and «📖 Commands» buttons in Group 4 of the GUI installer.
* **Bilingual In-App Reader:** Launches clean modal viewer windows displaying the complete version history (`CHANGELOG.ru.md` / `CHANGELOG.en.md`) and commands reference (`commands.ru.md` / `commands.en.md`) strictly matching the installer's active language.
* **Resilient File Resolution:** Automatically searches across current directory, parent path, and target overlay folder.
* **External Notepad Export:** One-click «📄 Open in Notepad» button for external viewing or printing.

---

## [RU] Русское описание релиза

### Краткое описание
Релиз **v1.2.1** добавляет в графический установщик (`Install-Overlay.bat` / `scripts/installer.ps1`) встроенные модальные окна для чтения списка изменений и интерактивных команд на выбранном языке оверлея непосредственно перед или после установки.

---

### Ключевые изменения

#### 1. Встроенный просмотр документации в мастере установки (`scripts/installer.ps1`)
* **Быстрый доступ к документам:** В группу 4 установщика добавлены кнопки «📜 Список изменений» и «📖 Список команд».
* **Двуязычный ридер:** Открытие отдельных модальных окон в тёмной теме с отображением полной истории версий (`CHANGELOG.ru.md` / `CHANGELOG.en.md`) и справочника команд (`commands.ru.md` / `commands.en.md`) в соответствии с выбранным в установщике языком.
* **Умный поиск файлов:** Автоматический поиск файлов документации по путям установки и родительским каталогам.
* **Открытие в блокноте:** Кнопка «📄 Открыть в блокноте» для внешнего просмотра и копирования.

---

### Checksums / Контрольные суммы (SHA-256)

| Файл / File | Размер / Size | Контрольная сумма SHA-256 / Checksum |
| :--- | :--- | :--- |
| `ETS2-ATS-Stream-Overlay-v1.2.1.zip` | 1.82 MB (1 912 059 B) | `502119FB0CA67A8A07450477E67DF40FCA716A54403F3E173A94F0E9C3631079` |
| `overlayobs_foozzee_telemetry.dll` | 205 KB (209 920 B) | `8C65F458C010B5E8415B470561966D11F2B1DEB09FA84A65092DCC77E1BC1DAF` |

---

Copyright (c) 2026 FooZzee. All Rights Reserved.
