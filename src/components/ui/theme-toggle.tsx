"use client";

import * as React from "react";
import { MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type Theme = "dark" | "light";

const storageKey = "kosix-theme";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const [theme, setTheme] = React.useState<Theme>("light");

  React.useEffect(() => {
    const storedTheme = window.localStorage.getItem(storageKey);
    const preferredTheme =
      storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    applyTheme(preferredTheme);

    const frame = window.requestAnimationFrame(() => {
      setTheme(preferredTheme);
      setMounted(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem(storageKey, nextTheme);
  }

  const Icon = mounted ? (theme === "dark" ? SunIcon : MoonIcon) : SunMoonIcon;

  return (
    <Button
      aria-label="Toggle theme"
      onClick={toggleTheme}
      size="icon-lg"
      title="Toggle theme"
      type="button"
      variant="outline"
    >
      <Icon className="size-4" />
    </Button>
  );
}
