import React, { useState } from 'react';
import { Shield, Sparkles, Award, Plus, Edit2, Check, Zap } from 'lucide-react';
import { HunterProfile, HunterStats } from '../types/hunter';
import { sounds } from '../services/soundService';

interface StatusWindowProps {
  profile: HunterProfile;
  onAllocateStat: (statKey: keyof Omit<HunterStats, 'unallocatedPoints'>) => void;
  onUpdateName: (newName: string) => void;
}

export const StatusWindow: React.FC<StatusWindowProps> = ({
  profile,
  onAllocateStat,
  onUpdateName,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateName(nameInput.trim());
      setIsEditingName(false);
      sounds.playTick();
    }
  };

  const getRankDetails = (rank: string) => {
    switch (rank) {
      case 'National':
        return { label: 'National Level Hunter', glow: 'text-amber-400 border-amber-400 bg-amber-950/20', bar: 'bg-amber-400' };
      case 'S':
        return { label: 'S-Rank Elite', glow: 'text-purple-400 border-purple-400 bg-purple-950/20', bar: 'bg-purple-400' };
      case 'A':
        return { label: 'A-Rank Vanguard', glow: 'text-rose-400 border-rose-400 bg-rose-950/20', bar: 'bg-rose-400' };
      case 'B':
        return { label: 'B-Rank Raider', glow: 'text-cyan-400 border-cyan-400 bg-cyan-950/20', bar: 'bg-cyan-400' };
      case 'C':
        return { label: 'C-Rank Hunter', glow: 'text-emerald-400 border-emerald-400 bg-emerald-950/20', bar: 'bg-emerald-400' };
      case 'D':
        return { label: 'D-Rank Novice', glow: 'text-blue-400 border-blue-400 bg-blue-950/20', bar: 'bg-blue-400' };
      default:
        return { label: 'E-Rank (Weakest)', glow: 'text-slate-400 border-slate-500 bg-slate-900/40', bar: 'bg-slate-400' };
    }
  };

  const rankInfo = getRankDetails(profile.rank);
  const xpPercent = Math.min(100, Math.round((profile.currentXp / profile.requiredXp) * 100));

  const statList: { key: keyof Omit<HunterStats, 'unallocatedPoints'>; label: string; desc: string }[] = [
    { key: 'strength', label: 'STRENGTH (STR)', desc: 'Increases muscular force and bodyweight rep endurance' },
    { key: 'agility', label: 'AGILITY (AGI)', desc: 'Boosts reaction speed, mobility, and movement agility' },
    { key: 'vitality', label: 'VITALITY (VIT)', desc: 'Enhances tissue recovery and maximum health pool' },
    { key: 'stamina', label: 'STAMINA (STA)', desc: 'Expands cardiovascular lung capacity and walking capacity' },
    { key: 'perception', label: 'PERCEPTION (PER)', desc: 'Sharpens posture awareness, mind-muscle connection' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Holographic Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#0e172a] to-[#070b14] border border-cyan-500/30 p-6 shadow-xl shadow-cyan-950/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/15">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-1">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              <span>[ SYSTEM STATUS WINDOW ]</span>
            </div>
            
            <div className="flex items-center gap-3">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="bg-slate-900 border border-cyan-400 text-white font-bold text-xl px-2.5 py-1 rounded focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1.5 bg-cyan-500 text-slate-950 rounded hover:bg-cyan-400"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {profile.name}
                  </h1>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-slate-400 hover:text-cyan-300 transition-colors p-1"
                    title="Edit Hunter Name"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-400 mt-0.5">
              Title: <span className="text-cyan-300 font-medium">{profile.title}</span> · Job: <span className="text-slate-300">{profile.job}</span>
            </p>
          </div>

          {/* Hunter Rank Box */}
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-xl border flex items-center gap-2.5 ${rankInfo.glow}`}>
              <Award className="w-5 h-5" />
              <div>
                <div className="text-xs uppercase font-hud font-bold tracking-wider">{rankInfo.label}</div>
                <div className="text-lg font-hud font-extrabold">{profile.rank}-RANK</div>
              </div>
            </div>

            <div className="px-4 py-2 rounded-xl border border-cyan-500/20 bg-slate-900/60 text-right">
              <div className="text-[11px] text-slate-400 font-mono tracking-wider">LEVEL</div>
              <div className="text-2xl font-bold font-mono-num text-cyan-300">{profile.level}</div>
            </div>
          </div>
        </div>

        {/* Level & XP Progression Bar */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono-num">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span>EXPERIENCE (XP)</span>
              <span className="text-cyan-400 font-semibold">{xpPercent}%</span>
            </span>
            <span className="text-slate-400">
              <strong className="text-cyan-300">{profile.currentXp}</strong> / {profile.requiredXp} XP
            </span>
          </div>

          <div className="w-full h-3 bg-slate-900/80 rounded-full border border-slate-700/60 overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-500 shadow-sm shadow-cyan-400"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        {/* Vital Gauges (HP, MP, Fatigue) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          <div className="p-3 rounded-xl bg-slate-900/70 border border-rose-500/20">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-rose-400 font-semibold">HP (HEALTH)</span>
              <span className="font-mono-num text-slate-300 text-xs">{profile.hp} / {profile.maxHp}</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(profile.hp / profile.maxHp) * 100}%` }} />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-cyan-500/20">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-cyan-400 font-semibold">MP (MANA)</span>
              <span className="font-mono-num text-slate-300 text-xs">{profile.mp} / {profile.maxMp}</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${(profile.mp / profile.maxMp) * 100}%` }} />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-amber-500/20">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-amber-400 font-semibold">FATIGUE</span>
              <span className="font-mono-num text-slate-300 text-xs">{profile.fatigue}%</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${profile.fatigue}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Attributes & Stat Point Allocation */}
      <div className="rounded-2xl bg-[#090e1a] border border-cyan-500/20 p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              PHYSICAL ATTRIBUTES
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Attributes scale your bodyweight power, conditioning resilience, and recovery speed.
            </p>
          </div>

          {/* Unallocated Stat Points Display */}
          <div className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Available Points:</span>
            <span className="font-mono-num font-bold text-sm text-cyan-200">{profile.stats.unallocatedPoints}</span>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {statList.map(({ key, label, desc }) => {
            const currentValue = profile.stats[key];
            const canAllocate = profile.stats.unallocatedPoints > 0;

            return (
              <div
                key={key}
                className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-cyan-500/30 transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-200">{label}</div>
                  <div className="text-xs text-slate-400 truncate">{desc}</div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-lg font-bold font-mono-num text-cyan-300 w-10 text-right">
                    {currentValue}
                  </span>

                  <button
                    onClick={() => {
                      if (canAllocate) {
                        sounds.playTick();
                        onAllocateStat(key);
                      }
                    }}
                    disabled={!canAllocate}
                    title={canAllocate ? `Add point to ${label}` : 'No unallocated points left (Level up to earn)'}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
                      canAllocate
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-sm shadow-cyan-500/40 cursor-pointer active:scale-95'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
