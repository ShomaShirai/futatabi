# octopus-pudding

ハッカソンチーム: たこすぷりん

## ふた旅アプリについて

ふた旅は、友達・家族・パートナーなど「誰かと一緒に行く旅」を計画しやすくするアプリです。  
行き先の検討、旅程づくり、移動ルート確認、参加メンバーとの共有を一つの体験としてまとめることを目指しています。

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
