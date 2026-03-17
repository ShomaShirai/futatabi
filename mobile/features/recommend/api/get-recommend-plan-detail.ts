import { apiFetch } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { type RecommendPlanDetail } from '@/features/recommend/types';

export async function getRecommendPlanDetail(id: string): Promise<RecommendPlanDetail | null> {
  return apiFetch<RecommendPlanDetail>(endpoints.recommendations.detail(id));
}
