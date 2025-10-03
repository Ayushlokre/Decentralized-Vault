# ----------------------
# Full Test Script for Backend API
# ----------------------

# Function: Send file via multipart/form-data
function Send-FileWithWebClient {
    param(
        [Parameter(Mandatory=$true)][string]$Uri,
        [Parameter(Mandatory=$true)][string]$FilePath,
        [Parameter(Mandatory=$true)][string]$Token,
        [Parameter(Mandatory=$false)][string]$FieldName = "file"
    )

    $CRLF = "`r`n"
    $boundary = [System.Guid]::NewGuid().ToString()
    $contentType = "multipart/form-data; boundary=$boundary"

    $fileInfo = Get-Item $FilePath
    $fileName = $fileInfo.Name
    $fileContent = [System.IO.File]::ReadAllBytes($FilePath)

    # Determine MIME type
    $mimeTypes = @{
        ".txt" = "text/plain"
        ".pdf" = "application/pdf"
        ".docx" = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ".png" = "image/png"
        ".jpg" = "image/jpeg"
        ".jpeg" = "image/jpeg"
    }
    $ext = [System.IO.Path]::GetExtension($FilePath).ToLower()
    $fileMime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }

    # Header part
    $header = "--$boundary$CRLF"
    $header += "Content-Disposition: form-data; name=`"$FieldName`"; filename=`"$fileName`"$CRLF"
    $header += "Content-Type: $fileMime$CRLF$CRLF"

    # Footer part
    $footer = "$CRLF--$boundary--$CRLF"

    $encoding = [System.Text.Encoding]::UTF8
    $headerBytes = $encoding.GetBytes($header)
    $footerBytes = $encoding.GetBytes($footer)

    $bodyLength = $headerBytes.Length + $fileContent.Length + $footerBytes.Length
    $body = New-Object byte[] $bodyLength

    [System.Buffer]::BlockCopy($headerBytes, 0, $body, 0, $headerBytes.Length)
    [System.Buffer]::BlockCopy($fileContent, 0, $body, $headerBytes.Length, $fileContent.Length)
    [System.Buffer]::BlockCopy($footerBytes, 0, $body, $headerBytes.Length + $fileContent.Length, $footerBytes.Length)

    $wc = New-Object System.Net.WebClient
    $wc.Headers.Add("Authorization", "Bearer $Token")
    $wc.Headers.Add("Content-Type", $contentType)

    return $wc.UploadData($Uri, "POST", $body)
}

# ----------------------
# 1️⃣ Register or Login
# ----------------------
$testEmail = "ayush.test123@example.com"
$testPassword = "Admin123!@#"
$testName = "Ayush Lokre"

$body = @{ name = $testName; email = $testEmail; password = $testPassword }
$jsonBody = $body | ConvertTo-Json -Depth 10

$token = $null

try {
    $responseRegister = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
        -Method POST `
        -Headers @{ "Content-Type" = "application/json" } `
        -Body $jsonBody
    $token = $responseRegister.token
    Write-Host "✅ Registration Success. Token obtained."
} catch {
    Write-Host "Registration failed, trying login..."
    try {
        $responseLogin = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
            -Method POST `
            -Headers @{ "Content-Type" = "application/json" } `
            -Body (@{ email = $testEmail; password = $testPassword } | ConvertTo-Json)
        $token = $responseLogin.token
        Write-Host "✅ Login Success. Token obtained."
    } catch {
        Write-Host "❌ Login also failed: $($_.Exception.Message)"
        exit
    }
}

if (-not $token) {
    Write-Host "❌ No token obtained - aborting."
    exit
}

# ----------------------
# 2️⃣ Test Files
# ----------------------
$testFilesDir = "C:\Users\AYUSH\Desktop\decentralized-data-vault\backend\test-files"
if (-not (Test-Path $testFilesDir)) { New-Item -Path $testFilesDir -ItemType Directory | Out-Null }
$files = Get-ChildItem -Path $testFilesDir -File -Recurse -Force

if ($files.Count -eq 0) {
    Write-Host "No test files found. Generating..."
    Push-Location "C:\Users\AYUSH\Desktop\decentralized-data-vault\backend"
    node generate-test-files.js
    Pop-Location
    Start-Sleep -Seconds 1
    $files = Get-ChildItem -Path $testFilesDir -File -Recurse -Force
}

Write-Host "Found $($files.Count) file(s) for upload:"

foreach ($file in $files) {
    Write-Host (" - {0} ({1} bytes)" -f $file.FullName, $file.Length)
}

# ----------------------
# 3️⃣ Upload Files
# ----------------------
$uploadSuccess = $false

foreach ($file in $files) {
    $filePath = $file.FullName
    Write-Host "`nUploading file: $filePath ..."
    try {
        [byte[]]$responseBytes = Send-FileWithWebClient -Uri "http://localhost:5000/api/files/upload" -FilePath $filePath -Token $token -FieldName "file"
        $responseString = [System.Text.Encoding]::UTF8.GetString($responseBytes)
        $responseUpload = $responseString | ConvertFrom-Json
        Write-Host "✅ Upload Success:"
        $responseUpload | ConvertTo-Json -Depth 10
        $uploadSuccess = $true
    } catch {
        Write-Host "❌ Upload Failed: $($_.Exception.Message)"
    }
}

# ----------------------
# 4️⃣ Fetch Uploaded Files
# ----------------------
Write-Host "`nFetching uploaded files..."
try {
    $responseFiles = Invoke-RestMethod -Uri "http://localhost:5000/api/files" `
        -Method GET `
        -Headers @{ "Authorization" = "Bearer $token" }
    if ($responseFiles -and $responseFiles.files.Count -gt 0) {
        Write-Host "Files Response:"
        $responseFiles | ConvertTo-Json -Depth 10
    } else { Write-Host "No files found." }
} catch {
    Write-Host "Error fetching files: $($_.Exception.Message)"
}

Write-Host "`nScript completed! (Upload succeeded: $uploadSuccess)"
