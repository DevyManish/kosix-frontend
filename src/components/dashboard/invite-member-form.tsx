"use client";

import { useActionState } from "react";
import { Loader2, MailPlus } from "lucide-react";
import {
  inviteMember,
  type DashboardActionState,
} from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActionToast } from "@/hooks/use-action-toast";

type InviteMemberFormProps = {
  organizationId: string;
};

const initialState: DashboardActionState = {};

export function InviteMemberForm({ organizationId }: InviteMemberFormProps) {
  const [state, action, pending] = useActionState(
    inviteMember.bind(null, organizationId),
    initialState,
  );
  useActionToast(state, pending);

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="member-email">Email</Label>
        <Input
          className="h-11"
          id="member-email"
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
      <div className="grid gap-2">
        <Label>Role</Label>
        <Select defaultValue="MEMBER" name="role" required>
          <SelectTrigger className="h-11 w-full justify-between">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MEMBER">Member</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
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
          <MailPlus className="size-4" />
        )}
        Add member
      </Button>
    </form>
  );
}
