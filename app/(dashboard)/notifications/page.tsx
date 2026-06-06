import { NotificationCenter } from '@/features/notifications/components/notification-center';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notificaciones | Fletix',
  description: 'Centro de notificaciones y alertas operativas',
};

export default function NotificationsPage() {
  return (
    <div className="h-[calc(100vh-64px)] w-full overflow-hidden -m-6 md:-m-8">
      <NotificationCenter />
    </div>
  );
}
