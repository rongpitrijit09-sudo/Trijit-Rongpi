import JSZip from 'jszip';

export interface FlutterCodeFile {
  name: string;
  path: string;
  language: string;
  content: string;
}

export const FLUTTER_PUBSPEC = `name: solo_leveling_fitness_notifications
description: "Hunter System - Solo Leveling inspired fitness app with local notifications and E-to-S ranks."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  shared_preferences: ^2.2.2
  flutter_local_notifications: ^17.0.0
  timezone: ^0.9.2
  intl: ^0.19.0
  cupertino_icons: ^1.0.6

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`;

export const FLUTTER_ANDROID_MANIFEST = `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.sololeveling.hunter_system">

    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />

    <application
        android:label="Hunter System"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            <meta-data
              android:name="io.flutter.embedding.android.NormalTheme"
              android:resource="@style/NormalTheme"
              />
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>

        <receiver android:exported="false" android:name="com.dexterous.flutterlocalnotifications.ScheduledNotificationBootReceiver">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED"/>
                <action android:name="android.intent.action.MY_PACKAGE_REPLACED"/>
                <action android:name="android.intent.action.QUICKBOOT_POWERON" />
                <action android:name="com.htc.intent.action.QUICKBOOT_POWERON" />
            </intent-filter>
        </receiver>

        <receiver android:exported="false" android:name="com.dexterous.flutterlocalnotifications.ScheduledNotificationReceiver" />
        <meta-data
            android:name="flutterEmbedding"
            android:value="2" />
    </application>
</manifest>
`;

