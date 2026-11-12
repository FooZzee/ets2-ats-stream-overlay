<#
.SYNOPSIS
  Bilingual (EN / RU) WinForms GUI Installer for ETS2 / ATS Stream Overlay (Twitch-only, Native SCS SDK 1.16).
  Двуязычный (EN / RU) графический установщик оверлея ETS2 / ATS (только Twitch, прямой SCS SDK 1.16).
#>
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

[System.Windows.Forms.Application]::EnableVisualStyles()

$ScriptRoot = $PSScriptRoot
$SourceRoot = Split-Path -Parent $ScriptRoot
$RedistDll  = Join-Path $SourceRoot 'redist\scs_direct_telemetry.dll'

$DefaultLang = if ([System.Globalization.CultureInfo]::CurrentUICulture.TwoLetterISOLanguageName -eq 'ru') { 'ru' } else { 'en' }

$Strings = @{
  en = @{
    WindowTitle      = 'ETS2 / ATS Stream Overlay — Setup Wizard'
    HeaderTitle      = 'ETS2 / ATS STREAM OVERLAY'
    HeaderSubtitle   = '2-Row Cockpit HUD • Native SCS SDK 1.16 Telemetry • Twitch Chat & Alerts'
    LangBtnEn        = 'English (EN)'
    LangBtnRu        = 'Русский (RU)'
    GrpInstallDir    = '1. Overlay Installation Folder'
    BrowseBtn        = 'Browse...'
    GrpPlugins       = '2. Telemetry Plugin Installation (scs_direct_telemetry.dll)'
    ChkEts2          = 'Install native SDK telemetry plugin for Euro Truck Simulator 2'
    ChkAts           = 'Install native SDK telemetry plugin for American Truck Simulator'
    PluginFound      = 'Detected automatically'
    PluginMissing    = 'Not detected automatically — check & browse if installed'
    DllMissingNote   = 'Warning: redist\scs_direct_telemetry.dll not found in installer package.'
    GrpProfile       = '3. Streamer Profile (written to config.js)'
    LblDriver        = 'Streamer Nickname'
    LblTwitch        = 'Twitch Channel'
    GrpOptions       = '4. Shortcuts & Finish Options'
    ChkShortcut      = 'Create Desktop Shortcut ("ETS2-ATS Overlay Bridge")'
    ChkOpenFolder    = 'Open installation folder after setup'
    FooterHint       = "OBS Desktop: 1920x1080 (ets2-desktop.html)`r`nWebcam: 346x195 px (16:9) • left: 24 • top: 180"
    BtnCancel        = 'Close'
    BtnInstall       = 'Install'
    AuthorPrefix     = 'Created by FooZzee'
    LinkWebsite      = 'Website (foozzee.ru)'
    LinkTwitch       = 'Twitch'
    LinkYouTube      = 'YouTube'
    LinkTelegram     = 'Telegram'
    LinkVk           = 'VK'
    DlgOverlayTitle  = 'Select overlay installation folder'
    DlgEts2Title     = 'Select Euro Truck Simulator 2 folder (game root, bin\win_x64, or plugins)'
    DlgAtsTitle      = 'Select American Truck Simulator folder (game root, bin\win_x64, or plugins)'
    ErrNoInstallDir  = 'Please specify a valid overlay installation folder.'
    ErrEts2Path      = 'ETS2 plugin installation is checked, but the selected ETS2 folder does not exist.'
    ErrAtsPath       = 'ATS plugin installation is checked, but the selected ATS folder does not exist.'
    StatusOk         = 'Installed'
    StatusOkBak      = 'Installed (legacy plugin -> .bak)'
    StatusSkipped    = 'Skipped'
    StatusWarnNoDll  = 'Skipped (redist\scs_direct_telemetry.dll missing)'
    DoneFormTitle    = 'INSTALLATION COMPLETE // УСТАНОВКА ЗАВЕРШЕНА'
    DoneHeader       = 'INSTALLATION COMPLETE'
    DoneSub          = 'Your ETS2 / ATS cockpit overlay & native SCS SDK 1.16 plugin are ready.'
    DoneOverlayLine  = 'Overlay files & config.js'
    DoneEts2Line     = 'ETS2 Plugin (scs_direct_telemetry.dll)'
    DoneAtsLine      = 'ATS Plugin (scs_direct_telemetry.dll)'
    DoneShortcutLine = 'Desktop Shortcut'
    DoneObsHeader    = 'OBS STUDIO & LAUNCH PARAMETERS'
    DoneObsBody      = "• Desktop Browser Source: 1920x1080  ->  ets2-desktop.html`r`n• Vertical Browser Source: 1080x1920  ->  ets2-vertical.html`r`n• Webcam Source (16:9): 346x195 px  |  left: 24  |  top: 180 (below overlay layer)`r`n• Launch 'ETS2-ATS Overlay Bridge' (start-telemetry.bat) before starting your stream."
    BtnReadReadme    = 'Read README'
    BtnFinishClose   = 'Finish & Close'
    ShortcutDesc     = 'Launch ETS2 / ATS Native SCS SDK Telemetry Bridge for OBS'
    SetupErrorTitle  = 'Installation Error'
  }
  ru = @{
    WindowTitle      = 'ETS2 / ATS Stream Overlay — Мастер установки'
    HeaderTitle      = 'ETS2 / ATS STREAM OVERLAY'
    HeaderSubtitle   = '2-рядная торпеда • Прямой SCS SDK 1.16 • Чат и алерты Twitch'
    LangBtnEn        = 'English (EN)'
    LangBtnRu        = 'Русский (RU)'
    GrpInstallDir    = '1. Папка установки оверлея'
    BrowseBtn        = 'Обзор...'
    GrpPlugins       = '2. Установка нативного плагина телеметрии (scs_direct_telemetry.dll)'
    ChkEts2          = 'Установить плагин телеметрии для Euro Truck Simulator 2'
    ChkAts           = 'Установить плагин телеметрии для American Truck Simulator'
    PluginFound      = 'Найдено автоматически'
    PluginMissing    = 'Не найдено автоматически — отметьте и укажите папку при необходимости'
    DllMissingNote   = 'Внимание: файл redist\scs_direct_telemetry.dll отсутствует в сборке.'
    GrpProfile       = '3. Профиль стримера (записывается в config.js)'
    LblDriver        = 'Никнейм стримера'
    LblTwitch        = 'Канал Twitch'
    GrpOptions       = '4. Ярлыки и завершение'
    ChkShortcut      = 'Создать ярлык на Рабочем столе ("ETS2-ATS Overlay Bridge")'
    ChkOpenFolder    = 'Открыть папку установки после завершения'
    FooterHint       = "OBS Desktop: 1920x1080 (ets2-desktop.html)`r`nКамера: 346x195 px (16:9) • left: 24 • top: 180"
    BtnCancel        = 'Закрыть'
    BtnInstall       = 'Установить'
    AuthorPrefix     = 'Автор проекта: FooZzee'
    LinkWebsite      = 'Сайт (foozzee.ru)'
    LinkTwitch       = 'Twitch'
    LinkYouTube      = 'YouTube'
    LinkTelegram     = 'Telegram'
    LinkVk           = 'VK'
    DlgOverlayTitle  = 'Выберите папку для установки оверлея'
    DlgEts2Title     = 'Выберите папку Euro Truck Simulator 2 (корень игры, bin\win_x64 или plugins)'
    DlgAtsTitle      = 'Выберите папку American Truck Simulator (корень игры, bin\win_x64 или plugins)'
    ErrNoInstallDir  = 'Укажите корректную папку для установки оверлея.'
    ErrEts2Path      = 'Отмечена установка плагина ETS2, но указанная папка ETS2 не найдена.'
    ErrAtsPath       = 'Отмечена установка плагина ATS, но указанная папка ATS не найдена.'
    StatusOk         = 'Установлено'
    StatusOkBak      = 'Установлено (старый плагин -> .bak)'
    StatusSkipped    = 'Пропущено'
    StatusWarnNoDll  = 'Пропущено (нет redist\scs_direct_telemetry.dll)'
    DoneFormTitle    = 'INSTALLATION COMPLETE // УСТАНОВКА ЗАВЕРШЕНА'
    DoneHeader       = 'УСТАНОВКА ЗАВЕРШЕНА'
    DoneSub          = 'Оверлей ETS2 / ATS и нативный плагин SCS SDK 1.16 готовы к работе.'
    DoneOverlayLine  = 'Файлы оверлея и config.js'
    DoneEts2Line     = 'Плагин ETS2 (scs_direct_telemetry.dll)'
    DoneAtsLine      = 'Плагин ATS (scs_direct_telemetry.dll)'
    DoneShortcutLine = 'Ярлык на Рабочем столе'
    DoneObsHeader    = 'ПАРАМЕТРЫ OBS STUDIO И ЗАПУСК'
    DoneObsBody      = "• Desktop-сцена: 1920x1080  ->  ets2-desktop.html`r`n• Вертикальная сцена: 1080x1920  ->  ets2-vertical.html`r`n• Веб-камера (16:9): 346x195 px  |  left: 24  |  top: 180 (слой ниже оверлея)`r`n• Перед стримом запустите ярлык 'ETS2-ATS Overlay Bridge' (start-telemetry.bat)."
    BtnReadReadme    = 'Открыть инструкцию README'
    BtnFinishClose   = 'Готово'
    ShortcutDesc     = 'Запуск прямого HTTP-моста телеметрии ETS2 / ATS (SCS SDK 1.16) для OBS'
    SetupErrorTitle  = 'Ошибка установки'
  }
}

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
          $normalized = $val.Replace('/', '\').TrimEnd('\')
          if (Test-Path -LiteralPath $normalized) {
            $steamRoot = $normalized
            if (-not $libs.Contains($normalized)) { [void]$libs.Add($normalized) }
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
            if ((Test-Path -LiteralPath $p) -and -not $libs.Contains($p)) {
              [void]$libs.Add($p)
            }
          } elseif ($line -match '^\s*"\d+"\s+"([A-Za-z]:\\[^"]+)"') {
            $p = $Matches[1].Replace('\\', '\').Replace('/', '\').TrimEnd('\')
            if ((Test-Path -LiteralPath $p) -and -not $libs.Contains($p)) {
              [void]$libs.Add($p)
            }
          }
        }
      } catch {}
    }
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

  $clean = [string]$SelectedPath
  $clean = $clean.Trim().Trim('"').TrimEnd('\', '/')
  if ([string]::IsNullOrWhiteSpace($clean)) { return $null }

  $leaf = Split-Path -Leaf $clean
  $parentLeaf = Split-Path -Leaf (Split-Path -Parent $clean)

  if ($leaf -ieq 'plugins' -and $parentLeaf -ieq 'win_x64') {
    return $clean
  }
  if ($leaf -ieq 'win_x64' -and $parentLeaf -ieq 'bin') {
    return (Join-Path $clean 'plugins')
  }
  if ($leaf -ieq 'bin') {
    return (Join-Path $clean 'win_x64\plugins')
  }
  if ($leaf -ieq 'plugins') {
    return $clean
  }

  $win64Dir = Join-Path $clean 'bin\win_x64'
  if ((Test-Path -LiteralPath (Join-Path $clean 'bin')) -or (Test-Path -LiteralPath $win64Dir)) {
    return (Join-Path $win64Dir 'plugins')
  }

  return (Join-Path $clean 'bin\win_x64\plugins')
}

