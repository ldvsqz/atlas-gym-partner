<h1 align="center">Atlas Gym Partner V1</h1>

## Deployment

### Firebase Hosting Setup

The project uses GitHub Actions for automatic deployment to Firebase Hosting on pushes to the `master` branch.

#### Required Secrets

Add the following secret to your GitHub repository:

- `FIREBASE_TOKEN`: Firebase CI token for deployment
  - Generate with: `firebase login:ci`
  - Add to: GitHub Repository → Settings → Secrets and variables → Actions

#### Manual Deployment

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Build and deploy
npm run build
firebase deploy --only hosting
```