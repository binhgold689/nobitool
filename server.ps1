# Simple Local HTTP Server for OmniAffiliate Dashboard using Native PowerShell
$port = 8080
$path = Resolve-Path "$PSScriptRoot\dashboard"

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host " OmniAffiliate Dashboard is running on localhost!" -ForegroundColor Green
    Write-Host " URL: $prefix" -ForegroundColor Cyan
    Write-Host " Folder: $path" -ForegroundColor Yellow
    Write-Host " Nhan Ctrl+C de dung server." -ForegroundColor Gray
    Write-Host "==========================================================" -ForegroundColor Green

    # Tu dong mo trinh duyet
    Start-Process $prefix

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($urlPath) -or $urlPath -eq "/") {
            $urlPath = "index.html"
        }

        $localFilePath = Join-Path $path $urlPath

        if (Test-Path $localFilePath -PathType Leaf) {
            $contentBytes = [System.IO.File]::ReadAllBytes($localFilePath)
            $extension = [System.IO.Path]::GetExtension($localFilePath).ToLower()

            $contentType = switch ($extension) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css" }
                ".js"   { "application/javascript" }
                ".json" { "application/json" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                default { "application/octet-stream" }
            }

            $response.ContentType = $contentType
            $response.ContentLength64 = $contentBytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($contentBytes, 0, $contentBytes.Length)
        } else {
            $response.StatusCode = 404
            $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($notFound, 0, $notFound.Length)
        }
        $response.Close()
    }
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
}
