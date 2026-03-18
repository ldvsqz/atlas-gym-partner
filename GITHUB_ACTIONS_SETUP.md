# GitHub Actions APK Build Setup

This guide explains how to set up automated Android APK builds using GitHub Actions.

## Overview

The project includes a complete CI/CD workflow (`.github/workflows/android-release.yml`) that automatically:
1. Builds the React web app
2. Syncs with Capacitor
3. Builds the Android APK
4. Signs the APK with your keystore
5. Uploads to GitHub Releases

## Prerequisites

You need:
- Java Development Kit (JDK) - The GitHub Actions runner includes JDK 17
- Android SDK - Automatically installed by the workflow
- Git and GitHub repository

## Setup Steps

### Step 1: Generate Keystore (One-time)

Run this command in PowerShell to create a signing keystore:

```powershell
keytool -genkey -v -keystore android/keystore.jks -alias atlas -keyalg RSA -keysize 2048 -validity 10000 -storepass atlas1234 -keypass atlas1234 -dname "CN=Atlas Gym, O=Atlas, C=US"
```

**Parameters:**
- **keystore**: `android/keystore.jks` - Location and filename
- **alias**: `atlas` - Key alias for identification
- **keyalg**: `RSA` - Encryption algorithm
- **keysize**: `2048` - Key size in bits
- **validity**: `10000` - Valid for 10000 days (~27 years)
- **storepass**: `atlas1234` - Keystore password (change this!)
- **keypass**: `atlas1234` - Key password (change this!)
- **dname**: Certificate distinguished name

**Important:** Keep `android/keystore.jks` secret! It's already in `.gitignore` and won't be committed.

### Step 2: Encode Keystore to Base64

Convert the keystore file to base64 for GitHub secrets:

**Option A: Using PowerShell**
```powershell
$keystoreBytes = [System.IO.File]::ReadAllBytes("c:\atlas\android\keystore.jks")
$base64String = [System.Convert]::ToBase64String($keystoreBytes)
$base64String | Set-Clipboard
```

Or as a one-liner:
```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("c:\atlas\android\keystore.jks")) | Set-Clipboard
```

**Option B: Using Node.js**
```bash
node -e "console.log(require('fs').readFileSync('android/keystore.jks', 'base64'))" | clip
```

**Option C: Using certutil (Windows)**
```cmd
certutil -encode android\keystore.jks keystore.b64
type keystore.b64 | clip
```

### Step 3: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** for each of these:

| Secret Name | Value | Example |
|---|---|---|
| `ANDROID_KEYSTORE` | Base64-encoded keystore (from Step 2) | `MIIJrQIBAzCC... (very long)` |
| `KEYSTORE_PASSWORD` | Keystore password | `atlas1234` |
| `KEY_PASSWORD` | Key password | `atlas1234` |
| `KEY_ALIAS` | Key alias | `atlas` |

### Step 4: Build and Release

**Option A: Automatic on Tag Push**

```bash
git add .
git commit -m "Setup GitHub Actions APK build"

# Update version in package.json first, then:
git tag v0.0.10
git push origin master
git push origin v0.0.10
```

The workflow will trigger automatically and build the APK.

**Option B: Manual Trigger (if configured)**

Go to GitHub Actions tab and manually run the workflow if available.

### Step 5: Download APK

1. Go to your GitHub repository
2. Navigate to **Releases**
3. Find the release matching your version (e.g., `v0.0.10`)
4. Download `atlas-v0.0.10.apk`
5. Transfer to your phone and install

## GitHub Actions Workflow File

The workflow is located at `.github/workflows/android-release.yml` and includes:

- **Web Build Job**: Builds React app with npm
- **Android Build Job**: 
  - Sets up Java 17
  - Sets up Android SDK (API 33, build-tools 33.0.2)
  - Syncs Capacitor
  - Builds APK with Gradle
  - Signs with keystore
  - Creates GitHub Release with APK

## Troubleshooting

### Build Fails on GitHub Actions

**Issue**: "Could not resolve com.android.tools.build:gradle"
- **Solution**: The runner doesn't have internet. This shouldn't happen with ubuntu-latest.
- **Check**: View the workflow logs in GitHub Actions tab.

**Issue**: "Keystore not found"
- **Solution**: Verify `ANDROID_KEYSTORE` secret is set correctly in GitHub Settings.
- **Debug**: The secret must be the full base64 string without line breaks.

**Issue**: "APK not found after build"
- **Solution**: Check if any compilation errors in the workflow logs.
- **Check**: Ensure `npm run build` completes successfully.

### Keystore Password Issues

If you get signature errors during build:
1. Verify passwords match in GitHub secrets
2. Ensure keystore file is valid: `keytool -list -v -keystore android/keystore.jks`
3. Regenerate keystore if corrupted

## Security Notes

1. **Never commit keystore.jks** - Already in `.gitignore`
2. **Use strong passwords** - Change `atlas1234` to something secure
3. **Rotate keys annually** - Regenerate keystore with new passwords yearly
4. **GitHub Secrets are encrypted** - Values are masked in logs
5. **Backup keystore** - Keep a secure backup of `keystore.jks` locally

## Updating the APK Version

Each release should have a new version number:

1. Update `package.json`:
```json
{
  "version": "0.0.11"
}
```

2. Commit and tag:
```bash
git add package.json
git commit -m "Bump version to 0.0.11"
git tag v0.0.11
git push origin master v0.0.11
```

## Next Steps

- Monitor your first build in GitHub Actions tab
- Download the APK and test on your phone
- Iterate on features and push new tags for releases

For more info, see:
- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
