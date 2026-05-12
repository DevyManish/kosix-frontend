"use client";

import * as React from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3Icon,
  BotIcon,
  BrainCircuitIcon,
  Building2Icon,
  DatabaseIcon,
  FileTextIcon,
  GitBranchIcon,
  LockKeyholeIcon,
  PlugIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersRoundIcon,
  WorkflowIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

type LinkItem = {
  description?: string;
  href: string;
  icon: LucideIcon;
  title: string;
};

export function Header() {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-transparent transition-colors",
        scrolled &&
          "border-border bg-background/90 shadow-sm shadow-foreground/5 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60",
      )}
    >
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-5">
          <Link
            aria-label="KOSIX home"
            className="inline-flex items-center gap-2 rounded-md p-2 font-semibold hover:bg-accent"
            href="/"
          >
            <span className="flex size-7 items-center justify-center rounded-md bg-foreground text-background">
              <DatabaseIcon className="size-4" />
            </span>
            <span className="tracking-wide">KOSIX</span>
          </Link>
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Product</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background p-1">
                  <ul className="grid w-[38rem] grid-cols-2 gap-2 rounded-md border bg-popover p-2 shadow">
                    {productLinks.map((item) => (
                      <li key={item.title}>
                        <ListItem {...item} />
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Platform</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-background p-1">
                  <div className="grid w-[34rem] grid-cols-[1.1fr_0.9fr] gap-2 rounded-md border bg-popover p-2 shadow">
                    <ul className="space-y-2">
                      {platformLinks.map((item) => (
                        <li key={item.title}>
                          <ListItem {...item} />
                        </li>
                      ))}
                    </ul>
                    <div className="rounded-md bg-muted p-4">
                      <SparklesIcon className="size-5 text-emerald-600 dark:text-emerald-300" />
                      <p className="mt-3 text-sm font-medium">
                        Agent AI for real database work
                      </p>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        Plan, generate, explain, and govern SQL across the
                        systems your teams already rely on.
                      </p>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  href="#security"
                >
                  Security
                </Link>
              </NavigationMenuLink>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button asChild variant="outline">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get started</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            aria-controls="mobile-menu"
            aria-expanded={open}
            aria-label="Toggle menu"
            className="md:hidden"
            onClick={() => setOpen((value) => !value)}
            size="icon-lg"
            type="button"
            variant="outline"
          >
            <MenuToggleIcon className="size-5" duration={300} open={open} />
          </Button>
        </div>
      </nav>

      <MobileMenu
        className="flex flex-col justify-between gap-6 overflow-y-auto"
        open={open}
      >
        <div className="grid gap-5">
          <MobileGroup label="Product" links={productLinks} />
          <MobileGroup label="Platform" links={platformLinks} />
        </div>
        <div className="grid gap-2">
          <Button asChild className="w-full bg-transparent" variant="outline">
            <Link href="/login" onClick={() => setOpen(false)}>
              Sign in
            </Link>
          </Button>
          <Button asChild className="w-full">
            <Link href="/signup" onClick={() => setOpen(false)}>
              Get started
            </Link>
          </Button>
        </div>
      </MobileMenu>
    </header>
  );
}

type MobileMenuProps = React.ComponentProps<"div"> & {
  open: boolean;
};

function MobileMenu({ className, children, open, ...props }: MobileMenuProps) {
  if (!open || typeof window === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed bottom-0 left-0 right-0 top-14 z-40 flex flex-col overflow-hidden border-y bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 md:hidden"
      id="mobile-menu"
    >
      <div
        className={cn(
          "size-full animate-in zoom-in-95 p-4 duration-150",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

function ListItem({
  className,
  description,
  href,
  icon: Icon,
  title,
  ...props
}: React.ComponentProps<typeof NavigationMenuLink> & LinkItem) {
  return (
    <NavigationMenuLink asChild {...props}>
      <Link
        className={cn(
          "flex w-full flex-row items-center gap-3 rounded-sm p-2 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className,
        )}
        href={href}
      >
        <span className="flex aspect-square size-11 items-center justify-center rounded-md border bg-background/50 shadow-sm">
          <Icon className="size-5 text-foreground" />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="font-medium">{title}</span>
          {description ? (
            <span className="text-xs leading-5 text-muted-foreground">
              {description}
            </span>
          ) : null}
        </span>
      </Link>
    </NavigationMenuLink>
  );
}

function MobileGroup({
  label,
  links,
}: {
  label: string;
  links: LinkItem[];
}) {
  return (
    <div className="grid gap-2">
      <p className="px-2 text-sm font-medium text-muted-foreground">{label}</p>
      {links.map((link) => (
        <Link
          className="flex items-center gap-3 rounded-md p-2 hover:bg-accent"
          href={link.href}
          key={link.title}
        >
          <span className="flex size-10 items-center justify-center rounded-md border bg-background">
            <link.icon className="size-5" />
          </span>
          <span>
            <span className="block font-medium">{link.title}</span>
            {link.description ? (
              <span className="block text-xs text-muted-foreground">
                {link.description}
              </span>
            ) : null}
          </span>
        </Link>
      ))}
    </div>
  );
}

function useScroll(threshold: number) {
  const [scrolled, setScrolled] = React.useState(false);

  const onScroll = React.useCallback(() => {
    setScrolled(window.scrollY > threshold);
  }, [threshold]);

  React.useEffect(() => {
    window.addEventListener("scroll", onScroll);
    const frame = window.requestAnimationFrame(onScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  return scrolled;
}

const productLinks: LinkItem[] = [
  {
    description: "Ask business questions and receive governed SQL.",
    href: "#product",
    icon: BrainCircuitIcon,
    title: "Natural language to SQL",
  },
  {
    description: "Run agents with scoped access inside each workspace.",
    href: "#product",
    icon: BotIcon,
    title: "Database agents",
  },
  {
    description: "Map organizations, projects, members, and permissions.",
    href: "#product",
    icon: Building2Icon,
    title: "Tenant workspaces",
  },
  {
    description: "Explain queries, lineage, joins, and result intent.",
    href: "#product",
    icon: GitBranchIcon,
    title: "Query reasoning",
  },
  {
    description: "PostgreSQL today, Oracle and enterprise stores next.",
    href: "#databases",
    icon: PlugIcon,
    title: "Database connectors",
  },
  {
    description: "Keep every generated query reviewable and auditable.",
    href: "#security",
    icon: ShieldCheckIcon,
    title: "Governance",
  },
];

const platformLinks: LinkItem[] = [
  {
    description: "Invite admins, analysts, builders, and operators.",
    href: "/signup",
    icon: UsersRoundIcon,
    title: "Team access",
  },
  {
    description: "Verified email auth with secure organization boundaries.",
    href: "/signup",
    icon: LockKeyholeIcon,
    title: "Secure onboarding",
  },
  {
    description: "Track usage patterns and database workflows.",
    href: "#product",
    icon: BarChart3Icon,
    title: "Operational insight",
  },
  {
    description: "Document generated SQL and decisions as your agents work.",
    href: "#product",
    icon: FileTextIcon,
    title: "Query memory",
  },
  {
    description: "Chain planning, SQL generation, review, and execution.",
    href: "#product",
    icon: WorkflowIcon,
    title: "Agentic workflows",
  },
];
