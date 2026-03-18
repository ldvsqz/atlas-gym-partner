# GitHub Secrets Summary

Add these 4 secrets to your GitHub repository:
**Settings → Secrets and variables → Actions → New repository secret**

---

## Secret 1: ANDROID_KEYSTORE
- **Name**: `ANDROID_KEYSTORE`
- **Value**: Base64-encoded keystore (from setup script output)
- **How to get**: Run `.\scripts\setup-keystore.ps1` → copies to clipboard
- **Note**: This is a very long string, paste as-is

## Secret 2: KEYSTORE_PASSWORD
- **Name**: `KEYSTORE_PASSWORD`
- **Value**: `atlas1234`

## Secret 3: KEY_PASSWORD
- **Name**: `KEY_PASSWORD`
- **Value**: `atlas1234`

## Secret 4: KEY_ALIAS
- **Name**: `KEY_ALIAS`
- **Value**: `atlas`

---

## Quick Reference Table

| Secret Name | Value |
|---|---|
| ANDROID_KEYSTORE | Paste from clipboard (setup script) |
| KEYSTORE_PASSWORD | atlas1234 |
| KEY_PASSWORD | atlas1234 |
| KEY_ALIAS | atlas |

---

## Steps to Add Secrets

1. Go to: https://github.com/YOUR_USERNAME/atlas/settings/secrets/actions
2. Click "New repository secret"
3. Enter Name and Value from above
4. Click "Add secret"
5. Repeat for all 4 secrets

Done! ✅
