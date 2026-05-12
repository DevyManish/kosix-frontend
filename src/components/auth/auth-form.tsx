"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, Loader2, LockKeyhole, Mail, UserRound } from "lucide-react";
import {
  login,
  signup,
  type AuthActionState,
} from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionToast } from "@/hooks/use-action-toast";

type AuthFormProps = {
  mode: "login" | "signup";
  message?: string;
  next?: string;
};

const initialState: AuthActionState = {};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="text-sm text-destructive">{errors[0]}</p>;
}

export function AuthForm({ message, mode, next }: AuthFormProps) {
  const action = mode === "login" ? login : signup;
  const [state, formAction, pending] = useActionState(action, initialState);
  const isLogin = mode === "login";
  useActionToast(state, pending);

  return (
    <form action={formAction} className="grid gap-5">
      {isLogin ? <input name="next" type="hidden" value={next ?? ""} /> : null}
      {message ? (
        <div className="rounded-md border bg-muted px-4 py-3 text-sm text-muted-foreground">
          {message}
        </div>
      ) : null}
      {isLogin ? null : (
        <div className="grid gap-2">
          <Label htmlFor="fullName">Name</Label>
          <span className="relative">
            <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoComplete="name"
              className="h-11 pl-10"
              id="fullName"
              maxLength={160}
              name="fullName"
              required
              type="text"
            />
          </span>
          <FieldError errors={state.fieldErrors?.fullName} />
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <span className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoComplete="email"
            className="h-11 pl-10"
            id="email"
            maxLength={320}
            name="email"
            required
            type="email"
          />
        </span>
        <FieldError errors={state.fieldErrors?.email} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <span className="relative">
          <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoComplete={isLogin ? "current-password" : "new-password"}
            className="h-11 pl-10"
            id="password"
            maxLength={128}
            minLength={8}
            name="password"
            required
            type="password"
          />
        </span>
        <FieldError errors={state.fieldErrors?.password} />
      </div>

      <Button
        className="h-11"
        disabled={pending}
        size="lg"
        type="submit"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ArrowRight className="size-4" />
        )}
        {isLogin ? "Log in" : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {isLogin ? "New here?" : "Already have an account?"}{" "}
        <Link
          className="font-semibold text-foreground underline-offset-4 hover:underline"
          href={isLogin ? "/signup" : "/login"}
        >
          {isLogin ? "Create an account" : "Log in"}
        </Link>
      </p>
    </form>
  );
}
