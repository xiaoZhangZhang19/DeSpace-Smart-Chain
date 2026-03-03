import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Workaround for TronLink extension error in sandboxed environments ('set' on proxy: trap returned falsish)
try {
  if (typeof window !== 'undefined') {
    let _tronlinkParams = (window as any).tronlinkParams || {};
    Object.defineProperty(window, 'tronlinkParams', {
      get: () => _tronlinkParams,
      set: (val) => { 
        _tronlinkParams = val; 
        return true; 
      },
      configurable: true,
      enumerable: true
    });

    // Suppress the specific proxy error from being logged to the console if it's non-fatal
    const originalError = window.onerror;
    window.onerror = (message, source, lineno, colno, error) => {
      if (typeof message === 'string' && message.includes('tronlinkParams')) {
        return true; // Prevent the error from being logged
      }
      if (originalError) {
        return originalError(message, source, lineno, colno, error);
      }
      return false;
    };
  }
} catch (e) {
  // Ignore errors if the environment restricts window modification
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
