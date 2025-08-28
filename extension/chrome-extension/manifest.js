import { defineManifest } from '@crxjs/vite-plugin';
export default defineManifest({
    manifest_version: 3,
    name: 'Orca Test Recorder',
    version: '1.0.0',
    description: 'Record browser interactions for automated testing with Orca',
    default_locale: 'en',
    permissions: [
        'activeTab',
        'storage',
        'tabs',
        'webNavigation',
        'scripting',
        'contextMenus'
    ],
    host_permissions: [
        '<all_urls>'
    ],
    background: {
        service_worker: 'background.js'
    },
    content_scripts: [
        {
            matches: ['<all_urls>'],
            js: ['content.js'],
            css: ['content.css'],
            run_at: 'document_idle',
            all_frames: true
        }
    ],
    action: {
        default_popup: 'popup.html',
        default_icon: {
            '16': 'icon-16.png',
            '32': 'icon-32.png',
            '48': 'icon-48.png',
            '128': 'icon-128.png'
        },
        default_title: 'Orca Test Recorder'
    },
    icons: {
        '16': 'icon-16.png',
        '32': 'icon-32.png',
        '48': 'icon-48.png',
        '128': 'icon-128.png'
    },
    web_accessible_resources: [
        {
            resources: ['injected.js'],
            matches: ['<all_urls>']
        }
    ]
});
