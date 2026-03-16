"""add ai plan generations and itinerary sequence

Revision ID: d4f1a8c9b2e3
Revises: c1a7b8d9e2f3
Create Date: 2026-03-16 22:30:00.000000

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd4f1a8c9b2e3'
down_revision = 'c1a7b8d9e2f3'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('itinerary_items', sa.Column('sequence', sa.Integer(), nullable=True))

    op.create_unique_constraint(
        'uq_trip_preferences_trip_id',
        'trip_preferences',
        ['trip_id'],
    )
    op.create_unique_constraint(
        'uq_trip_days_trip_id_day_number',
        'trip_days',
        ['trip_id', 'day_number'],
    )

    op.create_table(
        'ai_plan_generations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('trip_id', sa.Integer(), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=False),
        sa.Column('provider', sa.String(length=100), nullable=True),
        sa.Column('prompt_version', sa.String(length=50), nullable=True),
        sa.Column('requested_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('started_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('finished_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('result_summary_json', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['trip_id'], ['trips.id']),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_ai_plan_generations_id'), 'ai_plan_generations', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_ai_plan_generations_id'), table_name='ai_plan_generations')
    op.drop_table('ai_plan_generations')

    op.drop_constraint('uq_trip_days_trip_id_day_number', 'trip_days', type_='unique')
    op.drop_constraint('uq_trip_preferences_trip_id', 'trip_preferences', type_='unique')

    op.drop_column('itinerary_items', 'sequence')
