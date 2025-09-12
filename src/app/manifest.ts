import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'TrueMailer - Email Validation API',
        short_name: 'TrueMailer',
        description: 'Professional email validation API with real-time disposable email detection. Validate emails, detect spam domains, and ensure email deliverability.',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#f5f5dc',
        orientation: 'portrait-primary',
        categories: ['productivity', 'developer', 'utilities'],
        lang: 'en',
        dir: 'ltr',
        icons: [
            {
                src: '/icons/icon-72x72.png',
                sizes: '72x72',
                type: 'image/png',
                purpose: 'maskable any'
            },
            {
                src: '/icons/icon-96x96.png',
                sizes: '96x96',
                type: 'image/png',
                purpose: 'maskable any'
            },
            {
                src: '/icons/icon-128x128.png',
                sizes: '128x128',
                type: 'image/png',
                purpose: 'maskable any'
            },
            {
                src: '/icons/icon-144x144.png',
                sizes: '144x144',
                type: 'image/png',
                purpose: 'maskable any'
            },
            {
                src: '/icons/icon-152x152.png',
                sizes: '152x152',
                type: 'image/png',
                purpose: 'maskable any'
            },
            {
                src: '/icons/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable any'
            },
            {
                src: '/icons/icon-384x384.png',
                sizes: '384x384',
                type: 'image/png',
                purpose: 'maskable any'
            },
            {
                src: '/icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable any'
            }
        ],
        screenshots: [
            {
                src: '/screenshots/desktop-home.png',
                sizes: '1280x720',
                type: 'image/png',
                form_factor: 'wide',
                label: 'TrueMailer Homepage'
            },
            {
                src: '/screenshots/mobile-playground.png',
                sizes: '390x844',
                type: 'image/png',
                form_factor: 'narrow',
                label: 'Email Validation Playground'
            }
        ],
        shortcuts: [
            {
                name: 'Validate Email',
                short_name: 'Validate',
                description: 'Quickly validate an email address',
                url: '/playground',
                icons: [{ src: '/icons/shortcut-validate.png', sizes: '96x96' }]
            },
            {
                name: 'API Documentation',
                short_name: 'API Docs',
                description: 'View API documentation and examples',
                url: '/#quick-integration',
                icons: [{ src: '/icons/shortcut-docs.png', sizes: '96x96' }]
            }
        ]
    }
}