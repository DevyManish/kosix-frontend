"use client";

import { useActionState } from "react";
import { Loader2, Send } from "lucide-react";
import {
  resendVerification,
  type AuthActionState,
} from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionToast } from "@/hooks/use-action-toast";

type ResendVerificationFormProps = {
  email?: string;
};

const initialState: AuthActionState = {};

export function ResendVerificationForm({
  email,
}: ResendVerificationFormProps) {
  const [state, action, pending] = useActionState(
    resendVerification,
    initialState,
  );
  useActionToast(state, pending);

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="resend-email">Email</Label>
        <Input
          className="h-11"
          defaultValue={email}
          id="resend-email"
          maxLength={320}
          name="email"
          required
          type="email"
        />
        {state.fieldErrors?.email ? (
          <p className="text-sm text-destructive">
            {state.fieldErrors.email[0]}
          </p>
        ) : null}
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
          <Send className="size-4" />
        )}
        Send verification
      </Button>
    </form>
  );
}
