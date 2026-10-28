import React from 'react';
import { Flame, CheckCircle2, Lock, Zap, Award, Sparkles } from 'lucide-react';
import { StreakMilestone } from '../types/hunter';
import { sounds } from '../services/soundService';

interface StreakMilestonesProps {
  currentStreak: number;
  bestStreak: number;
  milestones: StreakMilestone[];
  onSimulateStreak: (days: number) => void;
  onIncrementStreakDay: () => void;
}

export const StreakMilestones: React.FC<StreakMilestonesProps> = ({
  currentStreak,
  bestStreak,
  milestones,
  onSimulateStreak,
  onIncrementStreakDay,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Streak Header */}
      <div className="rounded-2xl bg-gradient-to-b from-[#0e172a] to-[#070b14] border border-cyan-500/30 p-6 shadow-xl shadow-cyan-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>[ PROTOCOL: PERSISTENCE ENGINE ]</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
              Streak Milestones &amp; Awakening
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant notification &amp; bonus XP unlocked at 3, 7, 14, 30, 60, and 100 unbroken days.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-right">
              <div className="text-[10px] text-amber-400/80 font-mono tracking-wider uppercase">CURRENT STREAK</div>
              <div className="text-2xl font-bold font-mono-num text-amber-300">{currentStreak} DAYS</div>
            </div>

            <div className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-right">
              <div className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">ALL-TIME BEST</div>
              <div className="text-2xl font-bold font-mono-num text-slate-200">{bestStreak} DAYS</div>
            </div>
          </div>
        </div>

        {/* Quick Testing Bar */}
        <div className="mt-4 p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="text-xs text-cyan-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>
              <strong>Streak Simulator:</strong> Advance days or jump to a milestone to trigger the notification &amp; rewards.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => {
                sounds.playTick();
                onIncrementStreakDay();
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors cursor-pointer"
            >
              +1 Day
            </button>
            {[3, 7, 14, 30, 60, 100].map((target) => (
              <button
                key={target}
                onClick={() => {
                  sounds.playTick();
                  onSimulateStreak(target);
                }}
                className={`px-2 py-1 text-xs font-mono font-medium rounded transition-colors ${
                  currentStreak === target
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-300'
                }`}
              >
                {target}d
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Milestone Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {milestones.map((milestone) => {
          const isUnlocked = currentStreak >= milestone.days;
          const progress = Math.min(100, Math.round((currentStreak / milestone.days) * 100));

          return (
            <div
              key={milestone.days}
              className={`p-5 rounded-2xl border transition-all duration-200 ${
                isUnlocked
                  ? 'bg-[#09152b] border-amber-500/40 shadow-md shadow-amber-500/10'
                  : 'bg-[#080d1a] border-slate-800/80 hover:border-cyan-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border ${
                      isUnlocked
                        ? 'bg-amber-500/20 border-amber-400/50 shadow-sm shadow-amber-500/20'
                        : 'bg-slate-900 border-slate-700'
                    }`}
                  >
                    {milestone.badge}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-base font-bold tracking-tight ${
                          isUnlocked ? 'text-amber-300' : 'text-slate-200'
                        }`}
                      >
                        {milestone.title}
                      </h3>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{milestone.description}</div>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={`text-xs font-mono font-semibold px-2 py-0.5 rounded border ${
                      isUnlocked
                        ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                        : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}
                  >
                    +{milestone.xpBonus} XP
                  </span>
                </div>
              </div>

              {/* Progress to Milestone */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-400">Target: {milestone.days} Days</span>
                    <span className={isUnlocked ? 'text-amber-300 font-semibold' : 'text-slate-500'}>
                      {isUnlocked ? 'COMPLETE' : `${currentStreak} / ${milestone.days}d (${progress}%)`}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isUnlocked ? 'bg-amber-400' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-400">
                      <CheckCircle2 className="w-4 h-4" />
                      Achieved
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Lock className="w-3.5 h-3.5" />
                      Locked
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
