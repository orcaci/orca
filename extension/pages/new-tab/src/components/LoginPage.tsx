import React, { useState, useEffect } from 'react';
import { Button, Input, Label, cn } from '@extension/ui';
import { Settings } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
  onOpenSettings: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onOpenSettings }) => {
  const [endpoint, setEndpoint] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load saved endpoint
    chrome.storage.local.get(['orcaEndpoint'], (result) => {
      if (result.orcaEndpoint) {
        setEndpoint(result.orcaEndpoint);
      }
    });
  }, []);

  const handleLogin = async () => {
    if (!endpoint.trim()) {
      setError('Please configure an endpoint first');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Open the login URL in a new tab
      const loginUrl = `${endpoint.replace(/\/$/, '')}/auth/login?redirect_uri=${encodeURIComponent(chrome.runtime.getURL('/'))}`;
      chrome.tabs.create({ url: loginUrl });
      
      // For now, we'll assume login is successful
      // In a real implementation, you'd listen for the auth callback
      setTimeout(() => {
        setIsLoading(false);
        onLogin();
      }, 1000);
    } catch (err) {
      setError('Login failed. Please check your endpoint.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-secondary border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={chrome.runtime.getURL('popup/logo_vertical.svg')} className="w-8 h-8" alt="Orca Logo" />
            <h1 className="text-lg font-semibold">Orca Test Recorder</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onOpenSettings}
            className="h-9 w-9"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Welcome to Orca</h2>
            <p className="text-muted-foreground">Connect to your Orca instance to start recording tests</p>
          </div>

          {error && (
            <div className="bg-destructive/15 border border-destructive/20 rounded-md p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="endpoint">Endpoint URL</Label>
              <Input
                id="endpoint"
                type="url"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="https://your-orca-instance.com"
              />
              <p className="text-xs text-muted-foreground">
                Configure your Orca server endpoint
              </p>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading || !endpoint.trim()}
              className="w-full"
            >
              {isLoading ? 'Connecting...' : 'Login to Orca'}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Need help? Check the settings for endpoint configuration</p>
          </div>
        </div>
      </div>
    </div>
  );
};