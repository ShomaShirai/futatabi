"""add trip participant count

Revision ID: e5b7c2a1d9f4
Revises: d4f1a8c9b2e3
Create Date: 2026-03-17 00:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "e5b7c2a1d9f4"
down_revision: Union[str, Sequence[str], None] = "d4f1a8c9b2e3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("trips", sa.Column("participant_count", sa.Integer(), nullable=True))
    op.execute("UPDATE trips SET participant_count = 1 WHERE participant_count IS NULL")
    op.alter_column("trips", "participant_count", nullable=False)


def downgrade() -> None:
    op.drop_column("trips", "participant_count")
