import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [VitePWA({
    registerType: 'prompt',
    includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png'],
    manifest: {
      id: '/', name: 'ARAGON-FGR · Calculadora', short_name: 'ARAGON-FGR',
      description: 'Calculadora de investigación del score ARAGON-FGR',
      lang: 'es', start_url: '/', scope: '/', display: 'standalone',
      background_color: '#f7f4fa', theme_color: '#f5f2f8',
      icons: [{src:'/icon-192.png',sizes:'192x192',type:'image/png'}, {src:'/icon-512.png',sizes:'512x512',type:'image/png',purpose:'any maskable'}],
    },
    workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'], cleanupOutdatedCaches: true, navigateFallback: 'index.html' },
  })],
});
