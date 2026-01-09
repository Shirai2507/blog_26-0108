---
title: "Cache strategies for data-heavy pages"
date: "2026-01-03"
category: "Performance"
description: "Balance freshness and speed with layered caches."
slug: "cache-strategies"
---

## Split by volatility

Cache stable data longer and keep volatile data short-lived.

## Edge caching

Use CDN caching for read-heavy endpoints.

```ts filename="lib/cache.ts"
export function buildCacheKey(input: string): string {
  return `cache:${input}`;
}
```

## Invalidate carefully

Tag cache entries so you can clear them surgically.
