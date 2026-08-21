"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * The initial theme is applied by an inline script in the layout, before the first paint. This
 * mirrors the `.dark` class on <html> as external state, so the toggle can expose aria-pressed
 * without a setState-in-effect, and stays correct if the class changes elsewhere.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

export function ThemeToggle({ label }: { label: string }) {
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => false,
  );

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.theme = next ? "dark" : "light";
  }

  return (
    <Button variant="ghost" size="icon" aria-label={label} aria-pressed={dark} title={label} onClick={toggle}>
      {dark ? <Moon /> : <Sun />}
    </Button>
  );
}
