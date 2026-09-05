import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';

export default function ToastContainer() {
  const { toasts, removeToast } = useNotificationStore();

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-soil-gold" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-soil-mint" />,
  };

  return (
    <div className="fixed bottom-5 right-5 z-[150] space-y-3">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            className="glass-panel p-4 w-80 flex gap-3 cursor-pointer"
            onClick={() => removeToast(t.id)}
          >
            <div className="shrink-0">{icons[t.type || 'success']}</div>
            <div>
              <div className="text-sm font-bold text-text-primary">{t.title}</div>
              <div className="text-xs text-text-muted mt-0.5">{t.message}</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
