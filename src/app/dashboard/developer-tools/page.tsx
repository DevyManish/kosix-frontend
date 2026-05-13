"use client";

import * as React from "react";
import {
  Activity,
  GitBranch,
  Plug,
  Plus,
  RefreshCw,
  SquareTerminal,
  Webhook,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Tool = {
  description: string;
  id: number;
  kind: "Trigger" | "Hook" | "Plugin";
  name: string;
  status: string;
};

const initialTools: Tool[] = [
  {
    description: "Runs a schema drift scan when new DDL is detected.",
    id: 1,
    kind: "Trigger",
    name: "Schema drift watcher",
    status: "Active",
  },
  {
    description: "Posts reviewed SQL to the data-platform channel.",
    id: 2,
    kind: "Hook",
    name: "Slack review hook",
    status: "Active",
  },
  {
    description: "Masks PII columns before query generation.",
    id: 3,
    kind: "Plugin",
    name: "PII masking plugin",
    status: "Draft",
  },
];

const iconByKind = {
  Hook: Webhook,
  Plugin: Plug,
  Trigger: GitBranch,
};

export default function DeveloperToolsPage() {
  const [kind, setKind] = React.useState<Tool["kind"]>("Trigger");
  const [message, setMessage] = React.useState("Create a tool to add it to the runtime list.");
  const [tools, setTools] = React.useState<Tool[]>(initialTools);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (!name || !description) {
      setMessage("Tool name and behavior are required.");
      return;
    }

    setTools((current) => [
      {
        description,
        id: Date.now(),
        kind,
        name,
        status: "Active",
      },
      ...current,
    ]);
    setMessage(`${kind} "${name}" is now active.`);
    form.reset();
    setKind("Trigger");
  }

  function rerunTool(id: number) {
    setTools((current) =>
      current.map((tool) =>
        tool.id === id
          ? {
              ...tool,
              status: "Active",
            }
          : tool,
      ),
    );
    setMessage("Tool executed successfully.");
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_390px]">
      <section className="min-w-0">
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground">
            Developer tools
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Triggers, hooks, and plugins
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {(["Trigger", "Hook", "Plugin"] as const).map((item) => {
            const Icon = iconByKind[item];
            return (
              <Card className="rounded-md shadow-sm" key={item}>
                <CardContent className="p-4">
                  <Icon className="size-5 text-muted-foreground" />
                  <p className="mt-4 font-semibold">{item}s</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {tools.filter((tool) => tool.kind === item).length} configured
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4">
          {tools.map((tool) => {
            const Icon = iconByKind[tool.kind];
            return (
              <Card className="rounded-md shadow-sm" key={tool.id}>
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex min-w-0 gap-3">
                      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                        <Icon className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">{tool.name}</h3>
                          <Badge variant="outline">{tool.kind}</Badge>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          tool.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                            : "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                        }
                      >
                        {tool.status}
                      </Badge>
                      <Button
                        onClick={() => rerunTool(tool.id)}
                        size="sm"
                        type="button"
                        variant="outline"
                      >
                        <RefreshCw className="size-4" />
                        Run
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <aside className="grid h-fit gap-4">
        <Card className="rounded-md shadow-sm">
          <CardHeader>
            <CardTitle>Create tool</CardTitle>
            <CardDescription>
              Add workflow automation to the dashboard runtime.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="tool-kind">Tool type</Label>
                <Select value={kind} onValueChange={(value) => setKind(value as Tool["kind"])}>
                  <SelectTrigger id="tool-kind" className="w-full">
                    <SelectValue placeholder="Choose type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Trigger">Trigger</SelectItem>
                    <SelectItem value="Hook">Hook</SelectItem>
                    <SelectItem value="Plugin">Plugin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tool-name">Name</Label>
                <Input id="tool-name" name="name" placeholder="Query guardrail" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tool-description">Behavior</Label>
                <Input
                  id="tool-description"
                  name="description"
                  placeholder="Block unrestricted production scans"
                />
              </div>
              <Button type="submit">
                <Plus className="size-4" />
                Add tool
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-md shadow-sm">
          <CardHeader>
            <CardTitle>Runtime log</CardTitle>
            <CardDescription>Latest action feedback.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md bg-neutral-950 p-4 font-mono text-xs leading-6 text-neutral-100">
              <p>$ kosix tools status</p>
              <p>{message}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="size-4" />
              {tools.length} runtime extensions loaded
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <SquareTerminal className="size-4" />
              Last execution completed in 184ms
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
