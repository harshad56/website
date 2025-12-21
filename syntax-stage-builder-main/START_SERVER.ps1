# Script to start servers on correct ports
Write-Host "🚀 Starting CodeAcademy Pro Servers..." -ForegroundColor Green
Write-Host ""

# Kill any processes on ports 3000 and 5000
Write-Host "Clearing ports 3000 and 5000..." -ForegroundColor Yellow

# Kill port 3000
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    $pid3000 = $port3000.OwningProcess
    Stop-Process -Id $pid3000 -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Cleared port 3000" -ForegroundColor Green
}

# Kill port 5000
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($port5000) {
    $pid5000 = $port5000.OwningProcess
    Stop-Process -Id $pid5000 -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Cleared port 5000" -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting servers..." -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  IMPORTANT: Open TWO terminal windows!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Terminal 1 - Backend:" -ForegroundColor White
Write-Host "  cd syntax-stage-builder-main\backend" -ForegroundColor Gray
Write-Host "  npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "Terminal 2 - Frontend:" -ForegroundColor White
Write-Host "  cd syntax-stage-builder-main" -ForegroundColor Gray
Write-Host "  npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "Then open: http://localhost:3000 or http://192.168.0.102:3000" -ForegroundColor Green
Write-Host ""


