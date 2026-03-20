import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { weatherMock } from '@/data/travel';
import { AppHeader } from '@/features/travel/components/AppHeader';
import { travelStyles } from '@/features/travel/styles';
import { createAiPlanGeneration } from '@/features/trips/api/ai-plan-generation';
import { createTrip } from '@/features/trips/api/create-trip';
import { addTripMember } from '@/features/trips/api/trip-members';
import { validateAndBuildCreateTripPayload } from '@/features/trips/utils/create-trip';
import { clearCreateTripDraft, getCreateTripDraft } from '@/features/trips/utils/create-trip-draft';

type GenerationState = 'creating' | 'completed' | 'failed';
type StepState = 'pending' | 'active' | 'done' | 'failed';

function getAiGenerationFailureMessage(errorMessage?: string | null) {
  if (!errorMessage) {
    return 'プランは作成されましたが、AIで日程を生成できませんでした。少し時間をおいて再度お試しください。';
  }

  if (errorMessage.includes('Gemini API error: 429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
    return 'プランは作成されましたが、AI生成が混み合っています。少し待ってからもう一度お試しください。';
  }

  return 'プランは作成されましたが、AIで日程を生成できませんでした。詳細画面から再度お試しください。';
}

function StepRow({
  title,
  description,
  state,
}: {
  title: string;
  description: string;
  state: StepState;
}) {
  const iconName =
    state === 'done' ? 'check-circle' : state === 'failed' ? 'error' : state === 'active' ? 'autorenew' : 'radio-button-unchecked';
  const iconColor =
    state === 'done' ? '#16A34A' : state === 'failed' ? '#DC2626' : state === 'active' ? '#F97316' : '#94A3B8';

  return (
    <View style={styles.stepRow}>
      <MaterialIcons name={iconName} size={20} color={iconColor} />
      <View style={styles.stepBody}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDescription}>{description}</Text>
      </View>
    </View>
  );
}

