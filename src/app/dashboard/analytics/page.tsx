"use client";

import * as React from "react";
import {
  BarChart3,
  Clock,
  Database,
  Gauge,
  RefreshCw,
  TrendingUp,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const bars = [46, 72, 58, 88, 64, 93, 81, 68, 76, 90, 74, 84];

export default function AnalyticsPage() {
  const [range, setRange] = React.useState("Last 30 days");
  const [refreshCount, setRefreshCount] = React.useState(0);

  const multiplier = range === "Last 7 days" ? 0.4 : range === "Last quarter" ? 2.6 : 1;
  const queries = Math.round(12400 * multiplier + refreshCount * 17);
  const savedHours = Math.round(286 * multiplier + refreshCount * 2);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Analytics</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Usage and performance trends
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Last 7 days">Last 7 days</SelectItem>
              <SelectItem value="Last 30 days">Last 30 days</SelectItem>
              <SelectItem value="Last quarter">Last quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setRefreshCount((count) => count + 1)} type="button" variant="outline">
            <RefreshCw className="size-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { icon: BarChart3, label: "Queries generated", value: queries.toLocaleString() },
          { icon: Gauge, label: "Median latency", value: "1.8s" },
          { icon: Database, label: "Connected sources", value: "8" },
          { icon: Clock, label: "Analyst hours saved", value: savedHours.toLocaleString() },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card className="rounded-md shadow-sm" key={item.label}>
              <CardContent className="p-4">
                <Icon className="size-5 text-muted-foreground" />
                <p className="mt-4 text-2xl font-semibold">{item.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="rounded-md shadow-sm">
          <CardHeader>
            <CardTitle>Query volume</CardTitle>
            <CardDescription>{range} across all workspaces.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-72 items-end gap-3 rounded-md border bg-muted/30 p-4">
              {bars.map((bar, index) => (
                <div className="flex flex-1 flex-col items-center gap-2" key={index}>
                  <div
                    className="w-full rounded-t-md bg-foreground"
                    style={{
                      height: `${Math.min(96, Math.max(18, bar * multiplier * 0.75))}%`,
                    }}
                  />
                  <span className="text-xs text-muted-foreground">{index + 1}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <aside className="grid h-fit gap-4">
          <Card className="rounded-md shadow-sm">
            <CardHeader>
              <CardTitle>Top metrics</CardTitle>
              <CardDescription>Most requested dashboard outputs.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {["Revenue by customer", "Ticket escalation rate", "Inventory freshness"].map(
                (metric, index) => (
                  <div
                    className="flex items-center justify-between gap-3 rounded-md border bg-background p-3"
                    key={metric}
                  >
                    <span className="text-sm font-medium">{metric}</span>
                    <Badge variant="secondary">{92 - index * 11}%</Badge>
                  </div>
                ),
              )}
            </CardContent>
          </Card>
          <Card className="rounded-md shadow-sm">
            <CardContent className="flex items-center gap-3 p-4 text-sm text-muted-foreground">
              <TrendingUp className="size-4 text-emerald-600" />
              Refreshed {refreshCount} time{refreshCount === 1 ? "" : "s"} in this session.
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
