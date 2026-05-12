"use client";

import { useActionState } from "react";
import { Building2, Loader2, Plus } from "lucide-react";
import {
  createOrganization,
  type DashboardActionState,
} from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionToast } from "@/hooks/use-action-toast";

const initialState: DashboardActionState = {};

export function CreateOrganizationForm() {
  const [state, action, pending] = useActionState(
    createOrganization,
    initialState,
  );
  useActionToast(state, pending);

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="organization-name">Organization name</Label>
        <span className="relative">
          <Building2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-11 pl-10"
            id="organization-name"
            maxLength={120}
            name="name"
            required
            type="text"
          />
        </span>
        {state.fieldErrors?.name ? (
          <p className="text-sm text-destructive">
            {state.fieldErrors.name[0]}
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
          <Plus className="size-4" />
        )}
        Create organization
      </Button>
    </form>
  );
}
