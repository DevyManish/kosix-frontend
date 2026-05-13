"use client";

import * as React from "react";
import {
  Cable,
  CircleCheck,
  Database,
  KeyRound,
  LockKeyhole,
  Server,
  ShieldCheck,
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

type Connection = {
  database: string;
  engine: string;
  host: string;
  id: number;
  name: string;
  port: string;
  ssl: boolean;
  status: string;
  username: string;
};

const starterConnections: Connection[] = [
  {
    database: "warehouse",
    engine: "Postgres",
    host: "pg.analytics.internal",
    id: 1,
    name: "Production warehouse",
    port: "5432",
    ssl: true,
    status: "Connected",
    username: "readonly_agent",
  },
  {
    database: "finance",
    engine: "Oracle",
    host: "oracle-fin.ops.local",
    id: 2,
    name: "Finance read replica",
    port: "1521",
    ssl: true,
    status: "Needs rotation",
    username: "kosix_finance",
  },
];

const enginePorts: Record<string, string> = {
  MySQL: "3306",
  Oracle: "1521",
  Postgres: "5432",
  Teradata: "1025",
};

export default function DatabasesPage() {
  const [connections, setConnections] =
    React.useState<Connection[]>(starterConnections);
  const [engine, setEngine] = React.useState("Postgres");
  const [message, setMessage] = React.useState(
    "Connection details are validated locally for this prototype.",
  );
  const [port, setPort] = React.useState(enginePorts.Postgres);

  function handleEngineChange(value: string) {
    setEngine(value);
    setPort(enginePorts[value] ?? "");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const host = String(formData.get("host") ?? "").trim();
    const database = String(formData.get("database") ?? "").trim();
    const username = String(formData.get("username") ?? "").trim();
    const port = String(formData.get("port") ?? enginePorts[engine] ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!name || !host || !database || !username || !password) {
      setMessage("Add name, host, database, username, and password to continue.");
      return;
    }

    setConnections((current) => [
      {
        database,
        engine,
        host,
        id: Date.now(),
        name,
        port,
        ssl: formData.get("ssl") === "on",
        status: "Connected",
        username,
      },
      ...current,
    ]);
    setMessage(`${name} was added and marked connected.`);
    form.reset();
    setEngine("Postgres");
    setPort(enginePorts.Postgres);
  }

  function testConnection(id: number) {
    setConnections((current) =>
      current.map((connection) =>
        connection.id === id
          ? {
              ...connection,
              status: "Connected",
            }
          : connection,
      ),
    );
    setMessage("Connection test completed successfully.");
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <section className="min-w-0">
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground">Databases</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Connect database sources
          </h2>
        </div>

        <div className="grid gap-4">
          {connections.map((connection) => (
            <Card className="rounded-md shadow-sm" key={connection.id}>
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex size-10 items-center justify-center rounded-md bg-muted">
                        <Database className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold">
                          {connection.name}
                        </h3>
                        <p className="truncate text-sm text-muted-foreground">
                          {connection.engine} - {connection.host}:{connection.port}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="secondary">{connection.database}</Badge>
                      <Badge variant="secondary">{connection.username}</Badge>
                      {connection.ssl ? <Badge variant="outline">SSL</Badge> : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      className={
                        connection.status === "Connected"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                      }
                    >
                      {connection.status}
                    </Badge>
                    <Button
                      onClick={() => testConnection(connection.id)}
                      type="button"
                      variant="outline"
                    >
                      <Cable className="size-4" />
                      Test
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
            <CardTitle>Add database</CardTitle>
            <CardDescription>
              Oracle, MySQL, Postgres, and Teradata are ready to configure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="database-engine">Database type</Label>
                <Select value={engine} onValueChange={handleEngineChange}>
                  <SelectTrigger id="database-engine" className="w-full">
                    <SelectValue placeholder="Select database" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Oracle">Oracle</SelectItem>
                    <SelectItem value="MySQL">MySQL</SelectItem>
                    <SelectItem value="Postgres">Postgres</SelectItem>
                    <SelectItem value="Teradata">Teradata</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="db-name">Connection name</Label>
                <Input id="db-name" name="name" placeholder="Revenue warehouse" />
              </div>
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_110px]">
                <div className="grid gap-2">
                  <Label htmlFor="db-host">Host</Label>
                  <Input id="db-host" name="host" placeholder="db.company.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="db-port">Port</Label>
                  <Input
                    id="db-port"
                    name="port"
                    onChange={(event) => setPort(event.target.value)}
                    placeholder="5432"
                    value={port}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="db-database">Database or service</Label>
                <Input id="db-database" name="database" placeholder="analytics" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="db-username">Username</Label>
                <Input id="db-username" name="username" placeholder="readonly_agent" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="db-password">Password</Label>
                <Input id="db-password" name="password" placeholder="********" type="password" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  className="size-4 rounded border-input accent-foreground"
                  defaultChecked
                  name="ssl"
                  type="checkbox"
                />
                Require SSL
              </label>
              <Button type="submit">
                <Server className="size-4" />
                Add database
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-md shadow-sm">
          <CardContent className="grid gap-3 p-4">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 size-4 text-emerald-600" />
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
            <div className="flex gap-3">
              <LockKeyhole className="mt-0.5 size-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Passwords are used only for this in-page connection preview.
              </p>
            </div>
            <div className="flex gap-3">
              <KeyRound className="mt-0.5 size-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Rotate credentials from Settings once a secrets backend is wired.
              </p>
            </div>
            <div className="flex gap-3">
              <CircleCheck className="mt-0.5 size-4 text-emerald-600" />
              <p className="text-sm text-muted-foreground">
                New entries appear immediately in the connections list.
              </p>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
