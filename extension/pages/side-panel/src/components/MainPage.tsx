import React, { useState } from 'react';
import { Button, Input, Label, Badge, cn, ModernNav } from '@extension/ui';
import { Play, Square } from 'lucide-react';

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
      <ModernNav
        title="Orca Test Recorder"
        subtitle="Record and replay browser interactions"
        logoUrl={chrome.runtime.getURL('popup/logo_vertical.svg')}
        isRecording={isRecording}
        recordingName={recordingName}
        actionCount={actionCount}
        connectionStatus="connected"
        onOpenSettings={onOpenSettings}
        onLogout={onLogout}
        onToggleRecording={isRecording ? handleStopRecording : handleStartRecording}
        variant="glass"
      />

      {/* Content */}
      <div className="container mx-auto px-6 py-8 max-w-2xl">

        {/* Recording Controls */}
        <div className="space-y-6">
          {!isRecording ? (
            <div className="space-y-6">
              {/* Recording Setup Card */}
              <div className="bg-card border rounded-xl p-6 shadow-sm">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recording-name" className="text-base font-medium">
                      Recording Name
                    </Label>
                    <Input
                      id="recording-name"
                      type="text"
                      value={recordingName}
                      onChange={(e) => setRecordingName(e.target.value)}
                      placeholder="Enter a descriptive name for your test..."
                      className="h-12 text-base"
                    />
                    <p className="text-sm text-muted-foreground">
                      Choose a clear name that describes what this test will do
                    </p>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <Button
                onClick={handleStartRecording}
                disabled={!recordingName.trim()}
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Recording
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Currently Recording Card */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse mt-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                      Recording in Progress
                    </h3>
                    <p className="text-base font-medium text-red-800 dark:text-red-200 mb-1">
                      {recordingName}
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-300">
                      Navigate and interact with the webpage. All your actions are being captured.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stop Button */}
              <Button
                onClick={handleStopRecording}
                variant="destructive"
                className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                <Square className="w-5 h-5 mr-2" />
                Stop Recording
              </Button>
            </div>
          )}
        </div>

        {/* Instructions */}
        {!isRecording && (
          <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Play className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  How to Record a Test
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-medium flex items-center justify-center mt-0.5">1</div>
                    <p className="text-sm text-blue-800 dark:text-blue-200">Enter a descriptive name for your test</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-medium flex items-center justify-center mt-0.5">2</div>
                    <p className="text-sm text-blue-800 dark:text-blue-200">Click "Start Recording" to begin capturing</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-medium flex items-center justify-center mt-0.5">3</div>
                    <p className="text-sm text-blue-800 dark:text-blue-200">Navigate and interact with the webpage normally</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-medium flex items-center justify-center mt-0.5">4</div>
                    <p className="text-sm text-blue-800 dark:text-blue-200">Click "Stop Recording" when you're done</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};