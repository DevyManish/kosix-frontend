import Link from "next/link";
import { DatabaseIcon } from "lucide-react";
import { AuthForm } from "@/components/auth/auth-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";

type SearchParams = Promise<{
  message?: string | string[];
  next?: string | string[];
}>;

function first(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = await searchParams;

  return (
    <main className="relative grid min-h-screen bg-background px-5 py-10 text-foreground lg:grid-cols-[1fr_520px] lg:px-10">
      <div className="absolute right-5 top-5 z-10 lg:right-10">
        <ThemeToggle />
      </div>
      <section className="relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-md border bg-foreground p-8 text-background lg:min-h-full">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(50% 70% at 15% 10%, color-mix(in oklch, var(--background) 20%, transparent), transparent 70%)",
          }}
        />
        <Link
          className="relative inline-flex w-fit items-center gap-2 text-sm font-semibold tracking-wide"
          href="/"
        >
          <span className="flex size-7 items-center justify-center rounded-md bg-background text-foreground">
            <DatabaseIcon className="size-4" />
          </span>
          KOSIX
        </Link>
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-background/70">
            Secure access
          </p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">
            Bring governed agent AI database workspaces to every team.
          </h1>
        </div>
      </section>
      <section className="flex items-center justify-center py-8 lg:py-0">
        <Card className="w-full max-w-md rounded-md shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Log in</CardTitle>
            <CardDescription>
              Continue to your organizations and projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm
              message={first(query.message)}
              mode="login"
              next={first(query.next)}
            />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
