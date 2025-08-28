// Content Script for Orca Extension
import { ORCA_CONSTANTS } from '../common/constants';

class OrcaContentRecorder {
  private isRecording: boolean = false;
  private isPaused: boolean = false;
  private recordingId: string | null = null;
  private settings: any = {};
  private eventListeners: Array<{ element: Element; event: string; handler: EventListener }> = [];

  constructor() {
    this.init();
  }

  private init() {
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message);
      sendResponse({ received: true });
    });

    // Check if we should start recording (in case content script is injected after recording starts)
    this.checkRecordingStatus();
  }

  private async checkRecordingStatus() {
    try {
      const response = await chrome.runtime.sendMessage({
        type: ORCA_CONSTANTS.MESSAGES.GET_STATUS
      });
      
      if (response.success && response.recordingState === ORCA_CONSTANTS.RECORDING_STATES.RECORDING) {
        this.startRecording(response.currentRecording, response.settings);
      }
    } catch (error) {
      console.warn('Could not check recording status:', error);
    }
  }

  private handleMessage(message: any) {
    switch (message.type) {
      case ORCA_CONSTANTS.MESSAGES.START_RECORDING:
        this.startRecording(message.recordingId, message.settings);
        break;

      case ORCA_CONSTANTS.MESSAGES.STOP_RECORDING:
        this.stopRecording();
        break;

      case ORCA_CONSTANTS.MESSAGES.PAUSE_RECORDING:
        this.pauseRecording();
        break;

      case ORCA_CONSTANTS.MESSAGES.RESUME_RECORDING:
        this.resumeRecording();
        break;
    }
  }

  private startRecording(recordingId: string, settings: any) {
    if (this.isRecording) {
      console.warn('Recording already in progress');
      return;
    }

    this.isRecording = true;
    this.isPaused = false;
    this.recordingId = recordingId;
    this.settings = settings || {};

    console.log('Starting Orca recording:', recordingId);
    this.setupEventListeners();
  }

  private stopRecording() {
    if (!this.isRecording) {
      return;
    }

    console.log('Stopping Orca recording');
    this.isRecording = false;
    this.isPaused = false;
    this.recordingId = null;
    this.removeEventListeners();
  }

  private pauseRecording() {
    if (!this.isRecording) return;
    this.isPaused = true;
    console.log('Recording paused');
  }

  private resumeRecording() {
    if (!this.isRecording) return;
    this.isPaused = false;
    console.log('Recording resumed');
  }

  private setupEventListeners() {
    // Click events
    this.addEventListener('click', this.handleClick.bind(this));
    
    // Input events
    this.addEventListener('input', this.handleInput.bind(this));
    this.addEventListener('change', this.handleChange.bind(this));
    
    // Form submission
    this.addEventListener('submit', this.handleSubmit.bind(this));
    
    // Navigation events
    this.addEventListener('popstate', this.handleNavigation.bind(this));
    
    // Scroll events (throttled)
    this.addThrottledEventListener('scroll', this.handleScroll.bind(this), 1000);
    
    // Hover events (if enabled)
    if (this.settings.captureHover) {
      this.addEventListener('mouseover', this.handleHover.bind(this));
    }

    // Keyboard events for form fields
    this.addEventListener('keydown', this.handleKeydown.bind(this));
    this.addEventListener('keyup', this.handleKeyup.bind(this));
  }

  private addEventListener(event: string, handler: EventListener) {
    document.addEventListener(event, handler, true);
    this.eventListeners.push({ element: document, event, handler });
  }

  private addThrottledEventListener(event: string, handler: EventListener, delay: number) {
    let timeoutId: NodeJS.Timeout | null = null;
    const throttledHandler = (e: Event) => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        handler(e);
        timeoutId = null;
      }, delay);
    };
    
    document.addEventListener(event, throttledHandler, true);
    this.eventListeners.push({ element: document, event, handler: throttledHandler });
  }

  private removeEventListeners() {
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler, true);
    });
    this.eventListeners = [];
  }

  private shouldRecordEvent(event: Event): boolean {
    if (!this.isRecording || this.isPaused) return false;
    
    const target = event.target as Element;
    if (!target) return false;

    // Check if element should be ignored
    for (const selector of ORCA_CONSTANTS.IGNORED_SELECTORS) {
      if (target.matches(selector)) return false;
    }

    return true;
  }

  private generateSelector(element: Element): string {
    if (!this.settings.smartSelectors) {
      return this.generateBasicSelector(element);
    }

    // Try to find the best selector
    const selectors = [
      () => element.id ? `#${element.id}` : null,
      () => element.getAttribute('data-testid') ? `[data-testid="${element.getAttribute('data-testid')}"]` : null,
      () => element.getAttribute('data-test') ? `[data-test="${element.getAttribute('data-test')}"]` : null,
      () => element.getAttribute('data-cy') ? `[data-cy="${element.getAttribute('data-cy')}"]` : null,
      () => element.getAttribute('name') ? `[name="${element.getAttribute('name')}"]` : null,
      () => this.generateBasicSelector(element)
    ];

    for (const selectorFn of selectors) {
      try {
        const selector = selectorFn();
        if (selector && document.querySelectorAll(selector).length === 1) {
          return selector;
        }
      } catch (error) {
        console.warn('Error generating selector:', error);
      }
    }

    return this.generateBasicSelector(element);
  }

  private generateBasicSelector(element: Element): string {
    if (element.id) {
      return `#${element.id}`;
    }

    if (element.tagName) {
      const tag = element.tagName.toLowerCase();
      const classes = Array.from(element.classList).slice(0, 2).join('.');
      return classes ? `${tag}.${classes}` : tag;
    }

    return 'body';
  }

  private captureAction(actionType: string, target: Element, value?: any) {
    if (!this.shouldRecordEvent({ target } as Event)) return;

    const action = {
      action_type: actionType,
      target_element: {
        selector: this.generateSelector(target),
        tag_name: target.tagName.toLowerCase(),
        text_content: target.textContent?.trim().substring(0, 100) || '',
        attributes: this.getRelevantAttributes(target)
      },
      value: value || null,
      timestamp_ms: Date.now()
    };

    // Send action to background script
    chrome.runtime.sendMessage({
      type: ORCA_CONSTANTS.MESSAGES.ACTION_CAPTURED,
      ...action
    }).catch(error => {
      console.warn('Failed to send action:', error);
    });
  }

  private getRelevantAttributes(element: Element): Record<string, string> {
    const relevantAttrs = ORCA_CONSTANTS.SELECTOR_ATTRIBUTES;
    const attributes: Record<string, string> = {};

    relevantAttrs.forEach(attr => {
      const value = element.getAttribute(attr);
      if (value) {
        attributes[attr] = value;
      }
    });

    return attributes;
  }

  private handleClick(event: Event) {
    const target = event.target as Element;
    if (!target) return;

    this.captureAction(ORCA_CONSTANTS.ACTION_TYPES.CLICK, target);
  }

  private handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target) return;

    this.captureAction(ORCA_CONSTANTS.ACTION_TYPES.INPUT, target, target.value);
  }

  private handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target) return;

    this.captureAction(ORCA_CONSTANTS.ACTION_TYPES.CHANGE, target, target.value);
  }

  private handleSubmit(event: Event) {
    const target = event.target as HTMLFormElement;
    if (!target) return;

    this.captureAction(ORCA_CONSTANTS.ACTION_TYPES.SUBMIT, target);
  }

  private handleNavigation(event: Event) {
    this.captureAction(ORCA_CONSTANTS.ACTION_TYPES.NAVIGATION, document.body, window.location.href);
  }

  private handleScroll(event: Event) {
    this.captureAction(ORCA_CONSTANTS.ACTION_TYPES.SCROLL, document.body, {
      scrollX: window.scrollX,
      scrollY: window.scrollY
    });
  }

  private handleHover(event: Event) {
    const target = event.target as Element;
    if (!target) return;

    this.captureAction(ORCA_CONSTANTS.ACTION_TYPES.HOVER, target);
  }

  private handleKeydown(event: KeyboardEvent) {
    const target = event.target as Element;
    if (!target || !(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;

    this.captureAction(ORCA_CONSTANTS.ACTION_TYPES.KEYDOWN, target, {
      key: event.key,
      code: event.code,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey
    });
  }

  private handleKeyup(event: KeyboardEvent) {
    const target = event.target as Element;
    if (!target || !(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;

    this.captureAction(ORCA_CONSTANTS.ACTION_TYPES.KEYUP, target, {
      key: event.key,
      code: event.code
    });
  }
}

// Initialize the recorder when the content script loads
const recorder = new OrcaContentRecorder();

console.log('Orca content script loaded');
