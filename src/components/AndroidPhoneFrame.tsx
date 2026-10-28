import React, { useState } from 'react';
import { Wifi, BatteryMedium, Signal, ChevronDown, Bell, Check, Trash2, Smartphone } from 'lucide-react';
import { SystemNotification } from '../types/hunter';
import { sounds } from '../services/soundService';

interface AndroidPhoneFrameProps {
  children: React.ReactNode;
  notifications: SystemNotification[];
  onClearNotifications: () => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

export const AndroidPhoneFrame: React.FC<AndroidPhoneFrameProps> = ({
  children,
  notifications,
  onClearNotifications,
  activeTab,
  setActiveTab,
}) => {
  const [shadeOpen, setShadeOpen] = useState(false);
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="relative mx-auto w-full max-w-[420px] h-[860px] bg-[#050811] rounded-[48px] p-3 shadow-2xl shadow-cyan-950/60 border-[5px] border-slate-700/80 ring-1 ring-cyan-500/30 flex flex-col overflow-hidden">
      {/* Device Inner Display Bezel */}
      <div className="relative w-full h-full bg-[#070b14] rounded-[38px] overflow-hidden flex flex-col border border-slate-800">
        {/* Android Status Bar */}
        <div
          onClick={() => {
            sounds.playTick();
            setShadeOpen(!shadeOpen);
          }}
          className="h-9 px-6 bg-black/60 backdrop-blur-sm flex items-center justify-between text-xs text-slate-300 select-none z-30 cursor-pointer hover:bg-black/80 transition-colors"
          title="Click to toggle Android notification shade"
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-semibold text-slate-200">{currentTime}</span>
            {notifications.length > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-cyan-400 bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-500/40 font-mono">
                <Bell className="w-2.5 h-2.5" />
                {notifications.length}
              </span>
            )}
          </div>

          {/* Camera Punch Hole */}
          <div className="w-4 h-4 rounded-full bg-black border border-slate-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-700" />
          </div>

          {/* Android Status Icons */}
          <div className="flex items-center gap-2 text-slate-400">
            <Signal className="w-3.5 h-3.5 text-slate-300" />
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-300">
              <BatteryMedium className="w-3.5 h-3.5" />
              <span>88%</span>
            </div>
          </div>
        </div>

        {/* Pull-down Notification Shade (Android Drawer) */}
        {shadeOpen && (
          <div className="absolute inset-x-0 top-9 bottom-0 z-40 bg-[#080d1a]/95 backdrop-blur-md p-4 flex flex-col space-y-4 animate-in slide-in-from-top-4 duration-200 border-b border-cyan-500/30 overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" />
                <span>ANDROID NOTIFICATION SHADE</span>
              </div>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.playTick();
                      onClearNotifications();
                    }}
                    className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
                <button
                  onClick={() => setShadeOpen(false)}
                  className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Quick Settings Tiles */}
            <div className="grid grid-cols-4 gap-2 text-[10px] text-center font-mono">
              <div className="p-2 rounded-xl bg-cyan-500 text-slate-950 font-bold">Wi-Fi: ON</div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">Bluetooth</div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">DND: OFF</div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">Torch</div>
            </div>

            {/* Notification Cards */}
            <div className="space-y-2 flex-1">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No notifications right now
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-left shadow-sm"
                  >
                    <div className="flex items-center justify-between text-[11px] text-cyan-400 font-mono mb-1">
                      <span className="font-bold flex items-center gap-1">
                        <Smartphone className="w-3 h-3" />
                        Hunter System · {n.timestamp}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white">{n.title}</div>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{n.body}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Phone Content Screen */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {children}
        </div>

        {/* In-App Mobile Bottom Tab Navigation */}
        <div className="h-14 bg-[#0a1020]/95 backdrop-blur-md border-t border-cyan-500/20 px-2 grid grid-cols-5 items-center z-20">
          <button
            onClick={() => {
              sounds.playTick();
              setActiveTab('quests');
            }}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'quests' ? 'text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-xs">⚔️</span>
            <span className="text-[10px] mt-0.5">Quests</span>
          </button>

          <button
            onClick={() => {
              sounds.playTick();
              setActiveTab('status');
            }}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'status' ? 'text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-xs">🛡️</span>
            <span className="text-[10px] mt-0.5">Status</span>
          </button>

          <button
            onClick={() => {
              sounds.playTick();
              setActiveTab('logs');
            }}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'logs' ? 'text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-xs">📜</span>
            <span className="text-[10px] mt-0.5">Logs</span>
          </button>

          <button
            onClick={() => {
              sounds.playTick();
              setActiveTab('recovery');
            }}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'recovery' ? 'text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-xs">🌙</span>
            <span className="text-[10px] mt-0.5">Rest</span>
          </button>

          <button
            onClick={() => {
              sounds.playTick();
              setActiveTab('milestones');
            }}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'milestones' ? 'text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-xs">⚡</span>
            <span className="text-[10px] mt-0.5">Streak</span>
          </button>
        </div>

        {/* Android Bottom Navigation Bar */}
        <div className="h-12 bg-black/80 backdrop-blur-md border-t border-slate-800 px-8 flex items-center justify-between text-slate-400 z-20">
          <button
            onClick={() => {
              sounds.playTick();
              setActiveTab('quests');
            }}
            className="p-2 hover:text-cyan-400 focus:outline-none"
            title="Back / Home"
          >
            <div className="w-3.5 h-3.5 border-l-2 border-b-2 border-current transform rotate-45" />
          </button>

          <button
            onClick={() => {
              sounds.playTick();
              setActiveTab('quests');
            }}
            className="p-2 hover:text-cyan-400 focus:outline-none"
            title="Home"
          >
            <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />
          </button>

          <button
            onClick={() => {
              sounds.playTick();
              setActiveTab('flutter');
            }}
            className="p-2 hover:text-cyan-400 focus:outline-none"
            title="Recent Apps / Flutter Code"
          >
            <div className="w-3.5 h-3.5 border-2 border-current rounded-xs" />
          </button>
        </div>
      </div>
    </div>
  );
};
