---
title: "PHP ops playbook 3"
date: "2026-01-05"
category: "PHP"
description: "Notes for keeping PHP services stable (part 3)."
slug: "php-playbook-3"
---

## Overview

These notes cover routine maintenance steps for PHP services.

## Checklist

- Review error logs
- Verify cache health
- Run smoke tests

```php filename="app/Services/HealthCheck3.php"
<?php

final class HealthCheck3
{
    public function run(): string
    {
        return "ok";
    }
}
```
