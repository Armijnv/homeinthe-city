import Link from "next/link";
import type { ReactNode } from "react";

export type DashboardCardProps = {
  title: string;
  text: string;
  href?: string;
  action?: string;
  status?: string;
};

export function DashboardShell({
  eyebrow,
  title,
  intro,
  children,
  side,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
  side?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#1a1f2e] px-4 pt-24 pb-12 text-white sm:px-6 sm:pt-28 sm:pb-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 grid gap-4 sm:mb-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
          <div>
            <p className="mb-4 text-sm uppercase tracking-widest text-stone-400">
              {eyebrow}
            </p>
            <h1 className="text-3xl font-light leading-tight sm:text-4xl md:text-5xl">
              {title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-stone-300 sm:text-base">
              {intro}
            </p>
          </div>
          {side}
        </div>
        {children}
      </div>
    </div>
  );
}

export function DashboardCard({ title, text, href, action, status }: DashboardCardProps) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/10 p-4 shadow-xl shadow-black/10 sm:p-5">
      {status ? (
        <p className="mb-3 text-xs uppercase tracking-widest text-[#d6a85a]">
          {status}
        </p>
      ) : null}

      <h2 className="text-xl font-medium text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-stone-300">{text}</p>

      {href && action ? (
        <Link
          href={href}
          className="mt-5 inline-flex rounded-lg border border-white/15 px-4 py-3 text-sm text-white transition hover:border-[#d6a85a] hover:text-[#d6a85a]"
        >
          {action}
        </Link>
      ) : null}
    </section>
  );
}

export function BackToDashboard() {
  return (
    <Link
      href="/dashboard"
      className="mb-8 inline-flex rounded-lg border border-white/15 px-4 py-3 text-sm text-white transition hover:border-[#d6a85a] hover:text-[#d6a85a]"
    >
      Back to dashboard
    </Link>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-widest text-stone-300">
      {children}
    </span>
  );
}

export function DataTable({
  headers,
  children,
}: {
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/10">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-black/10 text-xs uppercase tracking-widest text-stone-400">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-5 py-4 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-stone-200">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TableLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="text-[#d6a85a] transition hover:text-white">
      {children}
    </Link>
  );
}
