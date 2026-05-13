"use client";

import * as React from "react";
import {
  BadgeCheck,
  CreditCard,
  Download,
  ReceiptText,
  ShieldCheck,
  UsersRound,
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

const plans = [
  {
    name: "Starter",
    price: "$49",
    seats: "5 seats",
    summary: "For early SQL assistant workflows.",
  },
  {
    name: "Growth",
    price: "$149",
    seats: "20 seats",
    summary: "For teams connecting several databases.",
  },
  {
    name: "Enterprise",
    price: "Custom",
    seats: "Unlimited seats",
    summary: "For governed rollout with security reviews.",
  },
];

const invoices = ["INV-2026-041", "INV-2026-040", "INV-2026-039"];

export default function PlansBillingPage() {
  const [activePlan, setActivePlan] = React.useState("Growth");
  const [downloadedInvoice, setDownloadedInvoice] = React.useState("");
  const [message, setMessage] = React.useState("Billing profile is ready to edit.");

  function saveBilling(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const company = String(formData.get("company") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();

    if (!company || !email) {
      setMessage("Company and billing email are required.");
      return;
    }

    setMessage(`Billing profile saved for ${company}.`);
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <p className="text-sm font-medium text-muted-foreground">
          Plans & billing
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
          Manage plan, seats, and invoices
        </h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="min-w-0">
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                className={`rounded-md shadow-sm ${
                  activePlan === plan.name ? "ring-2 ring-foreground" : ""
                }`}
                key={plan.name}
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle>{plan.name}</CardTitle>
                    {activePlan === plan.name ? (
                      <BadgeCheck className="size-5 text-emerald-600" />
                    ) : null}
                  </div>
                  <CardDescription>{plan.summary}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div>
                    <p className="text-3xl font-semibold">{plan.price}</p>
                    <p className="text-sm text-muted-foreground">{plan.seats}</p>
                  </div>
                  <Button
                    disabled={activePlan === plan.name}
                    onClick={() => {
                      setActivePlan(plan.name);
                      setMessage(`${plan.name} plan selected.`);
                    }}
                    type="button"
                    variant={activePlan === plan.name ? "secondary" : "outline"}
                  >
                    {activePlan === plan.name ? "Current plan" : "Choose plan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6 rounded-md shadow-sm">
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>Download billing documents for finance.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {invoices.map((invoice) => (
                <div
                  className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-background p-3"
                  key={invoice}
                >
                  <div className="flex items-center gap-3">
                    <ReceiptText className="size-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{invoice}</span>
                  </div>
                  <Button
                    onClick={() => {
                      setDownloadedInvoice(invoice);
                      setMessage(`${invoice} is ready in the billing drawer.`);
                    }}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    <Download className="size-4" />
                    Download
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <aside className="grid h-fit gap-4">
          <Card className="rounded-md shadow-sm">
            <CardHeader>
              <CardTitle>Billing profile</CardTitle>
              <CardDescription>Save invoice contact details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4" onSubmit={saveBilling}>
                <div className="grid gap-2">
                  <Label htmlFor="billing-company">Company</Label>
                  <Input id="billing-company" name="company" placeholder="Kosix Labs" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="billing-email">Billing email</Label>
                  <Input
                    id="billing-email"
                    name="email"
                    placeholder="finance@company.com"
                    type="email"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="billing-tax">Tax ID</Label>
                  <Input id="billing-tax" name="taxId" placeholder="Optional" />
                </div>
                <Button type="submit">
                  <CreditCard className="size-4" />
                  Save billing
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-md shadow-sm">
            <CardContent className="grid gap-3 p-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-600" />
                {message}
              </div>
              <div className="flex items-center gap-2">
                <UsersRound className="size-4" />
                Active plan: {activePlan}
              </div>
              {downloadedInvoice ? (
                <Badge variant="outline">Last invoice: {downloadedInvoice}</Badge>
              ) : null}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
