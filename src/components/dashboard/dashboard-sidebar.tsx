"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BotMessageSquare,
  CreditCard,
  Database,
  Files,
  Lightbulb,
  Settings,
  Upload,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type NavItem = {
  description: string;
  href: string;
  icon: LucideIcon;
  label: string;
};

const navItems: NavItem[] = [
  {
    description: "Ask questions and generate SQL",
    href: "/dashboard",
    icon: BotMessageSquare,
    label: "Cossic bot",
  },
  {
    description: "Connect warehouses and databases",
    href: "/dashboard/databases",
    icon: Database,
    label: "Databases",
  },
  {
    description: "Triggers, hooks, and plugins",
    href: "/dashboard/developer-tools",
    icon: Wrench,
    label: "Developer tools",
  },
  {
    description: "Import schemas and documents",
    href: "/dashboard/upload",
    icon: Upload,
    label: "Upload",
  },
  {
    description: "Browse uploaded assets",
    href: "/dashboard/files",
    icon: Files,
    label: "Files",
  },
  {
    description: "Usage trends and latency",
    href: "/dashboard/analytics",
    icon: BarChart3,
    label: "Analytics",
  },
  {
    description: "Recommendations and anomalies",
    href: "/dashboard/insights",
    icon: Lightbulb,
    label: "Insights",
  },
  {
    description: "Seats, plan, and invoices",
    href: "/dashboard/plans-billing",
    icon: CreditCard,
    label: "Plans & billing",
  },
  {
    description: "Workspace preferences",
    href: "/dashboard/settings",
    icon: Settings,
    label: "Settings",
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <aside className="border-b bg-sidebar text-sidebar-foreground lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-r lg:border-b-0">
      <div className="flex h-full flex-col gap-4 px-4 py-4">
        <Link className="flex items-center gap-3 px-1" href="/dashboard">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-foreground text-background">
            <Database className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold leading-5">KOSIX</span>
            <span className="block truncate text-xs text-muted-foreground">
              Agentic SQL workspace
            </span>
          </span>
        </Link>

        <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex min-w-48 items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition lg:min-w-0",
                  active
                    ? "bg-foreground text-background shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
                href={item.href}
                key={item.href}
              >
                <span
                  className={cn(
                    "inline-flex size-8 shrink-0 items-center justify-center rounded-md border",
                    active
                      ? "border-background/20 bg-background/10"
                      : "border-sidebar-border bg-background/70",
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium">
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      "block truncate text-xs",
                      active
                        ? "text-background/70"
                        : "text-muted-foreground",
                    )}
                  >
                    {item.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden rounded-md border border-sidebar-border bg-background/70 p-3 lg:block">
          <p className="text-xs font-medium text-muted-foreground">
            Signed in
          </p>
          <p className="mt-1 truncate text-sm font-medium">{email}</p>
        </div>
      </div>
    </aside>
  );
}
