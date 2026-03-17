import { type PlanDetailTimelineItem } from '@/features/plan-detail/types';

type RecommendPlanDetail = {
  username: string;
  date: string;
  area: string;
  intro: string;
  budget: string;
  moveTime: string;
  days: Array<{
    key: string;
    label: string;
    timeline: PlanDetailTimelineItem[];
  }>;
};

export const recommendPlanDetails: Record<string, RecommendPlanDetail> = {
  'rec-1': {
    username: 'user123',
    date: '2023年10月20日',
    area: '京都市内',
    intro: '自然体で回れるカフェ中心の京都旅。景色と休憩のバランスを重視したプランです。',
    budget: '¥8,000',
    moveTime: '3h 20m',
    days: [
      {
        key: 'day1',
        label: 'Day 1',
        timeline: [
          { id: '1', start: '10:00', end: '11:10', title: '京都駅 集合', body: '中央口の時計台前で待ち合わせ。まずは嵐山方面へ移動します。', icon: 'place' },
          { id: '2', start: '11:30', end: '12:50', title: '% Arabica Kyoto Arashiyama', body: '渡月橋を眺めながらのラテタイム。写真も撮りやすい人気スポット。', icon: 'restaurant' },
          { id: '3', start: '13:20', end: '14:40', title: '嵐山散策 & ランチ', body: '竹林の小径を歩いてから、おばんざいランチへ。', icon: 'place' },
          { id: '4', start: '15:00', end: '16:10', title: 'ブルーボトルコーヒー 京都カフェ', body: '京町家を改装した落ち着いた空間で一息。', icon: 'local-cafe' },
        ],
      },
      { key: 'day2', label: 'Day 2', timeline: [] },
      { key: 'day3', label: 'Day 3', timeline: [] },
    ],
  },
  'rec-2': {
    username: 'maitanaka',
    date: '2024年2月14日',
    area: '東京都内',
    intro: '高層階と湾岸エリアをつないで、夕景から夜景に滑らかに切り替えるプランです。',
    budget: '¥5,500',
    moveTime: '2h 10m',
    days: [
      {
        key: 'day1',
        label: 'Day 1',
        timeline: [
          { id: '1', start: '17:30', end: '18:00', title: '東京駅 集合', body: '日没前に合流して、最初の展望台へ向かいます。', icon: 'place' },
          { id: '2', start: '18:30', end: '19:40', title: '六本木ヒルズ 展望台', body: '街全体を見渡せる定番夜景スポット。夕景から夜景へ移る時間帯が狙い目です。', icon: 'photo-camera' },
          { id: '3', start: '20:10', end: '21:00', title: 'お台場海浜公園', body: 'レインボーブリッジを背景に写真を撮る流れです。', icon: 'place' },
        ],
      },
    ],
  },
  'rec-3': {
    username: 'makoto_ito',
    date: '2024年5月3日',
    area: '大阪市内',
    intro: '食べ歩きメインで回る大阪グルメ旅。移動を最小限にして、店の密度を優先しています。',
    budget: '¥6,500',
    moveTime: '1h 40m',
    days: [
      {
        key: 'day1',
        label: 'Day 1',
        timeline: [
          { id: '1', start: '11:00', end: '11:30', title: 'なんば駅 集合', body: '荷物を軽くして、食べ歩きしやすい形でスタート。', icon: 'place' },
          { id: '2', start: '12:00', end: '13:00', title: 'たこ焼き 食べ比べ', body: '有名店を2軒回って味の違いを楽しみます。', icon: 'restaurant' },
          { id: '3', start: '14:00', end: '15:00', title: '串カツランチ', body: '少し座って休めるように、串カツ店で昼食。', icon: 'restaurant' },
        ],
      },
    ],
  },
};
