# Quick Start Guide - Build APK with GitHub Actions

## 🚀 Fast Setup (5 minutes)

### Step 1: Run Setup Script
Open PowerShell in the project root and run:
```powershell
.\scripts\setup-keystore.ps1
```

This will:
- Generate a signing keystore
- Output the base64 encoding
- Copy ANDROID_KEYSTORE to your clipboard

### Step 2: Add GitHub Secrets
Go to: **GitHub → Your Repo → Settings → Secrets and variables → Actions**

Click "New repository secret" for each:

1. **ANDROID_KEYSTORE** → Paste from clipboard
2. **KEYSTORE_PASSWORD** → `atlas1234`
3. **KEY_PASSWORD** → `atlas1234`
4. **KEY_ALIAS** → `atlas`

### Step 3: Trigger Build
```bash
git add .
git commit -m "Setup APK build pipeline"
git tag v0.0.10
git push origin master
git push origin v0.0.10
```

### Step 4: Download APK
- Go to GitHub → Releases
- Download `atlas-v0.0.10.apk`
- Install on your phone

---

## 📋 Full Documentation

See `GITHUB_ACTIONS_SETUP.md` for detailed information including:
- Keystore generation with custom passwords
- Troubleshooting
- Security notes
- Version management

---

## 🔑 Keystore Details

**File**: `android/keystore.jks` (ignored by git)
**Alias**: atlas
**Valid for**: 10,000 days (~27 years)
**Used by**: GitHub Actions to sign APKs

---

## 📱 APK Locations

**Local Build** (if Java 11+ is installed):
```
android/app/build/outputs/apk/release/app-release.apk
```

**GitHub Releases** (automated):
```
https://github.com/yourusername/atlas/releases/download/v0.0.10/atlas-v0.0.10.apk
```

---

## 🔄 Workflow

1. Push code
2. Create git tag with version
3. GitHub Actions automatically:
   - Builds web app
   - Builds Android APK
   - Signs with keystore
   - Uploads to Releases

---

## ✅ Verify Setup

Check that:
- [ ] `.github/workflows/android-release.yml` exists
- [ ] `android/keystore.jks` exists (local only)
- [ ] GitHub secrets are configured (4 secrets)
- [ ] `package.json` version is set
- [ ] Recent commit pushed to master

Then: `git tag v0.0.10 && git push origin v0.0.10`

---

## 🆘 Need Help?

See `GITHUB_ACTIONS_SETUP.md` Troubleshooting section or check:
- GitHub Actions logs: Your Repo → Actions tab
- Workflow file: `.github/workflows/android-release.yml`
