import { useState } from 'react';
import { Bell, CheckCheck, FileText } from 'lucide-react';
import { GlassCard, GlassBadge, GlassButton } from '../components/ui/primitives';
import { SkeletonList } from '../components/ui/skeleton';
import { usePageLoading } from '../hooks/usePageLoading';
import { useAuthStore } from '../store/authStore';
import { useNotificationReadStore } from '../store/notificationReadStore';
import type { RoleName } from '../store/roleStore';
import { ROLE_NOTIFICATIONS, TYPE_ICONS, TYPE_COLORS } from '../components/notifications/notificationData';

export default function NotificationsPage() {
  const user = useAuthStore((s) => s.user);
  const loading = usePageLoading();
  const { read, markRead, markAllRead } = useNotificationReadStore();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const role = user?.role as RoleName | undefined;
  const notifications = role ? ROLE_NOTIFICATIONS[role] ?? [] : [];
  const notificationIds = notifications.map((n) => n.id);

  const visible = filter === 'unread' ? notifications.filter((n) => !read[n.id]) : notifications;
  const unreadCount = notifications.filter((n) => !read[n.id]).length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <GlassBadge gold>Notifications</GlassBadge>
          <h1 className="font-display font-extrabold text-2xl text-text-primary mt-2">Notification Center</h1>
          <p className="text-xs text-text-muted mt-1">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer ${filter === 'all' ? 'bg-soil-gold/25 text-soil-gold' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer ${filter === 'unread' ? 'bg-soil-gold/25 text-soil-gold' : 'bg-white/5 text-text-muted hover:bg-white/10'}`}
          >
            Unread ({unreadCount})
          </button>
          {unreadCount > 0 && (
            <GlassButton variant="glass" className="!px-3 !py-1.5 !text-[11px]" onClick={() => markAllRead(notificationIds)}>
              <CheckCheck className="w-3.5 h-3.5 mr-1 inline" /> Mark All Read
            </GlassButton>
          )}
        </div>
      </div>

      {loading ? (
        <SkeletonList count={5} />
      ) : visible.length === 0 ? (
        <GlassCard className="p-12 text-center space-y-3">
          <div className="flex justify-center text-soil-gold"><Bell className="w-10 h-10" /></div>
          <h3 className="font-display font-bold text-lg text-text-primary">
            {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
          </h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            {filter === 'unread' ? 'You have read all your notifications.' : 'New updates will appear here.'}
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-2">
          {visible.map((n) => {
            const isRead = read[n.id];
            const Icon = TYPE_ICONS[n.type] || FileText;
            return (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`glass-panel-sm p-4 flex items-start gap-3 transition cursor-pointer ${
                  isRead ? 'opacity-70' : 'border-soil-gold/30'
                }`}
              >
                <div className={`mt-0.5 shrink-0 ${TYPE_COLORS[n.type] || 'text-text-muted'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-text-primary">{n.title}</span>
                    {!isRead && <span className="w-2 h-2 rounded-full bg-soil-gold shrink-0" />}
                  </div>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-soil-gold">{n.timestamp}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-text-muted uppercase tracking-wide">{n.type}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}