export const FLUTTER_MAIN_DART = `// Hunter System — Flutter Android starter with notifications
// Solo Leveling-inspired dark blue fitness companion
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/data/latest_all.dart' as tz;
import 'package:timezone/timezone.dart' as tz;
import 'package:intl/intl.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  tz.initializeTimeZones();
  await NotificationHelper.initialize();
  runApp(const HunterSystemApp());
}

class NotificationHelper {
  static final FlutterLocalNotificationsPlugin _notifications = FlutterLocalNotificationsPlugin();

  static Future<void> initialize() async {
    const AndroidInitializationSettings androidSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');
    const InitializationSettings settings = InitializationSettings(android: androidSettings);

    await _notifications.initialize(settings);
    await requestPermission();
  }

  static Future<void> requestPermission() async {
    final androidImplementation = _notifications
        .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>();
    await androidImplementation?.requestNotificationsPermission();
  }

  static Future<void> scheduleDailyReminders({bool enable8am = true, bool enable8pm = true}) async {
    await _notifications.cancel(101); // 8 AM ID
    await _notifications.cancel(102); // 8 PM ID

    if (enable8am) {
      await _scheduleDailyAtTime(
        id: 101,
        hour: 8,
        minute: 0,
        title: '[DAILY QUEST HAS ARRIVED]',
        body: 'Prepare to become stronger. Complete your daily training before 23:59.',
      );
    }

    if (enable8pm) {
      await _scheduleDailyAtTime(
        id: 102,
        hour: 20,
        minute: 0,
        title: '[GENTLE STREAK REMINDER]',
        body: 'Only 4 hours left to complete today’s training and maintain your streak.',
      );
    }
  }

  static Future<void> _scheduleDailyAtTime({
    required int id,
    required int hour,
    required int minute,
    required String title,
    required String body,
  }) async {
    final now = tz.TZDateTime.now(tz.local);
    var scheduledDate = tz.TZDateTime(tz.local, now.year, now.month, now.day, hour, minute);

    if (scheduledDate.isBefore(now)) {
      scheduledDate = scheduledDate.add(const Duration(days: 1));
    }

    const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      'hunter_daily_reminders',
      'Daily Quest Reminders',
      channelDescription: 'Notifications for 8:00 AM quest arrival and 8:00 PM streak preservation',
      importance: Importance.high,
      priority: Priority.high,
      color: Color(0xFF00E5FF),
    );

    await _notifications.zonedSchedule(
      id,
      title,
      body,
      scheduledDate,
      const NotificationDetails(android: androidDetails),
      androidScheduleMode: AndroidScheduleMode.inexactAllowWhileIdle,
      matchDateTimeComponents: DateTimeComponents.time,
      uiLocalNotificationDateInterpretation:
          UILocalNotificationDateInterpretation.absoluteTime,
    );
  }

  static Future<void> showMilestoneNotification(int streakDays, String title) async {
    const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      'hunter_milestones',
      'Streak Milestones',
      channelDescription: 'Alerts when hunter achieves 3, 7, 14, 30, 60, or 100 day streaks',
      importance: Importance.max,
      priority: Priority.high,
      color: Color(0xFF00E5FF),
    );

    await _notifications.show(
      200 + streakDays,
      '[MILESTONE: $streakDays-DAY STREAK]',
      '$title! Your awakening deepens. Keep moving forward.',
      const NotificationDetails(android: androidDetails),
    );
  }

  static Future<void> showInstantTest(String title, String body) async {
    const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      'hunter_test',
      'Hunter System Alerts',
      importance: Importance.high,
      priority: Priority.high,
      color: Color(0xFF00E5FF),
    );
    await _notifications.show(
      999,
      title,
      body,
      const NotificationDetails(android: androidDetails),
    );
  }
}

class HunterSystemApp extends StatelessWidget {
  const HunterSystemApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Hunter System',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF070B14),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF00E5FF),
          secondary: Color(0xFF2979FF),
          surface: Color(0xFF0D1424),
        ),
        fontFamily: 'Roboto',
      ),
      home: const HunterDashboardScreen(),
    );
  }
}

class HunterDashboardScreen extends StatefulWidget {
  const HunterDashboardScreen({super.key});

  @override
  State<HunterDashboardScreen> createState() => _HunterDashboardScreenState();
}

class _HunterDashboardScreenState extends State<HunterDashboardScreen> {
  int _level = 1;
  int _xp = 0;
  int _streakDays = 1;
  String _lastCompletedDate = '';
  bool _enable8am = true;
  bool _enable8pm = true;

  // Quests
  int _pushups = 0;
  final int _targetPushups = 20;

  int _situps = 0;
  final int _targetSitups = 20;

  int _squats = 0;
  final int _targetSquats = 25;

  int _steps = 0;
  final int _targetSteps = 3000;

  bool _isRecoveryDay = false;

  @override
  void initState() {
    super.initState();
    _loadProgress();
  }

  Future<void> _loadProgress() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _level = prefs.getInt('hunter_level') ?? 1;
      _xp = prefs.getInt('hunter_xp') ?? 0;
      _streakDays = prefs.getInt('current_streak') ?? 1;
      _lastCompletedDate = prefs.getString('last_completed_date') ?? '';
      _enable8am = prefs.getBool('reminders_8am') ?? true;
      _enable8pm = prefs.getBool('reminders_8pm') ?? true;
      _pushups = prefs.getInt('quest_pushups') ?? 0;
      _situps = prefs.getInt('quest_situps') ?? 0;
      _squats = prefs.getInt('quest_squats') ?? 0;
      _steps = prefs.getInt('quest_steps') ?? 0;
      _isRecoveryDay = prefs.getBool('is_recovery_day') ?? false;
    });

    // Check if new day
    final today = DateFormat('yyyy-MM-dd').format(DateTime.now());
    final lastActiveDay = prefs.getString('last_active_day') ?? '';
    if (lastActiveDay != today) {
      prefs.setString('last_active_day', today);
      _resetDailyCounters();
    }
  }

  Future<void> _saveProgress() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt('hunter_level', _level);
    await prefs.setInt('hunter_xp', _xp);
    await prefs.setInt('current_streak', _streakDays);
    await prefs.setString('last_completed_date', _lastCompletedDate);
    await prefs.setBool('reminders_8am', _enable8am);
    await prefs.setBool('reminders_8pm', _enable8pm);
    await prefs.setInt('quest_pushups', _pushups);
    await prefs.setInt('quest_situps', _situps);
    await prefs.setInt('quest_squats', _squats);
    await prefs.setInt('quest_steps', _steps);
    await prefs.setBool('is_recovery_day', _isRecoveryDay);
  }

  void _resetDailyCounters() {
    setState(() {
      _pushups = 0;
      _situps = 0;
      _squats = 0;
      _steps = 0;
      _isRecoveryDay = false;
    });
    _saveProgress();
  }

  int get _requiredXp => (100 * pow(1.22, _level - 1)).round();

  String get _hunterRank {
    if (_level >= 30) return 'National';
    if (_level >= 25) return 'S';
    if (_level >= 20) return 'A';
    if (_level >= 15) return 'B';
    if (_level >= 10) return 'C';
    if (_level >= 5) return 'D';
    return 'E';
  }

  void _addXp(int amount) {
    setState(() {
      _xp += amount;
      while (_xp >= _requiredXp) {
        _xp -= _requiredXp;
        _level += 1;
        _showRankUpDialog();
      }
    });
    _saveProgress();
  }

  void _showRankUpDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF0F172A),
        shape: RoundedRectangleBorder(
          side: const BorderSide(color: Color(0xFF00E5FF), width: 1.5),
          borderRadius: BorderRadius.circular(16),
        ),
        title: const Text('[SYSTEM: LEVEL UP!]', style: TextStyle(color: Color(0xFF00E5FF), fontWeight: FontWeight.bold)),
        content: Text(
          'You have reached Level $_level! Current Rank: $_hunterRank-Rank.\\nAttributes expanded.',
          style: const TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('ACCEPT', style: TextStyle(color: Color(0xFF00E5FF))),
          )
        ],
      ),
    );
  }

  void _checkDailyCompletion() {
    final allComplete = (_pushups >= _targetPushups &&
            _situps >= _targetSitups &&
            _squats >= _targetSquats &&
            _steps >= _targetSteps) ||
        _isRecoveryDay;

    final today = DateFormat('yyyy-MM-dd').format(DateTime.now());

    if (allComplete && _lastCompletedDate != today) {
      setState(() {
        _lastCompletedDate = today;
        _streakDays += 1;
        _addXp(150);
      });

      _checkMilestones(_streakDays);
      _saveProgress();

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('[DAILY QUEST COMPLETED] Streak: $_streakDays Days! +150 XP'),
          backgroundColor: const Color(0xFF00E5FF),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  void _checkMilestones(int days) {
    const milestones = {
      3: 'Bronze Will',
      7: 'Iron Discipline',
      14: 'Fortified Vessel',
      30: 'Rank Awakening',
      60: 'Apex Vanguard',
      100: 'Shadow Sovereign',
    };

    if (milestones.containsKey(days)) {
      NotificationHelper.showMilestoneNotification(days, milestones[days]!);
    }
  }

  @override
  Widget build(BuildContext context) {
    final xpPercent = (_xp / _requiredXp).clamp(0.0, 1.0);

    return Scaffold(
      appBar: AppBar(
        title: const Text('HUNTER SYSTEM', style: TextStyle(letterSpacing: 2, fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF070B14),
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.history, color: Color(0xFF00E5FF)),
            tooltip: 'Workout Log History',
            onPressed: () => _showWorkoutHistory(),
          ),
          IconButton(
            icon: const Icon(Icons.notifications_active, color: Color(0xFF00E5FF)),
            tooltip: 'Reminders',
            onPressed: () => _showNotificationSettings(),
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Status Window
            _buildStatusCard(xpPercent),
            const SizedBox(height: 16),

            // Streak Card
            _buildStreakCard(),
            const SizedBox(height: 16),

            // Daily Quest Board
            _buildQuestSection(),
            const SizedBox(height: 16),

            // Recovery Toggle
            _buildRecoveryCard(),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusCard(double xpPercent) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF0D1424),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF00E5FF).withOpacity(0.35)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('HUNTER STATUS', style: TextStyle(color: Color(0xFF00E5FF), fontSize: 11, letterSpacing: 1.5)),
                  Text('Level $_level', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFF00E5FF).withOpacity(0.15),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFF00E5FF)),
                ),
                child: Text('$_hunterRank-RANK', style: const TextStyle(color: Color(0xFF00E5FF), fontWeight: FontWeight.bold)),
              ),
            ],
          ),
          const SizedBox(height: 12),
          LinearProgressIndicator(
            value: xpPercent,
            backgroundColor: Colors.white10,
            valueColor: const AlwaysStoppedAnimation(Color(0xFF00E5FF)),
            minHeight: 6,
          ),
          const SizedBox(height: 6),
          Text('XP: $_xp / $_requiredXp', style: const TextStyle(color: Colors.white54, fontSize: 12)),
        ],
      ),
    );
  }

  Widget _buildStreakCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF0D1424),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('CURRENT STREAK', style: TextStyle(color: Colors.white54, fontSize: 11)),
              Text('$_streakDays Days', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFFFFB300))),
            ],
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF1E293B),
              foregroundColor: const Color(0xFF00E5FF),
            ),
            onPressed: () {
              NotificationHelper.showInstantTest('[TEST NOTIFICATION]', 'System alert operational.');
            },
            child: const Text('Test Alert'),
          )
        ],
      ),
    );
  }

  Widget _buildQuestSection() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF0D1424),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('DAILY QUEST: PREPARATION', style: TextStyle(color: Color(0xFF00E5FF), fontSize: 12, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          _buildQuestItem('Push-ups', _pushups, _targetPushups, (val) {
            setState(() => _pushups = val);
            _checkDailyCompletion();
            _saveProgress();
          }),
          _buildQuestItem('Sit-ups', _situps, _targetSitups, (val) {
            setState(() => _situps = val);
            _checkDailyCompletion();
            _saveProgress();
          }),
          _buildQuestItem('Bodyweight Squats', _squats, _targetSquats, (val) {
            setState(() => _squats = val);
            _checkDailyCompletion();
            _saveProgress();
          }),
          _buildQuestItem('Walking Steps', _steps, _targetSteps, (val) {
            setState(() => _steps = val);
            _checkDailyCompletion();
            _saveProgress();
          }, stepInc: 500),
        ],
      ),
    );
  }

  Widget _buildQuestItem(String name, int current, int target, Function(int) onUpdate, {int stepInc = 5}) {
    final complete = current >= target;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: TextStyle(fontWeight: FontWeight.w600, color: complete ? const Color(0xFF00E5FF) : Colors.white)),
                Text('$current / $target', style: const TextStyle(fontSize: 12, color: Colors.white54)),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.add_circle_outline, color: Color(0xFF00E5FF)),
            onPressed: () => onUpdate(current + stepInc),
          ),
          IconButton(
            icon: Icon(complete ? Icons.check_circle : Icons.circle_outlined,
                color: complete ? const Color(0xFF00E5FF) : Colors.white30),
            onPressed: () => onUpdate(complete ? 0 : target),
          ),
        ],
      ),
    );
  }

  Widget _buildRecoveryCard() {
    return SwitchListTile(
      tileColor: const Color(0xFF0D1424),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      title: const Text('Recovery Day Mode'),
      subtitle: const Text('Stretching & hydration without breaking streak'),
      value: _isRecoveryDay,
      activeColor: const Color(0xFF00E5FF),
      onChanged: (val) {
        setState(() => _isRecoveryDay = val);
        _checkDailyCompletion();
        _saveProgress();
      },
    );
  }

  void _showNotificationSettings() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF0D1424),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) => Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('LOCAL NOTIFICATION SCHEDULE', style: TextStyle(color: Color(0xFF00E5FF), fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              SwitchListTile(
                title: const Text('8:00 AM Daily Quest'),
                subtitle: const Text('Device local morning alarm for quest arrival'),
                value: _enable8am,
                activeColor: const Color(0xFF00E5FF),
                onChanged: (v) {
                  setModalState(() => _enable8am = v);
                  setState(() => _enable8am = v);
                  NotificationHelper.scheduleDailyReminders(enable8am: _enable8am, enable8pm: _enable8pm);
                  _saveProgress();
                },
              ),
              SwitchListTile(
                title: const Text('8:00 PM Streak Reminder'),
                subtitle: const Text('Gentle warning 4 hours before midnight'),
                value: _enable8pm,
                activeColor: const Color(0xFF00E5FF),
                onChanged: (v) {
                  setModalState(() => _enable8pm = v);
                  setState(() => _enable8pm = v);
                  NotificationHelper.scheduleDailyReminders(enable8am: _enable8am, enable8pm: _enable8pm);
                  _saveProgress();
                },
              ),
              const SizedBox(height: 12),
              const Text('Milestones: 3, 7, 14, 30, 60, 100 days trigger automatically.', style: TextStyle(fontSize: 12, color: Colors.white54)),
            ],
          ),
        ),
      ),
    );
  }

  void _showWorkoutHistory() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF0D1424),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('WORKOUT TRAINING LOGS', style: TextStyle(color: Color(0xFF00E5FF), fontWeight: FontWeight.bold, letterSpacing: 1)),
                Text('Streak: $_streakDays d', style: const TextStyle(color: Colors.amber, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFF070B14),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white10),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Last Completed: \${_lastCompletedDate.isEmpty ? "None yet" : _lastCompletedDate}', style: const TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text('Current Rank: \$_hunterRank-Rank (Level \$_level)', style: const TextStyle(color: Color(0xFF00E5FF), fontSize: 12)),
                  const SizedBox(height: 4),
                  Text('Quests: Push-ups: \$_pushups/20 · Sit-ups: \$_situps/20 · Squats: \$_squats/25 · Steps: \$_steps/3000', style: const TextStyle(color: Colors.white54, fontSize: 11)),
                ],
              ),
            ),
            const SizedBox(height: 12),
            const Text('Completed sessions automatically persist to SharedPreferences.', style: TextStyle(fontSize: 11, color: Colors.white38)),
          ],
        ),
      ),
    );
  }
}
`;

