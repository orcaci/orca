import env, { IS_DEV, IS_PROD } from '@extension/env';
import { watchPublicPlugin, watchRebuildPlugin } from '@extension/hmr';
import { watchOption } from '@extension/vite-config';
import libAssetsPlugin from '@laynezh/vite-plugin-lib-assets';
import { resolve } from 'node:path';
import { defineConfig, type PluginOption } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import makeManifestPlugin from './utils/plugins/make-manifest-plugin.js';

const rootDir = resolve(import.meta.dirname);
const srcDir = resolve(rootDir, 'src');

const outDir = resolve(rootDir, '..', 'dist');
export default defineConfig({
  define: {
    'process.env': env,
  },
  resolve: {
    alias: {
      '@root': rootDir,
      '@src': srcDir,
      '@assets': resolve(srcDir, 'assets'),
    },
  },
  plugins: [
    libAssetsPlugin({
      outputPath: outDir,
    }) as PluginOption,
    watchPublicPlugin(),
    makeManifestPlugin({ outDir }),
    IS_DEV && watchRebuildPlugin({ reload: true, id: 'chrome-extension-hmr' }),
    nodePolyfills(),
  ],
  publicDir: resolve(rootDir, 'public'),
  build: {
    outDir,
    emptyOutDir: false,
    sourcemap: IS_DEV,
    minify: IS_PROD,
    reportCompressedSize: IS_PROD,
    watch: watchOption,
    rollupOptions: {
      external: ['chrome'],
      input: {
        background: resolve(srcDir, 'background', 'index.ts'),
        popup: resolve(srcDir, 'popup', 'index.tsx'),
        content: resolve(srcDir, 'content', 'recorder.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    },
  },
});
