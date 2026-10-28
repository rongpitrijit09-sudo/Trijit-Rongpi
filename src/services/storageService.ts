import { HunterProfile, HunterRank, QuestItem, StreakMilestone, SystemNotification } from '../types/hunter';

const STORAGE_KEY_PREFIX = 'flutter_sp_hunter_';

export const INITIAL_MILESTONES: StreakMilestone[] = [
  {
    days: 3,
    title: 'Bronze Will',
    badge: '🥉',
    xpBonus: 100,
    description: 'Survive 3 consecutive daily quests without failing.',
    achieved: false,
  },
  {
    days: 7,
    title: 'Iron Discipline',
    badge: '⚔️',
    xpBonus: 250,
    description: 'One full week of hunter conditioning unbroken.',
    achieved: false,
  },
  {
    days: 14,
    title: 'Fortified Vessel',
    badge: '🛡️',
    xpBonus: 500,
    description: 'Two weeks of constant physiological rebuilding.',
    achieved: false,
  },
  {
    days: 30,
    title: 'Rank Awakening',
    badge: '⚡',
    xpBonus: 1200,
    description: '30 consecutive days. The System acknowledges your core.',
    achieved: false,
  },
  {
    days: 60,
    title: 'Apex Vanguard',
    badge: '🔥',
    xpBonus: 2500,
    description: 'Two months of relentless growth. High-rank hunter aura.',
    achieved: false,
  },
  {
    days: 100,
    title: 'Shadow Sovereign',
    badge: '👑',
    xpBonus: 5000,
    description: '100 days of absolute supremacy. The Monarch emerges.',
    achieved: false,
  },
];

export const INITIAL_QUESTS: QuestItem[] = [
  {
    id: 'pushups',
    name: 'Push-ups',
    category: 'strength',
    target: 20,
    current: 0,
    unit: 'reps',
    xpReward: 35,
    description: 'Upper body pushing power. Maintain strict straight core form.',
    completed: false,
  },
  {
    id: 'situps',
    name: 'Sit-ups / Crunches',
    category: 'core',
    target: 20,
    current: 0,
    unit: 'reps',
    xpReward: 35,
    description: 'Abdominal fortress conditioning. Avoid neck strain.',
    completed: false,
  },
  {
    id: 'squats',
    name: 'Bodyweight Squats',
    category: 'legs',
    target: 25,
    current: 0,
    unit: 'reps',
    xpReward: 40,
    description: 'Lower chain activation. Thighs parallel to floor, chest up.',
    completed: false,
  },
  {
    id: 'walking',
    name: 'Outdoor Walk / Steps',
    category: 'cardio',
    target: 3000,
    current: 0,
    unit: 'steps',
    xpReward: 50,
    description: 'Aerobic energy reserves and recovery flush. Walk or jog briskly.',
    completed: false,
  },
];

export const INITIAL_RECOVERY_QUESTS: QuestItem[] = [
  {
    id: 'stretching',
    name: 'Full Body Mobility & Stretching',
    category: 'recovery',
    target: 10,
    current: 0,
    unit: 'minutes',
    xpReward: 40,
    description: 'Hamstring, hip flexor, shoulder, and thoracic mobility routine.',
    completed: false,
  },
  {
    id: 'hydration',
    name: 'Hydration Reservoir',
    category: 'recovery',
    target: 2000,
    current: 0,
    unit: 'ml',
    xpReward: 40,
    description: 'Cellular recovery replenishment. Drink pure clean water throughout the day.',
    completed: false,
  },
  {
    id: 'light_walk',
    name: 'Gentle Recovery Stroll',
    category: 'cardio',
    target: 1500,
    current: 0,
    unit: 'steps',
    xpReward: 30,
    description: 'Promote circulation and lactic clearance without nervous fatigue.',
    completed: false,
  },
];

export const INITIAL_WORKOUT_LOGS = [
  {
    id: 'log_seed_2',
    date: '2026-10-25',
    displayDate: 'Oct 25, 2026',
    dayOfWeek: 'Sunday',
    streakDayAtCompletion: 1,
    isRecoveryDay: false,
    questsCompleted: [
      { name: 'Push-ups', repsOrSteps: 20, unit: 'reps', target: 20 },
      { name: 'Sit-ups / Crunches', repsOrSteps: 20, unit: 'reps', target: 20 },
      { name: 'Bodyweight Squats', repsOrSteps: 25, unit: 'reps', target: 25 },
      { name: 'Outdoor Walk / Steps', repsOrSteps: 3200, unit: 'steps', target: 3000 },
    ],
    totalXpEarned: 310,
    hunterLevel: 1,
    hunterRank: 'E' as HunterRank,
    waterIntakeMl: 2500,
    notes: 'First awakening session. Core and push endurance felt steady.',
  },
  {
    id: 'log_seed_1',
    date: '2026-10-26',
    displayDate: 'Oct 26, 2026',
    dayOfWeek: 'Monday',
    streakDayAtCompletion: 2,
    isRecoveryDay: false,
    questsCompleted: [
      { name: 'Push-ups', repsOrSteps: 25, unit: 'reps', target: 20 },
      { name: 'Sit-ups / Crunches', repsOrSteps: 25, unit: 'reps', target: 20 },
      { name: 'Bodyweight Squats', repsOrSteps: 30, unit: 'reps', target: 25 },
      { name: 'Outdoor Walk / Steps', repsOrSteps: 4150, unit: 'steps', target: 3000 },
    ],
    totalXpEarned: 320,
    hunterLevel: 2,
    hunterRank: 'E' as HunterRank,
    waterIntakeMl: 2600,
    notes: 'Exceeded rep targets on squats and outdoor walk. Fatigue nominal.',
  },
];

