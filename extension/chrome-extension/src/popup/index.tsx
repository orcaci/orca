import { Avatar, AvatarFallback, Badge, Button, cn, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, Input, Label, Switch } from '@extension/ui';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { orcaAPI } from '../common/api';
import { ORCA_CONSTANTS } from '../common/constants';

interface Application {
    id: string;
    name: string;
    description?: string;
}

interface Recording {
    id: string;
    name: string;
    created_at: string;
    status: string;
}

interface PopupState {
    connectionStatus: string;
    recordingState: string;
    currentRecording: any;
    actionCount: number;
    recordingTime: string;
    applications: Application[];
    recentRecordings: Recording[];
    settings: {
        captureScreenshots: boolean;
        captureHover: boolean;
        smartSelectors: boolean;
        selectedApp: string;
        recordingName: string;
        apiUrl: string;
    };
}

const OrcaPopup: React.FC = () => {
    const [state, setState] = useState<PopupState>({
        connectionStatus: ORCA_CONSTANTS.CONNECTION_STATES.UNKNOWN,
        recordingState: ORCA_CONSTANTS.RECORDING_STATES.IDLE,
        currentRecording: null,
        actionCount: 0,
        recordingTime: '00:00',
        applications: [],
        recentRecordings: [],
        settings: {
            captureScreenshots: true,
            captureHover: true,
            smartSelectors: true,
            selectedApp: '',
            recordingName: '',
            apiUrl: 'http://localhost:4004'
        }
    });

    const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null);
    const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);

    useEffect(() => {
        init();
        return () => {
            if (recordingTimer) {
                clearInterval(recordingTimer);
            }
        };
    }, []);

    const init = async () => {
        await loadSettings();
        await loadApplications();
        await loadRecentRecordings();
        checkConnectionStatus();
        requestStatusUpdate();
    };

    const loadSettings = async () => {
        try {
            const result = await chrome.storage.local.get([
                ORCA_CONSTANTS.STORAGE_KEYS.RECORDING_SETTINGS,
                ORCA_CONSTANTS.STORAGE_KEYS.API_URL,
                ORCA_CONSTANTS.STORAGE_KEYS.SELECTED_APP
            ]);

            const settings = result[ORCA_CONSTANTS.STORAGE_KEYS.RECORDING_SETTINGS] ||
                ORCA_CONSTANTS.DEFAULT_SETTINGS;

            const apiUrl = result[ORCA_CONSTANTS.STORAGE_KEYS.API_URL] ||
                ORCA_CONSTANTS.DEFAULT_API_URL;

            const selectedApp = result[ORCA_CONSTANTS.STORAGE_KEYS.SELECTED_APP] || '';

            setState(prev => ({
                ...prev,
                settings: {
                    ...prev.settings,
                    ...settings,
                    apiUrl,
                    selectedApp
                }
            }));

            await orcaAPI.setBaseUrl(apiUrl);
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    };

    const saveSettings = async () => {
        try {
            const settings = {
                captureScreenshots: state.settings.captureScreenshots,
                captureHover: state.settings.captureHover,
                smartSelectors: state.settings.smartSelectors,
                maxActions: ORCA_CONSTANTS.DEFAULT_SETTINGS.maxActions,
                recordingTimeout: ORCA_CONSTANTS.DEFAULT_SETTINGS.recordingTimeout,
                actionDelay: ORCA_CONSTANTS.DEFAULT_SETTINGS.actionDelay
            };

            await chrome.storage.local.set({
                [ORCA_CONSTANTS.STORAGE_KEYS.RECORDING_SETTINGS]: settings,
                [ORCA_CONSTANTS.STORAGE_KEYS.SELECTED_APP]: state.settings.selectedApp
            });

            chrome.runtime.sendMessage({
                type: ORCA_CONSTANTS.MESSAGES.SAVE_SETTINGS,
                settings: { ...settings, selectedApp: state.settings.selectedApp, recordingName: state.settings.recordingName }
            });
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    };

    const loadApplications = async () => {
        try {
            const result = await orcaAPI.getApplications();
            if (result.success) {
                setState(prev => ({ ...prev, applications: result.data }));
            } else {
                console.error('Failed to load applications:', result.error);
            }
        } catch (error) {
            console.error('Error loading applications:', error);
        }
    };

    const loadRecentRecordings = async () => {
        try {
            const result = await orcaAPI.getRecordings();
            if (result.success) {
                setState(prev => ({ ...prev, recentRecordings: result.data.slice(0, 5) }));
            }
        } catch (error) {
            console.error('Error loading recent recordings:', error);
        }
    };

    const checkConnectionStatus = async () => {
        setState(prev => ({ ...prev, connectionStatus: ORCA_CONSTANTS.CONNECTION_STATES.CHECKING }));

        try {
            const result = await orcaAPI.checkHealth();
            if (result.status === 'connected') {
                setState(prev => ({ ...prev, connectionStatus: ORCA_CONSTANTS.CONNECTION_STATES.CONNECTED }));
            } else {
                setState(prev => ({ ...prev, connectionStatus: ORCA_CONSTANTS.CONNECTION_STATES.ERROR }));
            }
        } catch (error) {
            setState(prev => ({ ...prev, connectionStatus: ORCA_CONSTANTS.CONNECTION_STATES.DISCONNECTED }));
        }
    };

    const testConnection = async () => {
        try {
            const result = await orcaAPI.testConnection(state.settings.apiUrl);
            if (result.status === 'connected') {
                await updateApiUrl();
                checkConnectionStatus();
            }
        } catch (error) {
            console.error('Connection test failed:', error);
        }
    };

    const updateApiUrl = async () => {
        await orcaAPI.setBaseUrl(state.settings.apiUrl);
        await chrome.storage.local.set({ [ORCA_CONSTANTS.STORAGE_KEYS.API_URL]: state.settings.apiUrl });
    };

    const startRecording = async () => {
        if (!state.settings.selectedApp) {
            alert('Please select an application first');
            return;
        }

        if (state.connectionStatus !== ORCA_CONSTANTS.CONNECTION_STATES.CONNECTED) {
            alert('Not connected to Orca API');
            return;
        }

        try {
            chrome.runtime.sendMessage({
                type: ORCA_CONSTANTS.MESSAGES.START_RECORDING,
                appId: state.settings.selectedApp,
                recordingName: state.settings.recordingName || `Recording ${new Date().toLocaleString()}`
            });

            setState(prev => ({ ...prev, recordingState: ORCA_CONSTANTS.RECORDING_STATES.RECORDING }));
            startRecordingTimer();
        } catch (error) {
            alert(`Failed to start recording: ${error.message}`);
        }
    };

    const stopRecording = async () => {
        try {
            chrome.runtime.sendMessage({
                type: ORCA_CONSTANTS.MESSAGES.STOP_RECORDING
            });

            setState(prev => ({ ...prev, recordingState: ORCA_CONSTANTS.RECORDING_STATES.STOPPING }));
            stopRecordingTimer();
        } catch (error) {
            alert(`Failed to stop recording: ${error.message}`);
        }
    };

    const togglePause = async () => {
        const isPaused = state.recordingState === ORCA_CONSTANTS.RECORDING_STATES.PAUSED;

        try {
            chrome.runtime.sendMessage({
                type: isPaused ? ORCA_CONSTANTS.MESSAGES.RESUME_RECORDING : ORCA_CONSTANTS.MESSAGES.PAUSE_RECORDING
            });

            setState(prev => ({
                ...prev,
                recordingState: isPaused ? ORCA_CONSTANTS.RECORDING_STATES.RECORDING : ORCA_CONSTANTS.RECORDING_STATES.PAUSED
            }));

            if (isPaused) {
                startRecordingTimer();
            } else {
                pauseRecordingTimer();
            }
        } catch (error) {
            alert(`Failed to ${isPaused ? 'resume' : 'pause'} recording: ${error.message}`);
        }
    };

    const startRecordingTimer = () => {
        setRecordingStartTime(Date.now());
        const timer = setInterval(() => {
            if (recordingStartTime) {
                const elapsed = Date.now() - recordingStartTime;
                const timeString = formatDuration(elapsed);
                setState(prev => ({ ...prev, recordingTime: timeString }));
            }
        }, 1000);
        setRecordingTimer(timer);
    };

    const stopRecordingTimer = () => {
        if (recordingTimer) {
            clearInterval(recordingTimer);
            setRecordingTimer(null);
        }
        setState(prev => ({
            ...prev,
            actionCount: 0,
            recordingTime: '00:00',
            recordingState: ORCA_CONSTANTS.RECORDING_STATES.IDLE
        }));
    };

    const pauseRecordingTimer = () => {
        if (recordingTimer) {
            clearInterval(recordingTimer);
            setRecordingTimer(null);
        }
    };

    const requestStatusUpdate = () => {
        chrome.runtime.sendMessage({
            type: ORCA_CONSTANTS.MESSAGES.GET_STATUS
        });
    };

    const formatDuration = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
        } else {
            return `${minutes.toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getConnectionStatusColor = () => {
        switch (state.connectionStatus) {
            case ORCA_CONSTANTS.CONNECTION_STATES.CONNECTED:
                return 'bg-green-500';
            case ORCA_CONSTANTS.CONNECTION_STATES.ERROR:
            case ORCA_CONSTANTS.CONNECTION_STATES.DISCONNECTED:
                return 'bg-red-500';
            case ORCA_CONSTANTS.CONNECTION_STATES.CHECKING:
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getConnectionStatusText = () => {
        switch (state.connectionStatus) {
            case ORCA_CONSTANTS.CONNECTION_STATES.CONNECTED:
                return 'Connected to Orca API';
            case ORCA_CONSTANTS.CONNECTION_STATES.ERROR:
                return 'Connection error';
            case ORCA_CONSTANTS.CONNECTION_STATES.DISCONNECTED:
                return 'Disconnected from API';
            case ORCA_CONSTANTS.CONNECTION_STATES.CHECKING:
                return 'Checking connection...';
            default:
                return 'Unknown status';
        }
    };

    const isRecording = state.recordingState === ORCA_CONSTANTS.RECORDING_STATES.RECORDING;
    const isPaused = state.recordingState === ORCA_CONSTANTS.RECORDING_STATES.PAUSED;
    const isIdle = state.recordingState === ORCA_CONSTANTS.RECORDING_STATES.IDLE;

    return (
        <div className="w-96 p-4 bg-white">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <img src="/icon-34.png" alt="Orca" className="w-8 h-8" />
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Orca Recorder</h1>
                        <p className="text-sm text-gray-600">Record and replay browser interactions</p>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Avatar className="h-6 w-6">
                                <AvatarFallback>U.</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>About</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Connection Status */}
            <div className="mb-4">
                <div className={cn("flex items-center space-x-2 p-3 rounded-lg",
                    state.connectionStatus === ORCA_CONSTANTS.CONNECTION_STATES.CONNECTED ? "bg-green-50" :
                        state.connectionStatus === ORCA_CONSTANTS.CONNECTION_STATES.ERROR ? "bg-red-50" :
                            "bg-gray-50"
                )}>
                    <div className={cn("w-3 h-3 rounded-full", getConnectionStatusColor())}></div>
                    <span className="text-sm font-medium text-gray-700">{getConnectionStatusText()}</span>
                </div>
            </div>

            {/* Recording Controls */}
            <div className="mb-6">
                {!isIdle && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-blue-900">
                                {isPaused ? 'Recording paused' : 'Recording in progress'}
                            </span>
                        </div>
                        <div className="text-sm text-blue-700">
                            Actions captured: <span className="font-medium">{state.actionCount}</span>
                        </div>
                        <div className="text-sm text-blue-700">
                            Duration: <span className="font-medium">{state.recordingTime}</span>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    {isIdle ? (
                        <Button
                            onClick={startRecording}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={!state.settings.selectedApp || state.connectionStatus !== ORCA_CONSTANTS.CONNECTION_STATES.CONNECTED}
                        >
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            Start Recording
                        </Button>
                    ) : (
                        <div className="flex space-x-2">
                            <Button
                                onClick={togglePause}
                                variant="outline"
                                className="flex-1"
                            >
                                {isPaused ? 'Resume' : 'Pause'}
                            </Button>
                            <Button
                                onClick={stopRecording}
                                variant="destructive"
                                className="flex-1"
                            >
                                Stop
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Settings Section */}
            <div className="mb-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Recording Settings</h3>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="captureScreenshots">Capture screenshots</Label>
                        <Switch
                            id="captureScreenshots"
                            checked={state.settings.captureScreenshots}
                            onCheckedChange={(checked) => {
                                setState(prev => ({
                                    ...prev,
                                    settings: { ...prev.settings, captureScreenshots: checked }
                                }));
                                saveSettings();
                            }}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="captureHover">Record hover actions</Label>
                        <Switch
                            id="captureHover"
                            checked={state.settings.captureHover}
                            onCheckedChange={(checked) => {
                                setState(prev => ({
                                    ...prev,
                                    settings: { ...prev.settings, captureHover: checked }
                                }));
                                saveSettings();
                            }}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="smartSelectors">Generate smart selectors</Label>
                        <Switch
                            id="smartSelectors"
                            checked={state.settings.smartSelectors}
                            onCheckedChange={(checked) => {
                                setState(prev => ({
                                    ...prev,
                                    settings: { ...prev.settings, smartSelectors: checked }
                                }));
                                saveSettings();
                            }}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="applicationSelect">Application</Label>
                    <select
                        id="applicationSelect"
                        value={state.settings.selectedApp}
                        onChange={(e) => {
                            setState(prev => ({
                                ...prev,
                                settings: { ...prev.settings, selectedApp: e.target.value }
                            }));
                            saveSettings();
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Select an application...</option>
                        {state.applications.map(app => (
                            <option key={app.id} value={app.id}>{app.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="recordingName">Recording Name</Label>
                    <Input
                        id="recordingName"
                        placeholder="e.g., Login Flow Test"
                        value={state.settings.recordingName}
                        onChange={(e) => {
                            setState(prev => ({
                                ...prev,
                                settings: { ...prev.settings, recordingName: e.target.value }
                            }));
                        }}
                        onBlur={saveSettings}
                    />
                </div>
            </div>

            {/* Server Configuration */}
            <div className="mb-6">
                <details className="group">
                    <summary className="cursor-pointer text-lg font-semibold text-gray-900 mb-3">
                        Server Configuration
                    </summary>
                    <div className="space-y-3 pl-4">
                        <div className="space-y-2">
                            <Label htmlFor="apiUrl">API URL</Label>
                            <Input
                                id="apiUrl"
                                value={state.settings.apiUrl}
                                onChange={(e) => {
                                    setState(prev => ({
                                        ...prev,
                                        settings: { ...prev.settings, apiUrl: e.target.value }
                                    }));
                                }}
                                onBlur={updateApiUrl}
                                placeholder="http://localhost:4004"
                            />
                        </div>
                        <Button
                            onClick={testConnection}
                            variant="outline"
                            size="sm"
                        >
                            Test Connection
                        </Button>
                    </div>
                </details>
            </div>

            {/* Recent Recordings */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Recordings</h3>
                <div className="space-y-2">
                    {state.recentRecordings.length === 0 ? (
                        <div className="text-sm text-gray-500 text-center py-4">No recent recordings</div>
                    ) : (
                        state.recentRecordings.map(recording => (
                            <div key={recording.id} className="p-3 bg-gray-50 rounded-lg">
                                <div className="font-medium text-gray-900">{recording.name || 'Untitled Recording'}</div>
                                <div className="text-sm text-gray-600">{formatDate(recording.created_at)}</div>
                                <Badge variant={recording.status === 'completed' ? 'default' : 'secondary'} className="mt-1">
                                    {recording.status}
                                </Badge>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('root');
    if (container) {
        const root = createRoot(container);
        root.render(<OrcaPopup />);
    }
});

export default OrcaPopup;