function Clean-ChannelInput {
  param(
    [string]$Raw,
    [string]$DomainPattern
  )
  $val = ([string]$Raw).Trim()
  if ([string]::IsNullOrWhiteSpace($val)) { return '' }
  $val = $val -replace '^https?://(?:www\.)?', ''
  if ($DomainPattern) {
    $val = $val -replace $DomainPattern, ''
  }
  $val = $val.TrimStart('@', '/', '#').Split('/')[0].Split('?')[0].Trim()
  return $val
}

function Escape-JsSingleQuote {
  param([string]$Value)
  $s = [string]$Value
  return $s.Replace('\', '\\').Replace("'", "\'").Replace("`r", '').Replace("`n", '')
}

function Copy-OverlayDirectory {
  param(
    [string]$SrcDir,
    [string]$DstDir
  )
  $srcFull = [System.IO.Path]::GetFullPath($SrcDir).TrimEnd('\')
  $dstFull = [System.IO.Path]::GetFullPath($DstDir).TrimEnd('\')
  if ($srcFull -ieq $dstFull) {
    return
  }

  New-Item -ItemType Directory -Force -Path $dstFull | Out-Null
  $topItems = @(
    'ets2-desktop.html',
    'ets2-vertical.html',
    'config.example.js',
    'start-telemetry.bat',
    'Install-Overlay.bat',
    'README.md',
    'README.en.md',
    'README.ru.md',
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
    [string]$TwitchName
  )

  $safeLang     = if ($SelectedLang -eq 'ru') { 'ru' } else { 'en' }
  $driverOut    = if ([string]::IsNullOrWhiteSpace($DriverName)) { 'STREAMER' } else { $DriverName.Trim() }
  $twEnabled    = if ([string]::IsNullOrWhiteSpace($TwitchName)) { 'false' } else { 'true' }
  $minDonate    = if ($safeLang -eq 'ru') { 50 } else { 1 }
  $routeDefault = if ($safeLang -eq 'ru') { 'В РЕЙСЕ // ОНЛАЙН' } else { 'IN TRANSIT // LIVE' }

  $escDriver = Escape-JsSingleQuote $driverOut
  $escTwitch = Escape-JsSingleQuote $TwitchName
  $escRoute  = Escape-JsSingleQuote $routeDefault

  return @"
/**
 * ETS2 / ATS Stream Overlay runtime configuration (generated by Install-Overlay).
 * Рабочая конфигурация оверлея ETS2 / ATS (создано установщиком Install-Overlay).
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
      enabled: false,
      socketToken: ''
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
    cockpitAccentColor: '',
    safeZoneVertical: {
      topPx: 140,
      bottomPx: 370,
      rightPx: 110
    }
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
  param(
    [string]$GamePath,
    [string]$SourceDll,
    [hashtable]$LangStrings
  )

  $pluginsDir = Resolve-TruckPluginDir -SelectedPath $GamePath
  New-Item -ItemType Directory -Force -Path $pluginsDir | Out-Null

  $legacyDll = Join-Path $pluginsDir 'rtrucksim_telemetry.dll'
  $backedUpLegacy = $false
  if (Test-Path -LiteralPath $legacyDll) {
    $bakDll = "$legacyDll.bak"
    if (Test-Path -LiteralPath $bakDll) {
      Remove-Item -LiteralPath $bakDll -Force -ErrorAction SilentlyContinue
    }
    Move-Item -LiteralPath $legacyDll -Destination $bakDll -Force
    $backedUpLegacy = $true
  }

  $targetDll = Join-Path $pluginsDir 'scs_direct_telemetry.dll'
  Copy-Item -LiteralPath $SourceDll -Destination $targetDll -Force

  $prefix = if ($backedUpLegacy) { $LangStrings.StatusOkBak } else { $LangStrings.StatusOk }
  return @{
    Ok   = $true
    Text = "$prefix -> $targetDll"
  }
}

function Show-CompletionModal {
  param(
    [System.Windows.Forms.Form]$OwnerForm,
    [hashtable]$LangStrings,
    [string]$LangCode,
    [string]$TargetDir,
    [hashtable[]]$ChecklistRows
  )

  $cModalBg     = [System.Drawing.Color]::FromArgb(17, 22, 29)
  $cModalCard   = [System.Drawing.Color]::FromArgb(24, 31, 41)
  $cModalBorder = [System.Drawing.Color]::FromArgb(46, 58, 76)
  $cObsCard     = [System.Drawing.Color]::FromArgb(13, 18, 25)

  $doneForm = [System.Windows.Forms.Form]::new()
  $doneForm.Text = $LangStrings.DoneFormTitle
  $doneForm.ClientSize = [System.Drawing.Size]::new(640, 466)
  $doneForm.StartPosition = 'CenterParent'
  $doneForm.FormBorderStyle = 'FixedDialog'
  $doneForm.MaximizeBox = $false
  $doneForm.MinimizeBox = $false
  $doneForm.BackColor = $cModalBg
  $doneForm.ForeColor = $cText
  $doneForm.AutoScaleMode = 'Dpi'

  $hdrPanel = [System.Windows.Forms.Panel]::new()
  $hdrPanel.SetBounds(0, 0, 640, 68)
  $hdrPanel.BackColor = [System.Drawing.Color]::FromArgb(20, 26, 35)
  $doneForm.Controls.Add($hdrPanel)

  $hdrAccent = [System.Windows.Forms.Panel]::new()
  $hdrAccent.SetBounds(0, 66, 640, 2)
  $hdrAccent.BackColor = $cAccent
  $hdrPanel.Controls.Add($hdrAccent)

  $lblDoneHdr = [System.Windows.Forms.Label]::new()
  $lblDoneHdr.SetBounds(22, 12, 596, 26)
  $lblDoneHdr.Font = [System.Drawing.Font]::new('Segoe UI', 12.5, [System.Drawing.FontStyle]::Bold)
  $lblDoneHdr.ForeColor = $cGood
  $lblDoneHdr.Text = "[OK]  $($LangStrings.DoneHeader)"
  $hdrPanel.Controls.Add($lblDoneHdr)

  $lblDoneSub = [System.Windows.Forms.Label]::new()
  $lblDoneSub.SetBounds(22, 40, 596, 18)
  $lblDoneSub.Font = $fSmall
  $lblDoneSub.ForeColor = $cMuted
  $lblDoneSub.Text = $LangStrings.DoneSub
  $hdrPanel.Controls.Add($lblDoneSub)

  # Checklist Card
  $cardCheck = [System.Windows.Forms.Panel]::new()
  $cardCheck.SetBounds(22, 82, 596, 174)
  $cardCheck.BackColor = $cModalCard
  $doneForm.Controls.Add($cardCheck)

  $rowY = 12
  foreach ($row in $ChecklistRows) {
    $badgeLbl = [System.Windows.Forms.Label]::new()
    $badgeLbl.SetBounds(12, $rowY, 44, 18)
    $badgeLbl.Font = [System.Drawing.Font]::new('Consolas', 9, [System.Drawing.FontStyle]::Bold)
    $badgeLbl.ForeColor = if ($row.Ok) { $cGood } else { $cWarn }
    $badgeLbl.Text = if ($row.Ok) { '[OK]' } else { '[--]' }
    $cardCheck.Controls.Add($badgeLbl)

    $titleLbl = [System.Windows.Forms.Label]::new()
    $titleLbl.SetBounds(56, $rowY, 210, 18)
    $titleLbl.Font = [System.Drawing.Font]::new('Segoe UI', 8.5, [System.Drawing.FontStyle]::Bold)
    $titleLbl.ForeColor = $cText
    $titleLbl.Text = $row.Title
    $cardCheck.Controls.Add($titleLbl)

    $valLbl = [System.Windows.Forms.Label]::new()
    $valLbl.SetBounds(268, $rowY, 316, 32)
    $valLbl.Font = $fSmall
    $valLbl.ForeColor = if ($row.Ok) { $cMuted } else { $cWarn }
    $valLbl.Text = $row.Detail
    $cardCheck.Controls.Add($valLbl)

    $rowY += 38
  }

  # OBS Info Card
  $cardObs = [System.Windows.Forms.Panel]::new()
  $cardObs.SetBounds(22, 268, 596, 124)
  $cardObs.BackColor = $cObsCard
  $doneForm.Controls.Add($cardObs)

  $obsAccent = [System.Windows.Forms.Panel]::new()
  $obsAccent.SetBounds(0, 0, 4, 124)
  $obsAccent.BackColor = $cAccent
  $cardObs.Controls.Add($obsAccent)

  $lblObsHdr = [System.Windows.Forms.Label]::new()
  $lblObsHdr.SetBounds(16, 10, 566, 20)
  $lblObsHdr.Font = [System.Drawing.Font]::new('Segoe UI', 9, [System.Drawing.FontStyle]::Bold)
  $lblObsHdr.ForeColor = $cAccent
  $lblObsHdr.Text = $LangStrings.DoneObsHeader
  $cardObs.Controls.Add($lblObsHdr)

  $lblObsBody = [System.Windows.Forms.Label]::new()
  $lblObsBody.SetBounds(16, 34, 566, 80)
  $lblObsBody.Font = $fSmall
  $lblObsBody.ForeColor = $cText
  $lblObsBody.Text = $LangStrings.DoneObsBody
  $cardObs.Controls.Add($lblObsBody)

  # Bottom Action Buttons
  $btnReadme = [System.Windows.Forms.Button]::new()
  $btnReadme.SetBounds(22, 408, 286, 40)
  $btnReadme.FlatStyle = 'Flat'
  $btnReadme.FlatAppearance.BorderColor = $cModalBorder
  $btnReadme.BackColor = $cBtnDark
  $btnReadme.ForeColor = $cText
  $btnReadme.Font = $fBtnBold
  $btnReadme.Cursor = [System.Windows.Forms.Cursors]::Hand
  $btnReadme.Text = $LangStrings.BtnReadReadme
  $doneForm.Controls.Add($btnReadme)

  $btnFinish = [System.Windows.Forms.Button]::new()
  $btnFinish.SetBounds(332, 408, 286, 40)
  $btnFinish.FlatStyle = 'Flat'
  $btnFinish.FlatAppearance.BorderSize = 0
  $btnFinish.BackColor = $cAccent
  $btnFinish.ForeColor = [System.Drawing.Color]::FromArgb(9, 12, 17)
  $btnFinish.Font = $fBtnBold
  $btnFinish.Cursor = [System.Windows.Forms.Cursors]::Hand
  $btnFinish.Text = $LangStrings.BtnFinishClose
  $doneForm.Controls.Add($btnFinish)

  $btnReadme.Add_Click({
    $preferredName = if ($LangCode -eq 'ru') { 'README.ru.md' } else { 'README.en.md' }
    $candidates = @(
      (Join-Path $TargetDir $preferredName),
      (Join-Path $TargetDir 'README.md'),
      (Join-Path $SourceRoot $preferredName),
      (Join-Path $SourceRoot 'README.md')
    )
    foreach ($p in $candidates) {
      if (Test-Path -LiteralPath $p) {
        try {
          Start-Process -FilePath $p
        } catch {
          Start-Process -FilePath 'notepad.exe' -ArgumentList "`"$p`""
        }
        break
      }
    }
  })

  $btnFinish.Add_Click({
    $doneForm.DialogResult = [System.Windows.Forms.DialogResult]::OK
    $doneForm.Close()
  })

  [void]$doneForm.ShowDialog($OwnerForm)
  $doneForm.Dispose()
}

# Detect Steam libraries & games at launch
$steamLibs = Get-SteamLibraryPaths
$detectedEts2 = Find-TruckSimInstall -LibraryPaths $steamLibs -FolderName 'Euro Truck Simulator 2' -AppManifestName 'appmanifest_227300.acf'
$detectedAts  = Find-TruckSimInstall -LibraryPaths $steamLibs -FolderName 'American Truck Simulator' -AppManifestName 'appmanifest_270880.acf'

# Dark Cockpit Palette
$cBg      = [System.Drawing.Color]::FromArgb(14, 19, 27)
$cPanel   = [System.Drawing.Color]::FromArgb(21, 28, 39)
$cHeader  = [System.Drawing.Color]::FromArgb(18, 24, 34)
$cInput   = [System.Drawing.Color]::FromArgb(11, 15, 22)
$cAccent  = [System.Drawing.Color]::FromArgb(255, 158, 27)
$cBtnDark = [System.Drawing.Color]::FromArgb(34, 44, 60)
$cText    = [System.Drawing.Color]::FromArgb(241, 245, 249)
$cMuted   = [System.Drawing.Color]::FromArgb(148, 163, 184)
$cGood    = [System.Drawing.Color]::FromArgb(74, 222, 128)
$cWarn    = [System.Drawing.Color]::FromArgb(251, 191, 36)

$fTitle   = [System.Drawing.Font]::new('Segoe UI', 12, [System.Drawing.FontStyle]::Bold)
$fSub     = [System.Drawing.Font]::new('Segoe UI', 8.5, [System.Drawing.FontStyle]::Regular)
$fGroup   = [System.Drawing.Font]::new('Segoe UI', 9.5, [System.Drawing.FontStyle]::Bold)
$fRegular = [System.Drawing.Font]::new('Segoe UI', 9, [System.Drawing.FontStyle]::Regular)
$fSmall   = [System.Drawing.Font]::new('Segoe UI', 8, [System.Drawing.FontStyle]::Regular)
$fBtnBold = [System.Drawing.Font]::new('Segoe UI', 9.5, [System.Drawing.FontStyle]::Bold)

$form = [System.Windows.Forms.Form]::new()
$form.ClientSize = [System.Drawing.Size]::new(720, 650)
$form.StartPosition = 'CenterScreen'
$form.FormBorderStyle = 'FixedDialog'
$form.MaximizeBox = $false
$form.BackColor = $cBg
$form.ForeColor = $cText
$form.AutoScaleMode = 'Dpi'

# Header Panel
$pnlHeader = [System.Windows.Forms.Panel]::new()
$pnlHeader.SetBounds(0, 0, 720, 62)
$pnlHeader.BackColor = $cHeader
$form.Controls.Add($pnlHeader)

$pnlAccentLine = [System.Windows.Forms.Panel]::new()
$pnlAccentLine.SetBounds(0, 60, 720, 2)
$pnlAccentLine.BackColor = $cAccent
$pnlHeader.Controls.Add($pnlAccentLine)

$lblHeaderTitle = [System.Windows.Forms.Label]::new()
$lblHeaderTitle.SetBounds(18, 10, 415, 24)
$lblHeaderTitle.Font = $fTitle
$lblHeaderTitle.ForeColor = $cAccent
$pnlHeader.Controls.Add($lblHeaderTitle)

$lblHeaderSub = [System.Windows.Forms.Label]::new()
$lblHeaderSub.SetBounds(18, 35, 420, 18)
$lblHeaderSub.Font = $fSub
$lblHeaderSub.ForeColor = $cMuted
$pnlHeader.Controls.Add($lblHeaderSub)

$btnLangEn = [System.Windows.Forms.Button]::new()
$btnLangEn.SetBounds(444, 16, 126, 30)
$btnLangEn.FlatStyle = 'Flat'
$btnLangEn.Font = $fSmall
$btnLangEn.Cursor = [System.Windows.Forms.Cursors]::Hand
$pnlHeader.Controls.Add($btnLangEn)

$btnLangRu = [System.Windows.Forms.Button]::new()
$btnLangRu.SetBounds(576, 16, 126, 30)
$btnLangRu.FlatStyle = 'Flat'
$btnLangRu.Font = $fSmall
$btnLangRu.Cursor = [System.Windows.Forms.Cursors]::Hand
$pnlHeader.Controls.Add($btnLangRu)

function New-DarkGroup {
  param([int]$X, [int]$Y, [int]$W, [int]$H)
  $g = [System.Windows.Forms.GroupBox]::new()
  $g.SetBounds($X, $Y, $W, $H)
  $g.BackColor = $cPanel
  $g.ForeColor = $cAccent
  $g.Font = $fGroup
  return $g
}

function New-DarkTextBox {
  param([int]$X, [int]$Y, [int]$W, [int]$H, [string]$InitialText)
  $t = [System.Windows.Forms.TextBox]::new()
  $t.SetBounds($X, $Y, $W, $H)
  $t.BackColor = $cInput
  $t.ForeColor = $cText
  $t.BorderStyle = 'FixedSingle'
  $t.Font = $fRegular
  $t.Text = $InitialText
  return $t
}

function New-DarkButton {
  param([int]$X, [int]$Y, [int]$W, [int]$H)
  $b = [System.Windows.Forms.Button]::new()
  $b.SetBounds($X, $Y, $W, $H)
  $b.FlatStyle = 'Flat'
  $b.FlatAppearance.BorderColor = [System.Drawing.Color]::FromArgb(58, 72, 94)
  $b.BackColor = $cBtnDark
  $b.ForeColor = $cText
  $b.Font = $fRegular
  $b.Cursor = [System.Windows.Forms.Cursors]::Hand
  return $b
}

function New-LinkButton {
  param([int]$X, [int]$Y, [int]$W, [int]$H, [string]$Url)
  $b = [System.Windows.Forms.Button]::new()
  $b.SetBounds($X, $Y, $W, $H)
  $b.FlatStyle = 'Flat'
  $b.FlatAppearance.BorderColor = [System.Drawing.Color]::FromArgb(50, 64, 86)
  $b.BackColor = [System.Drawing.Color]::FromArgb(24, 32, 45)
  $b.ForeColor = [System.Drawing.Color]::FromArgb(191, 219, 254)
  $b.Font = $fSmall
  $b.Cursor = [System.Windows.Forms.Cursors]::Hand
  $b.Tag = $Url
  $b.Add_Click({
    param($sender, $e)
    $targetUrl = [string]$sender.Tag
    if (-not [string]::IsNullOrWhiteSpace($targetUrl)) {
      Start-Process $targetUrl
    }
  })
  return $b
}

# Group 1: Install Folder
$grpInstall = New-DarkGroup 18 74 684 72
$form.Controls.Add($grpInstall)

$txtInstallDir = New-DarkTextBox 14 28 540 24 'C:\ETS2-ATS-Stream-Overlay'
$grpInstall.Controls.Add($txtInstallDir)

$btnBrowseInstall = New-DarkButton 564 26 106 28
$grpInstall.Controls.Add($btnBrowseInstall)

# Group 2: Plugins (ETS2 & ATS)
$grpPlugins = New-DarkGroup 18 156 684 174
$form.Controls.Add($grpPlugins)

$chkEts2 = [System.Windows.Forms.CheckBox]::new()
$chkEts2.SetBounds(14, 24, 430, 22)
$chkEts2.Font = $fRegular
$chkEts2.ForeColor = $cText
$chkEts2.Checked = (-not [string]::IsNullOrWhiteSpace($detectedEts2))
$grpPlugins.Controls.Add($chkEts2)

$lblEts2Status = [System.Windows.Forms.Label]::new()
$lblEts2Status.SetBounds(448, 26, 222, 18)
$lblEts2Status.Font = $fSmall
$lblEts2Status.TextAlign = 'MiddleRight'
$lblEts2Status.ForeColor = if ($detectedEts2) { $cGood } else { $cMuted }
$grpPlugins.Controls.Add($lblEts2Status)

$txtEts2Dir = New-DarkTextBox 14 50 540 24 $detectedEts2
$grpPlugins.Controls.Add($txtEts2Dir)

$btnBrowseEts2 = New-DarkButton 564 48 106 28
$grpPlugins.Controls.Add($btnBrowseEts2)

$chkAts = [System.Windows.Forms.CheckBox]::new()
$chkAts.SetBounds(14, 86, 430, 22)
$chkAts.Font = $fRegular
$chkAts.ForeColor = $cText
$chkAts.Checked = (-not [string]::IsNullOrWhiteSpace($detectedAts))
$grpPlugins.Controls.Add($chkAts)

$lblAtsStatus = [System.Windows.Forms.Label]::new()
$lblAtsStatus.SetBounds(448, 88, 222, 18)
$lblAtsStatus.Font = $fSmall
$lblAtsStatus.TextAlign = 'MiddleRight'
$lblAtsStatus.ForeColor = if ($detectedAts) { $cGood } else { $cMuted }
$grpPlugins.Controls.Add($lblAtsStatus)

$txtAtsDir = New-DarkTextBox 14 112 540 24 $detectedAts
$grpPlugins.Controls.Add($txtAtsDir)

$btnBrowseAts = New-DarkButton 564 110 106 28
$grpPlugins.Controls.Add($btnBrowseAts)

$lblDllWarning = [System.Windows.Forms.Label]::new()
$lblDllWarning.SetBounds(14, 144, 656, 20)
$lblDllWarning.Font = $fSmall
$lblDllWarning.ForeColor = $cWarn
$lblDllWarning.Visible = (-not (Test-Path -LiteralPath $RedistDll))
$grpPlugins.Controls.Add($lblDllWarning)

# Group 3: Streamer Profile (2 Twitch-only fields)
$grpProfile = New-DarkGroup 18 340 684 82
$form.Controls.Add($grpProfile)

$lblDriver = [System.Windows.Forms.Label]::new()
$lblDriver.SetBounds(14, 22, 320, 18)
$lblDriver.Font = $fSmall
$lblDriver.ForeColor = $cMuted
$grpProfile.Controls.Add($lblDriver)

$txtDriver = New-DarkTextBox 14 42 320 24 'STREAMER'
$grpProfile.Controls.Add($txtDriver)

$lblTwitch = [System.Windows.Forms.Label]::new()
$lblTwitch.SetBounds(350, 22, 320, 18)
$lblTwitch.Font = $fSmall
$lblTwitch.ForeColor = $cMuted
$grpProfile.Controls.Add($lblTwitch)

$txtTwitch = New-DarkTextBox 350 42 320 24 ''
$grpProfile.Controls.Add($txtTwitch)

# Group 4: Options
$grpOptions = New-DarkGroup 18 432 684 78
$form.Controls.Add($grpOptions)

$chkShortcut = [System.Windows.Forms.CheckBox]::new()
$chkShortcut.SetBounds(14, 22, 656, 22)
$chkShortcut.Font = $fRegular
$chkShortcut.ForeColor = $cText
$chkShortcut.Checked = $true
$grpOptions.Controls.Add($chkShortcut)

$chkOpenFolder = [System.Windows.Forms.CheckBox]::new()
$chkOpenFolder.SetBounds(14, 47, 656, 22)
$chkOpenFolder.Font = $fRegular
$chkOpenFolder.ForeColor = $cText
$chkOpenFolder.Checked = $true
$grpOptions.Controls.Add($chkOpenFolder)

# Main Action Controls
$lblFooterHint = [System.Windows.Forms.Label]::new()
$lblFooterHint.SetBounds(20, 522, 430, 38)
$lblFooterHint.Font = $fSmall
$lblFooterHint.ForeColor = $cMuted
$form.Controls.Add($lblFooterHint)

$btnCancel = New-DarkButton 464 522 108 38
$form.Controls.Add($btnCancel)

$btnInstall = [System.Windows.Forms.Button]::new()
$btnInstall.SetBounds(582, 520, 120, 40)
$btnInstall.FlatStyle = 'Flat'
$btnInstall.FlatAppearance.BorderSize = 0
$btnInstall.BackColor = $cAccent
$btnInstall.ForeColor = [System.Drawing.Color]::FromArgb(9, 12, 17)
$btnInstall.Font = $fBtnBold
$btnInstall.Cursor = [System.Windows.Forms.Cursors]::Hand
$form.Controls.Add($btnInstall)

# Author Footer Strip
$pnlAuthor = [System.Windows.Forms.Panel]::new()
$pnlAuthor.SetBounds(0, 576, 720, 74)
$pnlAuthor.BackColor = $cHeader
$form.Controls.Add($pnlAuthor)

$pnlAuthorLine = [System.Windows.Forms.Panel]::new()
$pnlAuthorLine.SetBounds(0, 0, 720, 1)
$pnlAuthorLine.BackColor = [System.Drawing.Color]::FromArgb(42, 54, 72)
$pnlAuthor.Controls.Add($pnlAuthorLine)

$lblAuthor = [System.Windows.Forms.Label]::new()
$lblAuthor.SetBounds(18, 9, 684, 18)
$lblAuthor.Font = [System.Drawing.Font]::new('Segoe UI', 8.5, [System.Drawing.FontStyle]::Bold)
$lblAuthor.ForeColor = $cMuted
$pnlAuthor.Controls.Add($lblAuthor)

$lnkWebsite  = New-LinkButton 18  32 162 28 'https://foozzee.ru/'
$lnkTwitch   = New-LinkButton 188 32 118 28 'https://www.twitch.tv/foozzee'
$lnkYouTube  = New-LinkButton 314 32 122 28 'https://www.youtube.com/@foozzee'
$lnkTelegram = New-LinkButton 444 32 126 28 'https://t.me/foozzeestream'
$lnkVk       = New-LinkButton 578 32 124 28 'https://vk.ru/gtfun'

$pnlAuthor.Controls.Add($lnkWebsite)
$pnlAuthor.Controls.Add($lnkTwitch)
$pnlAuthor.Controls.Add($lnkYouTube)
$pnlAuthor.Controls.Add($lnkTelegram)
$pnlAuthor.Controls.Add($lnkVk)

$script:CurrentLang = $DefaultLang

function Apply-UiLanguage {
  param([string]$LangCode)

  $script:CurrentLang = if ($LangCode -eq 'ru') { 'ru' } else { 'en' }
  $L = $Strings[$script:CurrentLang]

  $form.Text             = $L.WindowTitle
  $lblHeaderTitle.Text   = $L.HeaderTitle
  $lblHeaderSub.Text     = $L.HeaderSubtitle
  $btnLangEn.Text        = $L.LangBtnEn
  $btnLangRu.Text        = $L.LangBtnRu
  $grpInstall.Text       = $L.GrpInstallDir
  $btnBrowseInstall.Text = $L.BrowseBtn
  $grpPlugins.Text       = $L.GrpPlugins
  $chkEts2.Text          = $L.ChkEts2
  $chkAts.Text           = $L.ChkAts
  $lblEts2Status.Text    = if ([string]::IsNullOrWhiteSpace($txtEts2Dir.Text)) { $L.PluginMissing } elseif ($detectedEts2 -and $txtEts2Dir.Text -eq $detectedEts2) { $L.PluginFound } else { '' }
  $lblAtsStatus.Text     = if ([string]::IsNullOrWhiteSpace($txtAtsDir.Text)) { $L.PluginMissing } elseif ($detectedAts -and $txtAtsDir.Text -eq $detectedAts) { $L.PluginFound } else { '' }
  $btnBrowseEts2.Text    = $L.BrowseBtn
  $btnBrowseAts.Text     = $L.BrowseBtn
  $lblDllWarning.Text    = $L.DllMissingNote
  $grpProfile.Text       = $L.GrpProfile
  $lblDriver.Text        = $L.LblDriver
  $lblTwitch.Text        = $L.LblTwitch
  $grpOptions.Text       = $L.GrpOptions
  $chkShortcut.Text      = $L.ChkShortcut
  $chkOpenFolder.Text    = $L.ChkOpenFolder
  $lblFooterHint.Text    = $L.FooterHint
  $btnCancel.Text        = $L.BtnCancel
  $btnInstall.Text       = $L.BtnInstall
  $lblAuthor.Text        = $L.AuthorPrefix
  $lnkWebsite.Text       = $L.LinkWebsite
  $lnkTwitch.Text        = $L.LinkTwitch
  $lnkYouTube.Text       = $L.LinkYouTube
  $lnkTelegram.Text      = $L.LinkTelegram
  $lnkVk.Text            = $L.LinkVk

  if ($script:CurrentLang -eq 'en') {
    $btnLangEn.BackColor = $cAccent
    $btnLangEn.ForeColor = [System.Drawing.Color]::FromArgb(9, 12, 17)
    $btnLangEn.FlatAppearance.BorderColor = $cAccent
    $btnLangRu.BackColor = $cBtnDark
    $btnLangRu.ForeColor = $cText
    $btnLangRu.FlatAppearance.BorderColor = [System.Drawing.Color]::FromArgb(58, 72, 94)
  } else {
    $btnLangRu.BackColor = $cAccent
    $btnLangRu.ForeColor = [System.Drawing.Color]::FromArgb(9, 12, 17)
    $btnLangRu.FlatAppearance.BorderColor = $cAccent
    $btnLangEn.BackColor = $cBtnDark
    $btnLangEn.ForeColor = $cText
    $btnLangEn.FlatAppearance.BorderColor = [System.Drawing.Color]::FromArgb(58, 72, 94)
  }
}

function Select-FolderDialog {
  param(
    [string]$Description,
    [System.Windows.Forms.TextBox]$TargetBox
  )
  $dlg = [System.Windows.Forms.FolderBrowserDialog]::new()
  $dlg.Description = $Description
  $dlg.ShowNewFolderButton = $true
  if (-not [string]::IsNullOrWhiteSpace($TargetBox.Text) -and (Test-Path -LiteralPath $TargetBox.Text)) {
    $dlg.SelectedPath = $TargetBox.Text
  }
  if ($dlg.ShowDialog($form) -eq [System.Windows.Forms.DialogResult]::OK) {
    $TargetBox.Text = $dlg.SelectedPath
  }
  $dlg.Dispose()
}

$btnLangEn.Add_Click({ Apply-UiLanguage 'en' })
$btnLangRu.Add_Click({ Apply-UiLanguage 'ru' })

$btnBrowseInstall.Add_Click({
  Select-FolderDialog -Description $Strings[$script:CurrentLang].DlgOverlayTitle -TargetBox $txtInstallDir
})
$btnBrowseEts2.Add_Click({
  Select-FolderDialog -Description $Strings[$script:CurrentLang].DlgEts2Title -TargetBox $txtEts2Dir
  if (-not [string]::IsNullOrWhiteSpace($txtEts2Dir.Text)) {
    $chkEts2.Checked = $true
    $lblEts2Status.Text = ''
  }
})
$btnBrowseAts.Add_Click({
  Select-FolderDialog -Description $Strings[$script:CurrentLang].DlgAtsTitle -TargetBox $txtAtsDir
  if (-not [string]::IsNullOrWhiteSpace($txtAtsDir.Text)) {
    $chkAts.Checked = $true
    $lblAtsStatus.Text = ''
  }
})

$btnCancel.Add_Click({ $form.Close() })

$btnInstall.Add_Click({
  $L = $Strings[$script:CurrentLang]

  $targetDir = $txtInstallDir.Text.Trim().Trim('"')
  if ([string]::IsNullOrWhiteSpace($targetDir)) {
    [System.Windows.Forms.MessageBox]::Show($form, $L.ErrNoInstallDir, $L.SetupErrorTitle, 'OK', 'Warning') | Out-Null
    return
  }

  if ($chkEts2.Checked) {
    $ets2Input = $txtEts2Dir.Text.Trim().Trim('"')
    if ([string]::IsNullOrWhiteSpace($ets2Input) -or -not (Test-Path -LiteralPath $ets2Input)) {
      [System.Windows.Forms.MessageBox]::Show($form, $L.ErrEts2Path, $L.SetupErrorTitle, 'OK', 'Warning') | Out-Null
      return
    }
  }

  if ($chkAts.Checked) {
    $atsInput = $txtAtsDir.Text.Trim().Trim('"')
    if ([string]::IsNullOrWhiteSpace($atsInput) -or -not (Test-Path -LiteralPath $atsInput)) {
      [System.Windows.Forms.MessageBox]::Show($form, $L.ErrAtsPath, $L.SetupErrorTitle, 'OK', 'Warning') | Out-Null
      return
    }
  }

  $btnInstall.Enabled = $false
  try {
    # 1. Copy overlay files & write config.js
    Copy-OverlayDirectory -SrcDir $SourceRoot -DstDir $targetDir
    $twitchClean = Clean-ChannelInput -Raw $txtTwitch.Text -DomainPattern '^twitch\.tv/'
    $configBody  = Build-ConfigJsContent `
      -SelectedLang $script:CurrentLang `
      -DriverName $txtDriver.Text `
      -TwitchName $twitchClean

    $utf8NoBom = [System.Text.UTF8Encoding]::new($false)
    [System.IO.File]::WriteAllText((Join-Path $targetDir 'config.js'), $configBody, $utf8NoBom)
    $overlayOk = $true
    $overlayReport = "$($L.StatusOk) -> $targetDir ($($script:CurrentLang.ToUpperInvariant()))"

    # 2. Install scs_direct_telemetry.dll into selected games (and migrate legacy rtrucksim_telemetry.dll -> .bak)
    $hasDll = Test-Path -LiteralPath $RedistDll
    $ets2Ok = $false
    $ets2Report = $L.StatusSkipped
    if ($chkEts2.Checked) {
      if (-not $hasDll) {
        $ets2Report = $L.StatusWarnNoDll
      } else {
        $resEts2 = Install-NativePluginToGame -GamePath $txtEts2Dir.Text -SourceDll $RedistDll -LangStrings $L
        $ets2Ok = $resEts2.Ok
        $ets2Report = $resEts2.Text
      }
    }

    $atsOk = $false
    $atsReport = $L.StatusSkipped
    if ($chkAts.Checked) {
      if (-not $hasDll) {
        $atsReport = $L.StatusWarnNoDll
      } else {
        $resAts = Install-NativePluginToGame -GamePath $txtAtsDir.Text -SourceDll $RedistDll -LangStrings $L
        $atsOk = $resAts.Ok
        $atsReport = $resAts.Text
      }
    }

    # 3. Desktop shortcut
    $shortcutOk = $false
    $shortcutReport = $L.StatusSkipped
    if ($chkShortcut.Checked) {
      $desktopDir = [Environment]::GetFolderPath('Desktop')
      $lnkPath = Join-Path $desktopDir 'ETS2-ATS Overlay Bridge.lnk'
      $batPath = Join-Path $targetDir 'start-telemetry.bat'
      $shell = New-Object -ComObject WScript.Shell
      $shortcut = $shell.CreateShortcut($lnkPath)
      $shortcut.TargetPath = $batPath
      $shortcut.WorkingDirectory = $targetDir
      $shortcut.Description = $L.ShortcutDesc
      $shortcut.Save()
      $shortcutOk = $true
      $shortcutReport = "$($L.StatusOk) -> $lnkPath"
    }

    if ($chkOpenFolder.Checked) {
      Start-Process explorer.exe -ArgumentList "`"$targetDir`""
    }

    $checklist = @(
      @{ Title = $L.DoneOverlayLine;  Detail = $overlayReport;  Ok = $overlayOk },
      @{ Title = $L.DoneEts2Line;     Detail = $ets2Report;     Ok = $ets2Ok },
      @{ Title = $L.DoneAtsLine;      Detail = $atsReport;      Ok = $atsOk },
      @{ Title = $L.DoneShortcutLine; Detail = $shortcutReport; Ok = $shortcutOk }
    )

    Show-CompletionModal `
      -OwnerForm $form `
      -LangStrings $L `
      -LangCode $script:CurrentLang `
      -TargetDir $targetDir `
      -ChecklistRows $checklist

    $form.Close()
  } catch {
    [System.Windows.Forms.MessageBox]::Show($form, $_.Exception.Message, $L.SetupErrorTitle, 'OK', 'Error') | Out-Null
  } finally {
    $btnInstall.Enabled = $true
  }
})

Apply-UiLanguage $DefaultLang
[void]$form.ShowDialog()
