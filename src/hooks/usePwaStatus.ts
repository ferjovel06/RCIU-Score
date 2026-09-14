import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function usePwaStatus() {
  const [offline, setOffline] = useState(!navigator.onLine);
  const [cacheError, setCacheError] = useState(false);
  const {
    offlineReady: [offlineReady],
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({ onRegisterError: () => setCacheError(true) });

  useEffect(() => {
    const updateConnectionStatus = () => setOffline(!navigator.onLine);
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);
    return () => {
      window.removeEventListener('online', updateConnectionStatus);
      window.removeEventListener('offline', updateConnectionStatus);
    };
  }, []);

  return { offline, offlineReady, cacheError, needRefresh, updateServiceWorker };
}
