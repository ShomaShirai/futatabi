# octopus-pudding

ハッカソンチーム: たこすぷりん

## 「ふた旅」アプリとは

「ふた旅」は、ユーザにとって最適な旅行プランを提案・再構築するAI旅行アプリです。

旅行プランを「作る」だけでなく、
状況に応じて“ふたたびつくり直す（＝ふた旅）”ことをコンセプトにしています。

主な機能
- 🎨 好みに合わせた旅行プランを0から自動生成
- 🔁 天候・時間・トラブルに応じたリアルタイム再プランニング
-	🧠 AIによる柔軟な意思決定サポート


## 開発背景・課題

みなさん、旅行がプラン通りにいかなかったことはありませんか？

- 行きたい場所は決まっているけど、その間の過ごし方がわからない
- プランを作ったけど、天候や混雑で崩れてしまう
- 現地での判断が難しく、最適な行動ができない

こういった経験は、多くの人が感じています。

しかし、既存のAIのみでは、
- 静的なプラン生成が中心
- リアルタイムの状況変化に弱い
- 「自分らしい最適な選択」まで踏み込めない

という課題があります。

## 解決方法

「ふた旅」は、
“プランは固定されるものではなく、更新され続けるもの”という発想を採用しました。
- ユーザの状況・環境に応じてプランを再構築
- 一貫した好みを維持しながら柔軟に変化
- 意思決定を支援するインタラクティブなAI


## プロジェクト概要

ふた旅アプリのモノレポです。以下の3つの領域で構成されています。

- `mobile`: Expo/React Native アプリ
- `backend`: FastAPI ベースのAPIサーバー
- `terraform`: GCPデプロイ基盤（Cloud Run / Cloud SQL / Artifact Registry / Cloud Build など）

## プロジェクト構成

```text
.
├── mobile/      # Expo + React Native フロントエンド
├── backend/     # FastAPI バックエンド
└── terraform/   # インフラ (IaC)
```

## 技術構成

### モバイル

- **Expo**: クロスプラットフォーム開発基盤
- **React Native**: モバイルUI実装
- **Expo Router**: 画面ルーティング
- **Firebase**: 認証などのモバイル連携
- **TypeScript**: 型安全な実装

### バックエンド

- **FastAPI**: モダンなPython Webフレームワーク
- **PostgreSQL**: リレーショナルデータベース
- **SQLAlchemy**: ORM
- **Alembic**: データベースマイグレーション
- **Clean Architecture**: ドメイン駆動設計
- **Poetry**: Python依存関係管理
- **Docker**: コンテナ実行基盤

### インフラ

- **Terraform**: インフラのコード管理
- **Google Cloud Run**: APIホスティング
- **Cloud SQL (PostgreSQL)**: マネージドDB
- **Artifact Registry**: コンテナイメージ管理
- **Cloud Build**: CI/CDビルド・デプロイ
- **Secret Manager**: シークレット管理

## 使用している主なAPI

- **Firebase Authentication API**: IDトークン検証と認証連携
- **Google Cloud Storage API**: 画像などのオブジェクト保存
- **Google Places API**: スポット検索
- **Google Routes / Directions API**: 経路計算
- **Gemini API**: 旅行プラン生成・提案

## ドキュメント

- バックエンド詳細: `backend/README.md`
- モバイル詳細: `mobile/README.md`
- Terraform詳細: `terraform/README.md`
