"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "../../lib/markdown";

type SidebarTocProps = {
  items: TocItem[];
};

export default function SidebarToc({ items }: SidebarTocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (targets.length === 0) {
      return;
    }

    setActiveId(targets[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          );
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "0px 0px -65% 0px", threshold: [0, 1] }
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
        目次
      </p>
      <ul className="mt-4 space-y-2 text-sm text-slate-600">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block transition ${
                  item.level === 3 ? "pl-3 text-xs" : ""
                } ${isActive ? "text-slate-900" : "text-slate-500"}`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
