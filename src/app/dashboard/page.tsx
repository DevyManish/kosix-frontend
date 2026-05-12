import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Database,
  FolderKanban,
  UsersRound,
} from "lucide-react";
import { MembershipStatus } from "@/generated/prisma/client";
import { CreateOrganizationForm } from "@/components/dashboard/create-organization-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";
import { getPrisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const { profile } = await requireUser();
  const prisma = getPrisma();
  const memberships = await prisma.organizationMember.findMany({
    include: {
      organization: {
        include: {
          _count: {
            select: {
              members: true,
              projects: true,
            },
          },
          projects: {
            orderBy: {
              createdAt: "desc",
            },
            take: 3,
          },
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    where: {
      status: MembershipStatus.ACTIVE,
      userId: profile.id,
    },
  });

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <section className="min-w-0">
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground">
            Workspace overview
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Organizations
          </h1>
        </div>

        {memberships.length === 0 ? (
          <Card className="rounded-md border-dashed p-4">
            <CardContent className="p-4">
              <Building2 className="size-10 text-muted-foreground" />
              <h2 className="mt-5 text-2xl font-semibold">
                Create your first organization
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Organizations hold members, projects, and future database agents
                behind a single permission boundary.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {memberships.map(({ organization, role }) => (
              <Link
                className="group rounded-md border bg-card p-5 shadow-sm transition hover:bg-muted/40 hover:shadow-md"
                href={`/dashboard/orgs/${organization.slug}`}
                key={organization.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex size-9 items-center justify-center rounded-md border bg-background text-foreground">
                        <Building2 className="size-5" />
                      </span>
                      <div>
                        <h2 className="font-semibold">{organization.name}</h2>
                        <p className="text-sm text-muted-foreground">{role}</p>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="size-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground" />
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-md bg-muted px-3 py-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UsersRound className="size-4" />
                      Members
                    </div>
                    <p className="mt-1 text-xl font-semibold">
                      {organization._count.members}
                    </p>
                  </div>
                  <div className="rounded-md bg-muted px-3 py-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FolderKanban className="size-4" />
                      Projects
                    </div>
                    <p className="mt-1 text-xl font-semibold">
                      {organization._count.projects}
                    </p>
                  </div>
                  <div className="rounded-md bg-muted px-3 py-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Database className="size-4" />
                      Latest
                    </div>
                    <p className="mt-1 truncate text-sm font-medium">
                      {organization.projects[0]?.name ?? "No projects"}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-muted-foreground">
                  Created {formatDate(organization.createdAt)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Card className="h-fit rounded-md shadow-sm">
        <CardHeader>
          <CardTitle>New organization</CardTitle>
          <CardDescription>
            The creator becomes owner automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateOrganizationForm />
        </CardContent>
      </Card>
    </main>
  );
}
