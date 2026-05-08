export type TripHistory = {
  id: string;
  title: string;
  date: string;
  detail: string;
};

export const weatherMock = {
  location: '東京駅',
  temp: '26°C',
  condition: '晴れ',
};

export const tripHistoryMock = [
  {
    id: 'history-1',
    title: '大阪夜景旅',
    date: '2025/12/12',
    detail: '3日間・東京→大阪→神戸',
  },
  {
    id: 'history-2',
    title: '京都寺社巡り',
    date: '2026/01/03',
    detail: '一人旅・2日間・徒歩中心',
  },
];
