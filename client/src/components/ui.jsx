import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ============================================================
   GymPass UI primitives
   Pure presentation — no data fetching, no business logic.
   ============================================================ */

export function PageHeader({ eyebrow, title, subtitle, right, tone = "light" }) {
  const isDark = tone === "dark";
  return (
    <div
      className={`gp-stagger flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end md:justify-between ${
        isDark ? "border-white/15" : "border-[var(--line)]"
      }`}
    >
      <div>
        {eyebrow && <p className={`gp-eyebrow mb-2 ${isDark ? "!text-white/50" : ""}`}>{eyebrow}</p>}
        <h1 className={`font-display text-4xl font-bold leading-none tracking-tight md:text-5xl ${isDark ? "text-white" : "text-[var(--ink)]"}`}>
          {title}
        </h1>
        {subtitle && <p className={`mt-2 text-sm ${isDark ? "text-white/60" : "text-[var(--muted)]"}`}>{subtitle}</p>}
      </div>
      {right && <div className="flex shrink-0 items-center gap-2">{right}</div>}
    </div>
  );
}

export function Button({ children, variant = "primary", className = "", ...props }) {
  const base =
    "gp-btn inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50";
  const variants = {
    primary: "bg-[var(--ink)] text-white hover:bg-[var(--ink-2)]",
    volt: "bg-[var(--volt)] text-[var(--volt-ink)] hover:brightness-95",
    ghost: "border border-[var(--line-strong)] bg-transparent text-[var(--ink)] hover:bg-[var(--paper-2)]",
    danger: "bg-[var(--overdue)] text-white hover:brightness-95",
    link: "px-0 py-0 text-[var(--ink)] underline decoration-[var(--volt)] decoration-2 underline-offset-4 hover:text-[var(--muted)]",
  };
  return (
    <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className = "", index = 0, as: Tag = "div", ...props }) {
  return (
    <Tag
      className={`gp-card gp-stagger ${className}`}
      style={{ "--gp-i": index }}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function Badge({ tone = "neutral", children }) {
  const tones = {
    neutral: "bg-[var(--paper-2)] text-[var(--ink)]",
    overdue: "bg-[var(--overdue-soft)] text-[var(--overdue)]",
    upcoming: "bg-[var(--upcoming-soft)] text-[var(--upcoming)]",
    good: "bg-[var(--good-soft)] text-[var(--good)]",
    volt: "bg-[var(--volt)] text-[var(--volt-ink)]",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${tones[tone] || tones.neutral}`}>
      {children}
    </span>
  );
}

export function statusTone(status) {
  if (status === "overdue") return "overdue";
  if (status === "upcoming") return "upcoming";
  return "good";
}

/** Big scoreboard-style number with a count-up animation on mount/update. */
export function StatNumber({ value = 0, duration = 700, className = "" }) {
  const [display, setDisplay] = useState(0);
  const frame = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const to = Number(value) || 0;

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [value, duration]);

  return <span className={`font-display tabular-nums ${className}`}>{display}</span>;
}

export function StatCard({ eyebrow, value, tone = "ink", to, cta, index = 0 }) {
  const toneClasses = {
    ink: "text-[var(--ink)]",
    overdue: "text-[var(--overdue)]",
    upcoming: "text-[var(--upcoming)]",
    good: "text-[var(--good)]",
  };

  const content = (
    <Card index={index} className="group relative overflow-hidden p-6">
      <p className="gp-eyebrow">{eyebrow}</p>
      <StatNumber value={value} className={`mt-2 block text-6xl font-extrabold leading-none ${toneClasses[tone]}`} />
      {cta && (
        <p className="mt-4 text-sm font-semibold text-[var(--ink)] transition-transform group-hover:translate-x-1">
          {cta} <span aria-hidden>→</span>
        </p>
      )}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--volt)] opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-30" />
    </Card>
  );

  return to ? (
    <Link to={to} className="block no-underline">
      {content}
    </Link>
  ) : (
    content
  );
}

export function Skeleton({ className = "" }) {
  return <div className={`gp-skeleton ${className}`} />;
}

export function SkeletonPage({ label = "Loading" }) {
  return (
    <div className="p-6 md:p-10">
      <p className="gp-eyebrow mb-4">{label}…</p>
      <Skeleton className="mb-3 h-10 w-64" />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  );
}

export function ErrorBanner({ children }) {
  if (!children) return null;
  return (
    <div className="gp-pop flex items-start gap-3 rounded-xl border border-[var(--overdue)]/30 bg-[var(--overdue-soft)] p-4 text-sm font-medium text-[var(--overdue)]">
      <span aria-hidden className="mt-0.5">⚠</span>
      <span>{children}</span>
    </div>
  );
}

export function SuccessBanner({ children }) {
  if (!children) return null;
  return (
    <div className="gp-pop flex items-start gap-3 rounded-xl border border-[var(--good)]/30 bg-[var(--good-soft)] p-4 text-sm font-medium text-[var(--good)]">
      <span aria-hidden className="mt-0.5">✓</span>
      <span>{children}</span>
    </div>
  );
}

export function EmptyState({ title, hint }) {
  return (
    <div className="gp-fade-in rounded-2xl border border-dashed border-[var(--line-strong)] bg-[var(--paper-2)]/50 p-10 text-center">
      <p className="font-display text-2xl font-bold text-[var(--ink)]">{title}</p>
      {hint && <p className="mt-1 text-sm text-[var(--muted)]">{hint}</p>}
    </div>
  );
}

export function Field({ label, ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{label}</span>}
      <input
        {...props}
        className="w-full rounded-lg border border-[var(--line)] bg-white px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--ink)] focus:ring-2 focus:ring-[var(--volt)]/40"
      />
    </label>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{label}</span>}
      <select
        {...props}
        className="w-full rounded-lg border border-[var(--line)] bg-white px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--ink)] focus:ring-2 focus:ring-[var(--volt)]/40"
      >
        {children}
      </select>
    </label>
  );
}
