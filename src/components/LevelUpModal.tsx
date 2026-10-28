import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Sparkles, ChevronRight, Zap } from 'lucide-react';
import { HunterRank } from '../types/hunter';
import { sounds } from '../services/soundService';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  newRank: HunterRank;
  pointsAwarded: number;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  onClose,
  newLevel,
  newRank,
  pointsAwarded,
}) => {
  useEffect(() => {
    if (isOpen) {
      sounds.playLevelUp();
      // Confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00E5FF', '#2979FF', '#FFB300', '#FFFFFF'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#090e1a] border-2 border-cyan-400 p-6 shadow-2xl shadow-cyan-500/50 text-center space-y-5 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400 mx-auto flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/40">
          <Zap className="w-8 h-8 animate-pulse text-cyan-300" />
        </div>

        <div>
          <div className="text-xs font-mono tracking-widest text-cyan-400 font-bold uppercase mb-1">
            [ SYSTEM NOTIFICATION: LEVEL UP! ]
          </div>
          <h2 className="text-3xl font-extrabold text-white font-hud tracking-wide">
            LEVEL {newLevel} REACHED
          </h2>
          <div className="inline-block mt-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-400 text-cyan-300 font-hud font-bold text-sm tracking-wider">
            CURRENT RANK: {newRank}-RANK
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1.5 text-left">
          <div className="flex items-center justify-between text-slate-200 font-semibold">
            <span>Attributes Expanded</span>
            <span className="text-cyan-400 font-mono">+{pointsAwarded} Stat Points</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Your physical vessel has strengthened. Allocate your points in the Status Window to increase your Strength, Agility, and Stamina.
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playTick();
            onClose();
          }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-hud font-bold text-sm tracking-widest uppercase shadow-lg shadow-cyan-500/30 transition-all cursor-pointer active:scale-98"
        >
          ACCEPT SYSTEM UPGRADE
        </button>
      </div>
    </div>
  );
};
