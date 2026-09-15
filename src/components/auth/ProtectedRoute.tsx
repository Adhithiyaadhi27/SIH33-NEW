import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { RoleName } from '../../store/roleStore';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: RoleName[];
}

const ROLE_ROUTES: Record<string, string> = {
  ADMIN: '/admin',
  FARMER: '/farmer',
  CONSUMER: '/consumer',
};

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role as RoleName)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
}

export function AccessDenied() {
  const user = useAuthStore((s) => s.user);
  const homeRoute = user ? ROLE_ROUTES[user.role] || '/' : '/';

  return (
    <div className="min-h-screen flex items-center justify-center bg-soil-base px-4">
      <div className="glass-panel p-8 sm:p-12 text-center space-y-4 max-w-md">
        <div className="text-5xl">🚫</div>
        <h1 className="font-display font-extrabold text-2xl text-text-primary">Access Denied</h1>
        <p className="text-sm text-text-muted">
          You don't have permission to access this page. Please sign in with the correct account.
        </p>
        <a
          href={homeRoute}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-soil-base bg-gradient-to-r from-soil-gold to-soil-goldSoft hover:brightness-110 transition"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
