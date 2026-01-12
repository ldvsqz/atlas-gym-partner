$ErrorActionPreference = 'Stop'
$ks = [guid]::NewGuid().ToString('N')
$key = [guid]::NewGuid().ToString('N')
$alias = 'atlas'
$root = (Resolve-Path "$PSScriptRoot\..\").ProviderPath
$androidDir = Join-Path $root 'android'
if (-not (Test-Path $androidDir)) { New-Item -ItemType Directory -Path $androidDir | Out-Null }
$keystorePath = Join-Path $androidDir 'keystore.jks'
$infoPath = Join-Path $androidDir 'keystore-info.txt'
$b64Path = Join-Path $androidDir 'keystore.b64'
Write-Host "Generating keystore at '$keystorePath' with alias: $alias"
$dn = 'CN=Atlas, OU=Dev, O=Atlas, L=City, ST=State, C=US'
$keyParams = @(
  '-genkeypair', '-v', '-keystore', $keystorePath,
  '-storepass', $ks,
  '-alias', $alias,
  '-keyalg', 'RSA', '-keysize', '2048', '-validity', '10000',
  '-dname', $dn,
  '-keypass', $key
)
& keytool @keyParams

# write info and base64
Set-Content -Path $infoPath -Value ("ALIAS=$alias`nKEYSTORE_PASSWORD=$ks`nKEY_PASSWORD=$key`n")
$b = [Convert]::ToBase64String([IO.File]::ReadAllBytes($keystorePath))
Set-Content -Path $b64Path -Value $b

Write-Output '--- keystore-info.txt ---'
Get-Content $infoPath
Write-Output '--- keystore.b64 (first 200 chars) ---'
if ($b.Length -gt 200) { $b.Substring(0,200) } else { $b }
Write-Output '--- To copy full base64 to clipboard: Get-Content "'"$b64Path"'" | Set-Clipboard'