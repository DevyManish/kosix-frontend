import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value))
}

export function safeRedirectPath(value: FormDataEntryValue | string | null) {
  if (typeof value !== "string") {
    return "/dashboard"
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard"
  }

  return value
}

export function redirectPathWithToast(path: string, toast: string) {
  const hashIndex = path.indexOf("#")
  const pathWithoutHash = hashIndex >= 0 ? path.slice(0, hashIndex) : path
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : ""
  const queryIndex = pathWithoutHash.indexOf("?")
  const pathname =
    queryIndex >= 0 ? pathWithoutHash.slice(0, queryIndex) : pathWithoutHash
  const query = queryIndex >= 0 ? pathWithoutHash.slice(queryIndex + 1) : ""
  const searchParams = new URLSearchParams(query)

  searchParams.set("toast", toast)

  const nextQuery = searchParams.toString()

  return `${pathname}${nextQuery ? `?${nextQuery}` : ""}${hash}`
}
