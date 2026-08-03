$root = 'C:\Users\User\Desktop\tzdean'
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add('http://127.0.0.1:8000/')
$listener.Prefixes.Add('http://localhost:8000/')
$listener.Start()
Write-Host 'Server started on http://localhost:8000'

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $path = $context.Request.Url.AbsolutePath
    if ([string]::IsNullOrWhiteSpace($path) -or $path -eq '/') {
        $path = '/index.html'
    }

    $relativePath = $path.TrimStart('/')
    $fullPath = Join-Path $root $relativePath

    if (-not (Test-Path $fullPath -PathType Leaf)) {
        if (Test-Path (Join-Path $root $relativePath) -PathType Container) {
            $fullPath = Join-Path $root $relativePath 'index.html'
        } else {
            $fullPath = Join-Path $root 'index.html'
        }
    }

    if (Test-Path $fullPath -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($fullPath)
        $extension = [System.IO.Path]::GetExtension($fullPath)
        $mime = switch ($extension) {
            '.html' { 'text/html' }
            '.css' { 'text/css' }
            '.js' { 'application/javascript' }
            '.json' { 'application/json' }
            '.png' { 'image/png' }
            '.jpg' { 'image/jpeg' }
            '.jpeg' { 'image/jpeg' }
            '.gif' { 'image/gif' }
            '.svg' { 'image/svg+xml' }
            '.ico' { 'image/x-icon' }
            default { 'application/octet-stream' }
        }

        $response = $context.Response
        $response.ContentType = $mime
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
        $response.OutputStream.Close()
        $response.Close()
    } else {
        $body = [System.Text.Encoding]::UTF8.GetBytes('Not Found')
        $response = $context.Response
        $response.StatusCode = 404
        $response.ContentType = 'text/plain'
        $response.ContentLength64 = $body.Length
        $response.OutputStream.Write($body, 0, $body.Length)
        $response.OutputStream.Close()
        $response.Close()
    }
}
