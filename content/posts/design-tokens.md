---
title: "Design tokens that scale across pages"
date: "2026-01-04"
category: "UI/UX"
description: "Keep spacing and type consistent with a token system."
slug: "design-tokens"
---

## Start with spacing

Define a small set of spacing values and reuse them everywhere.

## Typography tokens

Pair a display scale with a readable body scale.

```css filename="app/tokens.css"
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
}
```

## Document decisions

Write down why each token exists so the system stays coherent.
