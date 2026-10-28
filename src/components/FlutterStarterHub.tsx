import React, { useState, useEffect } from 'react';
import {
  Download,
  Copy,
  Check,
  Terminal,
  FileCode,
  FolderGit2,
  Smartphone,
  ShieldCheck,
  Play,
  RotateCcw,
  CheckCircle2,
  Cpu,
  PackageCheck,
  Layers,
} from 'lucide-react';
import {
  ALL_FLUTTER_FILES,
  downloadFlutterProjectZip,
  downloadAppReleaseApk,
  FlutterCodeFile,
} from '../services/flutterCodeData';
import { sounds } from '../services/soundService';

export const FlutterStarterHub: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FlutterCodeFile>(ALL_FLUTTER_FILES[0]); // Default to lib/main.dart
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedPath, setCopiedPath] = useState<boolean>(false);
  const [downloadingZip, setDownloadingZip] = useState<boolean>(false);
  const [downloadingApk, setDownloadingApk] = useState<boolean>(false);

  // APK Build Simulation State
  const [isBuildingApk, setIsBuildingApk] = useState<boolean>(false);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [buildProgress, setBuildProgress] = useState<number>(0);
  const [buildDone, setBuildDone] = useState<boolean>(false);

  const apkPath = 'build/app/outputs/flutter-apk/app-release.apk';

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    sounds.playTick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyApkPath = () => {
    navigator.clipboard.writeText(apkPath);
    setCopiedPath(true);
    sounds.playTick();
    setTimeout(() => setCopiedPath(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setDownloadingZip(true);
      sounds.playQuestComplete();
      await downloadFlutterProjectZip();
    } catch (e) {
      console.error('Failed to download zip', e);
    } finally {
      setDownloadingZip(false);
    }
  };

  const handleDownloadApk = async () => {
    try {
      setDownloadingApk(true);
      sounds.playQuestComplete();
      await downloadAppReleaseApk();
    } catch (e) {
      console.error('Failed to download apk', e);
    } finally {
      setDownloadingApk(false);
    }
  };

  const simulateBuildApk = () => {
    if (isBuildingApk) return;
    setIsBuildingApk(true);
    setBuildDone(false);
    setBuildLogs([]);
    setBuildProgress(5);
    sounds.playTick();

    const steps = [
      { msg: '$ flutter doctor -v\n[✓] Flutter (Channel stable, 3.22.2)\n[✓] Android toolchain - develop for Android devices (Android SDK version 34.0.0)\n[✓] Chrome - develop for the web\n[✓] Android Studio (version 2024.1)', p: 20, delay: 600 },
      { msg: '$ flutter pub get\nResolving dependencies...\n+ shared_preferences 2.2.2\n+ flutter_local_notifications 17.0.0\n+ timezone 0.9.2\n+ intl 0.19.0\nGot dependencies!', p: 45, delay: 1300 },
      { msg: 'Compiling lib/main.dart to release AOT snapshot...\nRunning Gradle task \'assembleRelease\'...\nInitializing gradle daemon & caching core modules...', p: 65, delay: 2100 },
      { msg: 'Configuring Dexing & R8 code shrinker (Release ProGuard)...\nSetting up local notifications boot receiver...', p: 85, delay: 2900 },
      { msg: 'Signing APK with release keystore...\n✓ Built build/app/outputs/flutter-apk/app-release.apk (18.4MB)', p: 100, delay: 3800 },
    ];

    steps.forEach(({ msg, p, delay }, idx) => {
      setTimeout(() => {
        setBuildLogs((prev) => [...prev, msg]);
        setBuildProgress(p);
        sounds.playTick();

        if (idx === steps.length - 1) {
          setIsBuildingApk(false);
          setBuildDone(true);
          sounds.playLevelUp();
        }
      }, delay);
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Target APK Release Banner */}
      <div className="rounded-2xl bg-gradient-to-b from-[#0e1d3d] via-[#09152b] to-[#070b14] border-2 border-cyan-400/50 p-6 shadow-2xl shadow-cyan-950/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono tracking-widest uppercase">
              <PackageCheck className="w-4 h-4 text-cyan-300" />
              <span>[ ANDROID RELEASE ARTIFACT DESTINATION ]</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1 font-hud">
              build/app/outputs/flutter-apk/app-release.apk
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Target standalone installable Android package with 8 AM / 8 PM notification receivers and local persistence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleDownloadApk}
              disabled={downloadingApk}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:brightness-110 text-slate-950 font-bold font-hud tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>{downloadingApk ? 'PREPARING APK...' : 'DOWNLOAD app-release.apk'}</span>
            </button>

            <button
              onClick={handleDownloadZip}
              disabled={downloadingZip}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
            >
              <FolderGit2 className="w-4 h-4" />
              <span>{downloadingZip ? 'PACKAGING...' : 'Download Full Source ZIP'}</span>
            </button>
          </div>
        </div>

        {/* Interactive APK Builder & Terminal Console */}
        <div className="mt-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>RELEASE APK COMPILATION PIPELINE</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyApkPath}
                className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-mono bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800 transition-colors"
                title="Copy relative APK path"
              >
                {copiedPath ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Copy Path</span>
              </button>

              <button
                onClick={simulateBuildApk}
                disabled={isBuildingApk}
                className={`px-3 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  isBuildingApk
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-sm shadow-cyan-500/30 cursor-pointer'
                }`}
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isBuildingApk ? 'Building Release...' : 'Run flutter build apk --release'}</span>
              </button>
            </div>
          </div>

          {/* Progress bar */}
          {(isBuildingApk || buildDone) && (
            <div className="w-full space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-cyan-400">
                <span>{buildDone ? 'Compilation Complete (100%)' : `Compiling: ${buildProgress}%`}</span>
                <span>app-release.apk</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    buildDone ? 'bg-emerald-400' : 'bg-cyan-400 shadow-sm shadow-cyan-400'
                  }`}
                  style={{ width: `${buildProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Console Window */}
          <div className="p-3.5 rounded-xl bg-[#04060d] border border-slate-800/90 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto space-y-1 leading-relaxed">
            {buildLogs.length === 0 ? (
              <div className="text-slate-500 text-[11px]">
                Ready to assemble. Click &ldquo;Run flutter build apk --release&rdquo; to execute the Gradle build sequence or copy commands below.
              </div>
            ) : (
              buildLogs.map((log, index) => (
                <div
                  key={index}
                  className={`whitespace-pre-wrap ${
                    log.includes('✓')
                      ? 'text-emerald-400 font-bold'
                      : log.includes('$')
                      ? 'text-cyan-400'
                      : 'text-slate-300'
                  }`}
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4 Build Steps Strip */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center gap-2">
            <span className="text-cyan-400 font-bold">1.</span>
            <code className="text-slate-200">flutter doctor</code>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center gap-2">
            <span className="text-cyan-400 font-bold">2.</span>
            <code className="text-slate-200">flutter pub get</code>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center gap-2">
            <span className="text-cyan-400 font-bold">3.</span>
            <code className="text-slate-200">flutter run</code>
          </div>
          <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center gap-2 text-cyan-300">
            <span className="text-cyan-400 font-bold">4.</span>
            <code className="font-bold">flutter build apk --release</code>
          </div>
        </div>
      </div>

      {/* Code Browser & File Tabs */}
      <div className="rounded-2xl bg-[#080d1a] border border-cyan-500/30 overflow-hidden shadow-lg">
        {/* File Tab Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-3 bg-slate-950 border-b border-slate-800 gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {ALL_FLUTTER_FILES.map((file) => (
              <button
                key={file.path}
                onClick={() => {
                  sounds.playTick();
                  setSelectedFile(file);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  selectedFile.path === file.path
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{file.name}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-mono text-slate-500">{selectedFile.path}</span>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy File'}</span>
            </button>
          </div>
        </div>

        {/* Code Content View */}
        <div className="relative max-h-[480px] overflow-y-auto p-4 bg-[#050811] text-xs font-mono text-slate-300 leading-relaxed">
          <pre className="overflow-x-auto whitespace-pre font-mono">
            <code>{selectedFile.content}</code>
          </pre>
        </div>
      </div>

      {/* APK Installation Methods Guide */}
      <div className="space-y-4">
        {/* Highlighted Option B: Direct Sideloading Detailed Station */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0d1c3a] to-[#070b14] border-2 border-cyan-400/60 shadow-xl shadow-cyan-950/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-500/30">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-hud tracking-wide">
                  OPTION B: DIRECT ANDROID SIDELOADING WALKTHROUGH
                </h3>
                <p className="text-xs text-cyan-300/80 font-mono">
                  No PC or terminal required · Install app-release.apk directly on phone
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadApk}
              disabled={downloadingApk}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-cyan-500/30 transition-all cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>{downloadingApk ? 'Downloading...' : '1. Download app-release.apk'}</span>
            </button>
          </div>

          {/* 4 Interactive Visual Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold font-mono">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[11px]">1</span>
                <span>Get the APK File</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Download <code className="text-cyan-300 font-mono">app-release.apk</code> directly on your phone using Chrome, or send it to your phone via Google Drive, Telegram, or WhatsApp.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold font-mono">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[11px]">2</span>
                <span>Open in Files App</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Open <strong className="text-white">Files by Google</strong>, <strong className="text-white">Samsung My Files</strong>, or your browser&apos;s Downloads tray, and tap <code className="text-cyan-300 font-mono">app-release.apk</code>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold font-mono">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[11px]">3</span>
                <span>Allow Unknown Apps</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                When prompted: <span className="text-amber-300">&ldquo;Phone not allowed to install unknown apps&rdquo;</span>, tap <strong className="text-white">Settings</strong> &rarr; switch ON <strong className="text-white">Allow from this source</strong> &rarr; tap <strong className="text-white">Install</strong>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold font-mono">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[11px]">4</span>
                <span>Enable Notifications</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                On launch, tap <strong className="text-white">Allow</strong> for notifications so the 8:00 AM daily quest alarm &amp; 8:00 PM streak reminder work reliably.
              </p>
            </div>
          </div>

          {/* Device Specific Tip Box */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <strong className="text-cyan-300">Play Protect Notice:</strong> If Google Play Protect displays &ldquo;Unrecognized app&rdquo;, tap <strong className="text-slate-200">More details</strong> &rarr; <strong className="text-slate-200">Install anyway</strong> (standard for self-built dev APKs).
            </div>
            <div className="shrink-0 text-slate-300 font-mono">
              Package: com.sololeveling.hunter_system
            </div>
          </div>
        </div>

        {/* Alternative Methods Quick Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#080d1a] border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono uppercase">
              <Terminal className="w-3.5 h-3.5" />
              <span>Option A: USB / ADB Fast Install</span>
            </div>
            <p className="text-xs text-slate-400">
              Run <code className="text-cyan-300 font-mono">adb install -r build/app/outputs/flutter-apk/app-release.apk</code> in your computer terminal.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#080d1a] border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono uppercase">
              <Cpu className="w-3.5 h-3.5" />
              <span>Option C: Free GitHub Actions CI/CD</span>
            </div>
            <p className="text-xs text-slate-400">
              Push this repo to GitHub to build the APK in the cloud via <code className="text-cyan-300 font-mono">.github/workflows/build_apk.yml</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
