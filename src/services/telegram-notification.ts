// src/services/telegram-notification.ts
// [file content begin]
import axios from 'axios';

interface TelegramConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
}

export interface ReviewNotification {
  title: string;
  repository: string;
  status: 'passed' | 'warnings' | 'failed';
  issues: number;
  timestamp: string;
  author?: string;
  branch?: string;
  commitHash?: string;
}

export class TelegramNotificationService {
  private config: TelegramConfig = {
    botToken: '',
    chatId: '',
    enabled: false
  };

  constructor() {
    this.loadConfig();
  }

  private loadConfig(): void {
    const storedConfig = localStorage.getItem('telegram_config');
    if (storedConfig) {
      this.config = JSON.parse(storedConfig);
    } else {
      this.config = {
        botToken: import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '',
        chatId: import.meta.env.VITE_TELEGRAM_CHAT_ID || '',
        enabled: !!(import.meta.env.VITE_TELEGRAM_BOT_TOKEN && import.meta.env.VITE_TELEGRAM_CHAT_ID)
      };
    }
  }

  private saveConfig(): void {
    localStorage.setItem('telegram_config', JSON.stringify(this.config));
  }

  configure(botToken: string, chatId: string): void {
    this.config = {
      botToken,
      chatId,
      enabled: true
    };
    this.saveConfig();
  }

  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    this.saveConfig();
  }

  isConfigured(): boolean {
    return this.config.enabled && !!this.config.botToken && !!this.config.chatId;
  }

  getConfig(): TelegramConfig {
    return { ...this.config };
  }

  async sendMessage(message: string): Promise<boolean> {
    if (!this.isConfigured()) {
      console.warn('Telegram notifications are not configured');
      return false;
    }

    try {
      const url = `https://api.telegram.org/bot${this.config.botToken}/sendMessage`;
      
      const response = await axios.post(url, {
        chat_id: this.config.chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      });

      console.log('Telegram notification sent successfully');
      return true;
    } catch (error: any) {
      console.error('Failed to send Telegram notification:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        this.config.enabled = false;
        this.saveConfig();
        console.error('Telegram bot token invalid. Notifications disabled.');
      }
      
      return false;
    }
  }

  private formatStatus(status: 'passed' | 'warnings' | 'failed'): string {
    const emoji = {
      passed: '✅',
      warnings: '⚠️',
      failed: '❌'
    };
    
    const text = {
      passed: 'PASSED',
      warnings: 'WARNINGS',
      failed: 'FAILED'
    };
    
    return `${emoji[status]} ${text[status]}`;
  }

  async sendReviewNotification(review: ReviewNotification): Promise<boolean> {
    if (!this.isConfigured()) {
      return false;
    }

    const statusEmoji = {
      passed: '🎉',
      warnings: '⚠️',
      failed: '🚨'
    };

    const message = `
<b>${statusEmoji[review.status]} CODE REVIEW COMPLETED</b>

<b>Review:</b> ${review.title}
<b>Repository:</b> <code>${review.repository}</code>
<b>Status:</b> ${this.formatStatus(review.status)}
<b>Issues Found:</b> ${review.issues}

${review.author ? `<b>Author:</b> ${review.author}` : ''}
${review.branch ? `<b>Branch:</b> ${review.branch}` : ''}
${review.commitHash ? `<b>Commit:</b> <code>${review.commitHash.substring(0, 8)}</code>` : ''}
<b>Time:</b> ${review.timestamp}

${review.status === 'passed' ? 'All checks passed successfully!' : 'Please check the review details.'}
    `.trim();

    return this.sendMessage(message);
  }

  async sendBatchReviewNotifications(reviews: ReviewNotification[]): Promise<boolean[]> {
    const results = [];
    for (const review of reviews) {
      results.push(await this.sendReviewNotification(review));
    }
    return results;
  }

  async testConnection(): Promise<boolean> {
    if (!this.config.botToken) {
      throw new Error('Bot token not configured');
    }

    try {
      const url = `https://api.telegram.org/bot${this.config.botToken}/getMe`;
      const response = await axios.get(url);
      return response.data.ok === true;
    } catch (error) {
      throw new Error('Invalid bot token or connection failed');
    }
  }
}

export const telegramService = new TelegramNotificationService();
// [file content end]