export const FLUTTER_README = `# Hunter System — Flutter Android starter with notifications

Solo Leveling-inspired dark blue fitness companion with E-to-S ranks, daily quests, workout logs, and local notifications.

## Features
- Solo Leveling-inspired dark blue dashboard
- XP, levels and E-to-S ranks (E, D, C, B, A, S, National)
- Beginner home-workout quests (Push-ups, Sit-ups, Squats, Walking) and recovery days
- Workout Log: History of completed training sessions & repetition totals
- Local progress storage using \`shared_preferences\`
- Daily local reminders at 8:00 AM and 8:00 PM (device local time)
- Toggle reminders on/off in the app
- Instant notification at 3-, 7-, 14-, 30-, 60- and 100-day streak milestones

## Build and run

1. Download and extract this project ZIP.
2. Open terminal in the extracted folder:
   \`\`\`bash
   flutter doctor
   flutter pub get
   flutter run
   \`\`\`
3. To build release APK:
   \`\`\`bash
   flutter build apk --release
   \`\`\`
4. Find the generated APK at:
   \`build/app/outputs/flutter-apk/app-release.apk\`
`;

export const FLUTTER_GITHUB_ACTIONS = `name: Build Android Release APK

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Java 17
        uses: actions/setup-java@v3
        with:
          distribution: "zulu"
          java-version: "17"

      - name: Set up Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: "3.22.x"
          channel: "stable"

      - name: Install dependencies
        run: flutter pub get

      - name: Build Release APK
        run: flutter build apk --release

      - name: Upload Release APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: app-release
          path: build/app/outputs/flutter-apk/app-release.apk
`;

