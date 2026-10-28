import React, { useState, useEffect } from 'react';
import {
  HunterProfile,
  HunterRank,
  HunterStats,
  QuestItem,
  SystemNotification,
  WorkoutLogEntry,
} from './types/hunter';
import {
  StorageService,
  calculateRank,
  calculateRequiredXp,
  INITIAL_PROFILE,
} from './services/storageService';
import { NotificationService } from './services/notificationService';
import { sounds } from './services/soundService';
import { SystemHeader } from './components/SystemHeader';
import { StatusWindow } from './components/StatusWindow';
import { DailyQuestBoard } from './components/DailyQuestBoard';
import { RecoveryMode } from './components/RecoveryMode';
import { StreakMilestones } from './components/StreakMilestones';
import { NotificationCenter } from './components/NotificationCenter';
import { FlutterStarterHub } from './components/FlutterStarterHub';
import { LevelUpModal } from './components/LevelUpModal';
import { AndroidPhoneFrame } from './components/AndroidPhoneFrame';
import { WorkoutLog } from './components/WorkoutLog';

export default function App() {
  const [profile, setProfile] = useState<HunterProfile>(() => StorageService.loadProfile());
  const [activeTab, setActiveTab] = useState<'quests' | 'status' | 'logs' | 'recovery' | 'milestones' | 'flutter'>('quests');
  const [viewMode, setViewMode] = useState<'phone' | 'desktop'>('desktop');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(profile.settings.soundEnabled ?? true);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);
  const [levelUpData, setLevelUpData] = useState<{
    isOpen: boolean;
    newLevel: number;
    newRank: HunterRank;
    pointsAwarded: number;
  }>({
    isOpen: false,
    newLevel: 1,
    newRank: 'E',
    pointsAwarded: 3,
  });

  // Keep sounds sync with sound toggle
  useEffect(() => {
    sounds.setSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  // Persist profile whenever it changes
  useEffect(() => {
    StorageService.saveProfile(profile);
  }, [profile]);

  // Toggle sound
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setSoundEnabled(next);
    if (next) sounds.playTick();
    setProfile((prev) => ({
      ...prev,
      settings: { ...prev.settings, soundEnabled: next },
    }));
  };

  // Add XP with automatic Level Up & Rank Progression calculation
  const addExperience = (amount: number) => {
    setProfile((prev) => {
      let currentXp = prev.currentXp + amount;
      let level = prev.level;
      let requiredXp = prev.requiredXp;
      let unallocatedPoints = prev.stats.unallocatedPoints;
      let leveledUp = false;
      let initialLevel = prev.level;

      while (currentXp >= requiredXp) {
        currentXp -= requiredXp;
        level += 1;
        unallocatedPoints += 3;
        requiredXp = calculateRequiredXp(level);
        leveledUp = true;
      }

      const rank = calculateRank(level);

      if (leveledUp) {
        setLevelUpData({
          isOpen: true,
          newLevel: level,
          newRank: rank,
          pointsAwarded: (level - initialLevel) * 3,
        });

        // Add level up notification
        const notif: SystemNotification = {
          id: `lvl_${Date.now()}`,
          title: `[SYSTEM: LEVEL UP TO LV.${level}]`,
          body: `Attributes expanded. Current Rank: ${rank}-Rank. +${(level - initialLevel) * 3} Stat Points granted.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'rank',
          read: false,
        };

        return {
          ...prev,
          level,
          rank,
          currentXp,
          requiredXp,
          stats: {
            ...prev.stats,
            unallocatedPoints,
          },
          notifications: [notif, ...prev.notifications],
        };
      }

      return {
        ...prev,
        currentXp,
      };
    });
  };

  // Handle Quest Rep Increments
  const handleUpdateRep = (questId: string, delta: number) => {
    sounds.playTick();
    setProfile((prev) => {
      const updatedQuests = prev.quests.map((q) => {
        if (q.id === questId) {
          const nextVal = Math.max(0, q.current + delta);
          const wasCompleted = q.completed || q.current >= q.target;
          const isNowCompleted = nextVal >= q.target;

          if (!wasCompleted && isNowCompleted) {
            sounds.playQuestComplete();
            addExperience(q.xpReward);
          }

          return {
            ...q,
            current: nextVal,
            completed: isNowCompleted,
          };
        }
        return q;
      });

      return {
        ...prev,
        quests: updatedQuests,
      };
    });
  };

  // Handle Quest Complete Checkbox Toggle
  const handleToggleQuestComplete = (questId: string) => {
    sounds.playTick();
    setProfile((prev) => {
      const updatedQuests = prev.quests.map((q) => {
        if (q.id === questId) {
          const isDone = q.completed || q.current >= q.target;
          if (!isDone) {
            sounds.playQuestComplete();
            addExperience(q.xpReward);
            return {
              ...q,
              current: q.target,
              completed: true,
            };
          } else {
            return {
              ...q,
              current: 0,
              completed: false,
            };
          }
        }
        return q;
      });

      return {
        ...prev,
        quests: updatedQuests,
      };
    });
  };

  // Check if today is already claimed
  const todayStr = new Date().toISOString().split('T')[0];
  const hasClaimedToday = profile.lastCompletedDate === todayStr;

  const isAllQuestsCompleted =
    profile.isRecoveryDay ||
    profile.quests.every((q) => q.completed || q.current >= q.target);

  // Claim Daily Grand Reward & Archive Workout Log
  const handleClaimDailyReward = () => {
    sounds.playQuestComplete();
    const newStreak = profile.streakDays + 1;
    const bestStreak = Math.max(profile.bestStreak, newStreak);

    // Check milestones
    checkAndAwardMilestones(newStreak);

    const now = new Date();
    const displayDate = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const dayOfWeek = now.toLocaleDateString("en-US", { weekday: "long" });

    const questsCompleted = profile.isRecoveryDay
      ? [
          { name: "Full Body Mobility & Stretching", repsOrSteps: 15, unit: "minutes", target: 10 },
          { name: "Hydration Reservoir", repsOrSteps: profile.waterIntakeMl, unit: "ml", target: 2000 },
          { name: "Gentle Recovery Stroll", repsOrSteps: 1500, unit: "steps", target: 1500 },
        ]
      : profile.quests.map((q) => ({
          name: q.name,
          repsOrSteps: q.current,
          unit: q.unit,
          target: q.target,
        }));

    const newLogEntry: WorkoutLogEntry = {
      id: `log_${Date.now()}`,
      date: todayStr,
      displayDate,
      dayOfWeek,
      streakDayAtCompletion: newStreak,
      isRecoveryDay: profile.isRecoveryDay,
      questsCompleted,
      totalXpEarned: 150 + profile.quests.reduce((acc, q) => acc + (q.completed ? q.xpReward : 0), 0),
      hunterLevel: profile.level,
      hunterRank: profile.rank,
      waterIntakeMl: profile.waterIntakeMl,
      notes: profile.isRecoveryDay ? "Active recovery day completed. Streak preserved." : "Daily preparation quest cleared with complete repetition compliance.",
    };

    // Add notification
    const notif: SystemNotification = {
      id: `claim_${Date.now()}`,
      title: "[DAILY QUEST CLEARED]",
      body: `Daily training complete! Streak advanced to ${newStreak} days. +150 Bonus XP awarded. Log archived.`,
      timestamp: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "quest",
      read: false,
    };

    setProfile((prev) => ({
      ...prev,
      streakDays: newStreak,
      bestStreak,
      lastCompletedDate: todayStr,
      totalWorkoutsCompleted: prev.totalWorkoutsCompleted + 1,
      notifications: [notif, ...prev.notifications],
      workoutLogs: [newLogEntry, ...prev.workoutLogs],
    }));

    addExperience(150);
  };

  // Add Manual Workout Log
  const handleAddManualLog = (newLog: Omit<WorkoutLogEntry, "id">) => {
    const entry: WorkoutLogEntry = {
      ...newLog,
      id: `log_manual_${Date.now()}`,
    };

    setProfile((prev) => ({
      ...prev,
      workoutLogs: [entry, ...prev.workoutLogs],
      totalWorkoutsCompleted: prev.totalWorkoutsCompleted + 1,
    }));

    addExperience(newLog.totalXpEarned);
  };

  // Delete Workout Log
  const handleDeleteLog = (logId: string) => {
    setProfile((prev) => ({
      ...prev,
      workoutLogs: prev.workoutLogs.filter((l) => l.id !== logId),
    }));
  };

  // Check streak milestones and trigger notifications
  const checkAndAwardMilestones = (days: number) => {
    const milestoneTargets = [3, 7, 14, 30, 60, 100];
    if (milestoneTargets.includes(days) && profile.settings.milestonesEnabled) {
      const notif = NotificationService.triggerStreakMilestone(days);
      if (notif) {
        setProfile((prev) => ({
          ...prev,
          notifications: [notif, ...prev.notifications],
          milestones: prev.milestones.map((m) =>
            m.days === days
              ? { ...m, achieved: true, achievedAt: new Date().toISOString() }
              : m
          ),
        }));
      }
    }
  };

  // Simulate streak
  const handleSimulateStreak = (targetDays: number) => {
    checkAndAwardMilestones(targetDays);
    setProfile((prev) => ({
      ...prev,
      streakDays: targetDays,
      bestStreak: Math.max(prev.bestStreak, targetDays),
    }));
  };

  const handleIncrementStreakDay = () => {
    const nextDays = profile.streakDays + 1;
    checkAndAwardMilestones(nextDays);
    setProfile((prev) => ({
      ...prev,
      streakDays: nextDays,
      bestStreak: Math.max(prev.bestStreak, nextDays),
    }));
  };

  // Stat allocation
  const handleAllocateStat = (statKey: keyof Omit<HunterStats, 'unallocatedPoints'>) => {
    if (profile.stats.unallocatedPoints <= 0) return;
    setProfile((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [statKey]: prev.stats[statKey] + 1,
        unallocatedPoints: prev.stats.unallocatedPoints - 1,
      },
    }));
  };

  // Update Hunter Name
  const handleUpdateName = (newName: string) => {
    setProfile((prev) => ({
      ...prev,
      name: newName,
    }));
  };

  // Recovery day toggle
  const handleToggleRecoveryDay = (enabled: boolean) => {
    setProfile((prev) => ({
      ...prev,
      isRecoveryDay: enabled,
    }));
  };

  // Add water intake
  const handleAddWater = (amountMl: number) => {
    setProfile((prev) => ({
      ...prev,
      waterIntakeMl: prev.waterIntakeMl + amountMl,
    }));
  };

  // Toggle notification settings
  const handleToggleSchedule = (
    key: 'enabled8am' | 'enabled8pm' | 'milestonesEnabled',
    val: boolean
  ) => {
    setProfile((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: val,
      },
    }));
  };

  // Clear notification drawer
  const handleClearNotifications = () => {
    setProfile((prev) => ({
      ...prev,
      notifications: [],
    }));
  };

  // Native notification permission
  const handleRequestBrowserPermission = async () => {
    const res = await NotificationService.requestPermission();
    setProfile((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        browserPermission: res,
      },
    }));
    if (res === 'granted') {
      const notif = NotificationService.notify(
        '[SYSTEM: PERMISSION GRANTED]',
        'Hunter alert transmitter operational. 8:00 AM & 8:00 PM alarms active.',
        'quest'
      );
      setProfile((prev) => ({
        ...prev,
        notifications: [notif, ...prev.notifications],
      }));
    }
  };

  // Test 8:00 AM alarm
  const handleTest8am = () => {
    const notif = NotificationService.trigger8amDailyQuest();
    setProfile((prev) => ({
      ...prev,
      notifications: [notif, ...prev.notifications],
    }));
  };

  // Test 8:00 PM alarm
  const handleTest8pm = () => {
    const notif = NotificationService.trigger8pmStreakReminder();
    setProfile((prev) => ({
      ...prev,
      notifications: [notif, ...prev.notifications],
    }));
  };

  // Render view body
  const renderTabContent = () => {
    switch (activeTab) {
      case 'status':
        return (
          <StatusWindow
            profile={profile}
            onAllocateStat={handleAllocateStat}
            onUpdateName={handleUpdateName}
          />
        );
      case 'logs':
        return (
          <WorkoutLog
            profile={profile}
            onAddManualLog={handleAddManualLog}
            onDeleteLog={handleDeleteLog}
          />
        );
      case 'recovery':
        return (
          <RecoveryMode
            profile={profile}
            onToggleRecoveryDay={handleToggleRecoveryDay}
            onAddWater={handleAddWater}
          />
        );
      case 'milestones':
        return (
          <StreakMilestones
            currentStreak={profile.streakDays}
            bestStreak={profile.bestStreak}
            milestones={profile.milestones}
            onSimulateStreak={handleSimulateStreak}
            onIncrementStreakDay={handleIncrementStreakDay}
          />
        );
      case 'flutter':
        return <FlutterStarterHub />;
      case 'quests':
      default:
        return (
          <DailyQuestBoard
            quests={profile.quests}
            streakDays={profile.streakDays}
            isAllCompleted={isAllQuestsCompleted}
            onUpdateRep={handleUpdateRep}
            onToggleQuestComplete={handleToggleQuestComplete}
            onClaimDailyReward={handleClaimDailyReward}
            hasClaimedToday={hasClaimedToday}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Bar Navigation */}
      <SystemHeader
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        soundEnabled={soundEnabled}
        toggleSound={handleToggleSound}
        unreadCount={profile.notifications.length}
        openNotificationDrawer={() => setIsNotificationDrawerOpen(true)}
      />

      {/* Main Body Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col items-center justify-start">
        {viewMode === 'phone' ? (
          <div className="w-full flex justify-center py-2">
            <AndroidPhoneFrame
              notifications={profile.notifications}
              onClearNotifications={handleClearNotifications}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            >
              {renderTabContent()}
            </AndroidPhoneFrame>
          </div>
        ) : (
          <div className="w-full space-y-6">
            {renderTabContent()}
          </div>
        )}
      </main>

      {/* Level Up & Rank Celebration Modal */}
      <LevelUpModal
        isOpen={levelUpData.isOpen}
        onClose={() => setLevelUpData((prev) => ({ ...prev, isOpen: false }))}
        newLevel={levelUpData.newLevel}
        newRank={levelUpData.newRank}
        pointsAwarded={levelUpData.pointsAwarded}
      />

      {/* System Notification Drawer & SharedPreferences Inspector */}
      <NotificationCenter
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        profile={profile}
        onToggleSchedule={handleToggleSchedule}
        onClearNotifications={handleClearNotifications}
        onTest8am={handleTest8am}
        onTest8pm={handleTest8pm}
        onRequestBrowserPermission={handleRequestBrowserPermission}
      />

      {/* Subtle Bottom System Status Bar */}
      <footer className="border-t border-slate-900 bg-[#04060d] text-slate-500 text-xs py-4 px-6 select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-hud font-bold text-slate-400">HUNTER SYSTEM PROTOCOL</span>
            <span>· Local Storage Connected</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>8:00 AM Quest Alarm: {profile.settings.enabled8am ? 'ACTIVE' : 'OFF'}</span>
            <span>·</span>
            <span>8:00 PM Streak Alarm: {profile.settings.enabled8pm ? 'ACTIVE' : 'OFF'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
