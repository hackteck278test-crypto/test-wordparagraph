// src/components/TelegramSettings.tsx
// [file content begin]
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Send, Save, TestTube } from "lucide-react";
import { telegramService } from '@/services/telegram-notification';

// You'll need to create a Switch component if it doesn't exist
// Or use a regular checkbox for now
const Switch = ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) => (
  <button
    type="button"
    className={`relative inline-flex h-6 w-11 items-center rounded-full ${checked ? 'bg-primary' : 'bg-gray-300'}`}
    onClick={() => onCheckedChange(!checked)}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

export function TelegramSettings() {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const config = telegramService.getConfig();
    setBotToken(config.botToken);
    setChatId(config.chatId);
    setEnabled(config.enabled);
    
    if (config.botToken && config.chatId) {
      testConnection();
    }
  }, []);

  const testConnection = async () => {
    setIsTesting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const connected = await telegramService.testConnection();
      setIsConnected(connected);
      setSuccess(connected ? 'Connected to Telegram successfully!' : 'Connection failed');
    } catch (err: any) {
      setError(err.message);
      setIsConnected(false);
    } finally {
      setIsTesting(false);
    }
  };

  const saveSettings = async () => {
    setError(null);
    setSuccess(null);
    
    if (!botToken || !chatId) {
      setError('Bot Token and Chat ID are required');
      return;
    }
    
    try {
      telegramService.configure(botToken, chatId);
      await testConnection();
      setSuccess('Settings saved successfully!');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const sendTestNotification = async () => {
    setError(null);
    setSuccess(null);
    
    if (!telegramService.isConfigured()) {
      setError('Please configure Telegram first');
      return;
    }
    
    try {
      const success = await telegramService.sendMessage(
        testMessage || '🚀 Test notification from CodeReview AI\n\nThis is a test message to verify Telegram notifications are working correctly.'
      );
      
      if (success) {
        setSuccess('Test notification sent successfully!');
      } else {
        setError('Failed to send test notification');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleEnabled = (checked: boolean) => {
    setEnabled(checked);
    telegramService.setEnabled(checked);
    if (checked && botToken && chatId) {
      testConnection();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Telegram Notifications
        </CardTitle>
        <CardDescription>
          Configure Telegram bot to receive code review notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
        
        {success && (
          <div className="rounded-lg bg-success/10 border border-success/20 p-3">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle className="h-4 w-4" />
              <p className="text-sm">{success}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="telegram-enabled">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send Telegram notifications for code review results
              </p>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={toggleEnabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bot-token">Bot Token</Label>
            <Input
              id="bot-token"
              type="password"
              placeholder="Enter your Telegram bot token"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              disabled={isTesting}
            />
            <p className="text-sm text-muted-foreground">
              Create a bot via @BotFather and get the token
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chat-id">Chat ID</Label>
            <Input
              id="chat-id"
              placeholder="Enter your Telegram chat ID"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              disabled={isTesting}
            />
            <p className="text-sm text-muted-foreground">
              Get your chat ID by messaging @userinfobot
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={saveSettings}
              disabled={isTesting || (!botToken && !chatId)}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
            
            <Button
              variant="outline"
              onClick={testConnection}
              disabled={isTesting || !botToken}
            >
              <TestTube className="h-4 w-4 mr-2" />
              Test Connection
            </Button>
          </div>

          {isConnected && (
            <Badge className="bg-success/10 text-success border-success/20">
              <CheckCircle className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          )}

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">Test Notification</h4>
            <div className="space-y-3">
              <Input
                placeholder="Custom test message (optional)"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                disabled={!enabled || !isConnected}
              />
              <Button
                onClick={sendTestNotification}
                disabled={!enabled || !isConnected || isTesting}
                variant="secondary"
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Test Notification
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
// [file content end]