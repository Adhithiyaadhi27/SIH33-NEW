import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bell, Check, CheckCheck, X, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNotificationReadStore } from '../../store/notificationReadStore';
import type { RoleName } from '../../store/roleStore';
import { ROLE_NOTIFICATIONS, TYPE_ICONS, TYPE_COLORS } from './notificationData';

interface NotificationsCenterProps {
  open: boolean;
  onClose: () => void;
}

export default function NotificationsCenter({ open, onClose }: NotificationsCenterProps) {
  const user = useAuthStore((s) => s.user);
  const { read, markRead, markAllRead } = useNotificationReadStore();

  const role = user?.role as RoleName | undefined;
  const notifications = role ? ROLE_NOTIFICATIONS[role] ?? [] : [];
  const notificationIds = notifications.map((n) => n.id);

  const unreadCount = notifications.filter((n) => !read[n.id]).length;

  const DummyIcon = Bell;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel p-3 z-50"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] uppercase font-bold text-soil-gold tracking-wider">
              Notifications {unreadCount > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-soil-gold/20 text-[9px]">{unreadCount} new</span>}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllRead(notificationIds)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-soil-gold transition cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-text-primary transition cursor-pointer"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="px-3 py-8 text-center text-[11px] text-text-muted">
              <div className="text-2xl mb-2">🔔</div>
              No notifications yet.
            </div>
          ) : (
            <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
              {notifications.map((n) => {
                const isRead = read[n.id];
                const Icon = TYPE_ICONS[n.type] || DummyIcon;
                return (
                  <div
                    key={n.id}
                    className={`px-3 py-2.5 rounded-xl text-xs transition cursor-pointer ${
                      isRead ? 'bg-white/5 opacity-70' : 'bg-white/10 border border-soil-gold/20'
                    }`}
                    onClick={() => markRead(n.id)}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`mt-0.5 ${TYPE_COLORS[n.type] || 'text-text-muted'}`}>
                        {isRead ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-text-primary truncate">{n.title}</span>
                          {!isRead && <span className="w-1.5 h-1.5 rounded-full bg-soil-gold shrink-0" />}
                        </div>
                        <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed">{n.message}</p>
                        <div className="text-[9px] text-soil-gold mt-1">{n.timestamp}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Link
            to="/notifications"
            onClick={onClose}
            className="mt-2 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold text-soil-gold hover:bg-white/10 transition cursor-pointer"
          >
            View all notifications <ArrowRight className="w-3 h-3" />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}