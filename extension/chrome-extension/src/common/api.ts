import { ORCA_CONSTANTS } from './constants';

// Orca API Communication Module
export class OrcaAPI {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = ORCA_CONSTANTS.DEFAULT_API_URL;
    this.timeout = ORCA_CONSTANTS.TIMEOUTS.API_REQUEST;
  }

  async setBaseUrl(url: string): Promise<void> {
    this.baseUrl = url;
    await chrome.storage.local.set({ [ORCA_CONSTANTS.STORAGE_KEYS.API_URL]: url });
  }

  async getBaseUrl(): Promise<string> {
    const result = await chrome.storage.local.get(ORCA_CONSTANTS.STORAGE_KEYS.API_URL);
    if (result[ORCA_CONSTANTS.STORAGE_KEYS.API_URL]) {
      this.baseUrl = result[ORCA_CONSTANTS.STORAGE_KEYS.API_URL];
    }
    return this.baseUrl;
  }

  async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const defaultOptions: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const requestOptions = { ...defaultOptions, ...options };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Health check
  async checkHealth(): Promise<{ status: string; message: string }> {
    try {
      await this.makeRequest(ORCA_CONSTANTS.API_ENDPOINTS.HEALTH);
      return { status: 'connected', message: 'API is healthy' };
    } catch (error: any) {
      return { 
        status: 'error', 
        message: `Failed to connect: ${error.message}` 
      };
    }
  }

  // Get applications
  async getApplications(): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const data = await this.makeRequest(ORCA_CONSTANTS.API_ENDPOINTS.APPS);
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Create new recording
  async createRecording(recordingData: any): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const data = await this.makeRequest(ORCA_CONSTANTS.API_ENDPOINTS.RECORDINGS, {
        method: 'POST',
        body: JSON.stringify(recordingData)
      });
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Update recording
  async updateRecording(recordingId: string, updateData: any): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const data = await this.makeRequest(`${ORCA_CONSTANTS.API_ENDPOINTS.RECORDINGS}/${recordingId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Save recorded actions
  async saveActions(recordingId: string, actions: any[]): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const data = await this.makeRequest(ORCA_CONSTANTS.API_ENDPOINTS.ACTIONS, {
        method: 'POST',
        body: JSON.stringify({
          recording_id: recordingId,
          actions: actions
        })
      });
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Create action group from recording
  async createActionGroup(groupData: any): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const data = await this.makeRequest(ORCA_CONSTANTS.API_ENDPOINTS.ACTION_GROUPS, {
        method: 'POST',
        body: JSON.stringify(groupData)
      });
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Get recordings
  async getRecordings(appId?: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      let endpoint = ORCA_CONSTANTS.API_ENDPOINTS.RECORDINGS;
      if (appId) {
        endpoint += `?app_id=${appId}`;
      }
      const data = await this.makeRequest(endpoint);
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Delete recording
  async deleteRecording(recordingId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.makeRequest(`${ORCA_CONSTANTS.API_ENDPOINTS.RECORDINGS}/${recordingId}`, {
        method: 'DELETE'
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Test connection with timeout
  async testConnection(url?: string): Promise<{ status: string; message: string }> {
    if (url) {
      const originalUrl = this.baseUrl;
      this.baseUrl = url;
      try {
        const result = await this.checkHealth();
        return result;
      } finally {
        this.baseUrl = originalUrl;
      }
    } else {
      return await this.checkHealth();
    }
  }
}

// Create global instance
export const orcaAPI = new OrcaAPI();
