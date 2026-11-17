<#
.SYNOPSIS
  Bilingual (RU / EN) WPF GUI Installer for ETS2 / ATS Cockpit Telemetry Stream Overlay.
  Двуязычный (RU / EN) графический WPF-мастер установки оверлея ETS2 / ATS в стиле Cockpit HUD.
#>
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

# 1. Проверка режима STA (Single-Threaded Apartment) для WPF
if ([System.Threading.Thread]::CurrentThread.GetApartmentState() -ne [System.Threading.ApartmentState]::STA) {
    $scriptPath = $MyInvocation.MyCommand.Definition
    if (-not $scriptPath) {
        $scriptPath = Join-Path $PSScriptRoot 'installer.ps1'
    }
    Start-Process -FilePath 'powershell.exe' -ArgumentList "-NoProfile -ExecutionPolicy Bypass -STA -WindowStyle Hidden -File `"$scriptPath`""
    exit
}

# 2. Инициализация современных протоколов TLS 1.2
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12 -bor [System.Net.SecurityProtocolType]::Tls11 -bor [System.Net.SecurityProtocolType]::Tls

# 3. Подключение сборок WPF и Forms (для диалогов выбора папок)
Add-Type -AssemblyName PresentationFramework
Add-Type -AssemblyName PresentationCore
Add-Type -AssemblyName WindowsBase
Add-Type -AssemblyName System.Windows.Forms

# 4. Пути и версии проекта
$ScriptRoot = if ($PSScriptRoot) {
    $PSScriptRoot
} elseif ($MyInvocation.MyCommand.Definition) {
    Split-Path -Parent $MyInvocation.MyCommand.Definition
} else {
    (Get-Location).Path
}

$SourceRoot = Split-Path -Parent $ScriptRoot
if (-not (Test-Path (Join-Path $SourceRoot 'ets2-desktop.html'))) {
    if (Test-Path (Join-Path (Get-Location).Path 'ets2-desktop.html')) {
        $SourceRoot = (Get-Location).Path
    }
}
$RedistDll  = Join-Path $SourceRoot 'redist\overlayobs_foozzee_telemetry.dll'
$TARGET_VER = '1.2.2'

# 5. Определение языка системы по умолчанию
$DefaultLang = if ([System.Globalization.CultureInfo]::CurrentUICulture.TwoLetterISOLanguageName -eq 'ru') { 'ru' } else { 'en' }
$script:CurrentLang = $DefaultLang

# 6. Двуязычный словарь локализации
$Strings = @{
    en = @{
        WindowTitle       = "ETS2 / ATS Stream Overlay — Setup Wizard v$TARGET_VER"
        HeaderTitle       = "ETS2 / ATS STREAM OVERLAY"
        HeaderSubtitle    = "2-Row Cockpit HUD • Native SCS SDK 1.16 Telemetry • Twitch Chat & Alerts"
        BadgeVersion      = "v$TARGET_VER"
        LangBtn           = "Русский (RU)"
        GrpInstallDir     = "1. Overlay Installation Folder"
        BrowseBtn         = "Browse..."
        GrpPlugins        = "2. Native SCS Telemetry Plugin (overlayobs_foozzee_telemetry.dll)"
        ChkEts2           = "Install native telemetry plugin for Euro Truck Simulator 2"
        ChkAts            = "Install native telemetry plugin for American Truck Simulator"
        PluginFound       = "Detected automatically"
        PluginMissing     = "Not detected automatically — browse if installed"
        DllMissingNote    = "Warning: redist\overlayobs_foozzee_telemetry.dll not found in installer package."
        ThirdPartyNote    = "Notice: Third-party rtrucksim_telemetry.dll will remain untouched."
        GrpProfile        = "3. Streamer Profile (written to config.js)"
        LblDriver         = "Streamer Nickname:"
        LblTwitch         = "Twitch Channel:"
        LblDaToken        = "DonationAlerts Secret Token (optional):"
        HintDaToken       = "Enables live donation alerts on the dashboard (DonationAlerts -> Settings -> Secret Token)"
        BtnShowToken      = "Show"
        BtnHideToken      = "Hide"
        GrpOptions        = "4. Shortcuts & Finish Options"
        ChkShortcut       = "Create Desktop Shortcut ('ETS2-ATS Overlay Bridge')"
        ChkUpdateShortcut = "Create Update Checker (Pip-Boy 3000) shortcut on Desktop"
        ChkOpenFolder     = "Open installation folder after setup"
        StarCardText      = "Enjoying the overlay? Please give the project a Star on GitHub — it really helps!"
        BtnStar           = "⭐ STAR ON GITHUB"
        BtnSupport        = "SUPPORT PROJECT"
        BtnInstall        = "🚀 INSTALL OVERLAY"
        BtnCancel         = "Close"
        AuthorPrefix      = "Created by FooZzee"
        LinkWebsite       = "Website (foozzee.ru)"
        LinkTwitch        = "Twitch"
        LinkYouTube       = "YouTube"
        LinkTelegram      = "Telegram"
        LinkVk            = "VK"
        BtnChangelog      = "📜 Changelog"
        BtnCommands       = "📖 Commands"
        FooterPkgVer      = "Package Version: v$TARGET_VER"
        FooterObsHint     = "OBS Desktop: 1920x1080 (ets2-desktop.html) • Webcam: 346x195 px"
        DlgOverlayTitle   = "Select overlay installation folder"
        DlgEts2Title      = "Select Euro Truck Simulator 2 folder (root, bin\win_x64, or plugins)"
        DlgAtsTitle       = "Select American Truck Simulator folder (root, bin\win_x64, or plugins)"
        ErrNoInstallDir   = "Please specify a valid overlay installation folder."
        ErrEts2Path       = "ETS2 plugin installation is checked, but the selected ETS2 folder does not exist."
        ErrAtsPath        = "ATS plugin installation is checked, but the selected ATS folder does not exist."
        StatusOk          = "Installed"
        DoneHeader        = "INSTALLATION COMPLETE"
        DoneSub           = "Your ETS2 / ATS Cockpit Overlay and native SCS SDK 1.16 plugin are ready."
        DoneOverlayLine   = "Overlay Files & config.js:"
        DoneEts2Line      = "ETS2 Plugin:"
        DoneAtsLine       = "ATS Plugin:"
        DoneShortcutLine  = "Desktop Shortcut:"
        DoneUpdateScLine  = "Update Checker Shortcut:"
        DoneDaLine        = "DonationAlerts:"
        StatusDaOk        = "Configured [OK]"
        StatusDaSkipped   = "Skipped (can be added later in config.js)"
        DoneObsHeader     = "OBS STUDIO CONFIGURATION & LAUNCH"
        DoneObsBody       = "• Desktop Browser Source: 1920x1080 -> ets2-desktop.html`r`n• Webcam Source (16:9): 346x195 px | left: 24 | top: 180 (layer below overlay)`r`n• Launch 'ETS2-ATS Overlay Bridge' (start-telemetry.bat) before starting your stream."
        BtnFinishClose    = "Finish & Close"
        DocChangelogTitle = "ETS2 / ATS Stream Overlay — Version History"
        DocCommandsTitle  = "ETS2 / ATS Stream Overlay — Commands Reference"
        ShortcutDesc      = "Launch ETS2 / ATS Native SCS SDK Telemetry Bridge for OBS"
        UpdateShortcutDesc= "Check ETS2 / ATS Overlay Updates via Pip-Boy 3000 Terminal"
        SetupErrorTitle   = "Installation Error"
    }
    ru = @{
        WindowTitle       = "ETS2 / ATS Stream Overlay — Мастер установки v$TARGET_VER"
        HeaderTitle       = "ETS2 / ATS STREAM OVERLAY"
        HeaderSubtitle    = "2-рядная торпеда • Прямой SCS SDK 1.16 • Чат и алерты Twitch"
        BadgeVersion      = "v$TARGET_VER"
        LangBtn           = "English (EN)"
        GrpInstallDir     = "1. Папка установки оверлея"
        BrowseBtn         = "Обзор..."
        GrpPlugins        = "2. Установка нативного плагина телеметрии (overlayobs_foozzee_telemetry.dll)"
        ChkEts2           = "Установить плагин телеметрии для Euro Truck Simulator 2"
        ChkAts            = "Установить плагин телеметрии для American Truck Simulator"
        PluginFound       = "Найдено автоматически"
        PluginMissing     = "Не найдено автоматически — укажите папку вручную"
        DllMissingNote    = "Внимание: файл redist\overlayobs_foozzee_telemetry.dll отсутствует в сборке."
        ThirdPartyNote    = "Напоминание: сторонний rtrucksim_telemetry.dll строго не затрагивается."
        GrpProfile        = "3. Профиль стримера (записывается в config.js)"
        LblDriver         = "Никнейм стримера:"
        LblTwitch         = "Канал Twitch:"
        LblDaToken        = "Секретный токен DonationAlerts (необязательно):"
        HintDaToken       = "Для показа донатов на торпеде (DonationAlerts -> Настройки аккаунта -> Секретный токен)"
        BtnShowToken      = "Показать"
        BtnHideToken      = "Скрыть"
        GrpOptions        = "4. Ярлыки и параметры"
        ChkShortcut       = "Создать ярлык на Рабочем столе ('ETS2-ATS Overlay Bridge')"
        ChkUpdateShortcut = "Создать ярлык проверки обновлений (Pip-Boy 3000) на Рабочем столе"
        ChkOpenFolder     = "Открыть папку установки после завершения"
        StarCardText      = "Нравится оверлей? Поддержите проект звездой на GitHub — это очень помогает развитию!"
        BtnStar           = "⭐ ПОСТАВИТЬ ЗВЕЗДУ НА GITHUB"
        BtnSupport        = "ПОДДЕРЖАТЬ ПРОЕКТ"
        BtnInstall        = "🚀 УСТАНОВИТЬ ОВЕРЛЕЙ"
        BtnCancel         = "Закрыть"
        AuthorPrefix      = "Автор проекта: FooZzee"
        LinkWebsite       = "Сайт (foozzee.ru)"
        LinkTwitch        = "Twitch"
        LinkYouTube       = "YouTube"
        LinkTelegram      = "Telegram"
        LinkVk            = "VK"
        BtnChangelog      = "📜 Список изменений"
        BtnCommands       = "📖 Список команд"
        FooterPkgVer      = "Версия пакета: v$TARGET_VER"
        FooterObsHint     = "OBS Desktop: 1920x1080 (ets2-desktop.html) • Камера: 346x195 px"
        DlgOverlayTitle   = "Выберите папку для установки оверлея"
        DlgEts2Title      = "Выберите папку Euro Truck Simulator 2 (корень игры, bin\win_x64 или plugins)"
        DlgAtsTitle       = "Выберите папку American Truck Simulator (корень игры, bin\win_x64 или plugins)"
        ErrNoInstallDir   = "Укажите корректную папку для установки оверлея."
        ErrEts2Path       = "Отмечена установка плагина ETS2, но указанная папка ETS2 не найдена."
        ErrAtsPath        = "Отмечена установка плагина ATS, но указанная папка ATS не найдена."
        StatusOk          = "Установлено"
        DoneHeader        = "УСТАНОВКА ЗАВЕРШЕНА"
        DoneSub           = "Оверлей ETS2 / ATS и нативный плагин SCS SDK 1.16 готовы к работе."
        DoneOverlayLine   = "Файлы оверлея и config.js:"
        DoneEts2Line      = "Плагин ETS2:"
        DoneAtsLine       = "Плагин ATS:"
        DoneShortcutLine  = "Ярлык на Рабочем столе:"
        DoneUpdateScLine  = "Ярлык обновления (Pip-Boy):"
        DoneDaLine        = "DonationAlerts:"
        StatusDaOk        = "Настроено [OK]"
        StatusDaSkipped   = "Пропущено (можно добавить позже в config.js)"
        DoneObsHeader     = "ПАРАМЕТРЫ OBS STUDIO И ЗАПУСК"
        DoneObsBody       = "• Desktop-сцена: 1920x1080 -> ets2-desktop.html`r`n• Веб-камера (16:9): 346x195 px | left: 24 | top: 180 (слой ниже оверлея)`r`n• Перед стримом запустите ярлык 'ETS2-ATS Overlay Bridge' (start-telemetry.bat)."
        BtnFinishClose    = "Готово"
        DocChangelogTitle = "ETS2 / ATS Stream Overlay — История изменений"
        DocCommandsTitle  = "ETS2 / ATS Stream Overlay — Справочник команд"
        ShortcutDesc      = "Запуск прямого HTTP-моста телеметрии ETS2 / ATS (SCS SDK 1.16) для OBS"
        UpdateShortcutDesc= "Проверка обновлений оверлея ETS2 / ATS через терминал Pip-Boy 3000"
        SetupErrorTitle   = "Ошибка установки"
    }
}

function Get-Text([string]$key) {
    return $Strings[$script:CurrentLang][$key]
}

# 7. Комплексный поиск библиотек Steam и путей игр ETS2 / ATS
function Get-SteamLibraryPaths {
    $libs = [System.Collections.Generic.List[string]]::new()
    $candidates = @(
        @{ Path = 'HKCU:\Software\Valve\Steam'; Name = 'SteamPath' },
        @{ Path = 'HKLM:\SOFTWARE\WOW6432Node\Valve\Steam'; Name = 'InstallPath' },
        @{ Path = 'HKLM:\SOFTWARE\Valve\Steam'; Name = 'InstallPath' }
    )

    $steamRoot = $null
    foreach ($c in $candidates) {
        try {
            if (Test-Path -LiteralPath $c.Path) {
                $val = (Get-ItemProperty -LiteralPath $c.Path -ErrorAction SilentlyContinue).($c.Name)
                if (-not [string]::IsNullOrWhiteSpace($val)) {
                    $norm = $val.Replace('/', '\\').TrimEnd('\\')
                    if (Test-Path -LiteralPath $norm) {
                        $steamRoot = $norm
                        if (-not $libs.Contains($norm)) { [void]$libs.Add($norm) }
                        break
                    }
                }
            }
        } catch {}
    }

    if ($steamRoot) {
        $vdfPath = Join-Path $steamRoot 'steamapps\libraryfolders.vdf'
        if (Test-Path -LiteralPath $vdfPath) {
            try {
                $vdfLines = Get-Content -LiteralPath $vdfPath -Encoding UTF8
                foreach ($line in $vdfLines) {
                    if ($line -match '^\s*"path"\s+"([^"]+)"') {
                        $p = $Matches[1].Replace('\\', '\').Replace('/', '\').TrimEnd('\')
                        if ((Test-Path -LiteralPath $p) -and -not $libs.Contains($p)) { [void]$libs.Add($p) }
                    } elseif ($line -match '^\s*"\d+"\s+"([A-Za-z]:\\[^"]+)"') {
                        $p = $Matches[1].Replace('\\', '\').Replace('/', '\').TrimEnd('\')
                        if ((Test-Path -LiteralPath $p) -and -not $libs.Contains($p)) { [void]$libs.Add($p) }
                    }
                }
            } catch {}
        }
    }

    # Сканирование всех доступных логических дисков системы (C: - Z:)
    foreach ($drive in [System.IO.DriveInfo]::GetDrives()) {
        try {
            if ($drive.IsReady) {
                $root = $drive.RootDirectory.FullName
                $stdPaths = @(
                    (Join-Path $root 'SteamLibrary'),
                    (Join-Path $root 'Steam'),
                    (Join-Path $root 'Program Files (x86)\Steam'),
                    (Join-Path $root 'Program Files\Steam'),
                    (Join-Path $root 'Games\Steam'),
                    (Join-Path $root 'Games\SteamLibrary')
                )
                foreach ($sp in $stdPaths) {
                    if ((Test-Path -LiteralPath $sp) -and -not $libs.Contains($sp)) {
                        [void]$libs.Add($sp)
                    }
                }
            }
        } catch {}
    }

    return $libs
}

function Find-TruckSimInstall {
    param(
        [string[]]$LibraryPaths,
        [string]$FolderName,
        [string]$AppManifestName
    )

    foreach ($lib in $LibraryPaths) {
        $commonPath = Join-Path $lib ("steamapps\common\" + $FolderName)
        if (Test-Path -LiteralPath $commonPath) {
            return $commonPath
        }
        if ($AppManifestName) {
            $acfPath = Join-Path $lib ("steamapps\" + $AppManifestName)
            if (Test-Path -LiteralPath $acfPath) {
                try {
                    $acfRaw = Get-Content -LiteralPath $acfPath -Raw -Encoding UTF8
                    if ($acfRaw -match '"installdir"\s+"([^"]+)"') {
                        $altPath = Join-Path $lib ("steamapps\common\" + $Matches[1])
                        if (Test-Path -LiteralPath $altPath) {
                            return $altPath
                        }
                    }
                } catch {}
            }
        }
    }
    return ''
}

function Resolve-TruckPluginDir {
    param([string]$SelectedPath)
    $clean = ([string]$SelectedPath).Trim().Trim('"').TrimEnd('\', '/')
    if ([string]::IsNullOrWhiteSpace($clean)) { return $null }

    $leaf = Split-Path -Leaf $clean
    $parentLeaf = Split-Path -Leaf (Split-Path -Parent $clean)

    if ($leaf -ieq 'plugins' -and $parentLeaf -ieq 'win_x64') { return $clean }
    if ($leaf -ieq 'win_x64' -and $parentLeaf -ieq 'bin') { return (Join-Path $clean 'plugins') }
    if ($leaf -ieq 'bin') { return (Join-Path $clean 'win_x64\plugins') }
    if ($leaf -ieq 'plugins') { return $clean }

    $win64Dir = Join-Path $clean 'bin\win_x64'
    if ((Test-Path -LiteralPath (Join-Path $clean 'bin')) -or (Test-Path -LiteralPath $win64Dir)) {
        return (Join-Path $win64Dir 'plugins')
    }
    return (Join-Path $clean 'bin\win_x64\plugins')
}

function Escape-JsSingleQuote {
    param([string]$Value)
    return ([string]$Value).Replace('\', '\\').Replace("'", "\'").Replace("`r", '').Replace("`n", '')
}

function Copy-OverlayDirectory {
    param([string]$SrcDir, [string]$DstDir)
    $srcFull = [System.IO.Path]::GetFullPath($SrcDir).TrimEnd('\')
    $dstFull = [System.IO.Path]::GetFullPath($DstDir).TrimEnd('\')
    if ($srcFull -ieq $dstFull) { return }

    New-Item -ItemType Directory -Force -Path $dstFull | Out-Null
    $topItems = @(
        'ets2-desktop.html',
        'config.example.js',
        'start-telemetry.bat',
        'Install-Overlay.bat',
        'Update-Overlay.bat',
        'build-and-install-plugin.bat',
        'README.md',
        'README.en.md',
        'README.ru.md',
        'CHANGELOG.md',
        'CHANGELOG.en.md',
        'CHANGELOG.ru.md',
        'commands.md',
        'commands.en.md',
        'commands.ru.md',
        'RELEASE_NOTES_v1.2.2.md',
        'LICENSE',
        '.gitignore'
    )
    foreach ($item in $topItems) {
        $srcFile = Join-Path $srcFull $item
        if (Test-Path -LiteralPath $srcFile) {
            Copy-Item -LiteralPath $srcFile -Destination (Join-Path $dstFull $item) -Force
        }
    }

    foreach ($sub in @('assets', 'scripts', 'redist')) {
        $srcSub = Join-Path $srcFull $sub
        if (Test-Path -LiteralPath $srcSub) {
            $dstSub = Join-Path $dstFull $sub
            New-Item -ItemType Directory -Force -Path $dstSub | Out-Null
            Copy-Item -Path (Join-Path $srcSub '*') -Destination $dstSub -Recurse -Force
        }
    }
}

function Build-ConfigJsContent {
    param(
        [string]$SelectedLang,
        [string]$DriverName,
        [string]$TwitchName,
        [string]$DonationAlertsToken
    )

    $safeLang     = if ($SelectedLang -eq 'ru') { 'ru' } else { 'en' }
    $driverOut    = if ([string]::IsNullOrWhiteSpace($DriverName)) { 'STREAMER' } else { $DriverName.Trim() }
    $twEnabled    = if ([string]::IsNullOrWhiteSpace($TwitchName)) { 'false' } else { 'true' }
    $cleanDaToken = ([string]$DonationAlertsToken).Trim()
    $daEnabled    = if ([string]::IsNullOrWhiteSpace($cleanDaToken)) { 'false' } else { 'true' }
    $minDonate    = if ($safeLang -eq 'ru') { 50 } else { 1 }
    $routeDefault = if ($safeLang -eq 'ru') { 'В РЕЙСЕ // ОНЛАЙН' } else { 'IN TRANSIT // LIVE' }

    $escDriver  = Escape-JsSingleQuote $driverOut
    $escTwitch  = Escape-JsSingleQuote $TwitchName
    $escDaToken = Escape-JsSingleQuote $cleanDaToken
    $escRoute   = Escape-JsSingleQuote $routeDefault

    return @"
/**
 * ETS2 / ATS Stream Overlay runtime configuration (generated by Install-Overlay v$TARGET_VER).
 * Рабочая конфигурация оверлея ETS2 / ATS (создано мастером установки Install-Overlay v$TARGET_VER).
 */
window.OVERLAY_CONFIG = {
  // Overlay language / Язык интерфейса ('en' | 'ru')
  lang: '$safeLang',

  // Set true for verbose console diagnostics & ?test=1 mode
  debug: false,

  channels: {
    twitch: {
      enabled: $twEnabled,
      channelName: '$escTwitch',
      oauthToken: '',
      clientId: ''
    },
    vk: {
      enabled: false,
      channelUrl: '',
      token: ''
    },
    donationAlerts: {
      enabled: $daEnabled,
      socketToken: '$escDaToken' // Account Settings -> Secret Token
    },
    obsWebSocket: {
      enabled: false,
      url: 'ws://127.0.0.1:4455',
      password: ''
    }
  },

  alerts: {
    volume: 0.65,
    displayDurationMs: 5000,
    pauseBetweenMs: 800,
    fallbackTimeoutMs: 10000,
    minDonateAmount: $minDonate,
    ttsEnabled: false,
    synthFallback: true,
    sounds: {
      follow: './assets/sounds/follow.mp3',
      sub: './assets/sounds/sub.mp3',
      donate: './assets/sounds/donate.mp3',
      raid: './assets/sounds/raid.mp3'
    }
  },

  chat: {
    maxMessages: 30,
    messageLifetimeMs: 0,
    hideCommands: true,
    ignoredUsers: ['Nightbot', 'StreamElements', 'Moobot']
  },

  theme: {
    cockpitPreset: 'amber',
    cockpitAccentColor: ''
  },

  webcam: {
    enabled: true,
    cbChannel: 'CB 19'
  },

  ets2: {
    driverName: '$escDriver',
    routeTag: 'ETS2 // ATS',
    routeText: '$escRoute',
    routeMeta: 'CRUISE',
    checkUpdates: true,
    telemetryApi: {
      enabled: true,
      url: 'http://127.0.0.1:30002/telemetry',
      pollIntervalMs: 300,
      staleAfterMs: 9000,
      offlineBackoffMaxMs: 15000,
      speedUnit: 'auto',
      navDistUnit: 'auto',
      navTimeUnit: 'auto',
      cargoDmgUnit: 'auto',
      maxRpm: 2500
    }
  },

  music: {
    enabled: true,
    title: 'TRUCK CABIN FM',
    artist: 'LIVE STREAM',
    sourceUrl: '',
    pollIntervalMs: 3000
  },

  socials: {
    switchIntervalMs: 9000,
    items: []
  }
};
"@
}

function Install-NativePluginToGame {
    param([string]$GamePath, [string]$SourceDll)
    $pluginsDir = Resolve-TruckPluginDir -SelectedPath $GamePath
    New-Item -ItemType Directory -Force -Path $pluginsDir | Out-Null

    # Удаление устаревшего scs_direct_telemetry.dll
    $oldDirectDll = Join-Path $pluginsDir 'scs_direct_telemetry.dll'
    if (Test-Path -LiteralPath $oldDirectDll) {
        try { Remove-Item -LiteralPath $oldDirectDll -Force -ErrorAction SilentlyContinue } catch {}
    }

    # ВАЖНО: сторонний rtrucksim_telemetry.dll строго не трогаем!
    $targetDll = Join-Path $pluginsDir 'overlayobs_foozzee_telemetry.dll'
    Copy-Item -LiteralPath $SourceDll -Destination $targetDll -Force
    return $targetDll
}

# 8. Разметка WPF XAML — Компактная форма без вертикального скролла
$xaml = @"
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="ETS2 / ATS Stream Overlay — Setup Wizard"
        Width="740" SizeToContent="Height"
        Background="#0d1117" Foreground="#f1f5f9"
        WindowStartupLocation="CenterScreen"
        FontFamily="Segoe UI, -apple-system, sans-serif"
        ResizeMode="CanMinimize">
    <Window.Resources>
        <!-- Базовый стиль кнопок с тактильным сдвигом и скруглением 8px -->
        <Style TargetType="Button" x:Key="BtnBase">
            <Setter Property="Background" Value="#1f2937"/>
            <Setter Property="Foreground" Value="#f1f5f9"/>
            <Setter Property="BorderBrush" Value="#374151"/>
            <Setter Property="BorderThickness" Value="1"/>
            <Setter Property="FontWeight" Value="SemiBold"/>
            <Setter Property="FontSize" Value="12"/>
            <Setter Property="Padding" Value="10,5"/>
            <Setter Property="Cursor" Value="Hand"/>
            <Setter Property="Template">
                <Setter.Value>
                    <ControlTemplate TargetType="Button">
                        <Border x:Name="border" Background="{TemplateBinding Background}"
                                BorderBrush="{TemplateBinding BorderBrush}"
                                BorderThickness="{TemplateBinding BorderThickness}"
                                CornerRadius="8" Padding="{TemplateBinding Padding}">
                            <ContentPresenter x:Name="content" HorizontalAlignment="Center" VerticalAlignment="Center"/>
                        </Border>
                        <ControlTemplate.Triggers>
                            <Trigger Property="IsMouseOver" Value="True">
                                <Setter TargetName="border" Property="Background" Value="#374151"/>
                                <Setter TargetName="border" Property="BorderBrush" Value="#4b5563"/>
                            </Trigger>
                            <Trigger Property="IsPressed" Value="True">
                                <Setter TargetName="border" Property="Background" Value="#111827"/>
                                <Setter TargetName="content" Property="RenderTransform">
                                    <Setter.Value>
                                        <TranslateTransform Y="1"/>
                                    </Setter.Value>
                                </Setter>
                            </Trigger>
                            <Trigger Property="IsEnabled" Value="False">
                                <Setter Property="Opacity" Value="0.45"/>
                                <Setter Property="Cursor" Value="Arrow"/>
                            </Trigger>
                        </ControlTemplate.Triggers>
                    </ControlTemplate>
                </Setter.Value>
            </Setter>
        </Style>

        <!-- Главная кнопка Установки (Янтарный градиент) -->
        <Style TargetType="Button" x:Key="BtnPrimary" BasedOn="{StaticResource BtnBase}">
            <Setter Property="Background">
                <Setter.Value>
                    <LinearGradientBrush StartPoint="0,0" EndPoint="1,1">
                        <GradientStop Color="#f59e0b" Offset="0"/>
                        <GradientStop Color="#d97706" Offset="1"/>
                    </LinearGradientBrush>
                </Setter.Value>
            </Setter>
            <Setter Property="Foreground" Value="#0f172a"/>
            <Setter Property="BorderBrush" Value="#fbbf24"/>
            <Setter Property="FontWeight" Value="Bold"/>
            <Setter Property="FontSize" Value="13"/>
            <Setter Property="Padding" Value="20,7"/>
        </Style>

        <!-- Центральная кнопка ПОДДЕРЖАТЬ ПРОЕКТ (CornerRadius 10, градиент #ff5e5b -> #e11d48) -->
        <Style TargetType="Button" x:Key="BtnSupport">
            <Setter Property="Background">
                <Setter.Value>
                    <LinearGradientBrush StartPoint="0,0" EndPoint="1,1">
                        <GradientStop Color="#ff5e5b" Offset="0"/>
                        <GradientStop Color="#e11d48" Offset="1"/>
                    </LinearGradientBrush>
                </Setter.Value>
            </Setter>
            <Setter Property="Foreground" Value="#ffffff"/>
            <Setter Property="BorderBrush" Value="#fda4af"/>
            <Setter Property="BorderThickness" Value="1.5"/>
            <Setter Property="FontWeight" Value="Bold"/>
            <Setter Property="FontSize" Value="13"/>
            <Setter Property="Padding" Value="24,8"/>
            <Setter Property="Cursor" Value="Hand"/>
            <Setter Property="Template">
                <Setter.Value>
                    <ControlTemplate TargetType="Button">
                        <Border x:Name="border" Background="{TemplateBinding Background}"
                                BorderBrush="{TemplateBinding BorderBrush}"
                                BorderThickness="{TemplateBinding BorderThickness}"
                                CornerRadius="10" Padding="{TemplateBinding Padding}">
                            <ContentPresenter x:Name="content" HorizontalAlignment="Center" VerticalAlignment="Center"/>
                        </Border>
                        <ControlTemplate.Triggers>
                            <Trigger Property="IsMouseOver" Value="True">
                                <Setter TargetName="border" Property="Background">
                                    <Setter.Value>
                                        <LinearGradientBrush StartPoint="0,0" EndPoint="1,1">
                                            <GradientStop Color="#fb7185" Offset="0"/>
                                            <GradientStop Color="#be123c" Offset="1"/>
                                        </LinearGradientBrush>
                                    </Setter.Value>
                                </Setter>
                                <Setter TargetName="border" Property="BorderBrush" Value="#ffffff"/>
                            </Trigger>
                            <Trigger Property="IsPressed" Value="True">
                                <Setter TargetName="content" Property="RenderTransform">
                                    <Setter.Value>
                                        <TranslateTransform Y="1"/>
                                    </Setter.Value>
                                </Setter>
                            </Trigger>
                        </ControlTemplate.Triggers>
                    </ControlTemplate>
                </Setter.Value>
            </Setter>
        </Style>

        <!-- Кнопка Звезда на GitHub -->
        <Style TargetType="Button" x:Key="BtnStar" BasedOn="{StaticResource BtnBase}">
            <Setter Property="Background" Value="#17202e"/>
            <Setter Property="Foreground" Value="#f59e0b"/>
            <Setter Property="BorderBrush" Value="#f59e0b"/>
            <Setter Property="FontWeight" Value="Bold"/>
            <Setter Property="FontSize" Value="11.5"/>
            <Setter Property="Padding" Value="14,5"/>
        </Style>

        <!-- Поля ввода -->
        <Style TargetType="TextBox">
            <Setter Property="Background" Value="#0b0f14"/>
            <Setter Property="Foreground" Value="#f1f5f9"/>
            <Setter Property="BorderBrush" Value="#2a3444"/>
            <Setter Property="BorderThickness" Value="1"/>
            <Setter Property="Padding" Value="6,4"/>
            <Setter Property="FontSize" Value="12"/>
            <Setter Property="VerticalContentAlignment" Value="Center"/>
        </Style>

        <Style TargetType="PasswordBox">
            <Setter Property="Background" Value="#0b0f14"/>
            <Setter Property="Foreground" Value="#f1f5f9"/>
            <Setter Property="BorderBrush" Value="#2a3444"/>
            <Setter Property="BorderThickness" Value="1"/>
            <Setter Property="Padding" Value="6,4"/>
            <Setter Property="FontSize" Value="12"/>
            <Setter Property="VerticalContentAlignment" Value="Center"/>
        </Style>

        <Style TargetType="CheckBox">
            <Setter Property="Foreground" Value="#f1f5f9"/>
            <Setter Property="FontSize" Value="11.5"/>
            <Setter Property="Cursor" Value="Hand"/>
        </Style>
    </Window.Resources>

    <Grid Margin="14,10,14,10">
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="Auto"/>
        </Grid.RowDefinitions>

        <!-- ШАПКА МАСТЕРА УСТАНОВКИ -->
        <Border Grid.Row="0" Background="#151b24" BorderBrush="#2a3444" BorderThickness="1" CornerRadius="8" Padding="14,8" Margin="0,0,0,7">
            <Grid>
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="*"/>
                    <ColumnDefinition Width="Auto"/>
                </Grid.ColumnDefinitions>

                <StackPanel Grid.Column="0" VerticalAlignment="Center">
                    <StackPanel Orientation="Horizontal" VerticalAlignment="Center">
                        <TextBlock x:Name="txtHeaderTitle" Text="ETS2 / ATS STREAM OVERLAY" FontWeight="Bold" FontSize="15" Foreground="#f59e0b" VerticalAlignment="Center"/>
                        <Border Background="#2a1d08" BorderBrush="#f59e0b" BorderThickness="1" CornerRadius="6" Padding="6,1" Margin="10,0,0,0" VerticalAlignment="Center">
                            <TextBlock x:Name="txtBadgeVer" Text="v1.2.2" FontWeight="Bold" FontSize="11" Foreground="#fbbf24"/>
                        </Border>
                    </StackPanel>
                    <TextBlock x:Name="txtHeaderSub" Text="2-Row Cockpit HUD • Native SCS SDK 1.16 Telemetry • Twitch Chat &amp; Alerts" FontSize="11" Foreground="#94a3b8" Margin="0,2,0,0"/>
                </StackPanel>

                <StackPanel Grid.Column="1" Orientation="Horizontal" VerticalAlignment="Center">
                    <Button x:Name="btnLang" Style="{StaticResource BtnBase}" Content="English (EN)" Height="28" Padding="10,2"/>
                </StackPanel>
            </Grid>
        </Border>

        <!-- МОДУЛЬНЫЕ СЕКЦИИ УСТАНОВКИ (КОМПАКТНЫЙ ЛАЙАУТ БЕЗ СКРОЛЛА) -->
        <StackPanel Grid.Row="1">
            <!-- 1. Папка установки оверлея (По умолчанию C:\OverlayOBS_FooZzee) -->
            <Border Background="#151b24" BorderBrush="#2a3444" BorderThickness="1" CornerRadius="8" Padding="12,7" Margin="0,0,0,6">
                <StackPanel>
                    <TextBlock x:Name="lblInstallDir" Text="1. Папка установки оверлея" FontWeight="Bold" FontSize="12" Foreground="#f59e0b" Margin="0,0,0,4"/>
                    <Grid>
                        <Grid.ColumnDefinitions>
                            <ColumnDefinition Width="*"/>
                            <ColumnDefinition Width="Auto"/>
                        </Grid.ColumnDefinitions>
                        <TextBox x:Name="txtInstallDir" Grid.Column="0" Height="26" Text="C:\OverlayOBS_FooZzee"/>
                        <Button x:Name="btnBrowseInstall" Style="{StaticResource BtnBase}" Grid.Column="1" Content="Обзор..." Margin="6,0,0,0" Height="26"/>
                    </Grid>
                </StackPanel>
            </Border>

            <!-- 2. Плагин телеметрии SCS SDK -->
            <Border Background="#151b24" BorderBrush="#2a3444" BorderThickness="1" CornerRadius="8" Padding="12,7" Margin="0,0,0,6">
                <StackPanel>
                    <TextBlock x:Name="lblPlugins" Text="2. Установка нативного плагина телеметрии (overlayobs_foozzee_telemetry.dll)" FontWeight="Bold" FontSize="12" Foreground="#f59e0b" Margin="0,0,0,5"/>
                    
                    <!-- ETS2 -->
                    <Grid Margin="0,0,0,3">
                        <Grid.ColumnDefinitions>
                            <ColumnDefinition Width="Auto"/>
                            <ColumnDefinition Width="*"/>
                            <ColumnDefinition Width="Auto"/>
                        </Grid.ColumnDefinitions>
                        <CheckBox x:Name="chkEts2" Grid.Column="0" Content="ETS2:" VerticalAlignment="Center" Margin="0,0,8,0" IsChecked="True"/>
                        <TextBox x:Name="txtEts2Path" Grid.Column="1" Height="24" FontSize="11"/>
                        <Button x:Name="btnBrowseEts2" Style="{StaticResource BtnBase}" Grid.Column="2" Content="Обзор..." Margin="6,0,0,0" Height="24" Padding="8,1"/>
                    </Grid>
                    <TextBlock x:Name="lblEts2Status" Text="Найдено автоматически" FontSize="10.5" Foreground="#38bdf8" Margin="20,0,0,4"/>

                    <!-- ATS -->
                    <Grid Margin="0,0,0,3">
                        <Grid.ColumnDefinitions>
                            <ColumnDefinition Width="Auto"/>
                            <ColumnDefinition Width="*"/>
                            <ColumnDefinition Width="Auto"/>
                        </Grid.ColumnDefinitions>
                        <CheckBox x:Name="chkAts" Grid.Column="0" Content="ATS: " VerticalAlignment="Center" Margin="0,0,8,0" IsChecked="True"/>
                        <TextBox x:Name="txtAtsPath" Grid.Column="1" Height="24" FontSize="11"/>
                        <Button x:Name="btnBrowseAts" Style="{StaticResource BtnBase}" Grid.Column="2" Content="Обзор..." Margin="6,0,0,0" Height="24" Padding="8,1"/>
                    </Grid>
                    <TextBlock x:Name="lblAtsStatus" Text="Найдено автоматически" FontSize="10.5" Foreground="#38bdf8" Margin="20,0,0,4"/>

                    <TextBlock x:Name="lblThirdPartyNote" Text="Напоминание: сторонний rtrucksim_telemetry.dll строго не затрагивается." FontSize="10.5" Foreground="#64748b"/>
                </StackPanel>
            </Border>

            <!-- 3. Профиль стримера -->
            <Border Background="#151b24" BorderBrush="#2a3444" BorderThickness="1" CornerRadius="8" Padding="12,7" Margin="0,0,0,6">
                <StackPanel>
                    <TextBlock x:Name="lblProfile" Text="3. Профиль стримера (записывается в config.js)" FontWeight="Bold" FontSize="12" Foreground="#f59e0b" Margin="0,0,0,4"/>
                    <Grid Margin="0,0,0,4">
                        <Grid.ColumnDefinitions>
                            <ColumnDefinition Width="*"/>
                            <ColumnDefinition Width="12"/>
                            <ColumnDefinition Width="*"/>
                        </Grid.ColumnDefinitions>
                        <StackPanel Grid.Column="0">
                            <TextBlock x:Name="lblDriver" Text="Никнейм стримера:" FontSize="11" Foreground="#94a3b8" Margin="0,0,0,2"/>
                            <TextBox x:Name="txtDriver" Text="STREAMER" Height="25"/>
                        </StackPanel>
                        <StackPanel Grid.Column="2">
                            <TextBlock x:Name="lblTwitch" Text="Канал Twitch:" FontSize="11" Foreground="#94a3b8" Margin="0,0,0,2"/>
                            <TextBox x:Name="txtTwitch" Text="" Height="25"/>
                        </StackPanel>
                    </Grid>

                    <TextBlock x:Name="lblDaToken" Text="Секретный токен DonationAlerts (необязательно):" FontSize="11" Foreground="#94a3b8" Margin="0,0,0,2"/>
                    <Grid>
                        <Grid.ColumnDefinitions>
                            <ColumnDefinition Width="*"/>
                            <ColumnDefinition Width="Auto"/>
                        </Grid.ColumnDefinitions>
                        <PasswordBox x:Name="pwdDaToken" Grid.Column="0" Height="25"/>
                        <TextBox x:Name="txtDaToken" Grid.Column="0" Height="25" Visibility="Collapsed"/>
                        <Button x:Name="btnToggleToken" Style="{StaticResource BtnBase}" Grid.Column="1" Content="Показать" Margin="6,0,0,0" Height="25" Padding="10,1"/>
                    </Grid>
                </StackPanel>
            </Border>

            <!-- 4. Ярлыки и параметры (Включая ярлык Pip-Boy 3000) -->
            <Border Background="#151b24" BorderBrush="#2a3444" BorderThickness="1" CornerRadius="8" Padding="12,7" Margin="0,0,0,6">
                <StackPanel>
                    <TextBlock x:Name="lblOptions" Text="4. Ярлыки и параметры" FontWeight="Bold" FontSize="12" Foreground="#f59e0b" Margin="0,0,0,4"/>
                    <Grid>
                        <Grid.RowDefinitions>
                            <RowDefinition Height="Auto"/>
                            <RowDefinition Height="Auto"/>
                        </Grid.RowDefinitions>
                        <Grid.ColumnDefinitions>
                            <ColumnDefinition Width="*"/>
                            <ColumnDefinition Width="*"/>
                        </Grid.ColumnDefinitions>
                        <CheckBox x:Name="chkShortcut" Grid.Row="0" Grid.Column="0" Content="Ярлык телеметрии на Рабочем столе" IsChecked="True" Margin="0,0,0,4"/>
                        <CheckBox x:Name="chkUpdateShortcut" Grid.Row="0" Grid.Column="1" Content="Ярлык обновления (Pip-Boy) на Рабочем столе" IsChecked="True" Margin="0,0,0,4"/>
                        <CheckBox x:Name="chkOpenFolder" Grid.Row="1" Grid.ColumnSpan="2" Content="Открыть папку установки после завершения" IsChecked="True"/>
                    </Grid>
                </StackPanel>
            </Border>

            <!-- 5. КАРТОЧКА GITHUB STAR И ЦЕНТРАЛЬНАЯ КНОПКА ПОДДЕРЖКИ -->
            <Border Background="#121820" BorderBrush="#f59e0b" BorderThickness="1" CornerRadius="8" Padding="12,8" Margin="0,0,0,6">
                <Grid>
                    <Grid.RowDefinitions>
                        <RowDefinition Height="Auto"/>
                        <RowDefinition Height="Auto"/>
                    </Grid.RowDefinitions>

                    <!-- Блок GitHub Star -->
                    <Grid Grid.Row="0" Margin="0,0,0,8">
                        <Grid.ColumnDefinitions>
                            <ColumnDefinition Width="*"/>
                            <ColumnDefinition Width="Auto"/>
                        </Grid.ColumnDefinitions>
                        <TextBlock x:Name="txtStarTitle" Grid.Column="0" Text="Нравится оверлей? Поддержите проект звездой на GitHub — это очень помогает развитию!"
                                   FontSize="11.5" Foreground="#e2e8f0" TextWrapping="Wrap" VerticalAlignment="Center" Margin="0,0,10,0"/>
                        <Button x:Name="btnStar" Style="{StaticResource BtnStar}" Grid.Column="1" VerticalAlignment="Center">
                            <StackPanel Orientation="Horizontal" VerticalAlignment="Center">
                                <Path Width="14" Height="14" Stretch="Uniform" Fill="#f59e0b" Margin="0,0,6,0" VerticalAlignment="Center"
                                      Data="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/>
                                <TextBlock x:Name="txtStarBtn" Text="ПОСТАВИТЬ ЗВЕЗДУ НА GITHUB" FontWeight="Bold" VerticalAlignment="Center"/>
                            </StackPanel>
                        </Button>
                    </Grid>

                    <!-- ЦЕНТРАЛЬНАЯ КНОПКА ПОДДЕРЖАТЬ ПРОЕКТ -->
                    <Border Grid.Row="1" BorderBrush="#2a3444" BorderThickness="0,1,0,0" Padding="0,8,0,0">
                        <StackPanel HorizontalAlignment="Center">
                            <Button x:Name="btnSupport" Style="{StaticResource BtnSupport}">
                                <StackPanel Orientation="Horizontal" VerticalAlignment="Center">
                                    <Path Width="16" Height="16" Stretch="Uniform" Fill="#ffffff" Margin="0,0,8,0" VerticalAlignment="Center"
                                          Data="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
                                    <TextBlock x:Name="txtSupportBtn" Text="ПОДДЕРЖАТЬ ПРОЕКТ" FontWeight="Bold" FontSize="13" VerticalAlignment="Center"/>
                                </StackPanel>
                            </Button>
                        </StackPanel>
                    </Border>
                </Grid>
            </Border>
        </StackPanel>

        <!-- ПАНЕЛЬ ДЕЙСТВИЙ И ССЫЛОК АВТОРА -->
        <Border Grid.Row="2" Background="#151b24" BorderBrush="#2a3444" BorderThickness="1" CornerRadius="8" Padding="12,8" Margin="0,0,0,6">
            <Grid>
                <Grid.ColumnDefinitions>
                    <ColumnDefinition Width="*"/>
                    <ColumnDefinition Width="Auto"/>
                </Grid.ColumnDefinitions>

                <!-- Ссылки автора и встроенный просмотр документации -->
                <StackPanel Grid.Column="0" Orientation="Horizontal" VerticalAlignment="Center">
                    <TextBlock Text="FooZzee:" FontSize="11" Foreground="#64748b" VerticalAlignment="Center" Margin="0,0,6,0"/>
                    <Button x:Name="linkWeb" Style="{StaticResource BtnBase}" Content="foozzee.ru" Padding="5,2" FontSize="10.5" Margin="0,0,3,0"/>
                    <Button x:Name="linkTwitch" Style="{StaticResource BtnBase}" Content="Twitch" Padding="5,2" FontSize="10.5" Margin="0,0,3,0"/>
                    <Button x:Name="linkYt" Style="{StaticResource BtnBase}" Content="YouTube" Padding="5,2" FontSize="10.5" Margin="0,0,3,0"/>
                    <Button x:Name="linkTg" Style="{StaticResource BtnBase}" Content="Telegram" Padding="5,2" FontSize="10.5" Margin="0,0,3,0"/>
                    <Button x:Name="linkVk" Style="{StaticResource BtnBase}" Content="VK" Padding="5,2" FontSize="10.5" Margin="0,0,6,0"/>
                    <Button x:Name="btnChangelog" Style="{StaticResource BtnBase}" Content="📜 Changelog" Padding="7,2" FontSize="10.5" Margin="0,0,3,0"/>
                    <Button x:Name="btnCommands" Style="{StaticResource BtnBase}" Content="📖 Commands" Padding="7,2" FontSize="10.5"/>
                </StackPanel>

                <!-- Кнопки Закрыть и Установить -->
                <StackPanel Grid.Column="1" Orientation="Horizontal" VerticalAlignment="Center">
                    <Button x:Name="btnCancel" Style="{StaticResource BtnBase}" Content="Закрыть" Margin="0,0,6,0" Height="32"/>
                    <Button x:Name="btnInstall" Style="{StaticResource BtnPrimary}" Content="🚀 УСТАНОВИТЬ ОВЕРЛЕЙ" Height="32"/>
                </StackPanel>
            </Grid>
        </Border>

        <!-- СТАТУСНАЯ СТРОКА В ФУТЕРЕ (ВЕРСИЯ ПАКЕТА И ПОДСКАЗКА OBS) -->
        <Grid Grid.Row="3" Margin="2,0,2,0">
            <Grid.ColumnDefinitions>
                <ColumnDefinition Width="*"/>
                <ColumnDefinition Width="Auto"/>
            </Grid.ColumnDefinitions>
            <TextBlock x:Name="txtFooterVer" Grid.Column="0" Text="Версия пакета: v1.2.2" FontSize="10.5" Foreground="#f59e0b"/>
            <TextBlock x:Name="txtFooterObs" Grid.Column="1" Text="OBS Desktop: 1920x1080 (ets2-desktop.html) • Камера: 346x195 px" FontSize="10.5" Foreground="#64748b"/>
        </Grid>
    </Grid>
</Window>
"@

# 9. Инициализация окна WPF
try {
    $reader = New-Object System.Xml.XmlNodeReader ([xml]$xaml)
    $win = [System.Windows.Markup.XamlReader]::Load($reader)
} catch {
    Write-Error "WPF XAML Load Failed: $_"
    exit 1
}

# Поиск элементов окна
$txtHeaderTitle   = $win.FindName('txtHeaderTitle')
$txtHeaderSub     = $win.FindName('txtHeaderSub')
$txtBadgeVer      = $win.FindName('txtBadgeVer')
$btnLang          = $win.FindName('btnLang')
$lblInstallDir    = $win.FindName('lblInstallDir')
$txtInstallDir    = $win.FindName('txtInstallDir')
$btnBrowseInstall = $win.FindName('btnBrowseInstall')
$lblPlugins       = $win.FindName('lblPlugins')
$chkEts2          = $win.FindName('chkEts2')
$txtEts2Path      = $win.FindName('txtEts2Path')
$btnBrowseEts2    = $win.FindName('btnBrowseEts2')
$lblEts2Status    = $win.FindName('lblEts2Status')
$chkAts           = $win.FindName('chkAts')
$txtAtsPath       = $win.FindName('txtAtsPath')
$btnBrowseAts     = $win.FindName('btnBrowseAts')
$lblAtsStatus     = $win.FindName('lblAtsStatus')
$lblThirdPartyNote= $win.FindName('lblThirdPartyNote')
$lblProfile       = $win.FindName('lblProfile')
$lblDriver        = $win.FindName('lblDriver')
$txtDriver        = $win.FindName('txtDriver')
$lblTwitch        = $win.FindName('lblTwitch')
$txtTwitch        = $win.FindName('txtTwitch')
$lblDaToken       = $win.FindName('lblDaToken')
$pwdDaToken       = $win.FindName('pwdDaToken')
$txtDaToken       = $win.FindName('txtDaToken')
$btnToggleToken   = $win.FindName('btnToggleToken')
$lblOptions       = $win.FindName('lblOptions')
$chkShortcut      = $win.FindName('chkShortcut')
$chkUpdateShortcut= $win.FindName('chkUpdateShortcut')
$chkOpenFolder    = $win.FindName('chkOpenFolder')
$txtStarTitle     = $win.FindName('txtStarTitle')
$btnStar          = $win.FindName('btnStar')
$txtStarBtn       = $win.FindName('txtStarBtn')
$btnSupport       = $win.FindName('btnSupport')
$txtSupportBtn    = $win.FindName('txtSupportBtn')
$linkWeb          = $win.FindName('linkWeb')
$linkTwitch       = $win.FindName('linkTwitch')
$linkYt           = $win.FindName('linkYt')
$linkTg           = $win.FindName('linkTg')
$linkVk           = $win.FindName('linkVk')
$btnChangelog     = $win.FindName('btnChangelog')
$btnCommands      = $win.FindName('btnCommands')
$btnCancel        = $win.FindName('btnCancel')
$btnInstall       = $win.FindName('btnInstall')
$txtFooterVer     = $win.FindName('txtFooterVer')
$txtFooterObs     = $win.FindName('txtFooterObs')

# 10. Функция обновления локализации интерфейса
function Update-Localization {
    $win.Title                = Get-Text 'WindowTitle'
    $txtHeaderTitle.Text      = Get-Text 'HeaderTitle'
    $txtHeaderSub.Text        = Get-Text 'HeaderSubtitle'
    $txtBadgeVer.Text         = Get-Text 'BadgeVersion'
    $btnLang.Content          = Get-Text 'LangBtn'
    $lblInstallDir.Text       = Get-Text 'GrpInstallDir'
    $btnBrowseInstall.Content = Get-Text 'BrowseBtn'
    $lblPlugins.Text          = Get-Text 'GrpPlugins'
    $btnBrowseEts2.Content    = Get-Text 'BrowseBtn'
    $btnBrowseAts.Content     = Get-Text 'BrowseBtn'
    $lblThirdPartyNote.Text   = Get-Text 'ThirdPartyNote'
    $lblProfile.Text          = Get-Text 'GrpProfile'
    $lblDriver.Text           = Get-Text 'LblDriver'
    $lblTwitch.Text           = Get-Text 'LblTwitch'
    $lblDaToken.Text          = Get-Text 'LblDaToken'
    $btnToggleToken.Content   = if ($pwdDaToken.Visibility -eq [System.Windows.Visibility]::Visible) { Get-Text 'BtnShowToken' } else { Get-Text 'BtnHideToken' }
    $lblOptions.Text          = Get-Text 'GrpOptions'
    $chkShortcut.Content      = Get-Text 'ChkShortcut'
    $chkUpdateShortcut.Content= Get-Text 'ChkUpdateShortcut'
    $chkOpenFolder.Content    = Get-Text 'ChkOpenFolder'
    $txtStarTitle.Text        = Get-Text 'StarCardText'
    $txtStarBtn.Text          = Get-Text 'BtnStar'
    $txtSupportBtn.Text       = Get-Text 'BtnSupport'
    $btnChangelog.Content     = Get-Text 'BtnChangelog'
    $btnCommands.Content      = Get-Text 'BtnCommands'
    $btnCancel.Content        = Get-Text 'BtnCancel'
    $btnInstall.Content       = Get-Text 'BtnInstall'
    $txtFooterVer.Text        = Get-Text 'FooterPkgVer'
    $txtFooterObs.Text        = Get-Text 'FooterObsHint'

    if ($txtEts2Path.Text) {
        $lblEts2Status.Text = Get-Text 'PluginFound'
        $lblEts2Status.Foreground = [System.Windows.Media.Brushes]::CornflowerBlue
    } else {
        $lblEts2Status.Text = Get-Text 'PluginMissing'
        $lblEts2Status.Foreground = [System.Windows.Media.Brushes]::Gray
    }
    if ($txtAtsPath.Text) {
        $lblAtsStatus.Text = Get-Text 'PluginFound'
        $lblAtsStatus.Foreground = [System.Windows.Media.Brushes]::CornflowerBlue
    } else {
        $lblAtsStatus.Text = Get-Text 'PluginMissing'
        $lblAtsStatus.Foreground = [System.Windows.Media.Brushes]::Gray
    }
}

# 11. Автопоиск путей к играм ETS2 и ATS
$steamLibs = Get-SteamLibraryPaths
$detectedEts2 = Find-TruckSimInstall -LibraryPaths $steamLibs -FolderName 'Euro Truck Simulator 2' -AppManifestName 'appmanifest_227300.acf'
$detectedAts  = Find-TruckSimInstall -LibraryPaths $steamLibs -FolderName 'American Truck Simulator' -AppManifestName 'appmanifest_270880.acf'

if ($detectedEts2) {
    $txtEts2Path.Text = $detectedEts2
    $chkEts2.IsChecked = $true
} else {
    $chkEts2.IsChecked = $false
}
if ($detectedAts) {
    $txtAtsPath.Text = $detectedAts
    $chkAts.IsChecked = $true
} else {
    $chkAts.IsChecked = $false
}

Update-Localization

# 12. Встроенные модальные WPF-окна для документации (БЕЗ Блокнота)
function Show-WpfDocModal([string]$docTitle, [string]$docFileName) {
    $searchDirs = @(
        $SourceRoot,
        $PSScriptRoot,
        (Split-Path -Parent $PSScriptRoot),
        $txtInstallDir.Text,
        [System.IO.Directory]::GetCurrentDirectory()
    )

    $resolvedPath = $null
    foreach ($dir in $searchDirs) {
        if (-not [string]::IsNullOrWhiteSpace($dir)) {
            $candidate = Join-Path $dir $docFileName
            if (Test-Path -LiteralPath $candidate) {
                $resolvedPath = $candidate
                break
            }
        }
    }

    $fileContent = ''
    if ($resolvedPath -and (Test-Path -LiteralPath $resolvedPath)) {
        try {
            $fileContent = [System.IO.File]::ReadAllText($resolvedPath, [System.Text.Encoding]::UTF8)
        } catch {
            $fileContent = "Error reading file: $($_.Exception.Message)"
        }
    } else {
        $fileContent = if ($script:CurrentLang -eq 'ru') {
            "Файл документации [$docFileName] не найден в каталоге установщика.`r`nПожалуйста, убедитесь, что архив релиза распакован полностью."
        } else {
            "Documentation file [$docFileName] not found in installer directory.`r`nPlease ensure the release archive is fully extracted."
        }
    }

    $modalXaml = @"
<Window xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        Title="$docTitle"
        Height="540" Width="720"
        MinHeight="400" MinWidth="550"
        Background="#0d1117" Foreground="#f1f5f9"
        WindowStartupLocation="CenterOwner"
        FontFamily="Segoe UI, -apple-system, sans-serif"
        ResizeMode="CanResizeWithGrip">
    <Grid Margin="12">
        <Grid.RowDefinitions>
            <RowDefinition Height="Auto"/>
            <RowDefinition Height="*"/>
            <RowDefinition Height="Auto"/>
        </Grid.RowDefinitions>

        <Border Grid.Row="0" Background="#151b24" BorderBrush="#2a3444" BorderThickness="1" CornerRadius="8" Padding="12,8" Margin="0,0,0,8">
            <TextBlock Text="$docTitle" FontWeight="Bold" FontSize="13.5" Foreground="#f59e0b"/>
        </Border>

        <Border Grid.Row="1" Background="#0b0f14" BorderBrush="#2a3444" BorderThickness="1" CornerRadius="8" Padding="4">
            <TextBox x:Name="txtDocContent" Background="Transparent" Foreground="#e2e8f0"
                     BorderThickness="0" FontFamily="Consolas, 'Courier New', monospace"
                     FontSize="12" IsReadOnly="True" TextWrapping="Wrap"
                     VerticalScrollBarVisibility="Auto" Padding="8"/>
        </Border>

        <StackPanel Grid.Row="2" Orientation="Horizontal" HorizontalAlignment="Right" Margin="0,8,0,0">
            <Button x:Name="btnDocClose" Content="$(if ($script:CurrentLang -eq 'ru') { 'Закрыть' } else { 'Close' })"
                    Background="#1f2937" Foreground="#f1f5f9" BorderBrush="#374151" BorderThickness="1"
                    FontWeight="SemiBold" FontSize="12" Padding="18,6" Cursor="Hand" Height="30">
                <Button.Resources>
                    <Style TargetType="Border">
                        <Setter Property="CornerRadius" Value="6"/>
                    </Style>
                </Button.Resources>
            </Button>
        </StackPanel>
    </Grid>
</Window>
"@
    try {
        $mReader = New-Object System.Xml.XmlNodeReader ([xml]$modalXaml)
        $mWin = [System.Windows.Markup.XamlReader]::Load($mReader)
        $mWin.Owner = $win

        $txtBox = $mWin.FindName('txtDocContent')
        if ($txtBox) {
            $txtBox.Text = $fileContent
            $txtBox.ScrollToHome()
        }

        $mCloseBtn = $mWin.FindName('btnDocClose')
        if ($mCloseBtn) {
            $mCloseBtn.Add_Click({ $mWin.Close() })
        }

        $mWin.ShowDialog() | Out-Null
    } catch {
        [System.Windows.MessageBox]::Show($fileContent, $docTitle, [System.Windows.MessageBoxButton]::OK, [System.Windows.MessageBoxImage]::Information)
    }
}

# 13. Обработчики событий элементов интерфейса

# Переключение языка
$btnLang.Add_Click({
    $script:CurrentLang = if ($script:CurrentLang -eq 'ru') { 'en' } else { 'ru' }
    Update-Localization
})

# Обзор папки установки
$btnBrowseInstall.Add_Click({
    $fbd = New-Object System.Windows.Forms.FolderBrowserDialog
    $fbd.Description = Get-Text 'DlgOverlayTitle'
    $fbd.SelectedPath = $txtInstallDir.Text
    if ($fbd.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
        $txtInstallDir.Text = $fbd.SelectedPath
    }
})

# Обзор папки ETS2
$btnBrowseEts2.Add_Click({
    $fbd = New-Object System.Windows.Forms.FolderBrowserDialog
    $fbd.Description = Get-Text 'DlgEts2Title'
    if ($txtEts2Path.Text) { $fbd.SelectedPath = $txtEts2Path.Text }
    if ($fbd.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
        $txtEts2Path.Text = $fbd.SelectedPath
        $chkEts2.IsChecked = $true
        $lblEts2Status.Text = Get-Text 'PluginFound'
        $lblEts2Status.Foreground = [System.Windows.Media.Brushes]::CornflowerBlue
    }
})

# Обзор папки ATS
$btnBrowseAts.Add_Click({
    $fbd = New-Object System.Windows.Forms.FolderBrowserDialog
    $fbd.Description = Get-Text 'DlgAtsTitle'
    if ($txtAtsPath.Text) { $fbd.SelectedPath = $txtAtsPath.Text }
    if ($fbd.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
        $txtAtsPath.Text = $fbd.SelectedPath
        $chkAts.IsChecked = $true
        $lblAtsStatus.Text = Get-Text 'PluginFound'
        $lblAtsStatus.Foreground = [System.Windows.Media.Brushes]::CornflowerBlue
    }
})

# Показать / скрыть токен DonationAlerts
$btnToggleToken.Add_Click({
    if ($pwdDaToken.Visibility -eq [System.Windows.Visibility]::Visible) {
        $txtDaToken.Text = $pwdDaToken.Password
        $pwdDaToken.Visibility = [System.Windows.Visibility]::Collapsed
        $txtDaToken.Visibility = [System.Windows.Visibility]::Visible
        $btnToggleToken.Content = Get-Text 'BtnHideToken'
    } else {
        $pwdDaToken.Password = $txtDaToken.Text
        $txtDaToken.Visibility = [System.Windows.Visibility]::Collapsed
        $pwdDaToken.Visibility = [System.Windows.Visibility]::Visible
        $btnToggleToken.Content = Get-Text 'BtnShowToken'
    }
})

# Поддержка и звезда
$btnStar.Add_Click({
    [System.Diagnostics.Process]::Start('https://github.com/FooZzee/ets2-ats-stream-overlay')
})
$btnSupport.Add_Click({
    [System.Diagnostics.Process]::Start('https://www.donationalerts.com/r/foozzee')
})
$linkWeb.Add_Click({ [System.Diagnostics.Process]::Start('https://foozzee.ru') })
$linkTwitch.Add_Click({ [System.Diagnostics.Process]::Start('https://twitch.tv/foozzee') })
$linkYt.Add_Click({ [System.Diagnostics.Process]::Start('https://youtube.com/@foozzee') })
$linkTg.Add_Click({ [System.Diagnostics.Process]::Start('https://t.me/foozzee_stream') })
$linkVk.Add_Click({ [System.Diagnostics.Process]::Start('https://vk.com/foozzee') })

# Вызов модальных окон документации (строго без Блокнота)
$btnChangelog.Add_Click({
    $docFile = if ($script:CurrentLang -eq 'ru') { 'CHANGELOG.ru.md' } else { 'CHANGELOG.en.md' }
    Show-WpfDocModal (Get-Text 'DocChangelogTitle') $docFile
})
$btnCommands.Add_Click({
    $docFile = if ($script:CurrentLang -eq 'ru') { 'commands.ru.md' } else { 'commands.en.md' }
    Show-WpfDocModal (Get-Text 'DocCommandsTitle') $docFile
})

$btnCancel.Add_Click({
    $win.Close()
})

# 14. Выполнение установки
$btnInstall.Add_Click({
    $instDir = $txtInstallDir.Text.Trim()
    if ([string]::IsNullOrWhiteSpace($instDir)) {
        [System.Windows.MessageBox]::Show((Get-Text 'ErrNoInstallDir'), (Get-Text 'SetupErrorTitle'), [System.Windows.MessageBoxButton]::OK, [System.Windows.MessageBoxImage]::Error)
        return
    }

    if ($chkEts2.IsChecked -and [string]::IsNullOrWhiteSpace($txtEts2Path.Text)) {
        [System.Windows.MessageBox]::Show((Get-Text 'ErrEts2Path'), (Get-Text 'SetupErrorTitle'), [System.Windows.MessageBoxButton]::OK, [System.Windows.MessageBoxImage]::Error)
        return
    }
    if ($chkAts.IsChecked -and [string]::IsNullOrWhiteSpace($txtAtsPath.Text)) {
        [System.Windows.MessageBox]::Show((Get-Text 'ErrAtsPath'), (Get-Text 'SetupErrorTitle'), [System.Windows.MessageBoxButton]::OK, [System.Windows.MessageBoxImage]::Error)
        return
    }

    $daTokenValue = if ($pwdDaToken.Visibility -eq [System.Windows.Visibility]::Visible) { $pwdDaToken.Password } else { $txtDaToken.Text }

    try {
        # Копирование файлов оверлея в выбранную папку
        Copy-OverlayDirectory -SrcDir $SourceRoot -DstDir $instDir

        # Генерация config.js (только если файла ещё нет в целевой папке, чтобы защитить пользовательские настройки)
        $cfgPath = Join-Path $instDir 'config.js'
        if (-not (Test-Path -LiteralPath $cfgPath)) {
            $cfgContent = Build-ConfigJsContent -SelectedLang $script:CurrentLang -DriverName $txtDriver.Text -TwitchName $txtTwitch.Text -DonationAlertsToken $daTokenValue
            [System.IO.File]::WriteAllText($cfgPath, $cfgContent, [System.Text.Encoding]::UTF8)
        }

        $ets2StatusText = Get-Text 'StatusOk'
        $atsStatusText  = Get-Text 'StatusOk'

        # Установка нативного плагина в ETS2
        if ($chkEts2.IsChecked) {
            if (Test-Path $RedistDll) {
                $target = Install-NativePluginToGame -GamePath $txtEts2Path.Text -SourceDll $RedistDll
                $ets2StatusText = "$($Strings[$script:CurrentLang].StatusOk) ($target)"
            } else {
                $ets2StatusText = $Strings[$script:CurrentLang].DllMissingNote
            }
        } else {
            $ets2StatusText = "-"
        }

        # Установка нативного плагина в ATS
        if ($chkAts.IsChecked) {
            if (Test-Path $RedistDll) {
                $target = Install-NativePluginToGame -GamePath $txtAtsPath.Text -SourceDll $RedistDll
                $atsStatusText = "$($Strings[$script:CurrentLang].StatusOk) ($target)"
            } else {
                $atsStatusText = $Strings[$script:CurrentLang].DllMissingNote
            }
        } else {
            $atsStatusText = "-"
        }

        # Создание ярлыков на Рабочем столе
        $desktopDir = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::DesktopDirectory)
        $wsh = New-Object -ComObject WScript.Shell

        # Ярлык телеметрии
        if ($chkShortcut.IsChecked) {
            $scPath = Join-Path $desktopDir "ETS2-ATS Overlay Bridge.lnk"
            $sc = $wsh.CreateShortcut($scPath)
            $sc.TargetPath = Join-Path $instDir 'start-telemetry.bat'
            $sc.WorkingDirectory = $instDir
            $sc.Description = Get-Text 'ShortcutDesc'
            $sc.Save()
        }

        # Ярлык проверки обновлений (Pip-Boy 3000)
        if ($chkUpdateShortcut.IsChecked) {
            $upScPath = Join-Path $desktopDir "ETS2-ATS Overlay Update.lnk"
            $upSc = $wsh.CreateShortcut($upScPath)
            $upSc.TargetPath = Join-Path $instDir 'Update-Overlay.bat'
            $upSc.WorkingDirectory = $instDir
            $upSc.Description = Get-Text 'UpdateShortcutDesc'
            $upSc.Save()
        }

        # Открытие целевой папки
        if ($chkOpenFolder.IsChecked) {
            [System.Diagnostics.Process]::Start('explorer.exe', $instDir)
        }

        # Отчёт об успешной установке
        $resMsg = @"
$([string](Get-Text 'DoneHeader'))
$([string](Get-Text 'DoneSub'))

• $([string](Get-Text 'DoneOverlayLine')) $instDir\ets2-desktop.html [OK]
• $([string](Get-Text 'DoneEts2Line')) $ets2StatusText
• $([string](Get-Text 'DoneAtsLine')) $atsStatusText
• $([string](Get-Text 'DoneShortcutLine')) $(if ($chkShortcut.IsChecked) { '[OK]' } else { '-' })
• $([string](Get-Text 'DoneUpdateScLine')) $(if ($chkUpdateShortcut.IsChecked) { '[OK]' } else { '-' })
• $([string](Get-Text 'DoneDaLine')) $(if ([string]::IsNullOrWhiteSpace($daTokenValue)) { Get-Text 'StatusDaSkipped' } else { Get-Text 'StatusDaOk' })

----------------------------------------------------------------------
$([string](Get-Text 'DoneObsHeader'))
$([string](Get-Text 'DoneObsBody'))
"@
        [System.Windows.MessageBox]::Show($resMsg, (Get-Text 'DoneHeader'), [System.Windows.MessageBoxButton]::OK, [System.Windows.MessageBoxImage]::Information)
        $win.Close()
    } catch {
        [System.Windows.MessageBox]::Show("Error during setup: $_", (Get-Text 'SetupErrorTitle'), [System.Windows.MessageBoxButton]::OK, [System.Windows.MessageBoxImage]::Error)
    }
})

# Запуск GUI приложения
$win.ShowDialog() | Out-Null
