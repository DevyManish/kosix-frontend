"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "@/lib/env";

export function createSupabaseBrowserClient() {
  const { publishableKey, url } = getSupabaseConfig();

  return createBrowserClient(url, publishableKey);
}
