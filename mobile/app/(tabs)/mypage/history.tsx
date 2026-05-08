import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import { AppHeader } from '@/features/travel/components/AppHeader';
import { ListButton } from '@/features/travel/components/ListButton';
import { travelStyles } from '@/features/travel/styles';
import { getTrips } from '@/features/trips/api/get-trips';
import { type TripResponse } from '@/features/trips/types/trip-edit';

type TripHistoryItem = {
  id: string;
  title: string;
  date: string;
  detail: string;
};

function parseIsoDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isPastDate(value: string) {
  const target = parseIsoDate(value);
  if (!target) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return target < today;
}

function formatDateLabel(startDate: string, endDate: string) {
  return `${startDate.replace(/-/g, '/')} - ${endDate.replace(/-/g, '/')}`;
}

function toHistoryItem(trip: TripResponse): TripHistoryItem {
  return {
    id: String(trip.id),
    title: `${trip.origin} → ${trip.destination}`,
    date: formatDateLabel(trip.start_date, trip.end_date),
    detail: `${trip.participant_count}名`,
  };
}

export default function HistoryListScreen() {
  const [histories, setHistories] = useState<TripHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadHistories = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const trips = await getTrips();
      const historyTrips = trips.filter((trip) => trip.status === 'completed' || isPastDate(trip.end_date));
      setHistories(historyTrips.map(toHistoryItem));
    } catch {
      setHasError(true);
      setHistories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadHistories();
    }, [loadHistories])
  );

  const emptyLabel = useMemo(() => {
    if (hasError) return '旅行履歴の取得に失敗しました。時間をおいて再度お試しください。';
    if (isLoading) return '旅行履歴を読み込み中...';
    return '表示できる旅行履歴がまだありません。';
  }, [hasError, isLoading]);

  return (
    <View style={travelStyles.screen}>
      <AppHeader title="旅行履歴" />
      <View style={travelStyles.container}>
        {isLoading ? <ActivityIndicator color="#EC5B13" /> : null}
        <FlatList
          data={histories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListButton
              title={item.title}
              description={`${item.date} / ${item.detail}`}
              href={{
                pathname: '/mypage/detail',
                params: { section: 'history', id: item.id },
              }}
            />
          )}
          ItemSeparatorComponent={() => null}
          ListEmptyComponent={<Text style={travelStyles.subheading}>{emptyLabel}</Text>}
        />
      </View>
    </View>
  );
}
