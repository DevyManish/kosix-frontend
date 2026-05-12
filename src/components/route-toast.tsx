"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const routeToasts = {
  "email-verified": {
    description: "You can now create organizations and projects.",
    title: "Email verified",
    type: "success",
  },
  "organization-created": {
    description: "Your workspace is ready.",
    title: "Organization created",
    type: "success",
  },
  "signed-in": {
    description: "Welcome back.",
    title: "Signed in",
    type: "success",
  },
  "signed-out": {
    description: "Your session has ended.",
    title: "Signed out",
    type: "success",
  },
} as const;

export function RouteToast() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const toastKey = searchParams.get("toast");

    if (!toastKey) {
      return;
    }

    const routeToast = routeToasts[toastKey as keyof typeof routeToasts];

    if (routeToast) {
      if (routeToast.type === "success") {
        toast.success(routeToast.title, {
          description: routeToast.description,
        });
      } else {
        toast.error(routeToast.title, {
          description: routeToast.description,
        });
      }
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("toast");

    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
      scroll: false,
    });
  }, [pathname, router, searchParams]);

  return null;
}
