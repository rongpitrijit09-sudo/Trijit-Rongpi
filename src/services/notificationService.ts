import { SystemNotification } from '../types/hunter';
import { sounds } from './soundService';

export const NotificationService = {
  /**
   * Check if browser notifications are supported
   */
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  },

  /**
   * Request native browser permission
   */
  async requestPermission(): Promise<NotificationPermission | 'unsupported'> {
    if (!this.isSupported()) return 'unsupported';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (e) {
      console.warn('Error requesting notification permission:', e);
      return 'denied';
    }
  },

  /**
   * Dispatch a notification (both native web notification if allowed, and in-app system log)
   */
  notify(
    title: string,
    body: string,
    type: SystemNotification['type'] = 'quest'
  ): SystemNotification {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const notificationItem: SystemNotification = {
      id,
      title,
      body,
      timestamp: timeStr,
      type,
      read: false,
    };

    // Play system ping
    sounds.playSystemPing();

    // Trigger native browser notification if granted
    if (this.isSupported() && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: id,
        });
      } catch (err) {
        console.warn('Failed to dispatch native browser notification:', err);
      }
    }

    return notificationItem;
  },

  /**
   * 8:00 AM Daily Quest Notification
   */
  trigger8amDailyQuest(): SystemNotification {
    return this.notify(
      '[DAILY QUEST: GETTING READY TO BECOME STRONG]',
      'A new daily quest has arrived: Push-ups, Sit-ups, Squats, and 3km Walk. Complete before 23:59:59 to avoid the Penalty Zone.',
      'quest'
    );
  },

  /**
   * 8:00 PM Evening Streak Reminder
   */
  trigger8pmStreakReminder(): SystemNotification {
    return this.notify(
      '[GENTLE STREAK REMINDER: 4 HOURS REMAINING]',
      'Hunter, your daily training is incomplete! Complete at least 1 quest before midnight to keep your streak alive.',
      'streak'
    );
  },

  /**
   * Instant streak milestone notifications at 3, 7, 14, 30, 60, 100 days
   */
  triggerStreakMilestone(days: number): SystemNotification | null {
    const milestonesContent: Record<number, { title: string; body: string }> = {
      3: {
        title: '[MILESTONE: 3-DAY STREAK ACHIEVED]',
        body: 'Bronze Will awakened! You completed 3 consecutive days. +100 XP awarded.',
      },
      7: {
        title: '[MILESTONE: 7-DAY STREAK COMPLETE]',
        body: 'Iron Discipline unlocked! 1 full week unbroken. Physical attributes rising. +250 XP awarded.',
      },
      14: {
        title: '[MILESTONE: 14-DAY STREAK FORGED]',
        body: 'Fortified Vessel! 2 weeks of disciplined conditioning. Muscle density elevated. +500 XP awarded.',
      },
      30: {
        title: '[MILESTONE: 30-DAY RANK BREAKTHROUGH]',
        body: 'Rank Awakening! 1 full month of training completed. The System grants +1,200 XP.',
      },
      60: {
        title: '[MILESTONE: 60-DAY APEX PERSISTENCE]',
        body: 'Apex Vanguard! 2 months of legendary dedication. High-tier Hunter presence achieved. +2,500 XP awarded.',
      },
      100: {
        title: '[SYSTEM ALERT: 100-DAY SHADOW SOVEREIGN]',
        body: 'Centennial Transcendence! 100 days unbroken. Monarch authority granted! +5,000 XP awarded.',
      },
    };

    const content = milestonesContent[days];
    if (!content) return null;

    return this.notify(content.title, content.body, 'milestone');
  },
};
