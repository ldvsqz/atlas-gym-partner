import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary'
import moduleSettings from './config/moduleSettings';
import { DEFAULT_GRID_COLS, DEFAULT_GRID_ROWS, DEFAULT_RESERVED_GRID_CELLS } from './features/gymLayout/models/gymLayoutModels';
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

moduleSettings.registerModule('gymLayout', {
  rows: DEFAULT_GRID_ROWS,
  cols: DEFAULT_GRID_COLS,
  reservedCells: DEFAULT_RESERVED_GRID_CELLS,
});

moduleSettings.restoreOverrides();

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
