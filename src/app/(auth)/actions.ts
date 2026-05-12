"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSiteUrl, hasSupabaseConfig } from "@/lib/env";
import { isEmailVerified } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirectPathWithToast, safeRedirectPath } from "@/lib/utils";

export type AuthActionState = {
  fieldErrors?: Record<string, string[] | undefined>;
  message?: string;
  status?: "error" | "success";
};

const emailSchema = z
  .string()
  .trim()
  .email("Enter a valid email address.")
  .max(320, "Email is too long.")
  .transform((value) => value.toLowerCase());

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password must be 128 characters or fewer.");

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const signupSchema = loginSchema.extend({
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(160, "Name must be 160 characters or fewer."),
});

function authFailureMessage(message?: string) {
  if (!message) {
    return "Authentication failed. Try again in a moment.";
  }

  if (message.toLowerCase().includes("invalid login credentials")) {
    return "Email or password is incorrect.";
  }

  return message;
}

function errorCode(error: unknown) {
  if (!error || typeof error !== "object" || !("code" in error)) {
    return null;
  }

  const code = (error as { code?: unknown }).code;
  return typeof code === "string" ? code : null;
}

function authNetworkFailure(error: unknown): AuthActionState {
  const cause = error instanceof Error ? error.cause : null;
  const code = errorCode(cause) ?? errorCode(error);

  if (code === "UNABLE_TO_GET_ISSUER_CERT_LOCALLY") {
    return {
      message:
        "Local Node.js rejected the Supabase TLS certificate. For local testing, restart with `npm run dev:insecure-tls -- --port 3000`, or add your network root CA with NODE_EXTRA_CA_CERTS.",
      status: "error",
    };
  }

  return {
    message: "Could not reach Supabase Auth. Check your network and .env values.",
    status: "error",
  };
}

function isAuthActionState(result: unknown): result is AuthActionState {
  if (!result || typeof result !== "object" || !("status" in result)) {
    return false;
  }

  return (
    (result as AuthActionState).status === "error" ||
    (result as AuthActionState).status === "success"
  );
}

async function getEmailRedirectTo() {
  const headersList = await headers();
  const origin = headersList.get("origin");

  return `${getSiteUrl(origin)}/auth/confirm?next=/dashboard`;
}

export async function login(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!hasSupabaseConfig()) {
    return {
      message:
        "Supabase is not configured yet. Add your project URL and publishable key to .env.local.",
      status: "error",
    };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      status: "error",
    };
  }

  const supabase = await createSupabaseServerClient();
  const signInResult = await supabase.auth
    .signInWithPassword(parsed.data)
    .catch((error: unknown) => authNetworkFailure(error));

  if (isAuthActionState(signInResult)) {
    return signInResult;
  }

  const { data, error } = signInResult;

  if (error || !data.user) {
    return {
      message: authFailureMessage(error?.message),
      status: "error",
    };
  }

  if (!isEmailVerified(data.user)) {
    await supabase.auth.signOut();

    return {
      message: "Verify your email address before logging in.",
      status: "error",
    };
  }

  redirect(
    redirectPathWithToast(safeRedirectPath(formData.get("next")), "signed-in"),
  );
}

export async function signup(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!hasSupabaseConfig()) {
    return {
      message:
        "Supabase is not configured yet. Add your project URL and publishable key to .env.local.",
      status: "error",
    };
  }

  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    fullName: formData.get("fullName"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      status: "error",
    };
  }

  const supabase = await createSupabaseServerClient();
  const signUpResult = await supabase.auth
    .signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: {
          full_name: parsed.data.fullName,
        },
        emailRedirectTo: await getEmailRedirectTo(),
      },
    })
    .catch((error: unknown) => authNetworkFailure(error));

  if (isAuthActionState(signUpResult)) {
    return signUpResult;
  }

  const { error } = signUpResult;

  if (error) {
    return {
      message: authFailureMessage(error.message),
      status: "error",
    };
  }

  await supabase.auth.signOut();

  return {
    message: "Verification email sent. Confirm your account before logging in.",
    status: "success",
  };
}

export async function resendVerification(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!hasSupabaseConfig()) {
    return {
      message:
        "Supabase is not configured yet. Add your project URL and publishable key to .env.local.",
      status: "error",
    };
  }

  const parsed = emailSchema.safeParse(formData.get("email"));

  if (!parsed.success) {
    return {
      fieldErrors: {
        email: parsed.error.flatten().formErrors,
      },
      status: "error",
    };
  }

  const supabase = await createSupabaseServerClient();
  const resendResult = await supabase.auth
    .resend({
      email: parsed.data,
      options: {
        emailRedirectTo: await getEmailRedirectTo(),
      },
      type: "signup",
    })
    .catch((error: unknown) => authNetworkFailure(error));

  if (isAuthActionState(resendResult)) {
    return resendResult;
  }

  const { error } = resendResult;

  if (error) {
    return {
      message: authFailureMessage(error.message),
      status: "error",
    };
  }

  return {
    message: "Verification email sent again.",
    status: "success",
  };
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login?toast=signed-out");
}
