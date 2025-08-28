import React, { useState, useEffect } from 'react';
import { Button, Input, Label, cn, ModernNav } from '@extension/ui';
import { Shield, AlertCircle } from 'lucide-react';

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
      <ModernNav
        title="Orca Test Recorder"
        subtitle="Automated browser testing platform"
        logoUrl={chrome.runtime.getURL('popup/logo_vertical.svg')}
        connectionStatus="disconnected"
        onOpenSettings={onOpenSettings}
        variant="minimal"
      />

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Welcome to Orca
              </h2>
              <p className="mt-2 text-muted-foreground">
                Connect to your Orca instance to start recording and managing automated tests
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-destructive">Connection Failed</p>
                  <p className="text-sm text-destructive/80 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
            <div className="space-y-2">
              <Label htmlFor="endpoint" className="text-base font-medium">
                Orca Server Endpoint
              </Label>
              <Input
                id="endpoint"
                type="url"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="http://localhost:4004"
                className="h-12 text-base"
              />
              <p className="text-sm text-muted-foreground">
                Enter the URL where your Orca server is running
              </p>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading || !endpoint.trim()}
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Connecting...</span>
                </div>
              ) : (
                'Connect to Orca'
              )}
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Need help configuring your endpoint?{' '}
              <button 
                onClick={onOpenSettings}
                className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors"
              >
                Check Settings
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};