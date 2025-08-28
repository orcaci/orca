import 'webextension-polyfill';
import { orcaAPI } from '../common/api';
import { ORCA_CONSTANTS } from '../common/constants';

interface TabState {
  isRecording: boolean;
  startTime: number;
  actionCount: number;
}

interface ActionData {
  action_type: string;
  target_element: any;
  value: any;
  timestamp_ms: number;
  recording_id?: string;
  sequence_number?: number;
  tab_id?: number;
  url?: string;
}

class OrcaRecorder {
  private state: {
    isRecording: boolean;
    isPaused: boolean;
    currentRecording: any;
    recordedActions: ActionData[];
    settings: any;
    tabStates: Map<number, TabState>;
  };

  constructor() {
    this.state = {
      isRecording: false,
      isPaused: false,
      currentRecording: null,
      recordedActions: [],
      settings: {},
      tabStates: new Map()
    };

    this.init();
  }

  private async init() {
    await this.loadSettings();
    this.setupEventListeners();
    this.setupContextMenus();
  }

  private async loadSettings() {
    try {
      const result = await chrome.storage.local.get([
        ORCA_CONSTANTS.STORAGE_KEYS.RECORDING_SETTINGS,
        ORCA_CONSTANTS.STORAGE_KEYS.API_URL
      ]);

      this.state.settings = result[ORCA_CONSTANTS.STORAGE_KEYS.RECORDING_SETTINGS] || 
        ORCA_CONSTANTS.DEFAULT_SETTINGS;

      const apiUrl = result[ORCA_CONSTANTS.STORAGE_KEYS.API_URL] || 
        ORCA_CONSTANTS.DEFAULT_API_URL;
      
      await orcaAPI.setBaseUrl(apiUrl);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  private setupEventListeners() {
    // Listen for messages from popup and content scripts
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender).then(response => {
        sendResponse(response);
      }).catch(error => {
        sendResponse({ success: false, error: error.message });
      });
      return true; // Keep message channel open for async response
    });

