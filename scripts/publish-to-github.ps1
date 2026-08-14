# SwiftShelf One-Click GitHub Publishing Script
# Run from PowerShell to publish SwiftShelf as a dedicated standalone repository

$ErrorActionPreference = "Stop"

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "🚀 PUBLISHING SWIFTSHELF TO GITHUB (LovjyotSingh/SwiftShelf)" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

$CurrentDir = Split-Path -Parent $PSScriptRoot
Set-Location $CurrentDir

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📦 Initializing clean Git repository..." -ForegroundColor Yellow
    git init -b main
}

# Set Git User Config
git config user.name "LovjyotSingh"
git config user.email "187410466+LovjyotSingh@users.noreply.github.com"

# Stage all files
Write-Host "📝 Staging all SwiftShelf platform source files..." -ForegroundColor Yellow
git add .

# Create initial commit
Write-Host "💾 Creating master architecture commit..." -ForegroundColor Yellow
git commit -m "feat: initial release of SwiftShelf - high-concurrency AI e-commerce platform" -q

# Set remote origin
$RemoteUrl = "https://github.com/LovjyotSingh/SwiftShelf.git"
$ExistingRemote = git remote | Where-Object { $_ -eq "origin" }

if ($ExistingRemote) {
    git remote set-url origin $RemoteUrl
} else {
    git remote add origin $RemoteUrl
}

Write-Host "🌐 Configured Remote: $RemoteUrl" -ForegroundColor Green
Write-Host ""
Write-Host "👉 To push to GitHub, ensure the repo 'SwiftShelf' is created on your GitHub profile and run:" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor Yellow -BackgroundColor Black
Write-Host ""
Write-Host "✅ SwiftShelf repository is initialized and ready for deployment!" -ForegroundColor Green
