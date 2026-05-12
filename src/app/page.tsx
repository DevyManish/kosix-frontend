import type { LucideIcon } from "lucide-react";
import {
  BadgeCheckIcon,
  DatabaseZapIcon,
  ShieldCheckIcon,
} from "lucide-react";

import { Header } from "@/components/ui/header-3";
import { HeroSection } from "@/components/ui/hero-3";

const featureItems: Array<{
  description: string;
  icon: LucideIcon;
  title: string;
}> = [
  {
    description: "Ask questions in plain English and turn intent into SQL.",
    icon: DatabaseZapIcon,
    title: "NL to SQL agents",
  },
  {
    description: "Separate organizations, members, projects, and access rules.",
    icon: BadgeCheckIcon,
    title: "Tenant-first workspaces",
  },
  {
    description: "Keep generated SQL explainable, reviewable, and auditable.",
    icon: ShieldCheckIcon,
    title: "Governed execution",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="grow overflow-hidden">
        <HeroSection />
        <section
          className="mx-auto grid max-w-5xl gap-3 px-4 pb-16 pt-8 sm:grid-cols-3"
          id="product"
        >
          {featureItems.map(({ description, icon: Icon, title }) => (
            <article
              className="rounded-md border bg-card p-4 shadow-sm"
              key={title}
            >
              <Icon className="size-5 text-emerald-600 dark:text-emerald-300" />
              <h2 className="mt-4 text-sm font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
