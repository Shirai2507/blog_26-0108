---
title: "PHP ops playbook 1"
date: "2026-01-03"
category: "PHP"
description: "Notes for keeping PHP services stable (part 1)."
slug: "php-playbook-1"
---

## Overview

These notes cover routine maintenance steps for PHP services.

## Checklist

- Review error logs
- Verify cache health
- Run smoke tests

```php filename="app/Services/HealthCheck1.php"
<?php

final class HealthCheck1
{
    public function run(): string
    {
        return "ok";
    }
}
```
