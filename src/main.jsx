import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary'
import moduleSettings from './config/moduleSettings';
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
