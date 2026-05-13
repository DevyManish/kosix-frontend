import Link from "next/link";
import { LogOut, Search, UserRound } from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
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
      <div className="flex min-h-screen flex-col lg:flex-row">
        <DashboardSidebar email={profile.email} />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65">
            <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <Link className="min-w-0" href="/dashboard">
                <p className="text-xs font-medium text-muted-foreground">
                  Dashboard
                </p>
                <h1 className="truncate text-base font-semibold">
                  KOSIX control room
                </h1>
              </Link>
              <div className="flex items-center gap-3">
                <div className="hidden h-9 min-w-64 items-center gap-2 rounded-md border bg-card px-3 text-sm text-muted-foreground md:flex">
                  <Search className="size-4" />
                  <span>Search schemas, files, tools...</span>
                </div>
                <div className="hidden items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm text-muted-foreground sm:flex">
                  <UserRound className="size-4" />
                  <span className="max-w-44 truncate">{profile.email}</span>
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

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
