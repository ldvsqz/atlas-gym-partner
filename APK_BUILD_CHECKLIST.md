# ✅ APK Build Setup Checklist

Complete these steps to build your first APK.

## Phase 1: Local Setup (On Your Computer)

- [ ] **Step 1.1**: Navigate to project root
  ```bash
  cd c:\atlas
  ```

- [ ] **Step 1.2**: Run keystore setup script
  ```powershell
  .\scripts\setup-keystore.ps1
  ```
  
  ✓ This creates: `android/keystore.jks`
  ✓ This copies base64 to clipboard

- [ ] **Step 1.3**: Verify keystore file exists
  ```powershell
  Test-Path "android/keystore.jks"
  ```
  Should return: `True`

- [ ] **Step 1.4**: Push changes to GitHub
  ```bash
  git push origin main
  ```
  (or your default branch)

## Phase 2: GitHub Configuration (On GitHub.com)

- [ ] **Step 2.1**: Go to your repository on GitHub

- [ ] **Step 2.2**: Navigate to Settings
  - Click "Settings" tab (gear icon)

- [ ] **Step 2.3**: Go to Secrets
  - Click "Secrets and variables" in left menu
  - Click "Actions" sub-section

- [ ] **Step 2.4**: Add 4 new repository secrets
  
  **Secret 1: ANDROID_KEYSTORE**
  - Click "New repository secret"
  - Name: `ANDROID_KEYSTORE`
  - Value: Paste from clipboard (from Step 1.2)
  - Click "Add secret"

  **Secret 2: KEYSTORE_PASSWORD**
  - Click "New repository secret"
  - Name: `KEYSTORE_PASSWORD`
  - Value: `atlas1234`
  - Click "Add secret"

  **Secret 3: KEY_PASSWORD**
  - Click "New repository secret"
  - Name: `KEY_PASSWORD`
  - Value: `atlas1234`
  - Click "Add secret"

  **Secret 4: KEY_ALIAS**
  - Click "New repository secret"
  - Name: `KEY_ALIAS`
  - Value: `atlas`
  - Click "Add secret"

- [ ] **Step 2.5**: Verify all 4 secrets are visible
  You should see 4 secrets in the list (masked values)

## Phase 3: Trigger First Build (Back on Your Computer)

- [ ] **Step 3.1**: Open terminal in project root

- [ ] **Step 3.2**: Create and push version tag
  ```bash
  git tag v0.0.10
  git push origin v0.0.10
  ```

- [ ] **Step 3.3**: Go to GitHub Actions tab
  - Open your repository on GitHub
  - Click "Actions" tab
  - You should see the workflow running

- [ ] **Step 3.4**: Monitor the build
  - Click on the running workflow
  - Watch for: ✅ Build web → ✅ Build Android
  - Build typically takes 5-10 minutes

- [ ] **Step 3.5**: Wait for completion
  - Workflow shows ✅ green checkmark when done
  - Or ❌ red X if there's an error

## Phase 4: Download and Install (On Your Phone)

- [ ] **Step 4.1**: Go to Releases
  - GitHub repo → "Releases" section
  - Or direct link: `github.com/youruser/atlas/releases`

- [ ] **Step 4.2**: Find your release
  - Look for tag `v0.0.10`
  - Should show "created a moment ago"

- [ ] **Step 4.3**: Download APK
  - Click the `atlas-v0.0.10.apk` link
  - File downloads to your Downloads folder

- [ ] **Step 4.4**: Transfer to phone
  - Connect phone via USB
  - Copy APK to phone storage
  - Or use cloud storage (Google Drive, OneDrive)

- [ ] **Step 4.5**: Install on phone
  - Open file manager on phone
  - Find `atlas-v0.0.10.apk`
  - Tap to install
  - Allow installation from unknown sources if prompted
  - Grant permissions when app launches

- [ ] **Step 4.6**: Test the app
  - Open Atlas Gym Partner app
  - Test login and basic features
  - Report any issues

## Troubleshooting During Setup

**"Script not found" error**
- Verify path: `dir .\scripts\setup-keystore.ps1`
- Run from project root: `cd c:\atlas`

**"Keystore already exists" message**
- Type `y` to regenerate
- Or delete manually: `rm android/keystore.jks`

**"Access denied" when running script**
- Run PowerShell as Administrator
- Or set execution policy: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

**GitHub Secrets not showing**
- Refresh the page (F5)
- Check you're in correct repository
- Verify you have admin access

**Build fails on GitHub Actions**
- Click workflow run to view logs
- Look for error messages in log output
- Common issues: Missing secrets, Java version mismatch
- See: `GITHUB_ACTIONS_SETUP.md` Troubleshooting

**Can't find APK in Releases**
- Workflow must complete successfully (green checkmark)
- Refresh the Releases page
- Check Actions tab to confirm workflow completed

## Success Criteria ✨

You've successfully set up APK builds when:

- ✅ `android/keystore.jks` exists locally
- ✅ 4 GitHub Secrets are configured
- ✅ First workflow run completes (green checkmark)
- ✅ APK available in Releases
- ✅ APK installs on phone
- ✅ App runs without errors

## Next Steps

Once working:
1. Make changes to your app
2. Commit to main branch: `git commit -m "..."`
3. Push to GitHub: `git push origin main`
4. Create new tag: `git tag v0.0.11 && git push origin v0.0.11`
5. GitHub Actions builds automatically
6. Download new APK from Releases

## For Help

- Check `QUICK_START_APK.md` for overview
- Read `GITHUB_ACTIONS_SETUP.md` for detailed info
- View GitHub Actions logs for build errors
- Check workflow file: `.github/workflows/android-release.yml`

---

**Ready? Start with Phase 1, Step 1.1** 🚀
