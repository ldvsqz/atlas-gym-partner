// Example registrations for moduleSettings
import { registerModule, loadOverrides, getSettings, subscribe } from './moduleSettings';

// Register defaults for a couple of modules
registerModule('training', {
  pageSize: 20,
  allowPublicPrint: true,
});

registerModule('auth', {
  sessionTimeoutMinutes: 60,
  allowGoogleSignIn: true,
});

// Load overrides (could come from server/localStorage)
loadOverrides({
  training: { pageSize: 50 },
});

// Read settings
console.log('training settings', getSettings('training'));

// Subscribe to changes
const unsubscribe = subscribe('training', (s) => console.log('training changed', s));

// Call unsubscribe() when appropriate
