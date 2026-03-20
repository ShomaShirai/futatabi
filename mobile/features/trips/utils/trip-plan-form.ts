import { type CreateAiPlanGenerationRequest } from '@/features/trips/types/ai-plan-generation';
import { type TripDetailAggregateResponse } from '@/features/trips/types/trip-detail';
import { defaultCreateTripFormValues } from '@/features/trips/utils/create-trip-draft';
import { type CreateTripFormValues } from '@/features/trips/utils/create-trip';

export function buildTripPlanFormValues(detail: TripDetailAggregateResponse): CreateTripFormValues {
  const participantCount = Math.max(1, detail.trip.participant_count ?? 1);
  const totalBudget = detail.preference?.budget ?? 0;
  const budgetPerPerson = totalBudget > 0 ? Math.trunc(totalBudget / participantCount) : Number(defaultCreateTripFormValues.budget);

  return {
    origin: detail.trip.origin ?? '',
    destination: detail.trip.destination ?? '',
    startDate: detail.trip.start_date ?? '',
    endDate: detail.trip.end_date ?? '',
    participantCount: String(participantCount),
    budget: String(budgetPerPerson),
    atmosphere: detail.preference?.atmosphere ?? defaultCreateTripFormValues.atmosphere,
    recommendationCategories: detail.trip.recommendation_categories ?? [],
    transportTypes: [],
    mustVisitPlacesText: '',
    accommodationNotesByDay: [...defaultCreateTripFormValues.accommodationNotesByDay],
    additionalRequestComment: '',
  };
}

export function buildAiGenerationRequestFromForm(
  formValues: CreateTripFormValues,
  selectedCompanionNames: string[]
): CreateAiPlanGenerationRequest {
  return {
    run_async: false,
    must_visit_places: formValues.mustVisitPlacesText
      .split(/[\n,、]/)
      .map((item) => item.trim())
      .filter(Boolean),
    lodging_notes: formValues.accommodationNotesByDay.map((item) => item.trim()).filter(Boolean),
    additional_request_comment: formValues.additionalRequestComment.trim() || undefined,
    selected_companion_names: selectedCompanionNames,
  };
}
