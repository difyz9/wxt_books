import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  outDir: 'dist',
  manifest: {
    name: 'Bilibili Subtitle Downloader',
    description: 'Download Bilibili video subtitles in multiple formats (SRT, VTT, TXT, JSON)',
    permissions: [
      'activeTab',
      'scripting',
    ],
    host_permissions: [
      '*://www.bilibili.com/*',
      '*://api.bilibili.com/*',
    ],
    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self';"
    }
  },
});
