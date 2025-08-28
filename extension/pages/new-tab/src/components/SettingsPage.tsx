import React, { useState, useEffect } from 'react';
import { Button, Input, Label, RadioGroup, RadioGroupItem, Badge, Switch, cn } from '@extension/ui';
import { useStorage } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { t } from '@extension/i18n';
import { ArrowLeft, Trash2 } from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
}

interface EndpointConfig {
  name: string;
  url: string;
  type: 'local' | 'remote';
}

const DEFAULT_ENDPOINTS: EndpointConfig[] = [
  { name: 'Local Development', url: 'http://localhost:4004', type: 'local' },
  { name: 'Local Docker', url: 'http://localhost:8080', type: 'local' },
  { name: 'Production', url: 'https://orca.example.com', type: 'remote' },
];

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const [endpoints, setEndpoints] = useState<EndpointConfig[]>(DEFAULT_ENDPOINTS);
  const [selectedEndpoint, setSelectedEndpoint] = useState('');
  const [customEndpoint, setCustomEndpoint] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    // Load saved settings
    chrome.storage.local.get(['orcaEndpoint', 'orcaEndpoints'], (result) => {
      if (result.orcaEndpoints) {
        setEndpoints([...DEFAULT_ENDPOINTS, ...result.orcaEndpoints]);
      }
      if (result.orcaEndpoint) {
        const endpoint = result.orcaEndpoint;
        const predefined = [...DEFAULT_ENDPOINTS, ...(result.orcaEndpoints || [])].find(e => e.url === endpoint);
        if (predefined) {
          setSelectedEndpoint(endpoint);
          setIsCustom(false);
        } else {
          setCustomEndpoint(endpoint);
          setIsCustom(true);
        }
      }
    });
  }, []);

  const saveEndpoint = () => {
    const endpoint = isCustom ? customEndpoint : selectedEndpoint;
    chrome.storage.local.set({ orcaEndpoint: endpoint });
  };

  const addCustomEndpoint = () => {
    if (!customEndpoint.trim()) return;
    
    const newEndpoint: EndpointConfig = {
      name: `Custom (${new URL(customEndpoint).hostname})`,
      url: customEndpoint,
      type: 'remote'
    };
    
    const updatedEndpoints = [...endpoints, newEndpoint];
    setEndpoints(updatedEndpoints);
    
    const customEndpoints = updatedEndpoints.filter(e => !DEFAULT_ENDPOINTS.includes(e));
    chrome.storage.local.set({ orcaEndpoints: customEndpoints });
    
    setSelectedEndpoint(customEndpoint);
    setIsCustom(false);
    setCustomEndpoint('');
  };

  const removeEndpoint = (url: string) => {
    const updatedEndpoints = endpoints.filter(e => e.url !== url || DEFAULT_ENDPOINTS.includes(e));
    setEndpoints(updatedEndpoints);
    
    const customEndpoints = updatedEndpoints.filter(e => !DEFAULT_ENDPOINTS.includes(e));
    chrome.storage.local.set({ orcaEndpoints: customEndpoints });
    
    if (selectedEndpoint === url) {
      setSelectedEndpoint('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary border-b px-6 py-4">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        {/* Endpoint Configuration */}
        <section>
          <h2 className="text-lg font-medium mb-4">Endpoint Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <Label className="text-base mb-3 block">Select Endpoint</Label>
              <RadioGroup 
                value={isCustom ? 'custom' : selectedEndpoint}
                onValueChange={(value) => {
                  if (value === 'custom') {
                    setIsCustom(true);
                  } else {
                    setSelectedEndpoint(value);
                    setIsCustom(false);
                  }
                }}
                className="space-y-3"
              >
                {endpoints.map((endpoint) => (
                  <div key={endpoint.url} className="flex items-center space-x-3">
                    <RadioGroupItem value={endpoint.url} id={endpoint.url} />
                    <Label htmlFor={endpoint.url} className="flex-1 cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{endpoint.name}</span>
                        <Badge variant={endpoint.type === 'local' ? 'secondary' : 'default'}>
                          {endpoint.type}
                        </Badge>
                        {!DEFAULT_ENDPOINTS.includes(endpoint) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeEndpoint(endpoint.url)}
                            className="h-6 w-6 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">{endpoint.url}</span>
                    </Label>
                  </div>
                ))}
                
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom" className="cursor-pointer font-medium">
                    Custom Endpoint
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {isCustom && (
              <div className="ml-6 space-y-2">
                <div className="flex space-x-2">
                  <Input
                    type="url"
                    value={customEndpoint}
                    onChange={(e) => setCustomEndpoint(e.target.value)}
                    placeholder="https://your-custom-endpoint.com"
                    className="flex-1"
                  />
                  <Button
                    onClick={addCustomEndpoint}
                    disabled={!customEndpoint.trim()}
                    variant="outline"
                  >
                    Add
                  </Button>
                </div>
              </div>
            )}

            <Button onClick={saveEndpoint} className="w-full">
              Save Endpoint Configuration
            </Button>
          </div>
        </section>

        {/* Theme Settings */}
        <section>
          <h2 className="text-lg font-medium mb-4">Appearance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-base">Theme</Label>
                <p className="text-sm text-muted-foreground">Choose between light and dark mode</p>
              </div>
              <Switch 
                checked={!useStorage(exampleThemeStorage).isLight}
                onCheckedChange={exampleThemeStorage.toggle}
              />
            </div>
          </div>
        </section>

        {/* About */}
        <section>
          <h2 className="text-lg font-medium mb-4">About</h2>
          <div className="bg-secondary rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <img src={chrome.runtime.getURL('popup/logo_vertical.svg')} className="w-8 h-8" alt="Orca Logo" />
              <div>
                <h3 className="text-sm font-semibold">Orca Test Recorder</h3>
                <p className="text-xs text-muted-foreground">Version 1.0.0</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Record browser interactions for automated testing with the Orca platform.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};