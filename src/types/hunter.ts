export type HunterRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'National';

export interface HunterStats {
  strength: number;
  agility: number;
  vitality: number;
  stamina: number;
  perception: number;
  unallocatedPoints: number;
}

export interface QuestItem {
  id: string;
  name: string;
  category: 'strength' | 'core' | 'legs' | 'cardio' | 'recovery';
  target: number;
  current: number;
  unit: string;
  xpReward: number;
  description: string;
  completed: boolean;
}

export interface StreakMilestone {
  days: number;
  title: string;
  badge: string;
  xpBonus: number;
  description: string;
  achieved: boolean;
  achievedAt?: string;
}

export interface NotificationSchedule {
  enabled8am: boolean;
  enabled8pm: boolean;
  milestonesEnabled: boolean;
  soundEnabled: boolean;
  browserPermission: NotificationPermission | 'unsupported';
}

export interface SystemNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  type: 'quest' | 'streak' | 'milestone' | 'rank' | 'penalty';
  read: boolean;
}

export interface WorkoutLogEntry {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  displayDate: string;
  dayOfWeek: string;
  streakDayAtCompletion: number;
  isRecoveryDay: boolean;
  questsCompleted: {
    name: string;
    repsOrSteps: number;
    unit: string;
    target: number;
  }[];
  totalXpEarned: number;
  hunterLevel: number;
  hunterRank: HunterRank;
  waterIntakeMl?: number;
  notes?: string;
}

export interface HunterProfile {
  name: string;
  title: string;
  job: string;
  rank: HunterRank;
  level: number;
  currentXp: number;
  requiredXp: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  fatigue: number;
  streakDays: number;
  bestStreak: number;
  totalWorkoutsCompleted: number;
  lastCompletedDate: string | null;
  isRecoveryDay: boolean;
  waterIntakeMl: number;
  targetWaterMl: number;
  stats: HunterStats;
  quests: QuestItem[];
  milestones: StreakMilestone[];
  notifications: SystemNotification[];
  settings: NotificationSchedule;
  workoutLogs: WorkoutLogEntry[];
}
