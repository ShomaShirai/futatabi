import argparse
import asyncio
from datetime import date, datetime

from sqlalchemy import select

from app.infrastructure.database.base import SessionLocal
from app.infrastructure.database.models import (
    ItineraryItemModel,
    TripDayModel,
    TripMemberModel,
    TripModel,
    TripPreferenceModel,
    UserModel,
)


TRIP_DEFINITIONS = [
    {
        "origin": "東京",
        "destination": "鎌倉",
        "start_date": date(2026, 4, 12),
        "end_date": date(2026, 4, 12),
        "participant_count": 1,
        "status": "planned",
        "preference": {
            "atmosphere": TripPreferenceModel.TripAtmosphere.RELAXED,
            "budget": 20000,
            "transport_type": "train",
            "companions": "solo",
        },
        "days": [
            {
                "day_number": 1,
                "date": date(2026, 4, 12),
                "items": [
                    {
                        "name": "鶴岡八幡宮",
                        "category": "sightseeing",
                        "start_time": datetime(2026, 4, 12, 10, 0),
                        "end_time": datetime(2026, 4, 12, 11, 30),
                        "estimated_cost": 0,
                        "notes": "朝の散策",
                        "sequence": 1,
                    },
                    {
                        "name": "小町通りランチ",
                        "category": "food",
                        "start_time": datetime(2026, 4, 12, 12, 0),
                        "end_time": datetime(2026, 4, 12, 13, 30),
                        "estimated_cost": 2200,
                        "notes": "しらす丼を食べる",
                        "sequence": 2,
                    },
                ],
            }
        ],
        "shared_member_slots": 0,
    },
    {
        "origin": "大阪",
        "destination": "京都",
        "start_date": date(2026, 5, 3),
        "end_date": date(2026, 5, 4),
        "participant_count": 4,
        "status": "planned",
        "preference": {
            "atmosphere": TripPreferenceModel.TripAtmosphere.GOURMET,
            "budget": 80000,
            "transport_type": "train",
            "companions": "friends",
        },
        "days": [
            {
                "day_number": 1,
                "date": date(2026, 5, 3),
                "items": [
                    {
                        "name": "伏見稲荷大社",
                        "category": "sightseeing",
                        "start_time": datetime(2026, 5, 3, 9, 0),
                        "end_time": datetime(2026, 5, 3, 11, 0),
                        "estimated_cost": 0,
                        "notes": "朝早く出発",
                        "sequence": 1,
                    },
                    {
                        "name": "祇園で昼食",
                        "category": "food",
                        "start_time": datetime(2026, 5, 3, 12, 0),
                        "end_time": datetime(2026, 5, 3, 13, 30),
                        "estimated_cost": 3500,
                        "notes": "京料理を予約済み",
                        "sequence": 2,
                    },
                ],
            },
            {
                "day_number": 2,
                "date": date(2026, 5, 4),
                "items": [
                    {
                        "name": "嵐山散策",
                        "category": "sightseeing",
                        "start_time": datetime(2026, 5, 4, 10, 0),
                        "end_time": datetime(2026, 5, 4, 12, 30),
                        "estimated_cost": 1500,
                        "notes": "竹林と渡月橋",
                        "sequence": 1,
                    }
                ],
            },
        ],
        "shared_member_slots": 1,
    },
    {
        "origin": "福岡",
        "destination": "沖縄",
        "start_date": date(2026, 7, 18),
        "end_date": date(2026, 7, 20),
        "participant_count": 6,
        "status": "planned",
        "preference": {
            "atmosphere": TripPreferenceModel.TripAtmosphere.ACTIVE,
            "budget": 180000,
            "transport_type": "flight",
            "companions": "family",
        },
        "days": [
            {
                "day_number": 1,
                "date": date(2026, 7, 18),
                "items": [
                    {
                        "name": "国際通り",
                        "category": "sightseeing",
                        "start_time": datetime(2026, 7, 18, 15, 0),
                        "end_time": datetime(2026, 7, 18, 17, 0),
                        "estimated_cost": 1000,
                        "notes": "到着後に散策",
                        "sequence": 1,
                    }
                ],
            },
            {
                "day_number": 2,
                "date": date(2026, 7, 19),
                "items": [
                    {
                        "name": "青の洞窟シュノーケル",
                        "category": "activity",
                        "start_time": datetime(2026, 7, 19, 9, 0),
                        "end_time": datetime(2026, 7, 19, 12, 0),
                        "estimated_cost": 7200,
                        "notes": "家族全員参加",
                        "sequence": 1,
                    }
                ],
            },
            {
                "day_number": 3,
                "date": date(2026, 7, 20),
                "items": [
                    {
                        "name": "美ら海水族館",
                        "category": "sightseeing",
                        "start_time": datetime(2026, 7, 20, 10, 0),
                        "end_time": datetime(2026, 7, 20, 13, 0),
                        "estimated_cost": 2180,
                        "notes": "最終日観光",
                        "sequence": 1,
                    }
                ],
            },
        ],
        "shared_member_slots": 2,
    },
]


