"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * The initial theme is applied by an inline script in the layout, before the first paint. Which
 * icon shows is decided by CSS from the same class, so this holds no state of its own.
 */
export function ThemeToggle({ label }: { label: string }) {
  function toggle() {
    const dark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", dark);
    localStorage.theme = dark ? "dark" : "light";
  }

  return (
    <Button variant="ghost" size="icon" aria-label={label} title={label} onClick={toggle}>
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </Button>
  );
}
