.PHONY: migrate dry-run apply current rollback up down status

# Docker Composeサービスを起動
up:
	docker compose up -d

# Docker Composeサービスを停止
down:
	docker compose down

# サービスの状態を確認
status:
	docker compose ps

# マイグレーションを作成（例: make migrate name="add hoge table"）
migrate:
	docker compose exec api poetry run alembic revision --autogenerate -m '$(name)'

# マイグレーションをローカルで確認（SQLファイル出力）
dry-run:
	docker compose exec api poetry run alembic upgrade head --sql > migration.sql

# マイグレーションを適用
apply:
	docker compose exec api poetry run alembic upgrade head

# DBの状態を確認
current:
	docker compose exec api poetry run alembic current

# DBのダウングレード（1つ前に戻す）
rollback:
	docker compose exec api poetry run alembic downgrade -1