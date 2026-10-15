# ==============================================================================
# SCRIPT KHOI CHAY n8n TREN LOCALHOST
# ==============================================================================

Write-Host "Dang khoi dong n8n tren Localhost..." -ForegroundColor Cyan

# Cap nhat PATH de nhan dien Node.js va npm
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Dat timezone Viet Nam
$env:GENERIC_TIMEZONE = "Asia/Ho_Chi_Minh"

# Khoi chay n8n tren port 5678
Write-Host "==========================================================" -ForegroundColor Green
Write-Host " n8n dang chay tai: http://localhost:5678" -ForegroundColor Green
Write-Host " Nhan Ctrl+C de dung server n8n." -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Green

npx.cmd -y n8n
