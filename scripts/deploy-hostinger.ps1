# Hostinger deployment helper script for Windows
# Usage: .\scripts\deploy-hostinger.ps1

Write-Host "🚀 Hostinger Deployment Helper" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

$ErrorActionPreference = "Stop"

function Print-Step {
  param([string]$Message)
  Write-Host "✓ $Message" -ForegroundColor Green
}

function Print-Warning {
  param([string]$Message)
  Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Print-Error {
  param([string]$Message)
  Write-Host "✗ $Message" -ForegroundColor Red
}

# 1. Check if build passes
Write-Host "1️⃣  Checking if build passes..." -ForegroundColor Cyan
try {
  & pnpm build | Out-Null
  Print-Step "Build successful"
} catch {
  Print-Error "Build failed. Please fix errors before deployment."
  exit 1
}

# 2. Check git status
Write-Host ""
Write-Host "2️⃣  Checking git status..." -ForegroundColor Cyan
$gitStatus = & git status --porcelain
if ($gitStatus) {
  Print-Warning "You have uncommitted changes"
  & git status
  $continue = Read-Host "Continue anyway? (y/n)"
  if ($continue -ne "y" -and $continue -ne "Y") {
    exit 1
  }
}

# 3. Backup local database
Write-Host ""
Write-Host "3️⃣  Creating local database backup..." -ForegroundColor Cyan

$DBHost = Read-Host "Database host [127.0.0.1]"
if (-not $DBHost) { $DBHost = "127.0.0.1" }

$DBUser = "root"
$DBName = "czekanski_dev"

$securePass = Read-Host "Database password" -AsSecureString
$DBPass = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($securePass))

$BackupFile = "backup-$(Get-Date -Format 'yyyyMMdd-HHmmss').sql"

try {
  & mysqldump -h $DBHost -u $DBUser -p"$DBPass" $DBName | Out-File -Encoding UTF8 $BackupFile
  Print-Step "Database backup created: $BackupFile"
} catch {
  Print-Warning "mysqldump failed. Make sure MySQL is installed and in PATH"
  Write-Host "You can manually backup using:"
  Write-Host "  mysqldump -h $DBHost -u $DBUser -p -D $DBName > backup.sql"
}

# 4. Git push
Write-Host ""
Write-Host "4️⃣  Pushing to git..." -ForegroundColor Cyan

$GitRemote = Read-Host "Push to which remote? [hostinger]"
if (-not $GitRemote) { $GitRemote = "hostinger" }

try {
  & git push $GitRemote main
  Print-Step "Code pushed successfully"
} catch {
  Print-Error "Git push failed"
  exit 1
}

Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. SSH into your Hostinger server (if needed)"
Write-Host "2. Create .env.production from .env.production.example"
Write-Host "3. Update DATABASE_URL with Hostinger credentials"
Write-Host "4. Run: npm run db:push  (or migrate with Prisma Studio)"
Write-Host "5. Verify the deployment at https://czekanski.dev"
Write-Host ""
Print-Step "Deployment script complete!"
