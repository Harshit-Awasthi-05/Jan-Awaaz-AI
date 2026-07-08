VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    clientsClaim: true,
    skipWaiting: true,
  },
  includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'masked-icon.svg'],
  manifest: {
    name: 'Jan Awaaz AI',
    short_name: 'Jan Awaaz',
    description: 'AI-powered citizen grievance platform',
    theme_color: '#863bff',
    background_color: '#ffffff',
    display: 'standalone',
    icons: [
      {
        src: 'favicon.svg',
        sizes: '192x192 512x512',
        type: 'image/svg+xml',
        purpose: 'any maskable'
      }
    ]
  }
})