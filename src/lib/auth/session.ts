import "server-only";

import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { MembershipStatus } from "@/generated/prisma/client";
import { hasSupabaseConfig } from "@/lib/env";
import { getPrisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export function isEmailVerified(user: User) {
  return Boolean(user.email_confirmed_at ?? user.confirmed_at);
}

function profileNameFromUser(user: User) {
  const fullName = user.user_metadata?.full_name;

  if (typeof fullName === "string" && fullName.trim()) {
    return fullName.trim().slice(0, 160);
  }

  return user.email?.split("@")[0] ?? null;
}

export const getCurrentSupabaseUser = cache(async () => {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
});

export async function ensureUserProfile(user: User) {
  const email = user.email?.toLowerCase();

  if (!email) {
    throw new Error("Authenticated Supabase user is missing an email address.");
  }

  const prisma = getPrisma();

  const profile = await prisma.userProfile.upsert({
    where: {
      id: user.id,
    },
    create: {
      email,
      fullName: profileNameFromUser(user),
      id: user.id,
    },
    update: {
      email,
      fullName: profileNameFromUser(user),
    },
  });

  await prisma.organizationMember.updateMany({
    data: {
      acceptedAt: new Date(),
      status: MembershipStatus.ACTIVE,
      userId: profile.id,
    },
    where: {
      email,
      status: MembershipStatus.INVITED,
      userId: null,
    },
  });

  return profile;
}

export const requireUser = cache(async () => {
  const user = await getCurrentSupabaseUser();

  if (!user) {
    redirect(
      "/login?message=Connect Supabase environment variables before opening the workspace.",
    );
  }

  if (!isEmailVerified(user)) {
    redirect(`/verify-email?email=${encodeURIComponent(user.email ?? "")}`);
  }

  const profile = await ensureUserProfile(user);

  return { profile, user };
});
