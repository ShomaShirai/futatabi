import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { recommendedPlans, weatherMock } from '@/data/travel';
import { PlanDetailTemplate } from '@/features/plan-detail/components/PlanDetailTemplate';
import { recommendPlanDetails } from '@/features/plan-detail/data/recommend-plan-detail';
import { AppHeader } from '@/features/travel/components/AppHeader';

export default function RecommendationDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const plan = recommendedPlans.find((item) => item.id === id);

  if (!plan) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FDFDFD' }}>
        <AppHeader title="おすすめ詳細" weatherLabel={`${weatherMock.temp} ${weatherMock.condition}`} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#0F172A' }}>投稿が見つかりませんでした</Text>
        </View>
      </View>
    );
  }

  const meta = recommendPlanDetails[plan.id];
  const [activeDayKey, setActiveDayKey] = useState(meta.days[0]?.key ?? 'day1');
  const activeDay = useMemo(
    () => meta.days.find((day) => day.key === activeDayKey) ?? meta.days[0],
    [activeDayKey, meta.days]
  );

  return (
    <PlanDetailTemplate
      headerTitle="おすすめ詳細"
      weatherLabel={`${weatherMock.temp} ${weatherMock.condition}`}
      heroImage={plan.image}
      heroBadge={meta.area}
      title={plan.title}
      subtitle={`by ${meta.username} ・ ${meta.date}`}
      intro={meta.intro}
      budgetLabel={meta.budget}
      moveTimeLabel={meta.moveTime}
      days={meta.days.map((day) => ({ key: day.key, label: day.label }))}
      activeDayKey={activeDay.key}
      onSelectDay={setActiveDayKey}
      timeline={activeDay.timeline}
      primaryActionLabel="このプランを使う"
      secondaryActionLabel="カスタマイズする"
    />
  );
}
