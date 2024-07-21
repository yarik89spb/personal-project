import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // Use 'jsdom' for browser environment
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
});