import '@src/SidePanel.css';
import React, { useState, useEffect } from 'react';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { ErrorDisplay, LoadingSpinner } from '@extension/ui';
import { LoginPage } from './components/LoginPage';
import { SettingsPage } from './components/SettingsPage';
import { MainPage } from './components/MainPage';

type Page = 'login' | 'main' | 'settings';

const SidePanel = () => {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    chrome.storage.local.get(['orcaAuthToken', 'orcaEndpoint'], (result) => {
      if (result.orcaAuthToken && result.orcaEndpoint) {
        setIsAuthenticated(true);
        setCurrentPage('main');
      }
    });
  }, []);

  const handleLogin = () => {
    // Set authentication token (in real implementation, this would come from the auth callback)
    chrome.storage.local.set({ orcaAuthToken: 'temp_token_' + Date.now() });
    setIsAuthenticated(true);
    setCurrentPage('main');
  };

  const handleLogout = () => {
    chrome.storage.local.remove(['orcaAuthToken']);
    setIsAuthenticated(false);
    setCurrentPage('login');
  };

  const openSettings = () => {
    setCurrentPage('settings');
  };

  const backToMain = () => {
    setCurrentPage(isAuthenticated ? 'main' : 'login');
  };

  switch (currentPage) {
    case 'login':
      return <LoginPage onLogin={handleLogin} onOpenSettings={openSettings} />;
    case 'settings':
      return <SettingsPage onBack={backToMain} />;
    case 'main':
      return <MainPage onOpenSettings={openSettings} onLogout={handleLogout} />;
    default:
      return <LoginPage onLogin={handleLogin} onOpenSettings={openSettings} />;
  }
};

export default withErrorBoundary(withSuspense(SidePanel, <LoadingSpinner />), ErrorDisplay);
