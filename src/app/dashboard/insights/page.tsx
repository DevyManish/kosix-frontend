"use client";

import * as React from "react";
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  Lightbulb,
  Plus,
  Radar,
  Sparkles,
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

type Insight = {
  id: number;
  impact: string;
  status: "New" | "Acknowledged";
  title: string;
  type: string;
};

const initialInsights: Insight[] = [
  {
    id: 1,
    impact: "Support ticket joins grew 38% after the new CRM field shipped.",
    status: "New",
    title: "Join volume anomaly",
    type: "Anomaly",
  },
  {
    id: 2,
    impact: "Three repeated finance prompts can become a saved metric.",
    status: "New",
    title: "Metric candidate",
    type: "Recommendation",
  },
  {
    id: 3,
    impact: "Two plugins overlap on PII masking for customer email.",
    status: "Acknowledged",
    title: "Policy overlap",
    type: "Governance",
  },
];

export default function InsightsPage() {
  const [insights, setInsights] = React.useState(initialInsights);
  const [monitorType, setMonitorType] = React.useState("Anomaly");
  const [message, setMessage] = React.useState("Insights update as you acknowledge or create monitors.");

  function acknowledge(id: number) {
    setInsights((current) =>
      current.map((insight) =>
        insight.id === id
          ? {
              ...insight,
              status: "Acknowledged",
            }
          : insight,
      ),
    );
    setMessage("Insight acknowledged.");
  }

  function createMonitor(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title") ?? "").trim();
    const impact = String(formData.get("impact") ?? "").trim();

    if (!title || !impact) {
      setMessage("Monitor title and signal are required.");
      return;
    }

    setInsights((current) => [
      {
        id: Date.now(),
        impact,
        status: "New",
        title,
        type: monitorType,
      },
      ...current,
    ]);
    setMessage(`${monitorType} monitor created.`);
    form.reset();
    setMonitorType("Anomaly");
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section className="min-w-0">
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground">Insights</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Recommendations and anomalies
          </h2>
        </div>

        <div className="grid gap-4">
          {insights.map((insight) => (
            <Card className="rounded-md shadow-sm" key={insight.id}>
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 gap-3">
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                      {insight.type === "Anomaly" ? (
                        <AlertTriangle className="size-5" />
                      ) : insight.type === "Governance" ? (
                        <BrainCircuit className="size-5" />
                      ) : (
                        <Lightbulb className="size-5" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{insight.title}</h3>
                        <Badge variant="outline">{insight.type}</Badge>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {insight.impact}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        insight.status === "New"
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                          : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      }
                    >
                      {insight.status}
                    </Badge>
                    <Button
                      disabled={insight.status === "Acknowledged"}
                      onClick={() => acknowledge(insight.id)}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      <CheckCircle2 className="size-4" />
                      Acknowledge
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <aside className="grid h-fit gap-4">
        <Card className="rounded-md shadow-sm">
          <CardHeader>
            <CardTitle>Create monitor</CardTitle>
            <CardDescription>
              Add a new insight rule to the workspace stream.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={createMonitor}>
              <div className="grid gap-2">
                <Label htmlFor="monitor-type">Monitor type</Label>
                <Select value={monitorType} onValueChange={setMonitorType}>
                  <SelectTrigger id="monitor-type" className="w-full">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Anomaly">Anomaly</SelectItem>
                    <SelectItem value="Recommendation">Recommendation</SelectItem>
                    <SelectItem value="Governance">Governance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="monitor-title">Title</Label>
                <Input id="monitor-title" name="title" placeholder="Cost spike detector" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="monitor-impact">Signal</Label>
                <Input
                  id="monitor-impact"
                  name="impact"
                  placeholder="Alert when query cost rises above weekly baseline"
                />
              </div>
              <Button type="submit">
                <Plus className="size-4" />
                Create monitor
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-md shadow-sm">
          <CardContent className="grid gap-3 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Radar className="size-4" />
              {insights.filter((insight) => insight.status === "New").length} open signals
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="size-4" />
              {message}
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
