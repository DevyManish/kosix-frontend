import { notFound, redirect } from "next/navigation";
import {
  Activity,
  Database,
  FolderKanban,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import {
  MembershipStatus,
  OrganizationRole,
} from "@/generated/prisma/client";
import { CreateProjectForm } from "@/components/dashboard/create-project-form";
import { InviteMemberForm } from "@/components/dashboard/invite-member-form";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";
import { getPrisma } from "@/lib/prisma";
import { cn, formatDate } from "@/lib/utils";

type OrganizationPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function readableDatasource(value: string) {
  return value
    .replace("SQLSERVER", "SQL Server")
    .replace("BIGQUERY", "BigQuery")
    .replace(/_/g, " ");
}

export default async function OrganizationPage({
  params,
}: OrganizationPageProps) {
  const { slug } = await params;
  const { profile } = await requireUser();
  const prisma = getPrisma();
  const membership = await prisma.organizationMember.findFirst({
    where: {
      organization: {
        slug,
      },
      status: MembershipStatus.ACTIVE,
      userId: profile.id,
    },
  });

  if (!membership) {
    const exists = await prisma.organization.findUnique({
      select: { id: true },
      where: { slug },
    });

    if (!exists) {
      notFound();
    }

    redirect("/dashboard");
  }

  const organization = await prisma.organization.findUnique({
    include: {
      members: {
        include: {
          user: true,
        },
        orderBy: [{ status: "asc" }, { createdAt: "asc" }],
      },
      projects: {
        include: {
          createdBy: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    where: {
      id: membership.organizationId,
    },
  });

  if (!organization) {
    notFound();
  }

  const canManageMembers =
    membership.role === OrganizationRole.OWNER ||
    membership.role === OrganizationRole.ADMIN;

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-5 py-8">
      <Card className="rounded-md shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Organization
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                {organization.name}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {organization.slug} - Your role is {membership.role}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-md bg-muted px-4 py-3">
                <UsersRound className="mx-auto size-4 text-muted-foreground" />
                <p className="mt-1 text-xl font-semibold">
                  {organization.members.length}
                </p>
              </div>
              <div className="rounded-md bg-muted px-4 py-3">
                <FolderKanban className="mx-auto size-4 text-muted-foreground" />
                <p className="mt-1 text-xl font-semibold">
                  {organization.projects.length}
                </p>
              </div>
              <div className="rounded-md bg-muted px-4 py-3">
                <ShieldCheck className="mx-auto size-4 text-muted-foreground" />
                <p className="mt-1 text-xl font-semibold">
                  {canManageMembers ? "Admin" : "User"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Card className="min-w-0 rounded-md shadow-sm">
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>
              Database workspaces for agentic SQL workflows.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {organization.projects.length === 0 ? (
              <div className="rounded-md border border-dashed bg-muted/50 p-6">
                <Database className="size-8 text-muted-foreground" />
                <h3 className="mt-4 font-semibold">No projects yet</h3>
                <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                  Create a project for each database domain, customer workspace,
                  or governed analytics surface.
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {organization.projects.map((project) => (
                  <article
                    className="rounded-md border bg-background p-4 transition hover:bg-muted/40"
                    key={project.id}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{project.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {project.description ?? "No description"}
                        </p>
                      </div>
                      <Badge
                        className="rounded-md bg-background"
                        variant="outline"
                      >
                        {readableDatasource(project.datasourceKind)}
                      </Badge>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Activity className="size-3.5" />
                        {project.status}
                      </span>
                      <span>Created {formatDate(project.createdAt)}</span>
                      <span>By {project.createdBy.email}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <aside className="grid h-fit gap-6">
          <Card className="rounded-md shadow-sm">
            <CardHeader>
              <CardTitle>New project</CardTitle>
              <CardDescription>
                Pick the first target database family.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateProjectForm organizationId={organization.id} />
            </CardContent>
          </Card>

          <Card className="rounded-md shadow-sm">
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                Existing users are activated; unknown emails stay invited.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {canManageMembers ? (
                <div className="mb-5">
                  <InviteMemberForm organizationId={organization.id} />
                </div>
              ) : null}
              <div className="grid gap-2">
                {organization.members.map((member) => (
                  <div
                    className="rounded-md border bg-background px-3 py-2"
                    key={member.id}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="min-w-0 truncate text-sm font-medium">
                        {member.user?.fullName ?? member.email}
                      </p>
                      <span
                        className={cn(
                          "rounded-md px-2 py-1 text-xs font-medium",
                          member.status === MembershipStatus.ACTIVE
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                            : "bg-amber-500/10 text-amber-700 dark:text-amber-300",
                        )}
                      >
                        {member.status}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {member.email} - {member.role}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  );
}
