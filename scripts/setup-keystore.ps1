param(
    [string]$StorePass = "atlas1234",
    [string]$KeyPass = "atlas1234",
    [string]$Alias = "atlas"
)

$keystorePath = "android/keystore.jks"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Atlas Gym - Keystore Setup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

if (Test-Path $keystorePath) {
    Write-Host "[!] Keystore already exists at $keystorePath" -ForegroundColor Yellow
    $response = Read-Host "Do you want to regenerate it? (y/n)"
    if ($response -ne 'y') {
        Write-Host "Skipping keystore generation." -ForegroundColor Yellow
    } else {
        Remove-Item $keystorePath -Force
        Write-Host "Deleted existing keystore." -ForegroundColor Green
    }
}

if (-not (Test-Path $keystorePath)) {
    try {
        keytool -genkey -v -keystore $keystorePath `
            -alias $Alias `
            -keyalg RSA `
            -keysize 2048 `
            -validity 10000 `
            -storepass $StorePass `
            -keypass $KeyPass `
            -dname "CN=Atlas Gym, O=Atlas, C=US"
        
        Write-Host "[OK] Keystore created successfully!" -ForegroundColor Green
    } catch {
        Write-Host "[ERROR] Error creating keystore: $_" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Verifying keystore..." -ForegroundColor Cyan
try {
    $output = keytool -list -v -keystore $keystorePath -storepass $StorePass 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Keystore is valid" -ForegroundColor Green
    } else {
        throw "Keystore validation failed"
    }
} catch {
    Write-Host "[ERROR] Keystore verification failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Encoding keystore to base64..." -ForegroundColor Cyan
try {
    $keystoreBytes = [System.IO.File]::ReadAllBytes((Resolve-Path $keystorePath).Path)
    $base64String = [System.Convert]::ToBase64String($keystoreBytes)
    
    Write-Host "[OK] Keystore encoded successfully" -ForegroundColor Green
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host "GitHub Secrets Configuration" -ForegroundColor Cyan
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Add these secrets to your GitHub repository:" -ForegroundColor Yellow
    Write-Host "Settings - Secrets and variables - Actions - New repository secret"
    Write-Host ""
    
    Write-Host "Secret 1: ANDROID_KEYSTORE" -ForegroundColor Yellow
    Write-Host "Value (copied to clipboard):" -ForegroundColor Gray
    $base64String | Set-Clipboard
    Write-Host "[OK] Base64 string copied to clipboard" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Secret 2: KEYSTORE_PASSWORD" -ForegroundColor Yellow
    Write-Host "Value: atlas1234" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "Secret 3: KEY_PASSWORD" -ForegroundColor Yellow
    Write-Host "Value: atlas1234" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "Secret 4: KEY_ALIAS" -ForegroundColor Yellow
    Write-Host "Value: atlas" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Instructions:" -ForegroundColor Cyan
    Write-Host "1. Go to GitHub repository Settings"
    Write-Host "2. Navigate to Secrets and variables then Actions"
    Write-Host "3. Click New repository secret"
    Write-Host "4. For ANDROID_KEYSTORE: Paste the value from clipboard"
    Write-Host "5. For other secrets: Copy the values from above"
    Write-Host ""
    Write-Host "After setting secrets, push a tag to trigger the build:"
    Write-Host "   git tag v0.0.10"
    Write-Host "   git push origin v0.0.10"
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Cyan
    
} catch {
    Write-Host "[ERROR] Error encoding keystore: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[OK] Keystore setup complete!" -ForegroundColor Green