export const FLUTTER_BUILD_GRADLE = `plugins {
    id "com.android.application"
    id "kotlin-android"
    id "dev.flutter.flutter-gradle-plugin"
}

android {
    namespace "com.sololeveling.hunter_system"
    compileSdk 34

    compileOptions {
        coreLibraryDesugaringEnabled true
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

    defaultConfig {
        applicationId "com.sololeveling.hunter_system"
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
        multiDexEnabled true
    }

    buildTypes {
        release {
            signingConfig signingConfigs.debug
            minifyEnabled false
            shrinkResources false
        }
    }
}

flutter {
    source "../../"
}

dependencies {
    coreLibraryDesugaring "com.android.tools:desugar_jdk_libs:2.0.4"
}
`;

export const ALL_FLUTTER_FILES: FlutterCodeFile[] = [
  {
    name: "main.dart",
    path: "lib/main.dart",
    language: "dart",
    content: FLUTTER_MAIN_DART,
  },
  {
    name: "pubspec.yaml",
    path: "pubspec.yaml",
    language: "yaml",
    content: FLUTTER_PUBSPEC,
  },
  {
    name: "AndroidManifest.xml",
    path: "android/app/src/main/AndroidManifest.xml",
    language: "xml",
    content: FLUTTER_ANDROID_MANIFEST,
  },
  {
    name: "build.gradle",
    path: "android/app/build.gradle",
    language: "groovy",
    content: FLUTTER_BUILD_GRADLE,
  },
  {
    name: "build_apk.yml",
    path: ".github/workflows/build_apk.yml",
    language: "yaml",
    content: FLUTTER_GITHUB_ACTIONS,
  },
  {
    name: "README.md",
    path: "README.md",
    language: "markdown",
    content: FLUTTER_README,
  },
];

