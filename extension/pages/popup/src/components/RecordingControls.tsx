import React, { useState, useEffect } from 'react';
import { cn } from '@extension/ui';
import type { RecordingState, OrcaRecording } from '@extension/orca-api';
import { MessageType } from '@extension/orca-api';

interface RecordingStatus {
  recordingState: RecordingState;
  actionCount: number;
  currentRecording?: OrcaRecording;
  error?: string;
}

export const RecordingControls: React.FC = () => {
  const [status, setStatus] = useState<RecordingStatus>({
    recordingState: 'idle' as RecordingState,
    actionCount: 0,
  });
  const [recordingName, setRecordingName] = useState('');
  const [selectedAppId, setSelectedAppId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get initial status
    getRecordingStatus();

    // Listen for status updates
    const handleMessage = (message: any) => {
      if (message.type === MessageType.UPDATE_STATUS) {
        setStatus({
          recordingState: message.data.recordingState,
          actionCount: message.data.actionCount,
          currentRecording: message.data.currentRecording,
        });
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const getRecordingStatus = async () => {
    try {
      const response = await chrome.runtime.sendMessage({
        type: MessageType.GET_STATUS,
      });
      if (response.success) {
        setStatus({
          recordingState: response.recordingState,
          actionCount: response.actionCount,
          currentRecording: response.currentRecording,
        });
      }
    } catch (error) {
      console.error('Failed to get recording status:', error);
    }
  };

  const startRecording = async () => {
    if (!selectedAppId || !recordingName.trim()) {
      setStatus(prev => ({
        ...prev,
        error: 'Please select an application and enter a recording name',
      }));
      return;
    }

    setIsLoading(true);
    setStatus(prev => ({ ...prev, error: undefined }));

    try {
      const response = await chrome.runtime.sendMessage({
        type: MessageType.START_RECORDING,
        data: {
          appId: selectedAppId,
          recordingName: recordingName.trim(),
        },
      });

      if (!response.success) {
        setStatus(prev => ({
          ...prev,
          error: response.error || 'Failed to start recording',
        }));
      }
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        error: 'Failed to communicate with extension',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const stopRecording = async () => {
    setIsLoading(true);

    try {
      const response = await chrome.runtime.sendMessage({
        type: MessageType.STOP_RECORDING,
      });

      if (!response.success) {
        setStatus(prev => ({
          ...prev,
          error: response.error || 'Failed to stop recording',
        }));
      }
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        error: 'Failed to communicate with extension',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const pauseRecording = async () => {
    setIsLoading(true);

    try {
      const response = await chrome.runtime.sendMessage({
        type: MessageType.PAUSE_RECORDING,
      });

      if (!response.success) {
        setStatus(prev => ({
          ...prev,
          error: response.error || 'Failed to pause recording',
        }));
      }
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        error: 'Failed to communicate with extension',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const resumeRecording = async () => {
    setIsLoading(true);

    try {
      const response = await chrome.runtime.sendMessage({
        type: MessageType.RESUME_RECORDING,
      });

      if (!response.success) {
        setStatus(prev => ({
          ...prev,
          error: response.error || 'Failed to resume recording',
        }));
      }
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        error: 'Failed to communicate with extension',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (): string => {
    switch (status.recordingState) {
      case 'recording':
        return 'text-red-600';
      case 'paused':
        return 'text-yellow-600';
      case 'processing':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (): string => {
    switch (status.recordingState) {
      case 'recording':
        return 'Recording';
      case 'paused':
        return 'Paused';
      case 'processing':
        return 'Processing';
      case 'stopping':
        return 'Stopping';
      default:
        return 'Ready';
    }
  };

  const isRecording = status.recordingState === 'recording';
  const isPaused = status.recordingState === 'paused';
  const isIdle = status.recordingState === 'idle';
  const canStart = isIdle && selectedAppId && recordingName.trim();

  return (
    <div className="space-y-4">
      {/* Status Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={cn('w-3 h-3 rounded-full', {
            'bg-red-500 animate-pulse': isRecording,
            'bg-yellow-500': isPaused,
            'bg-gray-400': isIdle,
          })} />
          <span className={cn('font-medium', getStatusColor())}>
            {getStatusText()}
          </span>
        </div>
        
        {status.actionCount > 0 && (
          <span className="text-sm text-gray-600">
            {status.actionCount} actions
          </span>
        )}
      </div>

      {/* Error Display */}
      {status.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{status.error}</p>
        </div>
      )}

      {/* Recording Name Input */}
      {isIdle && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Recording Name
          </label>
          <input
            type="text"
            value={recordingName}
            onChange={(e) => setRecordingName(e.target.value)}
            placeholder="Enter recording name..."
            className={cn(
              'w-full px-3 py-2 border rounded-md text-sm',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              'border-gray-300'
            )}
            disabled={isLoading}
          />
        </div>
      )}

      {/* Current Recording Info */}
      {status.currentRecording && !isIdle && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm font-medium text-blue-800">
            {status.currentRecording.name}
          </p>
          {status.currentRecording.description && (
            <p className="text-xs text-blue-600 mt-1">
              {status.currentRecording.description}
            </p>
          )}
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex space-x-2">
        {isIdle && (
          <button
            onClick={startRecording}
            disabled={!canStart || isLoading}
            className={cn(
              'flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              canStart && !isLoading
                ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            )}
          >
            {isLoading ? 'Starting...' : 'Start Recording'}
          </button>
        )}

        {isRecording && (
          <>
            <button
              onClick={pauseRecording}
              disabled={isLoading}
              className={cn(
                'flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors',
                'bg-yellow-600 hover:bg-yellow-700 text-white',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isLoading ? 'Pausing...' : 'Pause'}
            </button>
            <button
              onClick={stopRecording}
              disabled={isLoading}
              className={cn(
                'flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors',
                'bg-red-600 hover:bg-red-700 text-white',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isLoading ? 'Stopping...' : 'Stop'}
            </button>
          </>
        )}

        {isPaused && (
          <>
            <button
              onClick={resumeRecording}
              disabled={isLoading}
              className={cn(
                'flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors',
                'bg-green-600 hover:bg-green-700 text-white',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isLoading ? 'Resuming...' : 'Resume'}
            </button>
            <button
              onClick={stopRecording}
              disabled={isLoading}
              className={cn(
                'flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors',
                'bg-red-600 hover:bg-red-700 text-white',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isLoading ? 'Stopping...' : 'Stop'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};