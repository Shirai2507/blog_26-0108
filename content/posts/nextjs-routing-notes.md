---
title: "Next.js App Router patterns for 2026"
date: "2026-01-07"
category: "Next.js"
description: "Routing, layouts, and streaming tips that keep pages predictable."
slug: "nextjs-routing-notes"
---

## Why routing conventions matter

App Router favors clear folder intent, so keep route segments short and stable.

## Layout boundaries

Use nested layouts to keep sidebars and headers persistent.

```tsx filename="app/blog/layout.tsx"
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <section className="blog-layout">{children}</section>;
}
```

## Loading and error states

Pair route groups with loading UI so navigation remains calm during fetches.
