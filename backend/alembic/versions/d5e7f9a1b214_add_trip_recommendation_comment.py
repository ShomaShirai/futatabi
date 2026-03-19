"""add trip recommendation comment

Revision ID: d5e7f9a1b214
Revises: c4d6e8f0a113
Create Date: 2026-03-20 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "d5e7f9a1b214"
down_revision = "c4d6e8f0a113"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("trips", sa.Column("recommendation_comment", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("trips", "recommendation_comment")
