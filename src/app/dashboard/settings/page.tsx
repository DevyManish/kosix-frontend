"use client";

import * as React from "react";
import {
  BadgeCheck,
  KeyRound,
  LockKeyhole,
  RefreshCw,
  Save,
  Settings,
  SlidersHorizontal,
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

export default function SettingsPage() {
  const [apiKey, setApiKey] = React.useState("ksx_live_masked_8421");
  const [message, setMessage] = React.useState("Settings are ready.");
  const [retention, setRetention] = React.useState("90 days");
  const [strictMode, setStrictMode] = React.useState(true);

  function saveWorkspace(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("workspace") ?? "").trim();

    if (!name) {
      setMessage("Workspace name is required.");
      return;
    }

    setMessage(`${name} settings saved with ${retention} retention.`);
  }

  function rotateKey() {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    setApiKey(`ksx_live_masked_${suffix}`);
    setMessage("API key rotated for this session.");
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="min-w-0">
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground">Settings</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Workspace preferences
          </h2>
        </div>

        <Card className="rounded-md shadow-sm">
          <CardHeader>
            <CardTitle>General settings</CardTitle>
            <CardDescription>
              Configure workspace identity and governance defaults.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-5" onSubmit={saveWorkspace}>
              <div className="grid gap-2">
                <Label htmlFor="workspace-name">Workspace name</Label>
                <Input
                  defaultValue="KOSIX Data Platform"
                  id="workspace-name"
                  name="workspace"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="retention-window">Query log retention</Label>
                <Select value={retention} onValueChange={setRetention}>
                  <SelectTrigger id="retention-window" className="w-full">
                    <SelectValue placeholder="Retention" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30 days">30 days</SelectItem>
                    <SelectItem value="90 days">90 days</SelectItem>
                    <SelectItem value="1 year">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <label className="flex items-center justify-between gap-4 rounded-md border bg-background p-3 text-sm">
                <span>
                  <span className="block font-medium">Strict approval mode</span>
                  <span className="text-muted-foreground">
                    Require review before production SQL runs.
                  </span>
                </span>
                <input
                  checked={strictMode}
                  className="size-4 rounded border-input accent-foreground"
                  onChange={(event) => setStrictMode(event.target.checked)}
                  type="checkbox"
                />
              </label>
              <Button type="submit">
                <Save className="size-4" />
                Save settings
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6 rounded-md shadow-sm">
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage API access for integrations.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-background p-3">
              <div className="flex min-w-0 items-center gap-3">
                <KeyRound className="size-4 text-muted-foreground" />
                <span className="truncate font-mono text-sm">{apiKey}</span>
              </div>
              <Button onClick={rotateKey} type="button" variant="outline">
                <RefreshCw className="size-4" />
                Rotate
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-md border bg-muted/30 p-4">
                <LockKeyhole className="size-4 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium">Secrets policy</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Credentials are masked in the interface.
                </p>
              </div>
              <div className="rounded-md border bg-muted/30 p-4">
                <SlidersHorizontal className="size-4 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium">Approval mode</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {strictMode ? "Strict review enabled." : "Review is advisory."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <aside className="grid h-fit gap-4">
        <Card className="rounded-md shadow-sm">
          <CardHeader>
            <CardTitle>Status</CardTitle>
            <CardDescription>Current workspace posture.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BadgeCheck className="size-4 text-emerald-600" />
              {message}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Settings className="size-4" />
              Retention: {retention}
            </div>
            <Badge variant={strictMode ? "default" : "outline"}>
              {strictMode ? "Strict mode" : "Advisory mode"}
            </Badge>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
