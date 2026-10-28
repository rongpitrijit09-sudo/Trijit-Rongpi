import React from 'react';
import { Bell, Clock, ShieldCheck, CheckCircle2, Trash2, X, Send, Sparkles, Smartphone } from 'lucide-react';
import { HunterProfile, SystemNotification } from '../types/hunter';
import { NotificationService } from '../services/notificationService';
import { sounds } from '../services/soundService';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  profile: HunterProfile;
  onToggleSchedule: (key: 'enabled8am' | 'enabled8pm' | 'milestonesEnabled', val: boolean) => void;
  onClearNotifications: () => void;
  onTest8am: () => void;
  onTest8pm: () => void;
  onRequestBrowserPermission: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  profile,
  onToggleSchedule,
  onClearNotifications,
  onTest8am,
  onTest8pm,
  onRequestBrowserPermission,
}) => {
  if (!isOpen) return null;

  const permission = typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-[#090e1a] border border-cyan-500/40 shadow-2xl shadow-cyan-950/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-cyan-500/20 bg-[#0d1629]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide font-hud">
                SYSTEM NOTIFICATION HUB
              </h2>
              <p className="text-[11px] text-cyan-400/80 font-mono">
                LOCAL NOTIFICATIONS &amp; ANDROID SHIELD
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 space-y-5 flex-1 text-slate-200 text-sm">
          {/* Native Browser Notification Permission Banner */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Web Push &amp; Native Device Notifications</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Status:{' '}
                <span className={permission === 'granted' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {permission.toUpperCase()}
                </span>
              </p>
            </div>

            {permission !== 'granted' && (
              <button
                onClick={onRequestBrowserPermission}
                className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Enable Notifications
              </button>
            )}
          </div>

          {/* Schedule Toggles */}
          <div className="space-y-2.5">
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              [ SCHEDULED ALARMS ]
            </div>

            {/* 8:00 AM Toggle */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white text-xs">8:00 AM — Morning Quest Arrival</div>
                  <div className="text-[11px] text-slate-400">Daily quest dispatch &amp; penalty zone countdown.</div>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.playTick();
                  onToggleSchedule('enabled8am', !profile.settings.enabled8am);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  profile.settings.enabled8am ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    profile.settings.enabled8am ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 8:00 PM Toggle */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white text-xs">8:00 PM — Evening Streak Warning</div>
                  <div className="text-[11px] text-slate-400">Gentle reminder 4 hours before midnight day boundary.</div>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.playTick();
                  onToggleSchedule('enabled8pm', !profile.settings.enabled8pm);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  profile.settings.enabled8pm ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    profile.settings.enabled8pm ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Streak Milestone Toggle */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <div className="font-semibold text-white text-xs">Streak Milestones (3, 7, 14, 30, 60, 100 Days)</div>
                  <div className="text-[11px] text-slate-400">Instant alerts when reaching legendary training streaks.</div>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.playTick();
                  onToggleSchedule('milestonesEnabled', !profile.settings.milestonesEnabled);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  profile.settings.milestonesEnabled ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    profile.settings.milestonesEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Instant Test Buttons */}
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/20 space-y-2">
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              [ INSTANT SIMULATION / TEST DISPATCH ]
            </div>
            <p className="text-[11px] text-slate-400">
              Fire test alerts immediately to verify audio chime and Android notification appearance:
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={onTest8am}
                className="px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simulate 8:00 AM Quest</span>
              </button>

              <button
                onClick={onTest8pm}
                className="px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-amber-400 text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simulate 8:00 PM Streak</span>
              </button>
            </div>
          </div>

          {/* In-App Notification Drawer Log */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                [ DISPATCH LOG ({profile.notifications.length}) ]
              </div>

              {profile.notifications.length > 0 && (
                <button
                  onClick={() => {
                    sounds.playTick();
                    onClearNotifications();
                  }}
                  className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {profile.notifications.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                No active notifications in system memory.
              </div>
            ) : (
              <div className="space-y-2">
                {profile.notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                      <Smartphone className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white truncate">{n.title}</span>
                        <span className="text-[10px] font-mono text-slate-400 ml-2">{n.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