function CatLoader() {
  const { width } = useWindowDimensions();
  const moveX = useRef(new Animated.Value(0)).current;
  const walkBob = useRef(new Animated.Value(0)).current;
  const tailSwing = useRef(new Animated.Value(0)).current;
  const legA = useRef(new Animated.Value(0)).current;
  const legB = useRef(new Animated.Value(0)).current;
  const jumpY = useRef(new Animated.Value(0)).current;
  const isJumpingRef = useRef(false);

  useEffect(() => {
    const moveLoop = Animated.loop(
      Animated.timing(moveX, {
        toValue: 1,
        duration: 4600,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    const walkLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(walkBob, {
          toValue: 1,
          duration: 150,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(walkBob, {
          toValue: 0,
          duration: 150,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    const tailLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(tailSwing, {
          toValue: 1,
          duration: 170,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(tailSwing, {
          toValue: 0,
          duration: 170,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    const legLoop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(legA, {
            toValue: 1,
            duration: 150,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(legA, {
            toValue: 0,
            duration: 150,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(legB, {
            toValue: 1,
            duration: 150,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(legB, {
            toValue: 0,
            duration: 150,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    moveLoop.start();
    walkLoop.start();
    tailLoop.start();
    legLoop.start();

    return () => {
      moveLoop.stop();
      walkLoop.stop();
      tailLoop.stop();
      legLoop.stop();
    };
  }, [legA, legB, moveX, tailSwing, walkBob]);

  const handleJump = () => {
    if (isJumpingRef.current) {
      return;
    }
    isJumpingRef.current = true;
    Animated.sequence([
      Animated.timing(jumpY, {
        toValue: -22,
        duration: 120,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(jumpY, {
        toValue: -17,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(jumpY, {
        toValue: 0,
        duration: 190,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      isJumpingRef.current = false;
    });
  };

  const trackTranslateX = moveX.interpolate({
    inputRange: [0, 1],
    outputRange: [-160, width + 20],
  });
  const walkTranslateY = walkBob.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -3],
  });
  const tailRotate = tailSwing.interpolate({
    inputRange: [0, 1],
    outputRange: ['10deg', '-10deg'],
  });
  const legARotate = legA.interpolate({
    inputRange: [0, 1],
    outputRange: ['15deg', '-15deg'],
  });
  const legBRotate = legB.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '15deg'],
  });

  return (
    <Pressable style={styles.catLoader} onPress={handleJump}>
      <View style={styles.ground} />
      <Animated.View style={[styles.catTrack, { transform: [{ translateX: trackTranslateX }] }]}>
        <Animated.View style={[styles.catWalk, { transform: [{ translateY: walkTranslateY }] }]}>
          <Animated.View style={[styles.catJump, { transform: [{ translateY: jumpY }] }]}>
            <Animated.View style={[styles.tail, { transform: [{ rotate: tailRotate }] }]} />
            <Animated.View style={[styles.leg, styles.back1, { transform: [{ rotate: legBRotate }] }]} />
            <Animated.View style={[styles.leg, styles.back2, { transform: [{ rotate: legARotate }] }]} />
            <Animated.View style={[styles.leg, styles.front1, { transform: [{ rotate: legARotate }] }]} />
            <Animated.View style={[styles.leg, styles.front2, { transform: [{ rotate: legBRotate }] }]} />
            <View style={styles.catBody} />
            <View style={styles.catHead}>
              <View style={[styles.ear, styles.earLeft]} />
              <View style={[styles.ear, styles.earRight]} />
              <View style={[styles.eye, styles.eyeLeft]} />
              <View style={[styles.eye, styles.eyeRight]} />
            </View>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

export default function CreateGeneratingScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const startedRef = useRef(false);
  const [generationState, setGenerationState] = useState<GenerationState>('creating');
  const [tripId, setTripId] = useState<number | null>(null);
  const [resultMessage, setResultMessage] = useState('しばらくお待ちください');
  const [tripStepState, setTripStepState] = useState<StepState>('active');
  const [memberStepState, setMemberStepState] = useState<StepState>('pending');
  const [aiStepState, setAiStepState] = useState<StepState>('pending');

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      if (generationState !== 'creating') {
        return;
      }
      event.preventDefault();
    });

    return unsubscribe;
  }, [generationState, navigation]);

  useEffect(() => {
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;

    const run = async () => {
      const draft = getCreateTripDraft();
      const validated = validateAndBuildCreateTripPayload(draft.formValues);
      if (!validated.ok) {
        setGenerationState('failed');
        setTripStepState('failed');
        setResultMessage(validated.message);
        return;
      }

      try {
        const created = await createTrip(validated.payload);
        setTripId(created.trip.id);
        setTripStepState('done');

        setMemberStepState('active');
        const memberPromises = draft.selectedCompanionUserIds.map((userId) => addTripMember(created.trip.id, userId));
        const memberResults = await Promise.allSettled(memberPromises);
        const hasMemberError = memberResults.some((entry) => entry.status === 'rejected');
        setMemberStepState(hasMemberError ? 'failed' : 'done');

        setAiStepState('active');
        const aiGeneration = await createAiPlanGeneration(created.trip.id, { run_async: false });
        setAiStepState(aiGeneration.status === 'failed' ? 'failed' : 'done');

        clearCreateTripDraft();
        setGenerationState('completed');

        if (aiGeneration.status === 'failed') {
          setResultMessage(getAiGenerationFailureMessage(aiGeneration.error_message));
        } else if (hasMemberError) {
          setResultMessage('プランは作成できましたが、一部の同行者追加に失敗しました。詳細画面から再度追加できます。');
        } else {
          setResultMessage('マイプランから日程の確認や編集ができます');
        }
      } catch {
        setGenerationState('failed');
        setTripStepState('failed');
        setMemberStepState('pending');
        setAiStepState('pending');
        setResultMessage('プラン作成に失敗しました。入力内容や接続状況を確認して再度お試しください。');
      }
    };

    void run();
  }, []);

  return (
    <View style={travelStyles.screen}>
      <AppHeader title="プランを生成中" weatherLabel={`${weatherMock.temp} ${weatherMock.condition}`} />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.heroCard}>
          {generationState === 'creating' ? (
            <CatLoader />
          ) : generationState === 'completed' ? (
            <MaterialIcons name="check-circle" size={44} color="#16A34A" />
          ) : (
            <MaterialIcons name="error" size={44} color="#DC2626" />
          )}
          <Text style={styles.heroTitle}>
            {generationState === 'creating' ? 'プランを作成しています' : generationState === 'completed' ? '作成が完了しました' : '作成に失敗しました'}
          </Text>
          <Text style={styles.heroBody}>{resultMessage}</Text>
        </View>

        <View style={styles.stepCard}>
          <Text style={styles.stepCardTitle}>進行状況</Text>
          <StepRow title="基本情報を保存" description="旅の基本情報を登録しています" state={tripStepState} />
          <StepRow title="同行者を反映" description="選択済みの同行者をプランに追加します" state={memberStepState} />
          <StepRow title="プラン作成" description="AIがプランを作成しています" state={aiStepState} />
        </View>

        {generationState === 'completed' && tripId !== null ? (
          <Pressable
            style={travelStyles.primaryButton}
            onPress={() =>
              router.replace({
                pathname: '/plans/detail',
                params: { id: String(tripId) },
              })
            }
          >
            <Text style={travelStyles.primaryButtonText}>マイプランを見る</Text>
          </Pressable>
        ) : null}

        {generationState === 'failed' ? (
          <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
            <Text style={styles.secondaryButtonText}>基本情報の入力に戻る</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    gap: 16,
    paddingBottom: 28,
  },
  heroCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FED7AA',
    backgroundColor: '#FFF7ED',
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  catLoader: {
    width: '100%',
    height: 122,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#FFF7ED',
  },
  ground: {
    position: 'absolute',
    bottom: 38,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#D6D3D1',
  },
  catTrack: {
    position: 'absolute',
    bottom: 42,
    width: 58,
    height: 36,
  },
  catWalk: {
    position: 'relative',
    width: 58,
    height: 36,
  },
  catJump: {
    position: 'relative',
    width: 58,
    height: 36,
  },
  catBody: {
    position: 'absolute',
    left: 10,
    top: 11,
    width: 29,
    height: 13,
    backgroundColor: '#333333',
    borderRadius: 12,
    zIndex: 2,
  },
  catHead: {
    position: 'absolute',
    right: 7,
    top: 7,
    width: 13,
    height: 12,
    backgroundColor: '#333333',
    borderRadius: 999,
    zIndex: 3,
  },
  ear: {
    position: 'absolute',
    top: -2,
    width: 0,
    height: 0,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderBottomWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#333333',
  },
  earLeft: {
    left: 0,
  },
  earRight: {
    right: 0,
  },
  eye: {
    position: 'absolute',
    top: 3,
    width: 2,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
  },
  eyeLeft: {
    left: 3,
  },
  eyeRight: {
    left: 7,
  },
  tail: {
    position: 'absolute',
    left: 4,
    top: 7,
    width: 12,
    height: 4,
    borderTopWidth: 2,
    borderTopColor: '#333333',
    borderRadius: 20,
    zIndex: 1,
  },
  leg: {
    position: 'absolute',
    width: 2,
    height: 8,
    backgroundColor: '#333333',
    bottom: 2,
    zIndex: 1,
  },
  front1: {
    left: 31,
  },
  front2: {
    left: 37,
  },
  back1: {
    left: 16,
  },
  back2: {
    left: 22,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  heroBody: {
    fontSize: 14,
    lineHeight: 22,
    color: '#64748B',
    textAlign: 'center',
  },
  stepCard: {
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    gap: 14,
  },
  stepCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepBody: {
    flex: 1,
    gap: 2,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  stepDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: '#64748B',
  },
  secondaryButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
});
