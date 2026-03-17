import { MaterialIcons } from '@expo/vector-icons';

export type PlanDetailDay = {
  key: string;
  label: string;
};

export type PlanDetailTimelineItem = {
  id: string | number;
  start: string;
  end: string;
  title: string;
  body: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
};
