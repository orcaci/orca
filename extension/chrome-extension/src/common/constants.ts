// Orca Extension Constants
export const ORCA_CONSTANTS = {
  // API Configuration
  DEFAULT_API_URL: 'http://localhost:8080',
  API_ENDPOINTS: {
    HEALTH: '/health',
    APPS: '/api/v1/app',
    RECORDINGS: '/api/v1/recordings',
    ACTIONS: '/api/v1/actions',
    ACTION_GROUPS: '/api/v1/action-groups'
  },

  // Storage Keys
  STORAGE_KEYS: {
    API_URL: 'orca_api_url',
    RECORDING_SETTINGS: 'orca_recording_settings',
    CURRENT_RECORDING: 'orca_current_recording',
    RECENT_RECORDINGS: 'orca_recent_recordings',
    SELECTED_APP: 'orca_selected_app'
  },

  // Recording Settings
  DEFAULT_SETTINGS: {
    captureScreenshots: true,
    captureHover: true,
    smartSelectors: true,
    maxActions: 1000,
    recordingTimeout: 3600000, // 1 hour in ms
    actionDelay: 100 // ms between actions
  },

  // Action Types
  ACTION_TYPES: {
    CLICK: 'click',
    DOUBLE_CLICK: 'dblclick',
    RIGHT_CLICK: 'contextmenu',
    INPUT: 'input',
    CHANGE: 'change',
    KEYDOWN: 'keydown',
    KEYUP: 'keyup',
    SUBMIT: 'submit',
    FOCUS: 'focus',
    BLUR: 'blur',
    HOVER: 'mouseover',
    SCROLL: 'scroll',
    NAVIGATION: 'navigation',
    WAIT: 'wait'
  },

  // Target Types
  TARGET_TYPES: {
    CSS: 'css',
    XPATH: 'xpath',
    ID: 'id',
    NAME: 'name',
    CLASS: 'class',
    TEXT: 'text',
    ATTRIBUTES: 'attributes'
  },

  // Recording States
  RECORDING_STATES: {
    IDLE: 'idle',
    RECORDING: 'recording',
    PAUSED: 'paused',
    STOPPING: 'stopping',
    PROCESSING: 'processing'
  },

  // Connection States
  CONNECTION_STATES: {
    UNKNOWN: 'unknown',
    CHECKING: 'checking',
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected',
    ERROR: 'error'
  },

  // Messages between content script and background
  MESSAGES: {
    START_RECORDING: 'start_recording',
    STOP_RECORDING: 'stop_recording',
    PAUSE_RECORDING: 'pause_recording',
    RESUME_RECORDING: 'resume_recording',
    ACTION_CAPTURED: 'action_captured',
    UPDATE_STATUS: 'update_status',
    GET_STATUS: 'get_status',
    TEST_CONNECTION: 'test_connection',
    SAVE_SETTINGS: 'save_settings',
    GET_SETTINGS: 'get_settings',
    GET_APPS: 'get_apps'
  },

  // Element attributes to capture for smart selectors
  SELECTOR_ATTRIBUTES: [
    'id',
    'name',
    'class',
    'type',
    'role',
    'aria-label',
    'data-testid',
    'data-test',
    'data-cy',
    'placeholder',
    'title',
    'alt'
  ],

  // CSS selectors to ignore during recording
  IGNORED_SELECTORS: [
    '[data-orca-ignore]',
    '.orca-ignore',
    '#orca-overlay',
    '.orca-recorder-ui'
  ],

  // Maximum lengths
  MAX_LENGTHS: {
    RECORDING_NAME: 100,
    ACTION_DESCRIPTION: 500,
    SELECTOR_LENGTH: 1000,
    VALUE_LENGTH: 5000
  },

  // Timeouts
  TIMEOUTS: {
    API_REQUEST: 5000,
    CONNECTION_CHECK: 3000,
    SCREENSHOT_CAPTURE: 2000,
    ELEMENT_WAIT: 10000
  },

  // Screenshot settings
  SCREENSHOT: {
    MAX_WIDTH: 1920,
    MAX_HEIGHT: 1080,
    QUALITY: 0.8,
    FORMAT: 'png'
  }
};
