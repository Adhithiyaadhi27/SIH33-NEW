import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  small?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className = '', small = false, hover = true, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`${small ? 'glass-panel-sm' : 'glass-panel'} ${hover ? 'transition-all duration-300 hover:-translate-y-0.5' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function GlassPanel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`glass-panel ${className}`}>{children}</div>;
}

interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'glass' | 'green' | 'gold' | 'ghost';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  title?: string;
}

export function GlassButton({
  children,
  onClick,
  variant = 'glass',
  className = '',
  type = 'button',
  disabled = false,
  title,
}: GlassButtonProps) {
  const variants: Record<string, string> = {
    glass: 'glass-button',
    green: 'glass-button glass-button-green border-emerald-400/40 text-white',
    gold: 'bg-gradient-to-r from-soil-gold to-soil-goldSoft text-soil-base font-bold border border-yellow-300/40 shadow-glow-gold hover:brightness-110',
    ghost: 'bg-transparent hover:bg-white/10 border border-transparent hover:border-white/20',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`px-5 py-2.5 rounded-2xl text-sm font-semibold text-text-primary cursor-pointer disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

interface GlassBadgeProps {
  children: ReactNode;
  className?: string;
  gold?: boolean;
}

export function GlassBadge({ children, className = '', gold = false }: GlassBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md ${
        gold ? 'bg-soil-gold/20 text-soil-goldSoft border border-soil-gold/30' : 'bg-white/15 text-text-primary border border-white/20'
      } ${className}`}
    >
      {children}
    </span>
  );
}

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeading({ kicker, title, subtitle, className = '' }: SectionHeadingProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {kicker && (
        <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-soil-gold">
          <span className="h-px w-6 bg-soil-gold/60" />
          {kicker}
        </div>
      )}
      <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-text-primary">{title}</h2>
      {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
    </div>
  );
}

interface MetricTileProps {
  label: string;
  value: string;
  icon?: ReactNode;
  accent?: string;
}

export function MetricTile({ label, value, icon, accent = 'text-soil-gold' }: MetricTileProps) {
  return (
    <GlassCard small className="p-4 text-center">
      {icon && <div className={`mx-auto mb-1.5 ${accent}`}>{icon}</div>}
      <div className={`font-display font-extrabold text-xl sm:text-2xl ${accent}`}>{value}</div>
      <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mt-0.5">{label}</div>
    </GlassCard>
  );
}

export function FadeIn({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function DemoDataBadge({ className = '' }: { className?: string }) {
  return (
    <span
      title="These figures are illustrative sample data for the demo build and do not represent live platform statistics."
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border border-soil-gold/30 bg-soil-gold/10 text-soil-goldSoft ${className}`}
    >
      <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      Demo data
    </span>
  );
}
