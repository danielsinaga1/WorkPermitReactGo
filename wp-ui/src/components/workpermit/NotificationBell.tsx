import { useState, useEffect, useRef } from 'react';
import { Badge } from 'primereact/badge';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { notificationService } from '../../services/extendedHseService';
import type { Notification } from '../../types/workPermitTypes';

interface Props {
  userId?: string;
  personnelId?: number;
  pollIntervalMs?: number;
}

export default function NotificationBell({ userId, personnelId, pollIntervalMs = 30000 }: Props) {
  const op = useRef<OverlayPanel>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const resp = await notificationService.list({
        user_id: userId,
        personnel_id: personnelId,
        unread_only: true,
        per_page: 10,
      });
      setNotifications(resp.data);
      setUnreadCount(resp.total);
    } catch {
      // silently fail — notifications are non-critical
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, pollIntervalMs);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, personnelId, pollIntervalMs]);

  const handleRead = async (id: number) => {
    await notificationService.markRead(id);
    fetchNotifications();
  };

  const severityMap: Record<string, 'danger' | 'warning' | 'info' | 'success'> = {
    sos_alert: 'danger',
    gas_test_unsafe: 'danger',
    geofence_violation: 'warning',
    permit_rejected: 'danger',
    permit_approved: 'success',
    permit_expiring: 'warning',
  };

  return (
    <>
      <Button
        icon="pi pi-bell"
        className="p-button-text p-button-rounded"
        onClick={(e) => op.current?.toggle(e)}
        data-testid="notification-bell"
        aria-label="Notifications"
      >
        {unreadCount > 0 && (
          <Badge value={unreadCount > 99 ? '99+' : String(unreadCount)} severity="danger"
            data-testid="notification-badge" />
        )}
      </Button>

      <OverlayPanel ref={op} style={{ width: '360px' }} data-testid="notification-panel">
        <h4 className="font-semibold mb-2">Notifications</h4>
        {notifications.length === 0 ? (
          <p className="text-sm text-gray-400">No unread notifications</p>
        ) : (
          <div className="flex flex-col gap-2 max-h-80 overflow-auto">
            {notifications.map((n) => (
              <div key={n.id} className="border-b pb-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                onClick={() => handleRead(n.id)} data-testid={`notif-${n.id}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Tag severity={severityMap[n.type] ?? 'info'} value={n.type.replace(/_/g, ' ')} />
                </div>
                <p className="font-semibold text-sm">{n.title}</p>
                <p className="text-xs text-gray-500">{n.body}</p>
                <p className="text-xs text-gray-300 mt-1">{new Date(n.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </OverlayPanel>
    </>
  );
}
