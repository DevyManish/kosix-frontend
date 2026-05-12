"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  DatasourceKind,
  MembershipStatus,
  OrganizationRole,
} from "@/generated/prisma/client";
import { requireUser } from "@/lib/auth/session";
import { getPrisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { redirectPathWithToast } from "@/lib/utils";

export type DashboardActionState = {
  fieldErrors?: Record<string, string[] | undefined>;
  message?: string;
  status?: "error" | "success";
};

const organizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Organization name must be at least 2 characters.")
    .max(120, "Organization name must be 120 characters or fewer."),
});

const datasourceKinds = [
  "POSTGRESQL",
  "ORACLE",
  "MYSQL",
  "SQLSERVER",
  "SNOWFLAKE",
  "BIGQUERY",
  "OTHER",
] as const;

const projectSchema = z.object({
  datasourceKind: z.enum(datasourceKinds),
  description: z
    .string()
    .trim()
    .max(500, "Description must be 500 characters or fewer.")
    .optional()
    .transform((value) => (value ? value : undefined)),
  name: z
    .string()
    .trim()
    .min(2, "Project name must be at least 2 characters.")
    .max(120, "Project name must be 120 characters or fewer."),
});

const inviteSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(320, "Email is too long.")
    .transform((value) => value.toLowerCase()),
  role: z.enum(["ADMIN", "MEMBER"]),
});

async function uniqueOrganizationSlug(name: string) {
  const prisma = getPrisma();
  const base = slugify(name);

  for (let index = 0; index < 20; index += 1) {
    const slug = index === 0 ? base : `${base}-${index + 1}`;
    const existing = await prisma.organization.findUnique({
      select: { id: true },
      where: { slug },
    });

    if (!existing) {
      return slug;
    }
  }

  return `${base}-${crypto.randomUUID().slice(0, 8)}`;
}

async function uniqueProjectSlug(organizationId: string, name: string) {
  const prisma = getPrisma();
  const base = slugify(name);

  for (let index = 0; index < 20; index += 1) {
    const slug = index === 0 ? base : `${base}-${index + 1}`;
    const existing = await prisma.project.findUnique({
      select: { id: true },
      where: {
        organizationId_slug: {
          organizationId,
          slug,
        },
      },
    });

    if (!existing) {
      return slug;
    }
  }

  return `${base}-${crypto.randomUUID().slice(0, 8)}`;
}

async function requireActiveMembership(organizationId: string) {
  const { profile } = await requireUser();
  const prisma = getPrisma();
  const membership = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId: profile.id,
      },
    },
  });

  if (!membership || membership.status !== MembershipStatus.ACTIVE) {
    return {
      error: "You do not have access to this organization.",
      membership: null,
      profile,
    };
  }

  return { error: null, membership, profile };
}

export async function createOrganization(
  _state: DashboardActionState,
  formData: FormData,
): Promise<DashboardActionState> {
  const parsed = organizationSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      status: "error",
    };
  }

  const { profile } = await requireUser();
  const prisma = getPrisma();
  const slug = await uniqueOrganizationSlug(parsed.data.name);
  const organization = await prisma.organization.create({
    data: {
      members: {
        create: {
          acceptedAt: new Date(),
          email: profile.email,
          role: OrganizationRole.OWNER,
          status: MembershipStatus.ACTIVE,
          userId: profile.id,
        },
      },
      name: parsed.data.name,
      ownerId: profile.id,
      slug,
    },
    select: {
      slug: true,
    },
  });

  revalidatePath("/dashboard");
  redirect(
    redirectPathWithToast(
      `/dashboard/orgs/${organization.slug}`,
      "organization-created",
    ),
  );
}

export async function createProject(
  organizationId: string,
  _state: DashboardActionState,
  formData: FormData,
): Promise<DashboardActionState> {
  const parsed = projectSchema.safeParse({
    datasourceKind: formData.get("datasourceKind"),
    description: formData.get("description")?.toString(),
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      status: "error",
    };
  }

  const access = await requireActiveMembership(organizationId);

  if (!access.membership) {
    return {
      message: access.error ?? "You do not have access to this organization.",
      status: "error",
    };
  }

  const prisma = getPrisma();
  const organization = await prisma.organization.findUnique({
    select: { slug: true },
    where: { id: organizationId },
  });

  if (!organization) {
    return {
      message: "Organization not found.",
      status: "error",
    };
  }

  await prisma.project.create({
    data: {
      createdById: access.profile.id,
      datasourceKind: parsed.data.datasourceKind as DatasourceKind,
      description: parsed.data.description,
      name: parsed.data.name,
      organizationId,
      slug: await uniqueProjectSlug(organizationId, parsed.data.name),
    },
  });

  revalidatePath(`/dashboard/orgs/${organization.slug}`);

  return {
    message: "Project created.",
    status: "success",
  };
}

export async function inviteMember(
  organizationId: string,
  _state: DashboardActionState,
  formData: FormData,
): Promise<DashboardActionState> {
  const parsed = inviteSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      status: "error",
    };
  }

  const access = await requireActiveMembership(organizationId);

  if (!access.membership) {
    return {
      message: access.error ?? "You do not have access to this organization.",
      status: "error",
    };
  }

  if (
    access.membership.role !== OrganizationRole.OWNER &&
    access.membership.role !== OrganizationRole.ADMIN
  ) {
    return {
      message: "Only owners and admins can manage members.",
      status: "error",
    };
  }

  const prisma = getPrisma();
  const organization = await prisma.organization.findUnique({
    select: { slug: true },
    where: { id: organizationId },
  });

  if (!organization) {
    return {
      message: "Organization not found.",
      status: "error",
    };
  }

  const invitedProfile = await prisma.userProfile.findUnique({
    select: { id: true },
    where: { email: parsed.data.email },
  });

  if (invitedProfile) {
    const existingUserMembership =
      await prisma.organizationMember.findUnique({
        where: {
          organizationId_userId: {
            organizationId,
            userId: invitedProfile.id,
          },
        },
      });

    if (
      existingUserMembership &&
      existingUserMembership.email !== parsed.data.email
    ) {
      return {
        message: "That user already belongs to this organization.",
        status: "error",
      };
    }
  }

  const existingEmailMembership = await prisma.organizationMember.findUnique({
    where: {
      organizationId_email: {
        email: parsed.data.email,
        organizationId,
      },
    },
  });

  if (existingEmailMembership?.status === MembershipStatus.ACTIVE) {
    return {
      message: "That email is already an active member.",
      status: "error",
    };
  }

  const status = invitedProfile
    ? MembershipStatus.ACTIVE
    : MembershipStatus.INVITED;

  await prisma.organizationMember.upsert({
    create: {
      acceptedAt: invitedProfile ? new Date() : undefined,
      email: parsed.data.email,
      invitedById: access.profile.id,
      organizationId,
      role: parsed.data.role as OrganizationRole,
      status,
      userId: invitedProfile?.id,
    },
    update: {
      acceptedAt: invitedProfile ? new Date() : null,
      invitedById: access.profile.id,
      role: parsed.data.role as OrganizationRole,
      status,
      userId: invitedProfile?.id,
    },
    where: {
      organizationId_email: {
        email: parsed.data.email,
        organizationId,
      },
    },
  });

  revalidatePath(`/dashboard/orgs/${organization.slug}`);

  return {
    message: invitedProfile
      ? "Member added."
      : "Invitation staged for this email.",
    status: "success",
  };
}
