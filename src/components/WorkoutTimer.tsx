import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, Volume2 } from 'lucide-react';
import { sounds } from '../services/soundService';

export const WorkoutTimer: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState<number>(60);
  const [totalSeconds, setTotalSeconds] = useState<number>(60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            sounds.playTimerFinished();
            return 0;
          }
          if (prev <= 4) {
            sounds.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, secondsLeft]);

  const setPreset = (sec: number) => {
    setIsRunning(false);
    setTotalSeconds(sec);
    setSecondsLeft(sec);
    sounds.playTick();
  };

  const toggleRun = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(totalSeconds);
    }
    setIsRunning(!isRunning);
    sounds.playTick();
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
    sounds.playTick();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Timer className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-semibold">
            REST &amp; INTERVAL TIMER
          </div>
          <div className="text-2xl font-mono-num font-bold text-white tracking-wider">
            {formatTime(secondsLeft)}
          </div>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
        {[30, 45, 60, 90].map((preset) => (
          <button
            key={preset}
            onClick={() => setPreset(preset)}
            className={`px-2.5 py-1 text-xs font-mono-num rounded transition-colors ${
              totalSeconds === preset
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {preset}s
          </button>
        ))}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleRun}
          className={`px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-sm shadow-cyan-500/30'
          }`}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isRunning ? 'Pause' : 'Start'}</span>
        </button>

        <button
          onClick={resetTimer}
          title="Reset timer"
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
