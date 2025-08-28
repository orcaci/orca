# Orca Chrome Extension Architecture

## Overview
This document outlines the improved architecture for the Orca Chrome Extension built on the modern React + Vite + TypeScript boilerplate.

## Project Structure

```
orca-extension/
├── chrome-extension/          # Core extension configuration
│   ├── manifest.ts           # Manifest V3 configuration
│   ├── src/background/       # Service worker for API communication
│   └── public/               # Static assets and icons
├── pages/                    # Extension UI pages
│   ├── popup/               # Main recording control interface
│   ├── options/             # Settings and configuration
│   ├── side-panel/          # Recording history and status
│   ├── content/             # Content scripts for action capture
│   ├── content-ui/          # Recording overlay UI
│   └── devtools-panel/      # Developer tools integration
├── packages/                # Shared utilities and libraries
│   ├── orca-api/           # Orca API client and types
│   ├── orca-recorder/      # Recording logic and utilities
│   ├── orca-storage/       # Extension storage management
│   ├── orca-ui/            # Shared UI components
│   └── orca-constants/     # Shared constants and types
└── tests/                  # End-to-end testing
```

## Component Breakdown

### 1. Popup (`pages/popup/`)
**Purpose**: Main user interface for recording control
**Components**:
- `RecordingControls.tsx` - Start/stop/pause controls
- `ApplicationSelector.tsx` - Select Orca application
- `RecordingSettings.tsx` - Quick settings toggle
- `ConnectionStatus.tsx` - API connection indicator
- `ActionCounter.tsx` - Live action count display

### 2. Content Scripts (`pages/content/`, `pages/content-ui/`)
**Purpose**: Capture user actions and provide visual feedback
**Components**:
- `ActionRecorder.ts` - Main action capture logic
- `ElementSelector.ts` - Smart element targeting
- `RecordingOverlay.tsx` - Visual recording indicator
- `ActionPreview.tsx` - Live action preview

### 3. Background Service (`chrome-extension/src/background/`)
**Purpose**: API communication and state management
**Components**:
- `OrcaAPIService.ts` - API client wrapper
- `RecordingManager.ts` - Recording session management
- `StorageManager.ts` - Extension data persistence
- `ContextMenuManager.ts` - Right-click menu integration

### 4. Options Page (`pages/options/`)
**Purpose**: Extension configuration and settings
**Components**:
- `APISettings.tsx` - Server URL and connection config
- `RecordingPreferences.tsx` - Recording behavior settings
- `ExportOptions.tsx` - Data export and backup
- `AdvancedSettings.tsx` - Developer options

### 5. Side Panel (`pages/side-panel/`)
**Purpose**: Recording history and session management
**Components**:
- `RecordingHistory.tsx` - List of recent recordings
- `SessionDetails.tsx` - Current session information
- `ActionList.tsx` - Live action feed
- `QuickActions.tsx` - Common recording tasks

### 6. DevTools Panel (`pages/devtools-panel/`)
**Purpose**: Developer debugging and analysis
**Components**:
- `DebugConsole.tsx` - Extension logging and errors
- `APIInspector.tsx` - API request/response viewer
- `ActionAnalyzer.tsx` - Action quality analysis
- `PerformanceMonitor.tsx` - Recording performance metrics

## Shared Packages

### `packages/orca-api/`
- API client with TypeScript types
- Endpoint definitions and request builders
- Error handling and retry logic
- Response caching and optimization

### `packages/orca-recorder/`
- Action capture utilities
- Element selection strategies
- Screenshot and DOM analysis
- Recording validation and cleanup

### `packages/orca-storage/`
- Chrome storage API wrappers
- Data serialization/deserialization
- Settings management
- Recording session persistence

### `packages/orca-ui/`
- Shared React components
- Orca design system components
- Icons and visual assets
- Theme and styling utilities

### `packages/orca-constants/`
- API endpoints and configuration
- Action types and constants
- Error codes and messages
- Default settings and limits

## Development Features

### Modern Development Experience
- **Hot Module Replacement**: Instant updates during development
- **TypeScript**: Full type safety across all components
- **Turborepo**: Fast, optimized builds and caching
- **Testing**: Comprehensive E2E testing with WebDriverIO
- **Linting**: ESLint + Prettier for code quality
- **i18n**: Multi-language support ready

### Extension-Specific Enhancements
- **Mock API Mode**: Development without Orca server
- **Debug Panel**: Built-in debugging tools
- **Action Validation**: Real-time recording quality checks
- **Performance Monitoring**: Extension performance tracking
- **Error Boundaries**: Graceful error handling in UI

## Build & Deployment

### Development Commands
```bash
pnpm dev              # Development build for Chrome
pnpm dev:firefox      # Development build for Firefox
pnpm build            # Production build for Chrome
pnpm build:firefox    # Production build for Firefox
pnpm test:e2e         # Run end-to-end tests
pnpm lint             # Code quality checks
```

### Feature Flags
- `ENABLE_MOCK_API`: Use mock API for development
- `ENABLE_DEBUG_PANEL`: Show debug features in UI
- `ENABLE_PERFORMANCE_MONITOR`: Track performance metrics
- `ENABLE_ADVANCED_SELECTORS`: Use experimental selectors

## Integration Points

### Orca API Integration
- `/health` - Connection testing
- `/api/v1/app` - Application management
- `/api/v1/recordings` - Recording CRUD operations
- `/api/v1/actions` - Action batch uploads

### Browser APIs
- `chrome.runtime` - Extension messaging
- `chrome.storage` - Settings persistence
- `chrome.tabs` - Tab management and injection
- `chrome.contextMenus` - Right-click integration
- `chrome.scripting` - Content script injection

## Security & Privacy

### Data Handling
- No external data transmission (localhost only)
- Encrypted storage for sensitive settings
- User consent for screenshot capture
- Minimal permission requirements

### Content Security Policy
- Strict CSP for all extension pages
- Sanitized DOM interaction
- Safe API communication patterns
- XSS prevention measures

## Future Enhancements

### Planned Features
- **Visual Recording Editor**: Edit recordings in browser
- **AI-Powered Selectors**: Smart element targeting
- **Recording Templates**: Pre-configured recording patterns
- **Team Collaboration**: Share recordings between developers
- **Analytics Dashboard**: Recording usage and quality metrics

### Technical Improvements
- WebAssembly for performance-critical operations
- IndexedDB for large recording datasets
- Service Worker caching strategies
- Progressive Web App features for options page