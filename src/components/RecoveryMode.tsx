import React from 'react';
import { Droplet, Heart, Shield, CheckCircle, Plus, Moon, Sparkles, Check } from 'lucide-react';
import { HunterProfile } from '../types/hunter';
import { sounds } from '../services/soundService';

interface RecoveryModeProps {
  profile: HunterProfile;
  onToggleRecoveryDay: (enabled: boolean) => void;
  onAddWater: (amountMl: number) => void;
}

export const RecoveryMode: React.FC<RecoveryModeProps> = ({
  profile,
  onToggleRecoveryDay,
  onAddWater,
}) => {
  const waterPercent = Math.min(100, Math.round((profile.waterIntakeMl / profile.targetWaterMl) * 100));

  const stretches = [
    { title: 'Cat-Cow Spinal Articulation', duration: '60 seconds', focus: 'Spine decompression & thoracic mobility' },
    { title: '90/90 Hip Rotator Stretch', duration: '90 seconds / side', focus: 'Hip capsules & lower back relief' },
    { title: 'Doorway Chest & Shoulder Opener', duration: '60 seconds', focus: 'Counteracts pushing strain & rounded posture' },
    { title: 'Deep Squat Mobility Hang', duration: '60 seconds', focus: 'Ankle dorsiflexion & hip opening' },
    { title: 'Hamstring & Posterior Chain Stretch', duration: '90 seconds', focus: 'Leg recovery and sciatic nerve gliding' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Recovery Banner */}
      <div className="rounded-2xl bg-gradient-to-b from-[#09152a] to-[#070b14] border border-cyan-500/30 p-6 shadow-xl shadow-cyan-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase">
              <Moon className="w-3.5 h-3.5" />
              <span>[ PROTOCOL: ACTIVE RECOVERY ]</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
              Biological Restoration Chamber
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Muscles rebuild during recovery. Preserve your daily streak without central nervous fatigue.
            </p>
          </div>

          {/* Recovery Toggle Switch */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-300">Recovery Mode:</span>
            <button
              onClick={() => {
                sounds.playTick();
                onToggleRecoveryDay(!profile.isRecoveryDay);
              }}
              className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                profile.isRecoveryDay ? 'bg-cyan-500' : 'bg-slate-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  profile.isRecoveryDay ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {profile.isRecoveryDay && (
          <div className="mt-4 p-3.5 rounded-xl bg-cyan-950/50 border border-cyan-400/40 flex items-center gap-3">
            <Shield className="w-5 h-5 text-cyan-300 shrink-0" />
            <div className="text-xs text-cyan-200">
              <strong className="font-semibold text-white">STREAK SHIELD ACTIVE:</strong> Today is registered as an Active Recovery Day. Your {profile.streakDays}-day streak is protected while your body regenerates.
            </div>
          </div>
        )}
      </div>

      {/* Hydration Chamber */}
      <div className="rounded-2xl bg-[#080d1a] border border-cyan-500/20 p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Droplet className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              HYDRATION RESERVOIR
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Electrolyte balance accelerates lactic flush and muscle protein synthesis.
            </p>
          </div>

          <div className="font-mono-num text-sm font-bold text-cyan-300">
            {profile.waterIntakeMl} / {profile.targetWaterMl} ml ({waterPercent}%)
          </div>
        </div>

        {/* Water Progress Bar */}
        <div className="mt-4">
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-300 shadow-sm shadow-cyan-400"
              style={{ width: `${waterPercent}%` }}
            />
          </div>
        </div>

        {/* Quick Log Water Buttons */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              sounds.playTick();
              onAddWater(250);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/40 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+250 ml (Cup)</span>
          </button>

          <button
            onClick={() => {
              sounds.playTick();
              onAddWater(500);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/40 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+500 ml (Bottle)</span>
          </button>

          <button
            onClick={() => {
              sounds.playTick();
              onAddWater(750);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/40 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+750 ml (Flask)</span>
          </button>
        </div>
      </div>

      {/* Recommended Mobility & Stretching Routines */}
      <div className="rounded-2xl bg-[#080d1a] border border-cyan-500/20 p-6 shadow-md">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 pb-4 border-b border-slate-800">
          <Heart className="w-4 h-4 text-rose-400" />
          ACTIVE RECOVERY STRETCHING ROUTINE
        </h2>

        <div className="mt-4 space-y-3">
          {stretches.map((stretch, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-cyan-500/30 transition-colors flex items-center justify-between gap-3"
            >
              <div>
                <div className="text-sm font-semibold text-slate-200">{stretch.title}</div>
                <div className="text-xs text-slate-400 mt-0.5">{stretch.focus}</div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-mono font-medium text-cyan-400 bg-cyan-950/60 px-2 py-1 rounded border border-cyan-500/30">
                  {stretch.duration}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