export const INITIAL_PROFILE: HunterProfile = {
  name: 'Sung Jin-Woo',
  title: 'Wolf Slayer',
  job: 'None',
  rank: 'E',
  level: 1,
  currentXp: 0,
  requiredXp: 100,
  hp: 100,
  maxHp: 100,
  mp: 20,
  maxMp: 20,
  fatigue: 0,
  streakDays: 2,
  bestStreak: 2,
  totalWorkoutsCompleted: 2,
  lastCompletedDate: '2026-10-26',
  isRecoveryDay: false,
  waterIntakeMl: 600,
  targetWaterMl: 2500,
  stats: {
    strength: 10,
    agility: 10,
    vitality: 10,
    stamina: 10,
    perception: 10,
    unallocatedPoints: 3,
  },
  quests: INITIAL_QUESTS,
  milestones: INITIAL_MILESTONES,
  notifications: [
    {
      id: 'notif_welcome',
      title: '[SYSTEM: PLAYER AWAKENED]',
      body: 'Welcome to the Hunter Fitness System. Complete daily quests to level up.',
      timestamp: '08:00 AM',
      type: 'quest',
      read: false,
    },
    {
      id: 'notif_schedule',
      title: '[SCHEDULE: DAILY REMINDERS]',
      body: 'Daily reminders configured for 8:00 AM (Quest Brief) & 8:00 PM (Streak Reminder).',
      timestamp: 'Just now',
      type: 'quest',
      read: false,
    },
  ],
  settings: {
    enabled8am: true,
    enabled8pm: true,
    milestonesEnabled: true,
    soundEnabled: true,
    browserPermission: 'default',
  },
  workoutLogs: INITIAL_WORKOUT_LOGS,
};

export function calculateRank(level: number): HunterRank {
  if (level >= 30) return 'National';
  if (level >= 25) return 'S';
  if (level >= 20) return 'A';
  if (level >= 15) return 'B';
  if (level >= 10) return 'C';
  if (level >= 5) return 'D';
  return 'E';
}

export function calculateRequiredXp(level: number): number {
  return Math.round(100 * Math.pow(1.22, level - 1));
}

export const StorageService = {
  loadProfile(): HunterProfile {
    try {
      const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}profile`);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Ensure workoutLogs exists
        if (!parsed.workoutLogs || !Array.isArray(parsed.workoutLogs)) {
          parsed.workoutLogs = INITIAL_WORKOUT_LOGS;
        }
        // Ensure browserPermission syncs with actual browser state
        if (typeof window !== 'undefined' && 'Notification' in window) {
          parsed.settings.browserPermission = Notification.permission;
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse profile from storage, using defaults', e);
    }
    return INITIAL_PROFILE;
  },

  saveProfile(profile: HunterProfile): void {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}profile`, JSON.stringify(profile));
      // Also write mirrored individual SharedPreferences keys for inspection
      localStorage.setItem(`${STORAGE_KEY_PREFIX}hunter_level`, profile.level.toString());
      localStorage.setItem(`${STORAGE_KEY_PREFIX}hunter_xp`, profile.currentXp.toString());
      localStorage.setItem(`${STORAGE_KEY_PREFIX}current_streak`, profile.streakDays.toString());
      localStorage.setItem(`${STORAGE_KEY_PREFIX}best_streak`, profile.bestStreak.toString());
      localStorage.setItem(`${STORAGE_KEY_PREFIX}hunter_rank`, profile.rank);
      localStorage.setItem(`${STORAGE_KEY_PREFIX}reminders_8am`, profile.settings.enabled8am ? 'true' : 'false');
      localStorage.setItem(`${STORAGE_KEY_PREFIX}reminders_8pm`, profile.settings.enabled8pm ? 'true' : 'false');
      if (profile.lastCompletedDate) {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}last_completed_date`, profile.lastCompletedDate);
      }
    } catch (e) {
      console.error('Failed to write to local storage', e);
    }
  },

  exportSharedPreferences(): Record<string, string> {
    const dump: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        dump[key] = localStorage.getItem(key) || '';
      }
    }
    return dump;
  },

  resetProfile(): HunterProfile {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
    return INITIAL_PROFILE;
  },
};