    // Handle tab updates
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.handleTabUpdate(tabId, changeInfo, tab);
    });

    // Handle tab removal
    chrome.tabs.onRemoved.addListener((tabId) => {
      this.state.tabStates.delete(tabId);
    });

    // Handle extension startup
    chrome.runtime.onStartup.addListener(() => {
      this.handleStartup();
    });

    // Handle installation
    chrome.runtime.onInstalled.addListener((details) => {
      this.handleInstalled(details);
    });
  }

  private setupContextMenus() {
    // Remove existing context menus to avoid duplicates
    try {
      chrome.contextMenus.removeAll();
    } catch (error) {
      console.warn('Could not remove existing context menus:', error);
    }

    // Create new context menus
    chrome.contextMenus.create({
      id: 'orca-start-recording',
      title: 'Start Orca Recording',
      contexts: ['page']
    });

    chrome.contextMenus.create({
      id: 'orca-stop-recording',
      title: 'Stop Orca Recording',
      contexts: ['page']
    });

    chrome.contextMenus.onClicked.addListener((info, tab) => {
      this.handleContextMenu(info, tab);
    });
  }

  private async handleMessage(message: any, sender: any) {
    const { type, ...data } = message;

    switch (type) {
      case ORCA_CONSTANTS.MESSAGES.START_RECORDING:
        return await this.startRecording(data, sender.tab);

      case ORCA_CONSTANTS.MESSAGES.STOP_RECORDING:
        return await this.stopRecording(sender.tab);

      case ORCA_CONSTANTS.MESSAGES.PAUSE_RECORDING:
        return await this.pauseRecording(sender.tab);

      case ORCA_CONSTANTS.MESSAGES.RESUME_RECORDING:
        return await this.resumeRecording(sender.tab);

      case ORCA_CONSTANTS.MESSAGES.ACTION_CAPTURED:
        return this.handleActionCaptured(data, sender.tab);

      case ORCA_CONSTANTS.MESSAGES.GET_STATUS:
        return this.getStatus(sender.tab);

      case ORCA_CONSTANTS.MESSAGES.SAVE_SETTINGS:
        return await this.saveSettings(data.settings);

      case ORCA_CONSTANTS.MESSAGES.TEST_CONNECTION:
        return await this.testConnection(data.url);

      case ORCA_CONSTANTS.MESSAGES.GET_APPS:
        return await this.getApplications();

      default:
        console.warn('Unknown message type:', type);
        return { success: false, error: 'Unknown message type' };
    }
  }

  private async startRecording(data: any, tab: any) {
    try {
      if (this.state.isRecording) {
        return { success: false, error: 'Recording already in progress' };
      }

      // Create recording in API
      const recordingData = {
        app_id: data.appId,
        name: data.recordingName,
        description: `Recorded from ${tab.url}`,
        browser_type: 'Chrome',
        viewport_width: 1920,
        viewport_height: 1080,
        base_url: new URL(tab.url).origin,
        created_by: 'browser_extension'
      };

      const result = await orcaAPI.createRecording(recordingData);
      if (!result.success) {
        return { success: false, error: result.error };
      }

      // Update state
      this.state.isRecording = true;
      this.state.isPaused = false;
      this.state.currentRecording = result.data;
      this.state.recordedActions = [];
      
      // Track tab state
      this.state.tabStates.set(tab.id, {
        isRecording: true,
        startTime: Date.now(),
        actionCount: 0
      });

      // Inject content script if not already injected
      await this.injectContentScript(tab.id);

      // Notify content script to start recording
      await chrome.tabs.sendMessage(tab.id, {
        type: ORCA_CONSTANTS.MESSAGES.START_RECORDING,
        recordingId: this.state.currentRecording.id,
        settings: this.state.settings
      });

      // Update popup
      this.broadcastStatusUpdate();

      return { success: true, recording: this.state.currentRecording };
    } catch (error: any) {
      console.error('Failed to start recording:', error);
      return { success: false, error: error.message };
    }
  }

  private async stopRecording(tab: any) {
    try {
      if (!this.state.isRecording) {
        return { success: false, error: 'No recording in progress' };
      }

      // Notify content script to stop
      if (tab) {
        try {
          await chrome.tabs.sendMessage(tab.id, {
            type: ORCA_CONSTANTS.MESSAGES.STOP_RECORDING
          });
        } catch (error) {
          console.warn('Could not notify content script:', error);
        }
      }

      // Save actions to API
      if (this.state.recordedActions.length > 0) {
        const result = await orcaAPI.saveActions(
          this.state.currentRecording.id,
          this.state.recordedActions
        );
        
        if (!result.success) {
          console.error('Failed to save actions:', result.error);
        }
      }

      // Update recording end time
      await orcaAPI.updateRecording(this.state.currentRecording.id, {
        status: 'completed',
        duration_ms: Date.now() - (this.state.tabStates.get(tab?.id)?.startTime || Date.now()),
        action_count: this.state.recordedActions.length
      });

      // Reset state
      this.state.isRecording = false;
      this.state.isPaused = false;
      this.state.currentRecording = null;
      this.state.recordedActions = [];
      
      if (tab) {
        this.state.tabStates.delete(tab.id);
      }

      // Update popup
      this.broadcastStatusUpdate();

      return { success: true, actionCount: this.state.recordedActions.length };
    } catch (error: any) {
      console.error('Failed to stop recording:', error);
      return { success: false, error: error.message };
    }
  }

  private async pauseRecording(tab: any) {
    if (!this.state.isRecording || this.state.isPaused) {
      return { success: false, error: 'Cannot pause recording' };
    }

    this.state.isPaused = true;

    if (tab) {
      try {
        await chrome.tabs.sendMessage(tab.id, {
          type: ORCA_CONSTANTS.MESSAGES.PAUSE_RECORDING
        });
      } catch (error) {
        console.warn('Could not notify content script:', error);
      }
    }

    this.broadcastStatusUpdate();
    return { success: true };
  }

  private async resumeRecording(tab: any) {
    if (!this.state.isRecording || !this.state.isPaused) {
      return { success: false, error: 'Cannot resume recording' };
    }

    this.state.isPaused = false;

    if (tab) {
      try {
        await chrome.tabs.sendMessage(tab.id, {
          type: ORCA_CONSTANTS.MESSAGES.RESUME_RECORDING
        });
      } catch (error) {
        console.warn('Could not notify content script:', error);
      }
    }

    this.broadcastStatusUpdate();
    return { success: true };
  }

  private handleActionCaptured(actionData: ActionData, tab: any) {
    if (!this.state.isRecording || this.state.isPaused) {
      return { success: false, error: 'Not recording' };
    }

    // Add metadata to action
    const enrichedAction: ActionData = {
      ...actionData,
      recording_id: this.state.currentRecording.id,
      sequence_number: this.state.recordedActions.length + 1,
      timestamp_ms: Date.now(),
      tab_id: tab?.id,
      url: tab?.url
    };

    this.state.recordedActions.push(enrichedAction);

    // Update tab state
    if (tab && this.state.tabStates.has(tab.id)) {
      const tabState = this.state.tabStates.get(tab.id)!;
      tabState.actionCount++;
    }

    // Notify popup of new action
    this.broadcastActionCaptured(enrichedAction);

    // Save periodically (every 10 actions)
    if (this.state.recordedActions.length % 10 === 0) {
      this.saveActionsBatch();
    }

    return { success: true };
  }

  private async saveActionsBatch() {
    try {
      if (this.state.recordedActions.length > 0) {
        await orcaAPI.saveActions(
          this.state.currentRecording.id,
          this.state.recordedActions
        );
      }
    } catch (error) {
      console.error('Failed to save actions batch:', error);
    }
  }

  private getStatus(tab: any) {
    const tabState = tab ? this.state.tabStates.get(tab.id) : null;
    
    return {
      success: true,
      recordingState: this.state.isRecording ? 
        (this.state.isPaused ? ORCA_CONSTANTS.RECORDING_STATES.PAUSED : 
         ORCA_CONSTANTS.RECORDING_STATES.RECORDING) :
        ORCA_CONSTANTS.RECORDING_STATES.IDLE,
      actionCount: this.state.recordedActions.length,
      currentRecording: this.state.currentRecording,
      tabState
    };
  }

  private async saveSettings(settings: any) {
    try {
      this.state.settings = { ...this.state.settings, ...settings };
      
      await chrome.storage.local.set({
        [ORCA_CONSTANTS.STORAGE_KEYS.RECORDING_SETTINGS]: this.state.settings
      });

      return { success: true };
    } catch (error: any) {
      console.error('Failed to save settings:', error);
      return { success: false, error: error.message };
    }
  }

  private async testConnection(url: string) {
    try {
      return await orcaAPI.testConnection(url);
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private async getApplications() {
    try {
      return await orcaAPI.getApplications();
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  private async injectContentScript(tabId: number) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['src/content/recorder.js']
      });
    } catch (error) {
      console.warn('Content script might already be injected:', error);
    }
  }

  private broadcastStatusUpdate() {
    const status = {
      type: ORCA_CONSTANTS.MESSAGES.UPDATE_STATUS,
      recordingState: this.state.isRecording ? 
        (this.state.isPaused ? ORCA_CONSTANTS.RECORDING_STATES.PAUSED : 
         ORCA_CONSTANTS.RECORDING_STATES.RECORDING) :
        ORCA_CONSTANTS.RECORDING_STATES.IDLE,
      actionCount: this.state.recordedActions.length,
      currentRecording: this.state.currentRecording
    };

    // Try to send to popup (might not be open)
    chrome.runtime.sendMessage(status).catch(() => {
      // Popup is closed, ignore error
    });
  }

  private broadcastActionCaptured(action: ActionData) {
    const message = {
      type: ORCA_CONSTANTS.MESSAGES.ACTION_CAPTURED,
      action,
      totalCount: this.state.recordedActions.length
    };

    chrome.runtime.sendMessage(message).catch(() => {
      // Popup is closed, ignore error
    });
  }

  private handleTabUpdate(tabId: number, changeInfo: any, tab: any) {
    // Handle navigation during recording
    if (this.state.isRecording && changeInfo.status === 'loading' && changeInfo.url) {
      const navigationAction: ActionData = {
        action_type: ORCA_CONSTANTS.ACTION_TYPES.NAVIGATION,
        target_element: null,
        value: changeInfo.url,
        timestamp_ms: Date.now()
      };

      this.handleActionCaptured(navigationAction, tab);
    }
  }

  private handleContextMenu(info: any, tab: any) {
    switch (info.menuItemId) {
      case 'orca-start-recording':
        // Open popup instead of starting directly
        chrome.action.openPopup();
        break;

      case 'orca-stop-recording':
        if (this.state.isRecording) {
          this.stopRecording(tab);
        }
        break;
    }
  }

  private handleStartup() {
    console.log('Orca extension started');
    this.loadSettings();
  }

  private handleInstalled(details: any) {
    if (details.reason === 'install') {
      console.log('Orca extension installed');
      // Set default settings
      chrome.storage.local.set({
        [ORCA_CONSTANTS.STORAGE_KEYS.RECORDING_SETTINGS]: ORCA_CONSTANTS.DEFAULT_SETTINGS,
        [ORCA_CONSTANTS.STORAGE_KEYS.API_URL]: ORCA_CONSTANTS.DEFAULT_API_URL
      });
    } else if (details.reason === 'update') {
      console.log('Orca extension updated');
      this.loadSettings();
    }
  }
}

// Initialize the recorder when the service worker loads
const recorder = new OrcaRecorder();

// Keep service worker alive
chrome.runtime.onSuspend.addListener(() => {
  console.log('Service worker suspending');
  if (recorder.state.isRecording) {
    // Try to save current recording state
    recorder.saveActionsBatch();
  }
});

console.log('Background loaded');
console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");
