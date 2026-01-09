---
title: "Performance budgets for content sites"
date: "2026-01-06"
category: "Performance"
description: "Set a clear budget for JS and images to keep pages fast."
slug: "performance-budgets"
---

## Define budgets early

Agree on a max JS size and keep it visible in reviews.

## Measure continuously

Track LCP and CLS in production, not just local builds.

```bash filename="scripts/check-bundle.sh"
node scripts/check-bundle.js --max-js=200
```

## Keep images lean

Use modern formats and avoid oversized hero images.
