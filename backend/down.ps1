# down.ps1 - Menghentikan seluruh container TravelKu (data di host DB tetap aman)
# Usage: powershell -ExecutionPolicy Bypass -File down.ps1
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

docker compose down
Write-Host "Semua container TravelKu dihentikan." -ForegroundColor Green