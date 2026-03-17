import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';

import { weatherMock } from '@/data/travel';
import { PlanDetailTemplate } from '@/features/plan-detail/components/PlanDetailTemplate';
import { getRecommendPlanDetail } from '@/features/recommend/api/get-recommend-plan-detail';
import { AppHeader } from '@/features/travel/components/AppHeader';

export default function RecommendationDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [plan, setPlan] = useState<Awaited<ReturnType<typeof getRecommendPlanDetail>>>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDayKey, setActiveDayKey] = useState('day1');

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const detail = await getRecommendPlanDetail(id);
        setPlan(detail);
      } catch {
        Alert.alert('取得失敗', 'おすすめ詳細の取得に失敗しました。');
        setPlan(null);
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, [id]);

  useEffect(() => {
    if (!plan?.days.length) {
      return;
    }

    setActiveDayKey((currentKey) =>
      plan.days.some((day) => day.key === currentKey) ? currentKey : plan.days[0].key
    );
  }, [plan]);

  const activeDay = useMemo(() => {
    if (!plan?.days.length) {
      return null;
    }

    return plan.days.find((day) => day.key === activeDayKey) ?? plan.days[0];
  }, [activeDayKey, plan]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FDFDFD' }}>
        <AppHeader title="おすすめ詳細" weatherLabel={`${weatherMock.temp} ${weatherMock.condition}`} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <ActivityIndicator color="#EC5B13" />
          <Text style={{ color: '#64748B', fontSize: 14 }}>読み込み中...</Text>
        </View>
      </View>
    );
  }

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

  return (
    <PlanDetailTemplate
      headerTitle="おすすめ詳細"
      weatherLabel={`${weatherMock.temp} ${weatherMock.condition}`}
      heroImage={plan.image}
      heroBadge={plan.area}
      title={plan.title}
      subtitle={`by ${plan.username} ・ ${plan.date}`}
      intro={plan.intro}
      budgetLabel={plan.budget}
      moveTimeLabel={plan.moveTime}
      days={plan.days.map((day) => ({ key: day.key, label: day.label }))}
      activeDayKey={activeDay?.key ?? plan.days[0]?.key ?? 'day1'}
      onSelectDay={setActiveDayKey}
      timeline={activeDay?.timeline ?? []}
      primaryActionLabel="このプランを使う"
      secondaryActionLabel="カスタマイズする"
    />
  );
}
