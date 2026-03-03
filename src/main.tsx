import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Workaround for TronLink extension error in sandboxed environments ('set' on proxy: trap returned falsish)
(function() {
  if (typeof window !== 'undefined') {
    // 1. Try to pre-define the property
    try {
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
    } catch (e) {
      // DefineProperty might fail if window is a Proxy that rejects it
    }

    // 2. Intercept and silence the specific proxy error
    const silenceError = (e: any) => {
      const msg = (e && e.message) || (e && e.reason && e.reason.message) || "";
      if (typeof msg === 'string' && msg.includes('tronlinkParams')) {
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        if (e.preventDefault) e.preventDefault();
        return true;
      }
      return false;
    };

    window.addEventListener('error', silenceError, true);
    window.addEventListener('unhandledrejection', silenceError, true);
  }
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
