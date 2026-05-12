import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, PhoneCallIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative mx-auto w-full max-w-5xl overflow-hidden px-4 pt-14 sm:pt-16">
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(45% 70% at 15% 0%, color-mix(in oklch, var(--foreground) 10%, transparent), transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 flex max-w-2xl flex-col gap-5">
        <Link
          className={cn(
            "group flex w-fit items-center gap-3 rounded-sm border bg-card p-1 shadow-xs",
            "fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-500 duration-500 ease-out",
          )}
          href="/signup"
        >
          <div className="rounded-xs border bg-card px-1.5 py-0.5 shadow-sm">
            <p className="font-mono text-xs">BETA</p>
          </div>
          <span className="text-xs">agent AI for database teams</span>
          <span className="block h-5 border-l" />
          <div className="pr-1">
            <ArrowRightIcon className="size-3 -translate-x-0.5 duration-150 ease-out group-hover:translate-x-0.5" />
          </div>
        </Link>

        <h1
          className={cn(
            "text-balance text-4xl font-medium leading-tight text-foreground md:text-5xl",
            "fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-100 duration-500 ease-out",
          )}
        >
          Supercharge your database with agent AI
        </h1>

        <p
          className={cn(
            "max-w-2xl text-sm leading-7 text-muted-foreground sm:text-lg md:text-xl",
            "fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards delay-200 duration-500 ease-out",
          )}
        >
          KOSIX turns natural language into governed SQL across PostgreSQL,
          Oracle, and the enterprise databases your teams already trust.
        </p>

        <div className="fade-in slide-in-from-bottom-10 flex w-fit animate-in items-center justify-center gap-3 fill-mode-backwards pt-2 delay-300 duration-500 ease-out">
          <Button asChild variant="outline">
            <Link href="mailto:hello@kosix.ai">
              <PhoneCallIcon className="mr-2 size-4" data-icon="inline-start" />
              Book a call
            </Link>
          </Button>
          <Button asChild>
            <Link href="/signup">
              Get started
              <ArrowRightIcon className="ml-2 size-4" data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute -inset-x-16 inset-y-0 -translate-y-1/3 scale-125 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse at center, color-mix(in oklch, var(--foreground) 10%, transparent), transparent 65%)",
          }}
        />
        <div
          className={cn(
            "relative mt-8 overflow-hidden px-1 sm:mt-12 md:mt-20",
            "fade-in slide-in-from-bottom-5 animate-in fill-mode-backwards delay-100 duration-1000 ease-out",
          )}
        >
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-lg border bg-background p-2 shadow-xl ring-1 ring-card">
            <Image
              alt="KOSIX dashboard showing organization projects and database workflows"
              className="aspect-video rounded-lg border object-cover dark:hidden"
              height={1080}
              priority
              src="/dashboard-light.webp"
              width={1920}
            />
            <Image
              alt="KOSIX dashboard in dark mode"
              className="hidden aspect-video rounded-lg border object-cover dark:block"
              height={1080}
              priority
              src="/dashboard-dark.webp"
              width={1920}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
