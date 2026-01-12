import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
//import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Register service worker for production builds
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(reg => {
      // registration successful
      console.log('Service worker registered.', reg);
    }).catch(err => {
      console.warn('Service worker registration failed:', err);
    });
  });
}
