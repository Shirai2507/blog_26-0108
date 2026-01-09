---
title: "PHP refactor plan for legacy APIs"
date: "2026-01-05"
category: "PHP"
description: "Move slow endpoints behind a clear service boundary."
slug: "php-refactor-notes"
---

## Identify critical paths

Start with the slowest endpoints and isolate them.

## Introduce DTOs

Use typed payloads to reduce accidental shape changes.

```php filename="app/Services/ReportService.php"
<?php

final class ReportService
{
    public function build(array $input): array
    {
        return ["status" => "ok", "data" => $input];
    }
}
```

## Roll out safely

Shadow traffic first, then flip the new service on.
