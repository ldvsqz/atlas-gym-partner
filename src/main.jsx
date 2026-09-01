import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary'
import moduleSettings from './config/moduleSettings';
import SettingsService from '../Firebase/settingsService';
//import './index.css'

import { SnackbarProvider } from './Components/snackbar/AtlasSnackbar';

moduleSettings.registerModule('cashbox', {
  fixedDebtAmount: 0,
  partsCount: 3,
  distributionPercentages: {
    part1: 40,
    part2: 40,
    part3: 20,
  },
  maintenancePercentage: 20,
});

async function hydrateModuleSettings() {
  try {
    moduleSettings.restoreOverrides();

    const savedSettings = await SettingsService.getAllModuleSettings();
    if (!savedSettings || Object.keys(savedSettings).length === 0) {
      return;
    }

    const dbOverrides = Object.fromEntries(
      Object.entries(savedSettings).map(([moduleName, record]) => [
        moduleName,
        record?.overrides || {},
      ])
    );

    if (Object.keys(dbOverrides).length > 0) {
      moduleSettings.loadOverrides(dbOverrides);
      moduleSettings.persistOverrides();
    }
  } catch (error) {
    console.error('Error loading module settings from database:', error);
  }
}

hydrateModuleSettings();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <SnackbarProvider>
        <App />
      </SnackbarProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)

// Register service worker only in production builds.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .catch((err) => {
        console.warn('Service worker registration failed:', err);
      });
  });
}
