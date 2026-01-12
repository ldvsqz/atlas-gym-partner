# Android APK build & GitHub Releases

This document describes the steps to produce an Android APK from this Vite React app and automate releases via GitHub Actions.

## Local setup (Capacitor - recommended)

1. Install Capacitor packages:
   - npm i --save-dev @capacitor/cli @capacitor/core @capacitor/android

2. Initialize Capacitor (only once):
   - npm run cap:init

3. Add Android native project (only once):
   - npm run cap:add:android

4. Build web assets and sync into Android project:
   - npm run build
   - npx cap sync android
   - npx cap copy android

5. Build Android APK locally:
   - cd android
   - ./gradlew assembleRelease

6. Signing the APK:
   - Create a keystore: `keytool -genkey -v -keystore keystore.jks -alias atlas -keyalg RSA -keysize 2048 -validity 10000`
   - Do NOT commit the keystore to the repo.

## CI / GitHub Actions

Workflow file: `.github/workflows/android-release.yml` — the workflow runs on tag push (v*). It builds the web app, syncs Capacitor, builds the Android APK using Gradle, optionally signs it using a base64-encoded keystore stored in `ANDROID_KEYSTORE` secret, and uploads the APK to GitHub Releases.

### Required GitHub Secrets

- ANDROID_KEYSTORE: base64-encoded content of your keystore (run `base64 keystore.jks | pbcopy` or on Windows `certutil -encode keystore.jks keystore.b64` and copy the output). If not provided, an unsigned APK is uploaded.
- KEYSTORE_PASSWORD
- KEY_ALIAS
- KEY_PASSWORD
- OPTIONAL: PLAY_STORE_SERVICE_ACCOUNT_JSON if you plan to automate Play Store uploads

## PWA requirements for TWA (if you choose TWA instead of Capacitor)

- A publicly accessible HTTPS URL hosting `manifest.json` and a service worker.
- Use Bubblewrap or PWABuilder to generate a TWA project.

---

If you want, I can:
- Run `npm i --save-dev @capacitor/cli @capacitor/core @capacitor/android` and commit package-lock changes;
- Initialize `android/` locally (runs `npx cap add android`) and commit the `android/` folder;
- Or leave these steps to you and help debug any issues during the local run.

Which would you prefer?