async def ensure_user_exists(user_id: int) -> None:
    async with SessionLocal() as db:
        result = await db.execute(select(UserModel.id).where(UserModel.id == user_id))
        found = result.scalar_one_or_none()
        if found is None:
            raise ValueError(f"user_id={user_id} does not exist")


async def seed_trips(owner_user_id: int, shared_user_ids: list[int]) -> None:
    await ensure_user_exists(owner_user_id)
    for user_id in shared_user_ids:
        await ensure_user_exists(user_id)

    async with SessionLocal() as db:
        created_count = 0
        skipped_count = 0

        for definition in TRIP_DEFINITIONS:
            existing_trip_result = await db.execute(
                select(TripModel).where(
                    TripModel.user_id == owner_user_id,
                    TripModel.origin == definition["origin"],
                    TripModel.destination == definition["destination"],
                    TripModel.start_date == definition["start_date"],
                    TripModel.end_date == definition["end_date"],
                )
            )
            existing_trip = existing_trip_result.scalar_one_or_none()
            if existing_trip is not None:
                skipped_count += 1
                continue

            trip = TripModel(
                user_id=owner_user_id,
                origin=definition["origin"],
                destination=definition["destination"],
                start_date=definition["start_date"],
                end_date=definition["end_date"],
                participant_count=definition["participant_count"],
                status=definition["status"],
            )
            db.add(trip)
            await db.flush()

            preference = definition["preference"]
            db.add(
                TripPreferenceModel(
                    trip_id=trip.id,
                    atmosphere=preference["atmosphere"],
                    companions=preference["companions"],
                    budget=preference["budget"],
                    transport_type=preference["transport_type"],
                )
            )

            db.add(
                TripMemberModel(
                    trip_id=trip.id,
                    user_id=owner_user_id,
                    role="owner",
                    status="joined",
                )
            )

            for shared_user_id in shared_user_ids[: definition["shared_member_slots"]]:
                if shared_user_id == owner_user_id:
                    continue
                db.add(
                    TripMemberModel(
                        trip_id=trip.id,
                        user_id=shared_user_id,
                        role="member",
                        status="joined",
                    )
                )

            for day_definition in definition["days"]:
                day = TripDayModel(
                    trip_id=trip.id,
                    day_number=day_definition["day_number"],
                    date=day_definition["date"],
                )
                db.add(day)
                await db.flush()

                for item_definition in day_definition["items"]:
                    db.add(
                        ItineraryItemModel(
                            trip_day_id=day.id,
                            name=item_definition["name"],
                            sequence=item_definition["sequence"],
                            category=item_definition["category"],
                            start_time=item_definition["start_time"],
                            end_time=item_definition["end_time"],
                            estimated_cost=item_definition["estimated_cost"],
                            notes=item_definition["notes"],
                        )
                    )

            created_count += 1

        await db.commit()
        print(f"seed complete: created={created_count}, skipped={skipped_count}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Seed demo trips for development.")
    parser.add_argument("--owner-user-id", type=int, required=True, help="Owner user id for created demo trips")
    parser.add_argument(
        "--shared-user-ids",
        type=int,
        nargs="*",
        default=[],
        help="Optional user ids to add as shared trip members",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    asyncio.run(seed_trips(args.owner_user_id, args.shared_user_ids))


if __name__ == "__main__":
    main()