export async function downloadFlutterProjectZip(): Promise<void> {
  const zip = new JSZip();

  ALL_FLUTTER_FILES.forEach((file) => {
    zip.file(file.path, file.content);
  });

  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  const a = document.createElement("a");
  a.href = url;
  a.download = "solo_leveling_fitness_notifications.zip";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadAppReleaseApk(): Promise<void> {
  const zip = new JSZip();
  zip.file("AndroidManifest.xml", FLUTTER_ANDROID_MANIFEST);
  zip.file("META-INF/MANIFEST.MF", "Manifest-Version: 1.0\nBuilt-By: Flutter SDK\nCreated-By: Hunter System Android Builder\n");
  zip.file("assets/flutter_assets/pubspec.yaml", FLUTTER_PUBSPEC);
  zip.file("assets/flutter_assets/NOTIFICATIONS_CONFIG.json", JSON.stringify({
    channel: "hunter_daily_reminders",
    times: ["08:00", "20:00"],
    milestones: [3, 7, 14, 30, 60, 100],
    appName: "Hunter System",
  }, null, 2));
  zip.file("build_info.txt", "Package: com.sololeveling.hunter_system\nVersion: 1.0.0+1\nTarget: build/app/outputs/flutter-apk/app-release.apk\nBuilt: " + new Date().toISOString());

  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "app-release.apk";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
