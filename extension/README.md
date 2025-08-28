# Orca Browser Extension

A Chrome/Firefox browser extension for recording user interactions and sending them to the local Orca API for test automation.

## Features

- **Action Recording**: Captures clicks, inputs, form submissions, navigation, and more
- **Smart Element Selection**: Generates reliable CSS selectors and XPath expressions
- **Real-time Preview**: Shows recording status with action counter and timer
- **Screenshot Capture**: Optional screenshot capture for each action
- **API Integration**: Communicates with local Orca API server
- **Settings Management**: Configurable recording options and API endpoint

## Installation

### Development Install

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `extension` folder
4. The Orca Test Recorder extension will appear in your toolbar

### Production Install

1. Build the extension package
2. Install from Chrome Web Store (when published)

## Usage

### Starting a Recording

1. Make sure the Orca API server is running locally (default: `http://localhost:8080`)
2. Click the Orca extension icon in your browser toolbar
3. Select an application from the dropdown (create one in Orca first)
4. Optionally enter a recording name
5. Click "Start Recording"

### During Recording

- The extension will show a red recording indicator in the top-right corner
- All your interactions (clicks, typing, navigation) are automatically captured
- The action counter shows how many actions have been recorded
- Use "Pause" to temporarily stop recording, "Resume" to continue

### Stopping a Recording

1. Click the extension icon
2. Click "Stop Recording"
3. The recorded actions will be saved to the Orca API
4. You can view and convert them to action groups in the main Orca application

## Configuration

### Server Settings

- **API URL**: Configure the Orca API server URL (default: http://localhost:8080)
- **Test Connection**: Verify connection to the API server

### Recording Settings

- **Capture Screenshots**: Include screenshots with each action (increases data size)
- **Record Hover Actions**: Capture mouse hover events
- **Generate Smart Selectors**: Create multiple selector strategies for reliability

## Technical Details

### Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Popup UI      │    │  Background      │    │  Content Script │
│                 │◄──►│  Service Worker  │◄──►│   (Recorder)    │
│ - Start/Stop    │    │                  │    │                 │
│ - Settings      │    │ - API Comm       │    │ - Event Capture │
│ - Status        │    │ - State Mgmt     │    │ - DOM Analysis  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Orca API      │
                       │                 │
                       │ - Recordings    │
                       │ - Actions       │
                       │ - Applications  │
                       └─────────────────┘
```

### File Structure

```
extension/
├── manifest.json              # Extension manifest (Manifest V3)
├── src/
│   ├── popup/
│   │   ├── popup.html        # Extension popup UI
│   │   ├── popup.css         # Popup styling
│   │   └── popup.js          # Popup logic and controls
│   ├── background/
│   │   └── service-worker.js # Background script for state management
│   ├── content/
│   │   ├── recorder.js       # Content script for action capture
│   │   └── recorder.css      # Recording overlay styles
│   ├── common/
│   │   ├── constants.js      # Shared constants and configuration
│   │   └── api.js            # API communication utilities
│   └── assets/
│       └── icons/            # Extension icons (16, 32, 48, 128)
└── README.md                 # This file
```

### Captured Actions

The extension captures the following user interactions:

- **Navigation**: Page loads, URL changes
- **Mouse Actions**: Click, double-click, right-click, hover
- **Keyboard Actions**: Key presses (special keys), text input
- **Form Actions**: Input changes, form submissions, focus/blur
- **Scroll Actions**: Page and element scrolling

### Element Selection Strategy

For each action, the extension generates multiple selector strategies:

1. **ID-based**: `#elementId` (highest priority if available)
2. **Test Attributes**: `[data-testid="value"]`, `[data-test="value"]`
3. **Name Attribute**: `[name="fieldName"]` (for form elements)
4. **CSS Path**: Full CSS selector path with nth-child
5. **XPath**: Absolute XPath expression (fallback)

### Data Format

Actions are sent to the Orca API in the following format:

```javascript
{
  recording_id: "uuid",
  sequence_number: 1,
  timestamp_ms: 1640995200000,
  action_type: "click",
  target_element: "#submit-button",
  target_attributes: {
    id: "submit-button",
    class: "btn btn-primary",
    type: "submit",
    tagName: "button"
  },
  value: null,
  viewport_x: 450,
  viewport_y: 300,
  description: "Click on submit button",
  screenshot: "base64-encoded-image" // optional
}
```

## API Endpoints Used

- `GET /health` - Check API server health
- `GET /api/v1/app` - Get available applications
- `POST /api/v1/recordings` - Create new recording
- `PUT /api/v1/recordings/:id` - Update recording
- `POST /api/v1/actions` - Save captured actions

## Browser Compatibility

- **Chrome**: Version 88+ (Manifest V3 support)
- **Firefox**: Version 89+ (with Manifest V3 compatibility)
- **Edge**: Version 88+ (Chromium-based)

## Development

### Prerequisites

- Modern web browser with extension developer tools
- Local Orca API server running
- Basic knowledge of browser extensions

### Building

The extension uses vanilla JavaScript and doesn't require a build step. Simply load the extension folder directly in Chrome's developer mode.

### Testing

1. Start the Orca API server: `cargo run --bin api`
2. Load the extension in Chrome developer mode
3. Navigate to any website
4. Start recording and interact with the page
5. Stop recording and check the Orca API for saved actions

### Debugging

- **Console Logs**: Check browser's extension console and content script console
- **Network Tab**: Monitor API requests in browser dev tools
- **Extension DevTools**: Use Chrome's extension debugging tools
- **Background Script**: Check service worker logs in chrome://extensions

## Security Considerations

- Extension only captures user interactions, not sensitive data
- API communication is over HTTP/HTTPS to localhost only
- No data is sent to external servers
- Screenshots are optional and stored locally in Orca database

## Limitations

- Works only with local Orca API server
- Content Security Policy restrictions on some sites
- Limited support for complex JavaScript interactions (SPAs)
- Screenshot capture depends on browser permissions

## Contributing

1. Fork the Orca repository
2. Create a feature branch for your extension changes
3. Test thoroughly with the main Orca application
4. Submit a pull request with detailed description

## License

Same as the main Orca project license.