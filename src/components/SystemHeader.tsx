import React from 'react';
import { Bell, Volume2, VolumeX, Smartphone, Monitor, Shield, Sparkles } from 'lucide-react';
import { HunterProfile } from '../types/hunter';
import { sounds } from '../services/soundService';

interface SystemHeaderProps {
  profile: HunterProfile;
  activeTab: 'quests' | 'status' | 'logs' | 'recovery' | 'milestones' | 'flutter';
  setActiveTab: (tab: 'quests' | 'status' | 'logs' | 'recovery' | 'milestones' | 'flutter') => void;
  viewMode: 'phone' | 'desktop';
  setViewMode: (mode: 'phone' | 'desktop') => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  unreadCount: number;
  openNotificationDrawer: () => void;
}

export const SystemHeader: React.FC<SystemHeaderProps> = ({
  profile,
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  soundEnabled,
  toggleSound,
  unreadCount,
  openNotificationDrawer,
}) => {
  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'National':
        return 'text-amber-400 border-amber-400/50 bg-amber-400/10 shadow-amber-400/20';
      case 'S':
        return 'text-purple-400 border-purple-400/50 bg-purple-400/10 shadow-purple-400/20';
      case 'A':
        return 'text-rose-400 border-rose-400/50 bg-rose-400/10 shadow-rose-400/20';
      case 'B':
        return 'text-cyan-400 border-cyan-400/50 bg-cyan-400/10 shadow-cyan-400/20';
      case 'C':
        return 'text-emerald-400 border-emerald-400/50 bg-emerald-400/10 shadow-emerald-400/20';
      case 'D':
        return 'text-blue-400 border-blue-400/50 bg-blue-400/10 shadow-blue-400/20';
      default:
        return 'text-slate-400 border-slate-500/50 bg-slate-500/10 shadow-slate-500/20';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-md border-b border-cyan-500/20 px-4 md:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('quests')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-400/50 flex items-center justify-center text-cyan-400 group-hover:border-cyan-300 transition-colors shadow-sm shadow-cyan-500/20">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-hud text-lg md:text-xl font-bold tracking-wider text-slate-100 group-hover:text-cyan-300 transition-colors whitespace-nowrap">
                HUNTER SYSTEM
              </span>
              <span className="text-[10px] uppercase font-mono-num tracking-widest text-cyan-400/80 -mt-1 hidden sm:block">
                SOLO FITNESS PROTOCOL
              </span>
            </div>
          </button>

          {/* Quick Rank Badge */}
          <div
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-hud font-bold tracking-wider ${getRankColor(
              profile.rank
            )}`}
          >
            <Sparkles className="w-3 h-3" />
            <span>{profile.rank}-RANK</span>
            <span className="text-slate-400 font-mono-num font-normal text-[11px]">LV.{profile.level}</span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 text-xs lg:text-sm font-medium">
          <button
            onClick={() => {
              sounds.playTick();
              setActiveTab('quests');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'quests'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Daily Quests
          </button>

          <button
            onClick={() => {
              sounds.playTick();
              setActiveTab('status');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'status'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Status Window
            {profile.stats.unallocatedPoints > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 text-[10px] bg-cyan-500 text-slate-950 rounded font-bold">
                +{profile.stats.unallocatedPoints}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              sounds.playTick();
              setActiveTab('logs');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'logs'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Workout Log ({profile.workoutLogs.length})
          </button>

          <button
            onClick={() => {
              sounds.playTick();
              setActiveTab('recovery');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'recovery'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Recovery &amp; Hydration
          </button>

          <button
            onClick={() => {
              sounds.playTick();
              setActiveTab('milestones');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'milestones'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Streak Milestones ({profile.streakDays}d)
          </button>

          <button
            onClick={() => {
              sounds.playTick();
              setActiveTab('flutter');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'flutter'
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40 font-semibold'
                : 'text-blue-400/80 hover:text-blue-300'
            }`}
          >
            Flutter Project &amp; APK
          </button>
        </nav>

        {/* Zone 3: Primary Action & Hardware Tools */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute System Audio' : 'Unmute System Audio'}
            className="w-9 h-9 rounded-lg bg-slate-900/80 border border-slate-700/60 hover:border-cyan-500/40 flex items-center justify-center text-slate-300 hover:text-cyan-300 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* View Mode Toggle (Phone / Desktop) */}
          <button
            onClick={() => {
              sounds.playTick();
              setViewMode(viewMode === 'phone' ? 'desktop' : 'phone');
            }}
            title={viewMode === 'phone' ? 'Switch to Full Desktop Command Center' : 'Switch to Android Phone Simulator'}
            className="w-9 h-9 rounded-lg bg-slate-900/80 border border-slate-700/60 hover:border-cyan-500/40 flex items-center justify-center text-slate-300 hover:text-cyan-300 transition-colors"
          >
            {viewMode === 'phone' ? (
              <Monitor className="w-4 h-4 text-cyan-400" />
            ) : (
              <Smartphone className="w-4 h-4 text-slate-300" />
            )}
          </button>

          {/* Notification Center Trigger */}
          <button
            onClick={() => {
              sounds.playTick();
              openNotificationDrawer();
            }}
            title="Open Notification Drawer"
            className="relative px-3 py-2 rounded-lg bg-cyan-950/50 border border-cyan-500/40 hover:bg-cyan-900/40 hover:border-cyan-400 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm shadow-cyan-950"
          >
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Alerts</span>
            {unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 font-bold text-[10px] flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
