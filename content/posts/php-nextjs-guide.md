---
title: "PHPエンジニアのためのNext.js App Router移行メモ"
date: "2026-01-02"
category: "PHP"
description: "SSRの感覚を保ちながらApp Routerに移行する際のポイント。"
slug: "php-to-nextjs-app-router"
---

## ルーティングの考え方

ファイルベースでページが決まり、Server Componentsが標準になります。

### セグメント構成

ディレクトリ構成がURLに直結するため、階層設計が重要です。

## データ取得の違い

従来のgetServerSidePropsに代わり、サーバーコンポーネント内で取得します。

```bash filename="scripts/build.sh"
npm run build
npm run start
```

## 互換性の注意点

クライアント専用APIは`"use client"`の境界を意識して配置します。

### 移行の手順

小さな画面単位で切り替え、段階的にApp Routerに寄せます。

## まとめ

PHPの設計感覚を活かしつつ、ルールを明確にするのがポイントです。
