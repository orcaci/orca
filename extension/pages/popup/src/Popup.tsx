import '@src/Popup.css';
import { t } from '@extension/i18n';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { Button, ErrorDisplay, LoadingSpinner, cn } from '@extension/ui';
import { ExternalLink } from 'lucide-react';

const Popup = () => {
  const { isLight } = useStorage(exampleThemeStorage);
  const logo = isLight ? 'popup/logo_vertical.svg' : 'popup/logo_vertical_dark.svg';

  const openSidePanel = () => {
    chrome.sidePanel?.open({ windowId: chrome.windows.WINDOW_ID_CURRENT });
    window.close();
  };

  return (
    <div className="w-80 h-96 bg-background">
      <div className="p-6 text-center">
        <img src={chrome.runtime.getURL(logo)} className="w-16 h-16 mx-auto mb-4" alt="Orca Logo" />
        <h2 className="text-xl font-semibold mb-2">
          Orca Test Recorder
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Use the side panel for the full experience
        </p>
        <Button onClick={openSidePanel} className="w-full" size="lg">
          <ExternalLink className="w-4 h-4 mr-2" />
          Open Side Panel
        </Button>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <LoadingSpinner />), ErrorDisplay);
