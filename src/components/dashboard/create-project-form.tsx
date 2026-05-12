"use client";

import { useActionState } from "react";
import { Database, Loader2, Plus } from "lucide-react";
import {
  createProject,
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
import { Textarea } from "@/components/ui/textarea";
import { useActionToast } from "@/hooks/use-action-toast";

type CreateProjectFormProps = {
  organizationId: string;
};

const initialState: DashboardActionState = {};

const datasourceOptions = [
  ["POSTGRESQL", "PostgreSQL"],
  ["ORACLE", "Oracle"],
  ["MYSQL", "MySQL"],
  ["SQLSERVER", "SQL Server"],
  ["SNOWFLAKE", "Snowflake"],
  ["BIGQUERY", "BigQuery"],
  ["OTHER", "Other"],
] as const;

export function CreateProjectForm({ organizationId }: CreateProjectFormProps) {
  const [state, action, pending] = useActionState(
    createProject.bind(null, organizationId),
    initialState,
  );
  useActionToast(state, pending);

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="project-name">Project name</Label>
        <Input
          className="h-11"
          id="project-name"
          maxLength={120}
          name="name"
          required
          type="text"
        />
        {state.fieldErrors?.name ? (
          <p className="text-sm text-destructive">
            {state.fieldErrors.name[0]}
          </p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <Label>Datasource</Label>
        <Select defaultValue="POSTGRESQL" name="datasourceKind" required>
          <SelectTrigger className="h-11 w-full justify-between">
            <span className="flex items-center gap-2">
              <Database className="size-4 text-muted-foreground" />
              <SelectValue placeholder="Select database" />
            </span>
          </SelectTrigger>
          <SelectContent>
            {datasourceOptions.map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="project-description">Description</Label>
        <Textarea
          className="min-h-24 resize-y"
          id="project-description"
          maxLength={500}
          name="description"
        />
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
        Create project
      </Button>
    </form>
  );
}
