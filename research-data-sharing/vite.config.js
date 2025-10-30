import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@fhevm/sdk': new URL('../../packages/fhevm-sdk/src/index.ts', import.meta.url).pathname
    }
  },
  optimizeDeps: {
    exclude: ['@fhevm/sdk']
  }
});
