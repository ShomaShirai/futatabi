from abc import ABC, abstractmethod
from typing import Optional

from app.domain.entities.trip import Trip, TripAggregate, TripPreference, TripMember


class TripRepository(ABC):
    """Trip aggregate repository interface."""

    @abstractmethod
    async def create_trip(self, trip: Trip, preference: Optional[TripPreference] = None) -> TripAggregate:
        """Create a trip and optionally its preference in one transaction."""
        pass

    @abstractmethod
    async def get_trip_aggregate(self, trip_id: int) -> Optional[TripAggregate]:
        """Get a full trip aggregate by trip id."""
        pass

    @abstractmethod
    async def list_by_user(self, user_id: int, skip: int = 0, limit: int = 100) -> list[Trip]:
        """List trips for a user."""
        pass

    @abstractmethod
    async def add_member(self, member: TripMember) -> TripMember:
        """Add a member to a trip."""
        pass

    @abstractmethod
    async def upsert_preference(self, preference: TripPreference) -> TripPreference:
        """Create or update trip preference."""
        pass
