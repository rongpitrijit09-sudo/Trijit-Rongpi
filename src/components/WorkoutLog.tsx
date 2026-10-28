import React, { useState, useMemo } from 'react';
import {
  Calendar,
  History,
  TrendingUp,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  Moon,
  Search,
  Filter,
  Sparkles,
  Footprints,
  Flame,
  Award,
} from 'lucide-react';
import { HunterProfile, WorkoutLogEntry } from '../types/hunter';
import { sounds } from '../services/soundService';

interface WorkoutLogProps {
  profile: HunterProfile;
  onAddManualLog: (log: Omit<WorkoutLogEntry, 'id'>) => void;
  onDeleteLog: (logId: string) => void;
}

export const WorkoutLog: React.FC<WorkoutLogProps> = ({
  profile,
  onAddManualLog,
  onDeleteLog,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'workout' | 'recovery'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Manual log form state
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualPushups, setManualPushups] = useState(20);
  const [manualSitups, setManualSitups] = useState(20);
  const [manualSquats, setManualSquats] = useState(25);
  const [manualSteps, setManualSteps] = useState(3000);
  const [manualIsRecovery, setManualIsRecovery] = useState(false);
  const [manualNotes, setManualNotes] = useState('');

  // Lifetime cumulative metrics
  const cumulativeStats = useMemo(() => {
    let totalPushups = 0;
    let totalSitups = 0;
    let totalSquats = 0;
    let totalSteps = 0;
    let totalXp = 0;

    profile.workoutLogs.forEach((entry) => {
      totalXp += entry.totalXpEarned;
      entry.questsCompleted.forEach((q) => {
        const lower = q.name.toLowerCase();
        if (lower.includes('push')) totalPushups += q.repsOrSteps;
        else if (lower.includes('sit') || lower.includes('crunch')) totalSitups += q.repsOrSteps;
        else if (lower.includes('squat')) totalSquats += q.repsOrSteps;
        else if (lower.includes('step') || lower.includes('walk')) totalSteps += q.repsOrSteps;
      });
    });

    return {
      totalWorkouts: profile.workoutLogs.length,
      totalPushups,
      totalSitups,
      totalSquats,
      totalSteps,
      totalXp,
    };
  }, [profile.workoutLogs]);

  // Filtered and searched logs
  const filteredLogs = useMemo(() => {
    return profile.workoutLogs
      .filter((log) => {
        if (filterType === 'workout' && log.isRecoveryDay) return false;
        if (filterType === 'recovery' && !log.isRecoveryDay) return false;
        if (!searchQuery.trim()) return true;

        const q = searchQuery.toLowerCase();
        const matchesDate = log.displayDate.toLowerCase().includes(q) || log.date.includes(q);
        const matchesNote = log.notes?.toLowerCase().includes(q);
        const matchesExercise = log.questsCompleted.some((item) =>
          item.name.toLowerCase().includes(q)
        );
        return matchesDate || matchesNote || matchesExercise;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [profile.workoutLogs, filterType, searchQuery]);

  // Export logs to CSV
  const handleExportCsv = () => {
    sounds.playTick();
    const headers = [
      'Date',
      'DayOfWeek',
      'Type',
      'StreakDay',
      'Pushups',
      'Situps',
      'Squats',
      'Steps',
      'XpEarned',
      'HunterLevel',
      'HunterRank',
      'Notes',
    ];

    const rows = profile.workoutLogs.map((entry) => {
      let pushups = 0;
      let situps = 0;
      let squats = 0;
      let steps = 0;

      entry.questsCompleted.forEach((q) => {
        const lower = q.name.toLowerCase();
        if (lower.includes('push')) pushups = q.repsOrSteps;
        else if (lower.includes('sit')) situps = q.repsOrSteps;
        else if (lower.includes('squat')) squats = q.repsOrSteps;
        else if (lower.includes('step') || lower.includes('walk')) steps = q.repsOrSteps;
      });

      return [
        entry.date,
        entry.dayOfWeek,
        entry.isRecoveryDay ? 'Active Recovery' : 'Workout',
        entry.streakDayAtCompletion,
        pushups,
        situps,
        squats,
        steps,
        entry.totalXpEarned,
        entry.hunterLevel,
        entry.hunterRank,
        `"${(entry.notes || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hunter_workout_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveManualLog = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playQuestComplete();

    const dateObj = new Date(manualDate + 'T12:00:00');
    const displayDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

    const quests = manualIsRecovery
      ? [
          { name: 'Full Body Mobility & Stretching', repsOrSteps: 15, unit: 'minutes', target: 10 },
          { name: 'Hydration Reservoir', repsOrSteps: 2000, unit: 'ml', target: 2000 },
          { name: 'Gentle Recovery Stroll', repsOrSteps: manualSteps || 1500, unit: 'steps', target: 1500 },
        ]
      : [
          { name: 'Push-ups', repsOrSteps: manualPushups, unit: 'reps', target: 20 },
          { name: 'Sit-ups / Crunches', repsOrSteps: manualSitups, unit: 'reps', target: 20 },
          { name: 'Bodyweight Squats', repsOrSteps: manualSquats, unit: 'reps', target: 25 },
          { name: 'Outdoor Walk / Steps', repsOrSteps: manualSteps, unit: 'steps', target: 3000 },
        ];

    onAddManualLog({
      date: manualDate,
      displayDate,
      dayOfWeek,
      streakDayAtCompletion: profile.streakDays,
      isRecoveryDay: manualIsRecovery,
      questsCompleted: quests,
      totalXpEarned: manualIsRecovery ? 110 : 310,
      hunterLevel: profile.level,
      hunterRank: profile.rank,
      waterIntakeMl: manualIsRecovery ? 2500 : 2000,
      notes: manualNotes.trim() || (manualIsRecovery ? 'Active recovery protocol completed.' : 'Standard calisthenics quest cleared.'),
    });

    setIsManualModalOpen(false);
    setManualNotes('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Banner & Cumulative Stats */}
      <div className="rounded-2xl bg-gradient-to-b from-[#0c1833] to-[#070b14] border border-cyan-500/30 p-6 shadow-xl shadow-cyan-950/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-cyan-500/20">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase">
              <History className="w-3.5 h-3.5" />
              <span>[ TRAINING ARCHIVE: SYSTEM RECORD ]</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
              Hunter Workout Log
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Historical record of completed daily quests, repetitions, and attribute progression.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                sounds.playTick();
                setIsManualModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-hud tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>RECORD SESSION</span>
            </button>

            <button
              onClick={handleExportCsv}
              title="Download CSV report"
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Lifetime Rep Counters Strip */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">SESSIONS</div>
            <div className="text-xl font-bold font-mono-num text-cyan-300 mt-0.5">
              {cumulativeStats.totalWorkouts}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">PUSH-UPS</div>
            <div className="text-xl font-bold font-mono-num text-slate-100 mt-0.5">
              {cumulativeStats.totalPushups.toLocaleString()}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">SIT-UPS</div>
            <div className="text-xl font-bold font-mono-num text-slate-100 mt-0.5">
              {cumulativeStats.totalSitups.toLocaleString()}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">SQUATS</div>
            <div className="text-xl font-bold font-mono-num text-slate-100 mt-0.5">
              {cumulativeStats.totalSquats.toLocaleString()}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">TOTAL STEPS</div>
            <div className="text-xl font-bold font-mono-num text-slate-100 mt-0.5">
              {cumulativeStats.totalSteps.toLocaleString()}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
            <div className="text-[10px] text-cyan-400 font-mono tracking-wider uppercase">TOTAL XP</div>
            <div className="text-xl font-bold font-mono-num text-cyan-300 mt-0.5">
              +{cumulativeStats.totalXp.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#080d1a] border border-slate-800">
        {/* Interactive Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => {
              sounds.playTick();
              setFilterType('all');
            }}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              filterType === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Logs ({profile.workoutLogs.length})
          </button>

          <button
            onClick={() => {
              sounds.playTick();
              setFilterType('workout');
            }}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              filterType === 'workout'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Quests Cleared
          </button>

          <button
            onClick={() => {
              sounds.playTick();
              setFilterType('recovery');
            }}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              filterType === 'recovery'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active Recovery
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search date or exercises..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 focus:border-cyan-500/50 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* History Log Feed */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#080d1a] border border-slate-800 text-slate-400 space-y-3">
            <History className="w-8 h-8 text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-slate-300">No workout records found</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Complete your daily quests on the Daily Quests tab to archive your training session, or click &ldquo;Record Session&rdquo; above.
            </p>
          </div>
        ) : (
          filteredLogs.map((entry) => (
            <div
              key={entry.id}
              className={`p-5 rounded-2xl border transition-all duration-200 ${
                entry.isRecoveryDay
                  ? 'bg-[#080f1e] border-blue-500/30'
                  : 'bg-[#080d1a] border-slate-800/80 hover:border-cyan-500/30'
              }`}
            >
              {/* Entry Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      entry.isRecoveryDay
                        ? 'bg-blue-500/15 border border-blue-400/40 text-blue-300'
                        : 'bg-cyan-500/15 border border-cyan-400/40 text-cyan-400'
                    }`}
                  >
                    {entry.isRecoveryDay ? <Moon className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 text-sm">{entry.displayDate}</span>
                      <span className="text-xs text-slate-400">· {entry.dayOfWeek}</span>
                      <span className="text-xs text-amber-400 font-mono font-semibold flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-amber-400" />
                        Day {entry.streakDayAtCompletion} Streak
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Hunter Status:{' '}
                      <span className="text-cyan-300 font-medium">
                        {entry.hunterRank}-Rank (Lv.{entry.hunterLevel})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="text-xs font-mono font-bold text-cyan-300 px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/30">
                    +{entry.totalXpEarned} XP
                  </span>

                  <button
                    onClick={() => {
                      if (confirm('Delete this workout log entry?')) {
                        sounds.playTick();
                        onDeleteLog(entry.id);
                      }
                    }}
                    title="Delete log"
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quest Items Breakdown Grid */}
              <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {entry.questsCompleted.map((quest, qIdx) => (
                  <div
                    key={qIdx}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80"
                  >
                    <div className="text-[11px] text-slate-400 truncate">{quest.name}</div>
                    <div className="font-mono-num font-bold text-sm text-slate-200 mt-0.5">
                      <span className="text-cyan-300">{quest.repsOrSteps.toLocaleString()}</span>
                      <span className="text-slate-500 text-xs font-normal"> / {quest.target} {quest.unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes or Remark */}
              {entry.notes && (
                <div className="mt-3 text-xs text-slate-400 italic bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
                  &ldquo;{entry.notes}&rdquo;
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Manual Record Session Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#090e1a] border border-cyan-500/40 p-6 shadow-2xl shadow-cyan-950/50 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2 font-hud">
                <Plus className="w-4 h-4 text-cyan-400" />
                RECORD TRAINING SESSION
              </h2>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveManualLog} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Workout Date</label>
                  <input
                    type="date"
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Session Type</label>
                  <select
                    value={manualIsRecovery ? 'recovery' : 'workout'}
                    onChange={(e) => setManualIsRecovery(e.target.value === 'recovery')}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="workout">Standard Quests (Calisthenics)</option>
                    <option value="recovery">Active Recovery (Stretching)</option>
                  </select>
                </div>
              </div>

              {!manualIsRecovery && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div>
                    <label className="block text-slate-400 mb-1">Push-ups</label>
                    <input
                      type="number"
                      min="0"
                      value={manualPushups}
                      onChange={(e) => setManualPushups(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 text-cyan-300 font-mono-num font-bold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Sit-ups</label>
                    <input
                      type="number"
                      min="0"
                      value={manualSitups}
                      onChange={(e) => setManualSitups(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 text-cyan-300 font-mono-num font-bold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Squats</label>
                    <input
                      type="number"
                      min="0"
                      value={manualSquats}
                      onChange={(e) => setManualSquats(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 text-cyan-300 font-mono-num font-bold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Steps</label>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={manualSteps}
                      onChange={(e) => setManualSteps(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 text-cyan-300 font-mono-num font-bold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Training Notes / Observations</label>
                <textarea
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="E.g. Clean form, fast cadence, explosive push reps..."
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-bold font-hud tracking-wider uppercase text-xs shadow-lg shadow-cyan-500/30 transition-all cursor-pointer"
              >
                COMMIT LOG TO SYSTEM
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
