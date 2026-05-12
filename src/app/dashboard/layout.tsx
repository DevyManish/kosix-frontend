import Link from "next/link";
import { DatabaseIcon, LogOut, UserRound } from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { requireUser } from "@/lib/auth/session";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { profile } = await requireUser();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <Link className="inline-flex items-center gap-2 font-semibold" href="/">
            <span className="inline-flex size-9 items-center justify-center rounded-md bg-foreground text-background">
              <DatabaseIcon className="size-5" />
            </span>
            KOSIX
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm text-muted-foreground sm:flex">
              <UserRound className="size-4" />
              <span className="max-w-52 truncate">{profile.email}</span>
            </div>
            <ThemeToggle />
            <form action={logout}>
              <Button
                size="icon-lg"
                title="Log out"
                type="submit"
                variant="outline"
              >
                <LogOut className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
