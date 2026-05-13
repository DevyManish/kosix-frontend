"use client";

import * as React from "react";
import {
  BotMessageSquare,
  BrainCircuit,
  CircleCheck,
  Database,
  Paperclip,
  Plus,
  Send,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Message = {
  badges?: string[];
  content: string;
  id: number;
  role: "assistant" | "user";
  sql?: string;
};

const initialMessages: Message[] = [
  {
    content:
      "I can inspect connected schemas, draft SQL, explain joins, and flag risky queries before they run.",
    id: 1,
    role: "assistant",
  },
  {
    content:
      "Show me customers whose orders increased last month but whose support tickets also went up.",
    id: 2,
    role: "user",
  },
  {
    badges: ["Read only", "4 tables", "Cost estimate: low"],
    content:
      "I found matching tables in sales and support. This query keeps customer-level aggregation isolated and adds a ticket trend threshold.",
    id: 3,
    role: "assistant",
    sql: `select
  c.customer_name,
  sum(o.amount) as revenue_delta,
  count(t.id) as ticket_delta
from sales.orders o
join support.ticket_stream t using (customer_id)
join crm.customers c using (customer_id)
where o.order_month >= date_trunc('month', current_date) - interval '1 month'
group by c.customer_name
having sum(o.amount) > 0 and count(t.id) >= 3;`,
  },
];

const conversations = [
  {
    label: "Monthly revenue drilldown",
    status: "Ready",
    tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  {
    label: "Slow Teradata joins",
    status: "Tuning",
    tone: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  {
    label: "Finance access policy",
    status: "Guarded",
    tone: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  },
];

const sourceTables = [
  "sales.orders",
  "warehouse.inventory",
  "finance.invoice_events",
  "support.ticket_stream",
];

function answerFor(prompt: string, model: string, attachmentCount: number) {
  const lowerPrompt = prompt.toLowerCase();
  const attachmentText =
    attachmentCount > 0
      ? ` I also attached ${attachmentCount} uploaded file${
          attachmentCount === 1 ? "" : "s"
        } to this workspace context.`
      : "";

  if (lowerPrompt.includes("slow") || lowerPrompt.includes("optimize")) {
    return {
      content: `${model} reviewed the request and found a likely join pressure point. I would start by narrowing the date range before the fact table join and checking the warehouse stats.${attachmentText}`,
      sql: `explain analyze
select o.customer_id, count(*) as orders
from sales.orders o
where o.created_at >= current_date - interval '30 days'
group by o.customer_id;`,
      badges: ["Performance review", "Index hint", "Safe to test"],
    };
  }

  if (lowerPrompt.includes("schema") || lowerPrompt.includes("table")) {
    return {
      content: `${model} mapped the likely schema path. The safest first step is to inspect table shape, then generate the aggregate query from confirmed columns.${attachmentText}`,
      sql: `select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'sales'
  and table_name = 'orders'
order by ordinal_position;`,
      badges: ["Schema scan", "Metadata only", "No row data"],
    };
  }

  return {
    content: `${model} drafted a governed query plan for that request. It keeps reads isolated, labels assumptions, and is ready for review before execution.${attachmentText}`,
    sql: `select
  date_trunc('week', created_at) as week,
  count(*) as records,
  sum(amount) as total_amount
from sales.orders
where created_at >= current_date - interval '90 days'
group by 1
order by 1 desc;`,
    badges: ["Draft generated", "Read only", "Needs review"],
  };
}

export default function DashboardPage() {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [attachedFiles, setAttachedFiles] = React.useState<File[]>([]);
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [model, setModel] = React.useState("Kosix SQL Pro");
  const [prompt, setPrompt] = React.useState("");

  function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setAttachedFiles((current) => [...current, ...files]);
    event.target.value = "";
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      return;
    }

    const nextId = Date.now();
    const response = answerFor(trimmedPrompt, model, attachedFiles.length);

    setMessages((current) => [
      ...current,
      {
        content: trimmedPrompt,
        id: nextId,
        role: "user",
      },
      {
        ...response,
        id: nextId + 1,
        role: "assistant",
      },
    ]);
    setPrompt("");
    setAttachedFiles([]);
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="min-w-0">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Cossic bot
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Chat with your database workspace
            </h2>
          </div>
          <Badge className="rounded-md" variant="outline">
            <Sparkles className="size-3" />
            SQL agent online
          </Badge>
        </div>

        <Card className="min-h-[680px] rounded-md shadow-sm">
          <CardHeader className="border-b">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Assistant thread</CardTitle>
                <CardDescription>
                  Natural-language analysis with governed query suggestions.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kosix SQL Pro">Kosix SQL Pro</SelectItem>
                    <SelectItem value="Kosix Fast">Kosix Fast</SelectItem>
                    <SelectItem value="Kosix Audit">Kosix Audit</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" type="button" variant="outline">
                  <BrainCircuit className="size-4" />
                  Memory
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex min-h-[580px] flex-col p-0">
            <div className="flex-1 space-y-5 p-4 sm:p-6">
              {messages.map((message) =>
                message.role === "user" ? (
                  <div
                    className="ml-auto max-w-[88%] rounded-md bg-foreground p-4 text-background"
                    key={message.id}
                  >
                    <p className="text-sm leading-6">{message.content}</p>
                  </div>
                ) : (
                  <div className="flex max-w-[92%] gap-3" key={message.id}>
                    <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                      <BotMessageSquare className="size-4" />
                    </span>
                    <div className="space-y-3 rounded-md border bg-card p-4">
                      <p className="text-sm leading-6">{message.content}</p>
                      {message.sql ? (
                        <pre className="overflow-x-auto rounded-md bg-neutral-950 p-4 text-xs leading-6 text-neutral-100">
                          <code>{message.sql}</code>
                        </pre>
                      ) : null}
                      {message.badges ? (
                        <div className="flex flex-wrap gap-2">
                          {message.badges.map((badge) => (
                            <Badge key={badge} variant="secondary">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ),
              )}
            </div>

            <form className="border-t bg-muted/30 p-4" onSubmit={handleSubmit}>
              <input
                className="hidden"
                multiple
                onChange={handleFiles}
                ref={fileInputRef}
                type="file"
              />
              <div className="flex flex-col gap-3 rounded-md border bg-background p-3">
                <Textarea
                  className="min-h-24 resize-none border-0 px-0 shadow-none focus-visible:ring-0"
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder="Ask Cossic to write SQL, explain a metric, or inspect a schema..."
                  value={prompt}
                />
                {attachedFiles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {attachedFiles.map((file) => (
                      <Badge key={`${file.name}-${file.lastModified}`} variant="outline">
                        {file.name}
                      </Badge>
                    ))}
                  </div>
                ) : null}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="icon"
                      title="Attach a file"
                      type="button"
                      variant="outline"
                    >
                      <Plus className="size-4" />
                    </Button>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      <Paperclip className="size-4" />
                      Upload schema
                    </Button>
                  </div>
                  <Button disabled={!prompt.trim()} type="submit">
                    <Send className="size-4" />
                    Send
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>

      <aside className="grid h-fit gap-4">
        <Card className="rounded-md shadow-sm">
          <CardHeader>
            <CardTitle>Workspace context</CardTitle>
            <CardDescription>Sources available to the bot.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {sourceTables.map((table) => (
              <div
                className="flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2"
                key={table}
              >
                <span className="inline-flex min-w-0 items-center gap-2 text-sm">
                  <Database className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{table}</span>
                </span>
                <CircleCheck className="size-4 text-emerald-600" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-md shadow-sm">
          <CardHeader>
            <CardTitle>Recent threads</CardTitle>
            <CardDescription>Drafts and monitored conversations.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {conversations.map((item) => (
              <div className="rounded-md border bg-background p-3" key={item.label}>
                <p className="truncate text-sm font-medium">{item.label}</p>
                <span
                  className={`mt-2 inline-flex rounded-md px-2 py-1 text-xs font-medium ${item.tone}`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
