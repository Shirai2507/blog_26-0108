"use client";

import { useEffect } from "react";

export default function CodeCopy() {
  useEffect(() => {
    const handler = async (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }

      const button = target.closest<HTMLButtonElement>("[data-code-copy]");
      if (!button) {
        return;
      }

      const wrapper = button.closest<HTMLElement>("[data-code-block]");
      const code = wrapper?.querySelector("pre code");
      const text = code?.textContent ?? "";

      if (!text) {
        return;
      }

      try {
        await navigator.clipboard.writeText(text);
        button.textContent = "Copied";
      } catch {
        button.textContent = "Failed";
      }

      window.setTimeout(() => {
        button.textContent = "Copy";
      }, 1600);
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return null;
}
