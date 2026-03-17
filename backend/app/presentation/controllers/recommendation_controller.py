from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.database.base import get_db
from app.infrastructure.database.models import (
    ItineraryItemModel,
    TripDayModel,
    TripModel,
    TripPreferenceModel,
    UserModel,
)
from app.presentation.dto.recommendation_dto import (
    RecommendationDayResponse,
    RecommendationDetailResponse,
    RecommendationListResponse,
    RecommendationTimelineItemResponse,
)

router = APIRouter()


def _timeline_icon_from_category(category: str | None) -> str:
    if category == "food":
        return "restaurant"
    if category == "transport":
        return "train"
    return "place"


@router.get("/", response_model=list[RecommendationListResponse])
async def list_recommendations(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(TripModel, UserModel)
        .join(UserModel, UserModel.id == TripModel.user_id)
        .where(TripModel.is_public.is_(True))
        .order_by(TripModel.created_at.desc(), TripModel.id.desc())
    )
    rows = result.all()
    return [
        RecommendationListResponse(
            id=trip.id,
            title=f"{trip.origin} → {trip.destination}",
            location=trip.destination,
            author=user.username,
            likes=trip.like_count,
            image=trip.cover_image_url or "",
            category=trip.recommendation_category or "その他",
        )
        for trip, user in rows
    ]


@router.get("/{recommendation_id}", response_model=RecommendationDetailResponse)
async def get_recommendation_detail(
    recommendation_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(TripModel, UserModel)
        .join(UserModel, UserModel.id == TripModel.user_id)
        .where(TripModel.id == recommendation_id, TripModel.is_public.is_(True))
    )
    row = result.one_or_none()
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recommendation not found")
    trip, user = row

    day_result = await db.execute(
        select(TripDayModel)
        .where(TripDayModel.trip_id == recommendation_id)
        .order_by(TripDayModel.day_number.asc(), TripDayModel.id.asc())
    )
    days = day_result.scalars().all()

    day_ids = [day.id for day in days]
    items_by_day_id: dict[int, list[RecommendationTimelineItemResponse]] = {day_id: [] for day_id in day_ids}

    if day_ids:
        item_result = await db.execute(
            select(ItineraryItemModel)
            .where(ItineraryItemModel.trip_day_id.in_(day_ids))
            .order_by(
                ItineraryItemModel.sequence.asc().nulls_last(),
                ItineraryItemModel.start_time.asc().nulls_last(),
                ItineraryItemModel.id.asc(),
            )
        )
        items = item_result.scalars().all()
        for item in items:
            items_by_day_id[item.trip_day_id].append(
                RecommendationTimelineItemResponse(
                    id=item.id,
                    start=item.start_time.strftime("%H:%M") if item.start_time else "--:--",
                    end=item.end_time.strftime("%H:%M") if item.end_time else "--:--",
                    title=item.name,
                    body=item.notes or item.category or "詳細メモは未設定です。",
                    icon=_timeline_icon_from_category(item.category),
                )
            )

    preference_result = await db.execute(
        select(TripPreferenceModel).where(TripPreferenceModel.trip_id == recommendation_id)
    )
    preference = preference_result.scalar_one_or_none()

    return RecommendationDetailResponse(
        id=trip.id,
        title=f"{trip.origin} → {trip.destination}",
        image=trip.cover_image_url or "",
        username=user.username,
        date=trip.created_at.strftime("%Y年%m月%d日") if trip.created_at else "",
        area=trip.destination,
        intro=(
            f"{trip.destination}を中心に回る公開プランです。"
            if preference is None
            else f"{preference.atmosphere.value}な雰囲気で回る公開プランです。"
        ),
        budget=(
            f"¥{preference.budget:,}" if preference and preference.budget is not None else "未設定"
        ),
        move_time=(
            f"{len(days)}日間"
            if not items_by_day_id
            else f"{len(days)}日間"
        ),
        days=[
            RecommendationDayResponse(
                key=f"day{day.day_number}",
                label=f"Day {day.day_number}",
                timeline=items_by_day_id.get(day.id, []),
            )
            for day in days
        ],
    )
