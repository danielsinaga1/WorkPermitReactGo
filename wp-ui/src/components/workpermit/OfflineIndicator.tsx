import { useState, useEffect } from 'react';
import { Tag } from 'primereact/tag';

/**
 * Offline indicator — shows online/offline status.
 * When offline, queued requests are stored in localStorage for later sync.
 */
export default function OfflineIndicator() {
  const [online, setOnline] = useState(navigator.onLine);
  const [queueSize, setQueueSize] = useState(0);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // Check queue on every status change
  useEffect(() => {
    try {
      const queue = JSON.parse(localStorage.getItem('wp_offline_queue') || '[]');
      setQueueSize(Array.isArray(queue) ? queue.length : 0);
    } catch {
      setQueueSize(0);
    }
  }, [online]);

  if (online && queueSize === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50" data-testid="offline-indicator">
      {!online && (
        <Tag severity="warning" value="⚡ Offline Mode" className="text-sm px-3 py-2" />
      )}
      {online && queueSize > 0 && (
        <Tag severity="info" value={`Syncing ${queueSize} queued item(s)…`} className="text-sm px-3 py-2" />
      )}
    </div>
  );
}
