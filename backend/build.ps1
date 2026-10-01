# build.ps1 - Membuild dan menjalankan seluruh stack TravelKu (backend + frontend)
# Usage: powershell -ExecutionPolicy Bypass -File build.ps1
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

function Wait-Docker {
    Write-Host "Menunggu Docker daemon siap..." -ForegroundColor Yellow
    for ($i = 0; $i -lt 60; $i++) {
        docker info *> $null
        if ($LASTEXITCODE -eq 0) { Write-Host "Docker daemon siap." -ForegroundColor Green; return }
        Start-Sleep -Seconds 5
    }
    Write-Error "Docker daemon tidak mau jalan. Buka Docker Desktop lalu ulangi."
}

# Kalau Docker Desktop belum berjalan, coba buka
docker info *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker Desktop tidak terdeteksi. Mencoba membuka..." -ForegroundColor Yellow
    $dd = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    $ddAlt = "$env:ProgramFiles\Docker\Docker\Docker Desktop.exe"
    $ddUser = "$env:LOCALAPPDATA\Programs\DockerDesktop\Docker Desktop.exe"
    if (Test-Path $dd) { Start-Process $dd }
    elseif (Test-Path $ddAlt) { Start-Process $ddAlt }
    elseif (Test-Path $ddUser) { Start-Process $ddUser }
    else { Write-Error "Docker Desktop tidak ditemukan. Buka manual dulu." }
    Wait-Docker
}

Write-Host ">>> Membuild & menjalankan semua service (membutuhkan waktu pada build pertama)..." -ForegroundColor Cyan
docker compose up --build -d
if ($LASTEXITCODE -ne 0) { Write-Error "docker compose up gagal." }

Write-Host ""
Write-Host "===============================================" -ForegroundColor Green
Write-Host "  TravelKu siap!" -ForegroundColor Green
Write-Host "  Frontend : http://localhost:5173" -ForegroundColor Green
Write-Host "  Gateway  : http://localhost:8000" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green