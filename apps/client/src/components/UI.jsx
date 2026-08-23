// Shared reusable UI primitives

// Glass card wrapper
export function Card({ children, className = '', tampered = false }) {
  return (
    <div className={`glass rounded-xl shadow-sm ${tampered ? 'border-l-4 border-l-error' : ''} ${className}`}>
      {children}
    </div>
  )
}

// Section heading with optional icon
export function SectionLabel({ icon, children }) {
  return (
    <p className="flex items-center gap-1 text-[11px] uppercase tracking-widest text-on-surface-variant mb-1">
      {icon && <span className="material-symbols-outlined text-[14px]">{icon}</span>}
      {children}
    </p>
  )
}

// Mono hash display
export function HashPill({ hash, dim = false }) {
  return (
    <p className={`font-mono text-[11px] break-all bg-surface-container-low px-2 py-1.5 rounded
      ${dim ? 'text-outline' : 'text-secondary'}`}>
      {hash}
    </p>
  )
}

// Chip / badge
export function Chip({ children, color = 'amber' }) {
  const styles = {
    amber: 'bg-primary-container/10 text-on-primary-container border-primary-container/20',
    green: 'bg-secondary-container text-on-secondary-container border-transparent',
    red:   'bg-error-container text-on-error-container border-transparent',
  }
  return (
    <span className={`px-3 py-1.5 rounded-full text-[11px] uppercase tracking-widest font-bold border ${styles[color]}`}>
      {children}
    </span>
  )
}

// Score bar
export function ScoreBar({ value, max = 100 }) {
  return (
    <div className="score-bar mt-1">
      <div className="score-fill" style={{ width: `${(value / max) * 100}%` }} />
    </div>
  )
}

// Pulsing live dot
export function LiveDot() {
  return (
    <span className="flex h-3 w-3 relative">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
      <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary" />
    </span>
  )
}

// Full-page loading spinner
export function PageSpinner({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <span className="material-symbols-outlined text-5xl text-outline animate-spin">refresh</span>
      <p className="text-on-surface-variant">{label}</p>
    </div>
  )
}

// Error banner
export function ErrorBanner({ message }) {
  return (
    <div className="bg-error-container text-on-error-container rounded-xl px-4 py-3 flex items-center gap-2">
      <span className="material-symbols-outlined text-[18px]">error</span>
      <span>{message}</span>
    </div>
  )
}
