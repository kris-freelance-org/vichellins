import Link from "next/link";
import type { ReactNode } from "react";
import { AdminIcon, type AdminIconName } from "./AdminIcon";

export const inputClass =
  "admin-input mt-1.5 h-11 w-full min-w-0 rounded-xl border border-line bg-white px-3 text-base text-foreground transition-colors placeholder:text-muted/70 focus:border-marine-700 focus:outline-none focus:ring-3 focus:ring-marine-50 disabled:cursor-not-allowed disabled:bg-surface disabled:text-muted sm:text-sm";

export function PageHeader({ title, description, actions }: {
  title: string; description?: string; actions?: ReactNode;
}) {
  return (
    <div className="admin-page-header">
      <div className="min-w-0">
        <h1 className="break-words text-[clamp(1.65rem,3cqi,2.125rem)] font-semibold leading-tight tracking-[-0.035em] text-foreground">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{description}</p>}
      </div>
      {actions && <div className="flex min-w-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ title, description, actions, children, className = "" }: {
  title?: string; description?: string; actions?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <section className={`admin-card min-w-0 rounded-2xl border border-line bg-white p-5 sm:p-6 ${className}`}>
      {(title || description || actions) && <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {title && <h2 className="text-sm font-semibold text-foreground sm:text-[15px]">{title}</h2>}
          {description && <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-muted">{description}</p>}
        </div>
        {actions}
      </header>}
      {children}
    </section>
  );
}

export function Field({ label, htmlFor, hint, children }: {
  label: string; htmlFor?: string; hint?: string; children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">{label}</label>
      {children}
      {hint && <p className="mt-1.5 break-words text-xs leading-relaxed text-muted">{hint}</p>}
    </div>
  );
}

type Tone = "neutral" | "blue" | "gold" | "green" | "red";
const tones: Record<Tone, string> = {
  neutral: "bg-surface text-muted",
  blue: "bg-marine-50 text-marine-800",
  gold: "bg-gold-100 text-gold-700",
  green: "bg-success-50 text-success-800",
  red: "bg-danger-50 text-danger-800",
};

export function Badge({ tone = "neutral", children, dot = false }: { tone?: Tone; children: ReactNode; dot?: boolean }) {
  return <span className={`inline-flex max-w-full items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium leading-relaxed ${tones[tone]}`}>{dot && <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-75" />}{children}</span>;
}

const orderTone: Record<string, Tone> = {
  pending: "gold", confirmed: "blue", packed: "blue", out_for_delivery: "blue", delivered: "green",
  cancelled: "red", refunded: "red", unpaid: "gold", paid: "green", failed: "red",
  draft: "neutral", published: "green", archived: "neutral",
};
export function StatusBadge({ status }: { status: string }) {
  const label = status.replace(/_/g, " ");
  return <Badge tone={orderTone[status] ?? "neutral"} dot>{label.charAt(0).toUpperCase() + label.slice(1)}</Badge>;
}

const buttonBase =
  "inline-flex min-h-11 min-w-[44px] items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-center text-xs font-semibold transition-colors active:brightness-95 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm";
export const buttonStyles = {
  primary: `${buttonBase} border border-marine-700 bg-marine-700 text-white hover:border-marine-800 hover:bg-marine-800`,
  secondary: `${buttonBase} border border-line bg-white text-foreground hover:border-marine-200 hover:bg-marine-50/40`,
  danger: `${buttonBase} border border-danger-200 bg-white text-danger-700 hover:bg-danger-50`,
};

export function LinkButton({ href, children, variant = "secondary", icon }: {
  href: string; children: ReactNode; variant?: keyof typeof buttonStyles; icon?: AdminIconName;
}) {
  return <Link href={href} className={buttonStyles[variant]}>{icon && <AdminIcon name={icon} className="h-4 w-4 shrink-0" />}{children}</Link>;
}

export function EmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="min-w-0 rounded-2xl border border-dashed border-line bg-white px-5 py-12 text-center sm:px-10">
      <AdminIcon name="products" className="mx-auto mb-4 h-8 w-8 text-marine-200" />
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {body && <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">{body}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function Notice({ tone = "blue", children }: { tone?: "blue" | "red" | "green" | "gold"; children: ReactNode }) {
  const styles = {
    blue: "border-marine-100 bg-marine-50 text-marine-900",
    red: "border-danger-200 bg-danger-50 text-danger-900",
    green: "border-success-200 bg-success-50 text-success-900",
    gold: "border-gold-200 bg-gold-100 text-gold-700",
  };
  return <div role={tone === "red" ? "alert" : "status"} aria-live={tone === "red" ? "assertive" : "polite"} className={`mb-5 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm leading-relaxed ${styles[tone]}`}><AdminIcon name={tone === "green" ? "check" : tone === "red" || tone === "gold" ? "alert" : "overview"} className="mt-0.5 h-4 w-4 shrink-0" /><div className="min-w-0">{children}</div></div>;
}

export function Table({ children }: { children: ReactNode }) {
  return <div className="admin-table min-w-0 space-y-2">
    <p className="flex items-center gap-2 text-xs text-muted sm:hidden"><AdminIcon name="arrow" className="h-3.5 w-3.5" /> Swipe to see all columns</p>
    <div role="region" aria-label="Scrollable data table" tabIndex={0} className="relative max-w-full overflow-x-auto overscroll-x-contain rounded-2xl border border-line bg-white focus-visible:outline-marine-700">
      <table className="w-full min-w-[640px] text-left text-sm [&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-marine-50/30 [&_thead]:bg-[#f9fafc]">{children}</table>
    </div>
  </div>;
}

export const th = "whitespace-nowrap px-5 py-3.5 text-[11px] font-medium tracking-wide text-muted";
export const td = "px-5 py-4 align-middle text-foreground";
