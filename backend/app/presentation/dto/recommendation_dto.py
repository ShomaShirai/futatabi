from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class RecommendationListResponse(BaseModel):
    id: int
    title: str
    location: str
    author: str
    likes: int
    image: str
    category: str


class RecommendationTimelineItemResponse(BaseModel):
    id: int
    start: str
    end: str
    title: str
    body: str
    icon: Optional[str] = None


class RecommendationDayResponse(BaseModel):
    key: str
    label: str
    timeline: list[RecommendationTimelineItemResponse]


class RecommendationDetailResponse(BaseModel):
    id: int
    title: str
    image: str
    username: str
    date: str
    area: str
    intro: str
    budget: str
    move_time: str
    days: list[RecommendationDayResponse]
