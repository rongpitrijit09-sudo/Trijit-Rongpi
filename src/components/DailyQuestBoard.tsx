import React from 'react';
import { CheckCircle2, Circle, AlertTriangle, Flame, Plus, Trophy, Activity, Footprints } from 'lucide-react';
import { QuestItem } from '../types/hunter';
import { WorkoutTimer } from './WorkoutTimer';
import { sounds } from '../services/soundService';

interface DailyQuestBoardProps {
  quests: QuestItem[];
  streakDays: number;
  isAllCompleted: boolean;
  onUpdateRep: (questId: string, delta: number) => void;
  onToggleQuestComplete: (questId: string) => void;
  onClaimDailyReward: () => void;
  hasClaimedToday: boolean;
}

export const DailyQuestBoard: React.FC<DailyQuestBoardProps> = ({
  quests,
  streakDays,
  isAllCompleted,
  onUpdateRep,
  onToggleQuestComplete,
  onClaimDailyReward,
  hasClaimedToday,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Solo Leveling Holographic Quest Header */}
      <div className="rounded-2xl bg-gradient-to-b from-[#0d1629] to-[#070b14] border border-cyan-500/30 p-6 shadow-xl shadow-cyan-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cyan-500/20">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase">
              <Activity className="w-3.5 h-3.5" />
              <span>[ QUEST INFO: DAILY PROTOCOL ]</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
              Preparation to Become Strong
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Beginner calisthenics &amp; cardiovascular endurance daily foundation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-hud font-bold flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>STREAK: {streakDays} DAYS</span>
            </div>
          </div>
        </div>

        {/* Penalty Alert Warning */}
        <div className="mt-4 p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-200/90 leading-relaxed">
            <strong className="text-rose-300 font-semibold">[WARNING: PENALTY SYSTEM]</strong> Failure to complete the daily quest before 23:59:59 will transport the player to the Penalty Zone. All progress resets daily at 00:00.
          </div>
        </div>
      </div>

      {/* Quest Item Cards */}
      <div className="space-y-3.5">
        {quests.map((quest) => {
          const percent = Math.min(100, Math.round((quest.current / quest.target) * 100));
          const isDone = quest.completed || quest.current >= quest.target;
          const isSteps = quest.unit === 'steps';

          return (
            <div
              key={quest.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                isDone
                  ? 'bg-[#091122]/90 border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                  : 'bg-[#080d1a] border-slate-800 hover:border-cyan-500/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left: Quest Name & Description */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleQuestComplete(quest.id)}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors focus:outline-none"
                      title={isDone ? 'Mark Incomplete' : 'Mark Completed'}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 hover:text-cyan-400" />
                      )}
                    </button>

                    <h2
                      className={`text-base font-bold tracking-tight transition-colors ${
                        isDone ? 'text-cyan-300' : 'text-slate-100'
                      }`}
                    >
                      {quest.name}
                    </h2>

                    <span className="text-[11px] font-mono text-cyan-400/80 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                      +{quest.xpReward} XP
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1 pl-7">{quest.description}</p>
                </div>

                {/* Right: Counter & Quick Controls */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pl-7 sm:pl-0 shrink-0">
                  {/* Numeric Progress */}
                  <div className="text-right">
                    <div className="font-mono-num text-lg font-bold">
                      <span className={isDone ? 'text-cyan-300' : 'text-slate-100'}>
                        {quest.current.toLocaleString()}
                      </span>
                      <span className="text-slate-500 text-xs font-normal"> / {quest.target.toLocaleString()} {quest.unit}</span>
                    </div>
                  </div>

                  {/* Increments Buttons */}
                  <div className="flex items-center gap-1">
                    {isSteps ? (
                      <>
                        <button
                          onClick={() => onUpdateRep(quest.id, 500)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 hover:bg-cyan-950/40 text-cyan-300 text-xs font-mono font-medium transition-colors"
                        >
                          +500
                        </button>
                        <button
                          onClick={() => onUpdateRep(quest.id, 1000)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 hover:bg-cyan-950/40 text-cyan-300 text-xs font-mono font-medium transition-colors"
                        >
                          +1k
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => onUpdateRep(quest.id, 1)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 hover:bg-cyan-950/40 text-cyan-300 text-xs font-mono font-medium transition-colors"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => onUpdateRep(quest.id, 5)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 hover:bg-cyan-950/40 text-cyan-300 text-xs font-mono font-medium transition-colors"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => onUpdateRep(quest.id, 10)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 hover:bg-cyan-950/40 text-cyan-300 text-xs font-mono font-medium transition-colors"
                        >
                          +10
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3.5 pl-7">
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      isDone ? 'bg-cyan-400 shadow-sm shadow-cyan-400' : 'bg-blue-600'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Built-in Rest & Set Timer */}
      <WorkoutTimer />

      {/* Daily Grand Reward Claim Button */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0a1428] to-[#060a14] border border-cyan-500/40 text-center space-y-3 shadow-lg">
        <div className="flex items-center justify-center gap-2 text-cyan-300 font-hud font-bold text-lg">
          <Trophy className="w-5 h-5 text-cyan-400" />
          <span>DAILY QUEST REWARD</span>
        </div>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Complete all four daily training quests to claim +150 bonus XP, attribute restoration, and advance your unbroken streak.
        </p>

        {hasClaimedToday ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Today&apos;s Quest Reward Claimed</span>
          </div>
        ) : (
          <button
            onClick={() => {
              if (isAllCompleted) {
                onClaimDailyReward();
              } else {
                sounds.playTick();
              }
            }}
            disabled={!isAllCompleted}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-hud font-bold text-sm tracking-wider uppercase transition-all ${
              isAllCompleted
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/30 hover:brightness-110 active:scale-98 cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
            }`}
          >
            {isAllCompleted ? 'Claim Quest Rewards (+150 XP)' : 'Complete All Quests to Claim'}
          </button>
        )}
      </div>
    </div>
  );
};
