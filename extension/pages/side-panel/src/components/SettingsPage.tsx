import React, { useState, useEffect } from 'react';
import { Button, Input, Label, RadioGroup, RadioGroupItem, Badge, Switch, cn, ModernNav } from '@extension/ui';
import { useStorage } from '@extension/shared';
import { exampleThemeStorage } from '@extension/storage';
import { t } from '@extension/i18n';
import { ArrowLeft, Trash2, Server, Palette, Info } from 'lucide-react';

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
      {/* Custom Header with Back Button */}
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="h-9 w-9 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-3">
              <img src={chrome.runtime.getURL('popup/logo_vertical.svg')} className="w-8 h-8" alt="Orca Logo" />
              <div>
                <h1 className="text-lg font-semibold">Settings</h1>
                <p className="text-xs text-muted-foreground">Configure your Orca experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8 max-w-4xl space-y-8">
        {/* Endpoint Configuration */}
        <section className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Server className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Endpoint Configuration</h2>
              <p className="text-sm text-muted-foreground">Configure your Orca server connection</p>
            </div>
          </div>
          
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

            <Button onClick={saveEndpoint} className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all duration-200">
              Save Endpoint Configuration
            </Button>
          </div>
        </section>

        {/* Theme Settings */}
        <section className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Appearance</h2>
              <p className="text-sm text-muted-foreground">Customize the look and feel</p>
            </div>
          </div>
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
        <section className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Info className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">About</h2>
              <p className="text-sm text-muted-foreground">Extension information and version</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-muted/50 to-muted/20 rounded-xl p-6 border">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <img src={chrome.runtime.getURL('popup/logo_vertical.svg')} className="w-12 h-12 rounded-lg" alt="Orca Logo" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold mb-1">Orca Test Recorder</h3>
                <p className="text-sm text-muted-foreground mb-3">Version 1.0.0</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Record browser interactions for automated testing with the Orca platform. 
                  Create reliable, maintainable tests that help ensure your applications work perfectly.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};