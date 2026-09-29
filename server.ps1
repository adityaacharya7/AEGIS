param (
    [int]$port = 5000
)

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "=========================================================="
Write-Host " Project AEGIS: AI Forecast Bust Intelligence Server"
Write-Host " Running at: http://localhost:$port/"
Write-Host " Serving directory: $PSScriptRoot"
Write-Host "=========================================================="

$root = $PSScriptRoot

try {
    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            $urlPath = $request.Url.LocalPath
            if ($urlPath -eq "/" -or $urlPath -eq "") {
                $urlPath = "/index.html"
            }

            # Normalize relative path
            $cleanPath = $urlPath.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
            $filePath = Join-Path $root $cleanPath

            # Prevent directory traversal
            $fullFilePath = [System.IO.Path]::GetFullPath($filePath)
            if (-not $fullFilePath.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
                $response.StatusCode = 403
                $msg = [System.Text.Encoding]::UTF8.GetBytes("403 Forbidden")
                $response.ContentLength64 = $msg.Length
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($msg, 0, $msg.Length)
                }
                $response.Close()
                continue
            }

            if (Test-Path $fullFilePath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($fullFilePath).ToLower()
                $mime = switch ($ext) {
                    ".html" { "text/html; charset=utf-8" }
                    ".css"  { "text/css; charset=utf-8" }
                    ".js"   { "application/javascript; charset=utf-8" }
                    ".json" { "application/json; charset=utf-8" }
                    ".png"  { "image/png" }
                    ".jpg"  { "image/jpeg" }
                    ".jpeg" { "image/jpeg" }
                    ".svg"  { "image/svg+xml" }
                    ".webp" { "image/webp" }
                    ".ico"  { "image/x-icon" }
                    Default { "application/octet-stream" }
                }

                $response.ContentType = $mime
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")
                
                $bytes = [System.IO.File]::ReadAllBytes($fullFilePath)
                $response.ContentLength64 = $bytes.Length

                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                }
            } else {
                $response.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 File Not Found: $urlPath")
                $response.ContentLength64 = $msg.Length
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($msg, 0, $msg.Length)
                }
            }

            $response.Close()
        } catch {
            Write-Warning "Request error: $_"
            if ($null -ne $response) {
                try { $response.Close() } catch {}
            }
        }
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
