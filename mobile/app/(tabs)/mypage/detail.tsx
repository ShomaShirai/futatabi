import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

import { getTripDetail } from '@/features/trips/api/get-trip-detail';
import { type TripDetailAggregateResponse } from '@/features/trips/types/trip-detail';
import { AppHeader } from '@/features/travel/components/AppHeader';
import { travelStyles } from '@/features/travel/styles';

type MyPageSection = 'friends' | 'history';

type FriendRouteParams = {
  section?: MyPageSection;
  id?: string;
  name?: string;
  nearestStation?: string;
  addedAt?: string;
};

export default function MyPageDetailScreen() {
  const { section, id, name, nearestStation, addedAt } = useLocalSearchParams<FriendRouteParams>();
  const [historyDetail, setHistoryDetail] = useState<TripDetailAggregateResponse | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isHistoryUnavailable, setIsHistoryUnavailable] = useState(false);
  const historyTripId = useMemo(() => {
    if (!id) return null;
    const parsed = Number(id);
    return Number.isNaN(parsed) ? null : parsed;
  }, [id]);

  useEffect(() => {
    if (section !== 'history' || historyTripId === null) {
      return;
    }

    let isCancelled = false;
    setIsLoadingHistory(true);
    setIsHistoryUnavailable(false);

    void getTripDetail(historyTripId)
      .then((detail) => {
        if (!isCancelled) {
          setHistoryDetail(detail);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setIsHistoryUnavailable(true);
          setHistoryDetail(null);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoadingHistory(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [historyTripId, section]);

  if (!section) {
    return (
      <View style={travelStyles.screen}>
        <AppHeader title="マイページ" />
        <View style={travelStyles.container}>
          <Text style={travelStyles.heading}>項目を選択してください</Text>
        </View>
      </View>
    );
  }

  if (section === 'friends') {
    return (
      <ScrollView style={travelStyles.screen} contentContainerStyle={{ paddingBottom: 24 }}>
        <AppHeader title="フレンド詳細" />

        <View style={travelStyles.container}>
          <View style={travelStyles.detailSection}>
            <Text style={travelStyles.sectionTitleText}>フレンド情報</Text>
            <Text style={travelStyles.heading}>{name ?? '不明なユーザー'}</Text>
            <Text style={travelStyles.sectionBody}>ID: {id ?? '-'}</Text>
            <Text style={travelStyles.sectionBody}>
              最寄り駅: {nearestStation && nearestStation.length > 0 ? nearestStation : '未設定'}
            </Text>
            <Text style={travelStyles.sectionBody}>
              追加日: {addedAt && addedAt.length > 0 ? addedAt : '不明'}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (section === 'history' && isLoadingHistory) {
    return (
      <View style={travelStyles.screen}>
        <AppHeader title="旅行履歴詳細" />
        <View style={travelStyles.container}>
          <ActivityIndicator color="#EC5B13" />
          <Text style={travelStyles.subheading}>旅行履歴を読み込み中...</Text>
        </View>
      </View>
    );
  }

  if (section === 'history' && historyDetail) {
    const { trip } = historyDetail;

    return (
      <ScrollView style={travelStyles.screen} contentContainerStyle={{ paddingBottom: 24 }}>
        <AppHeader title="旅行履歴詳細" />

        <View style={travelStyles.container}>
          <View style={travelStyles.detailSection}>
            <Text style={travelStyles.sectionTitleText}>履歴情報</Text>
            <Text style={travelStyles.heading}>{trip.origin} → {trip.destination}</Text>
            <Text style={travelStyles.sectionBody}>
              旅行日: {trip.start_date.replace(/-/g, '/')} - {trip.end_date.replace(/-/g, '/')}
            </Text>
            <Text style={travelStyles.sectionBody}>人数: {trip.participant_count}名</Text>
            <Text style={travelStyles.sectionBody}>ステータス: {trip.status}</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (section === 'history' && isHistoryUnavailable) {
    return (
      <View style={travelStyles.screen}>
        <AppHeader title="旅行履歴詳細" />
        <View style={travelStyles.container}>
          <Text style={travelStyles.heading}>履歴情報を取得できませんでした</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={travelStyles.screen}>
      <AppHeader title="詳細" />
      <View style={travelStyles.container}>
        <Text style={travelStyles.heading}>対象が見つかりませんでした</Text>
      </View>
    </View>
  );
}
