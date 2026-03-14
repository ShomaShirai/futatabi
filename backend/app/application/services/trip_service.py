from typing import Optional

from app.domain.entities.trip import Trip, TripAggregate, TripMember, TripPreference
from app.domain.repositories.trip_repository import TripRepository
from app.shared.exceptions import PermissionDeniedError, TripNotFoundError


class TripService:
    """Trip application service."""

    def __init__(self, trip_repository: TripRepository):
        self.trip_repository = trip_repository

    async def create_trip(
        self,
        user_id: int,
        trip: Trip,
        preference: Optional[TripPreference] = None,
    ) -> TripAggregate:
        trip.user_id = user_id
        return await self.trip_repository.create_trip(trip, preference)

    async def list_my_trips(self, user_id: int, skip: int = 0, limit: int = 100) -> list[Trip]:
        return await self.trip_repository.list_by_user(user_id, skip=skip, limit=limit)

    async def get_my_trip_detail(self, user_id: int, trip_id: int) -> TripAggregate:
        aggregate = await self.trip_repository.get_trip_aggregate(trip_id)
        if aggregate is None:
            raise TripNotFoundError(f"Trip with ID {trip_id} not found")
        if aggregate.trip.user_id != user_id:
            raise PermissionDeniedError("You do not have access to this trip")
        return aggregate

    async def update_my_trip(self, user_id: int, trip_id: int, **kwargs) -> Trip:
        aggregate = await self.get_my_trip_detail(user_id=user_id, trip_id=trip_id)
        trip = aggregate.trip

        for key, value in kwargs.items():
            if value is not None and hasattr(trip, key):
                setattr(trip, key, value)

        updated = await self.trip_repository.update_trip(trip)
        if updated is None:
            raise TripNotFoundError(f"Trip with ID {trip_id} not found")
        return updated

    async def delete_my_trip(self, user_id: int, trip_id: int) -> bool:
        await self.get_my_trip_detail(user_id=user_id, trip_id=trip_id)
        deleted = await self.trip_repository.delete_trip(trip_id)
        if not deleted:
            raise TripNotFoundError(f"Trip with ID {trip_id} not found")
        return True

    async def upsert_my_preference(
        self,
        user_id: int,
        trip_id: int,
        preference: TripPreference,
    ) -> TripPreference:
        await self.get_my_trip_detail(user_id=user_id, trip_id=trip_id)
        preference.trip_id = trip_id
        return await self.trip_repository.upsert_preference(preference)

    async def add_my_member(
        self,
        owner_user_id: int,
        trip_id: int,
        member_user_id: int,
        role: str = "member",
        status: str = "joined",
    ) -> TripMember:
        await self.get_my_trip_detail(user_id=owner_user_id, trip_id=trip_id)
        member = TripMember(
            id=None,
            trip_id=trip_id,
            user_id=member_user_id,
            role=role,
            status=status,
        )
        return await self.trip_repository.add_member(member)

    async def update_my_member(
        self,
        owner_user_id: int,
        trip_id: int,
        member_user_id: int,
        role: str | None = None,
        status: str | None = None,
    ) -> TripMember:
        await self.get_my_trip_detail(user_id=owner_user_id, trip_id=trip_id)
        member = await self.trip_repository.get_member(trip_id=trip_id, user_id=member_user_id)
        if member is None:
            raise TripNotFoundError(
                f"Trip member user_id={member_user_id} not found in trip {trip_id}"
            )

        if role is not None:
            member.role = role
        if status is not None:
            member.status = status

        updated_member = await self.trip_repository.update_member(member)
        if updated_member is None:
            raise TripNotFoundError(
                f"Trip member user_id={member_user_id} not found in trip {trip_id}"
            )
        return updated_member

    async def delete_my_member(self, owner_user_id: int, trip_id: int, member_user_id: int) -> bool:
        await self.get_my_trip_detail(user_id=owner_user_id, trip_id=trip_id)
        deleted = await self.trip_repository.delete_member(trip_id=trip_id, user_id=member_user_id)
        if not deleted:
            raise TripNotFoundError(
                f"Trip member user_id={member_user_id} not found in trip {trip_id}"
            )
        return True
