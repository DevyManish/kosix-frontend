import Link from "next/link";
import { DatabaseIcon } from "lucide-react";
import { ResendVerificationForm } from "@/components/auth/resend-verification-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";

type SearchParams = Promise<{
  email?: string | string[];
}>;

function first(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = await searchParams;

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-5 py-10 text-foreground">
      <div className="absolute right-5 top-5 z-10">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md rounded-md shadow-sm">
        <CardHeader>
          <Link
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold tracking-wide"
            href="/"
          >
            <span className="flex size-7 items-center justify-center rounded-md bg-foreground text-background">
              <DatabaseIcon className="size-4" />
            </span>
            KOSIX
          </Link>
          <p className="pt-6 text-sm font-medium text-muted-foreground">
            Verification required
          </p>
          <CardTitle className="text-2xl">Confirm your email</CardTitle>
          <CardDescription>
            Open the verification link from Supabase before entering the
            workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResendVerificationForm email={first(query.email)} />
        </CardContent>
      </Card>
    </main>
  );
}
