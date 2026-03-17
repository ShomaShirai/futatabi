import { apiFetch } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { type TripMemberResponse } from '@/features/trips/types/trip-edit';

type AddTripMemberPayload = {
  user_id: number;
  role: 'member';
  status: 'joined';
};

export async function addTripMember(tripId: number, userId: number): Promise<TripMemberResponse> {
  const payload: AddTripMemberPayload = {
    user_id: userId,
    role: 'member',
    status: 'joined',
  };
  return apiFetch<TripMemberResponse>(endpoints.trips.members.create(tripId), {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function removeTripMember(tripId: number, userId: number): Promise<void> {
  return apiFetch<void>(endpoints.trips.members.delete(tripId, userId), {
    method: 'DELETE',
  });
}
