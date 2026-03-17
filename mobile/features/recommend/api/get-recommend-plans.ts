import { apiFetch } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { type RecommendPlanListItem } from '@/features/recommend/types';

export async function getRecommendPlans(): Promise<RecommendPlanListItem[]> {
  return apiFetch<RecommendPlanListItem[]>(endpoints.recommendations.list);
}
