export interface OrcaApplication {
  id: string;
  name: string;
  description?: string;
  baseUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrcaRecording {
  id: string;
  name: string;
  description?: string;
  applicationId: string;
  status: RecordingStatus;
  actions: OrcaAction[];
  createdAt: string;
  updatedAt: string;
}

export interface OrcaAction {
  id: string;
  recordingId: string;
  type: ActionType;
  target: ActionTarget;
  data: ActionData;
  timestamp: number;
  screenshot?: string;
}

export interface ActionTarget {
  selector: string;
  xpath?: string;
  text?: string;
  tagName: string;
  attributes: Record<string, string>;
}

export interface ActionData {
  value?: string;
  coordinates?: { x: number; y: number };
  keyCode?: string;
  button?: number;
  scrollPosition?: { x: number; y: number };
  [key: string]: any;
}

export enum ActionType {
  CLICK = 'click',
  TYPE = 'type',
  SCROLL = 'scroll',
  HOVER = 'hover',
  FOCUS = 'focus',
  BLUR = 'blur',
  CHANGE = 'change',
  SUBMIT = 'submit',
  KEY_DOWN = 'keydown',
  KEY_UP = 'keyup',
  MOUSE_DOWN = 'mousedown',
  MOUSE_UP = 'mouseup',
  MOUSE_MOVE = 'mousemove',
  WHEEL = 'wheel',
  RESIZE = 'resize',
  LOAD = 'load',
  UNLOAD = 'unload',
  NAVIGATION = 'navigation',
  SCREENSHOT = 'screenshot',
  ASSERTION = 'assertion',
  WAIT = 'wait',
}

export type RecordingStatus = 'draft' | 'recording' | 'completed' | 'failed';
export type RecordingState = 'idle' | 'recording' | 'paused' | 'stopping' | 'processing';

export enum MessageType {
  START_RECORDING = 'START_RECORDING',
  STOP_RECORDING = 'STOP_RECORDING',
  PAUSE_RECORDING = 'PAUSE_RECORDING',
  RESUME_RECORDING = 'RESUME_RECORDING',
  GET_STATUS = 'GET_STATUS',
  UPDATE_STATUS = 'UPDATE_STATUS',
  RECORD_ACTION = 'RECORD_ACTION',
  GET_APPLICATIONS = 'GET_APPLICATIONS',
  CONNECT_API = 'CONNECT_API',
  DISCONNECT_API = 'DISCONNECT_API',
}

export interface MessageResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface StartRecordingRequest {
  appId: string;
  recordingName: string;
  description?: string;
}

export interface RecordingStatusUpdate {
  recordingState: RecordingState;
  actionCount: number;
  currentRecording?: OrcaRecording;
  error?: string;
}

export interface ApiHealthResponse {
  status: 'healthy' | 'unhealthy';
  version: string;
  timestamp: string;
}

export interface ApiConnectionConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
}