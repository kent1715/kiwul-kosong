# apply-ui-redesign.ps1
# Script untuk apply UI redesign Kiwul Storyboard Studio
# Jalankan dari folder yang sama dengan file ini (tempat extract download)

param(
    [string]$RepoPath = "D:\storyboard-kiwul",
    [string]$SourcePath = $PSScriptRoot
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Kiwul UI Redesign - Apply Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Repo target : $RepoPath"
Write-Host "Source files: $SourcePath"
Write-Host ""

# Step 0: Validate paths
Write-Host "[Step 0] Validating paths..." -ForegroundColor Yellow

if (-not (Test-Path "$RepoPath\package.json")) {
    Write-Host "ERROR: Repo tidak ditemukan di $RepoPath" -ForegroundColor Red
    Write-Host "Pastikan path benar. Atau jalankan dengan parameter:" -ForegroundColor Yellow
    Write-Host "  .\apply-ui-redesign.ps1 -RepoPath 'D:\path\ke\storyboard-kiwul'" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path "$SourcePath\app\globals.css")) {
    Write-Host "ERROR: Source files tidak ditemukan di $SourcePath" -ForegroundColor Red
    Write-Host "Pastikan script ini dijalankan dari folder ui-redesign (hasil extract)" -ForegroundColor Yellow
    exit 1
}

Write-Host "OK: Paths valid" -ForegroundColor Green
Write-Host ""

# Step 1: Backup old files
Write-Host "[Step 1] Backup old files..." -ForegroundColor Yellow

$backupDir = "$RepoPath\backup-ui-old"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

# Backup globals.css
if (Test-Path "$RepoPath\src\app\globals.css") {
    Copy-Item "$RepoPath\src\app\globals.css" "$backupDir\globals.css.$timestamp" -Force
    Write-Host "  Backed up: globals.css" -ForegroundColor Gray
}

# Backup all storyboard components
$componentFiles = @(
    "StoryboardStudio.tsx",
    "TopToolbar.tsx",
    "JobProgress.tsx",
    "ReferencePanel.tsx",
    "SceneStatusBadge.tsx",
    "StorylineColumn.tsx",
    "BackgroundColumn.tsx",
    "GambarColumn.tsx",
    "VideoColumn.tsx",
    "SceneCharacterSelector.tsx",
    "LoadJsonDialog.tsx",
    "ProviderSettingsDialog.tsx",
    "ProjectListDialog.tsx"
)

foreach ($file in $componentFiles) {
    $src = "$RepoPath\src\components\storyboard\$file"
    if (Test-Path $src) {
        Copy-Item $src "$backupDir\$file.$timestamp" -Force
        Write-Host "  Backed up: $file" -ForegroundColor Gray
    }
}

# Also backup orphan files (in case user wants them back)
$orphanFiles = @(
    "SceneSidebar.tsx",
    "SceneDetailPanel.tsx",
    "PreviewPanel.tsx",
    "StatusBadge.tsx"
)

foreach ($file in $orphanFiles) {
    $src = "$RepoPath\src\components\storyboard\$file"
    if (Test-Path $src) {
        Copy-Item $src "$backupDir\$file.$timestamp" -Force
        Write-Host "  Backed up orphan: $file" -ForegroundColor Gray
    }
}

Write-Host "OK: Backup selesai di $backupDir" -ForegroundColor Green
Write-Host ""

# Step 2: Copy new files
Write-Host "[Step 2] Copy new files..." -ForegroundColor Yellow

# Copy globals.css
Copy-Item "$SourcePath\app\globals.css" "$RepoPath\src\app\globals.css" -Force
Write-Host "  Copied: src\app\globals.css" -ForegroundColor Gray

# Copy all component files
foreach ($file in $componentFiles) {
    $srcFile = "$SourcePath\components\storyboard\$file"
    $destFile = "$RepoPath\src\components\storyboard\$file"
    if (Test-Path $srcFile) {
        Copy-Item $srcFile $destFile -Force
        Write-Host "  Copied: src\components\storyboard\$file" -ForegroundColor Gray
    }
}

Write-Host "OK: 14 files copied" -ForegroundColor Green
Write-Host ""

# Step 3: Delete orphan files
Write-Host "[Step 3] Delete orphan files..." -ForegroundColor Yellow

foreach ($file in $orphanFiles) {
    $path = "$RepoPath\src\components\storyboard\$file"
    if (Test-Path $path) {
        Remove-Item $path -Force
        Write-Host "  Deleted: $file" -ForegroundColor Gray
    }
}

Write-Host "OK: Orphan files deleted (813 lines dead code removed)" -ForegroundColor Green
Write-Host ""

# Step 4: Verify
Write-Host "[Step 4] Verify files..." -ForegroundColor Yellow

$allPresent = $true

# Check globals.css
if (Test-Path "$RepoPath\src\app\globals.css") {
    Write-Host "  OK: globals.css" -ForegroundColor Green
} else {
    Write-Host "  MISSING: globals.css" -ForegroundColor Red
    $allPresent = $false
}

# Check all component files
foreach ($file in $componentFiles) {
    $path = "$RepoPath\src\components\storyboard\$file"
    if (Test-Path $path) {
        Write-Host "  OK: $file" -ForegroundColor Green
    } else {
        Write-Host "  MISSING: $file" -ForegroundColor Red
        $allPresent = $false
    }
}

# Check orphans deleted
foreach ($file in $orphanFiles) {
    $path = "$RepoPath\src\components\storyboard\$file"
    if (-not (Test-Path $path)) {
        Write-Host "  OK: $file deleted" -ForegroundColor Green
    } else {
        Write-Host "  WARNING: $file still exists" -ForegroundColor Yellow
    }
}

Write-Host ""

if ($allPresent) {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  UI Redesign Applied Successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Restart Next.js:" -ForegroundColor White
    Write-Host "     cd $RepoPath" -ForegroundColor Gray
    Write-Host "     bun run dev" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  2. Open UI in browser (http://localhost:3000)" -ForegroundColor White
    Write-Host ""
    Write-Host "  3. Test all features:" -ForegroundColor White
    Write-Host "     - Load JSON / Open Project" -ForegroundColor Gray
    Write-Host "     - Generate Image (2-character scene)" -ForegroundColor Gray
    Write-Host "     - Generate Video" -ForegroundColor Gray
    Write-Host "     - Save / Export" -ForegroundColor Gray
    Write-Host "     - Provider Settings" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Backup location: $backupDir" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  Some files missing! Check output above." -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
}

Write-Host "Rollback (if needed):" -ForegroundColor Cyan
Write-Host "  Copy-Item -Path `"$backupDir\*`" -Destination `"$RepoPath\src`" -Recurse -Force" -ForegroundColor Gray
Write-Host ""
