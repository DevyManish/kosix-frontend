import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirectPathWithToast, safeRedirectPath } from "@/lib/utils";

type EmailOtpType =
  | "signup"
  | "invite"
  | "magiclink"
  | "recovery"
  | "email_change"
  | "email"
  | (string & {});

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeRedirectPath(searchParams.get("next"));
  const supabase = await createSupabaseServerClient();

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    if (!error) {
      return NextResponse.redirect(
        new URL(redirectPathWithToast(next, "email-verified"), request.url),
      );
    }
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(
        new URL(redirectPathWithToast(next, "email-verified"), request.url),
      );
    }
  }

  const failedUrl = new URL("/login", request.url);
  failedUrl.searchParams.set(
    "message",
    "Email confirmation failed or the link expired.",
  );

  return NextResponse.redirect(failedUrl);
}
