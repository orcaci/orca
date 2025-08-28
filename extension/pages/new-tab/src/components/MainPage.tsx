import React, { useState } from 'react';
import { Button, Input, Label, Badge, cn } from '@extension/ui';
import { Settings, LogOut, Play, Square } from 'lucide-react';

interface MainPageProps {
  onOpenSettings: () => void;
  onLogout: () => void;
}

export const MainPage: React.FC<MainPageProps> = ({ onOpenSettings, onLogout }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingName, setRecordingName] = useState('');
  const [actionCount, setActionCount] = useState(0);

  const handleStartRecording = () => {
    if (!recordingName.trim()) return;
    setIsRecording(true);
    setActionCount(0);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setRecordingName('');
    setActionCount(0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={chrome.runtime.getURL('popup/logo_vertical.svg')} className="w-8 h-8" alt="Orca Logo" />
            <h1 className="text-lg font-semibold">Orca Test Recorder</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={onOpenSettings} className="h-9 w-9">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onLogout} className="h-9 w-9">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Recording Status */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <div className={cn('w-3 h-3 rounded-full', {
              'bg-red-500 animate-pulse': isRecording,
              'bg-muted-foreground': !isRecording,
            })} />
            <span className={cn('font-medium', {
              'text-red-600': isRecording,
              'text-muted-foreground': !isRecording,
            })}>
              {isRecording ? 'Recording' : 'Ready'}
            </span>
            {isRecording && actionCount > 0 && (
              <Badge variant="secondary">
                {actionCount} actions
              </Badge>
            )}
          </div>
        </div>

        {/* Recording Controls */}
        <div className="space-y-4">
          {!isRecording ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recording-name">Recording Name</Label>
                <Input
                  id="recording-name"
                  type="text"
                  value={recordingName}
                  onChange={(e) => setRecordingName(e.target.value)}
                  placeholder="Enter test name..."
                />
              </div>
              <Button
                onClick={handleStartRecording}
                disabled={!recordingName.trim()}
                className="w-full"
                size="lg"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Recording
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <h3 className="text-sm font-medium text-primary mb-1">
                  Currently Recording: {recordingName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Interact with the webpage to record actions
                </p>
              </div>
              <Button
                onClick={handleStopRecording}
                variant="destructive"
                className="w-full"
                size="lg"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop Recording
              </Button>
            </div>
          )}
        </div>

        {/* Instructions */}
        {!isRecording && (
          <div className="mt-8 p-4 bg-secondary rounded-lg">
            <h3 className="text-sm font-medium mb-2">Getting Started</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>1. Enter a name for your test recording</li>
              <li>2. Click "Start Recording" to begin</li>
              <li>3. Interact with the webpage normally</li>
              <li>4. Click "Stop Recording" when finished</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};