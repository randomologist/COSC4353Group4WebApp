import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: { 
      provider: 'v8', 
      reporter: ['text', 'html', 'lcov'], 

      all: true,
      include: [
        '**/*.js',            
      ],

    
      exclude: [
        '**/node_modules/**',
        '**/tests/**',
        '**/*.test.*',
        'vitest.config.*',

        // Exclude client for testing
        '../client/**',

        // userStore seems obsolete for now
        'data/userStore.js',
        'middleware/roleMiddleware.js', // Potentially add back in later
      ],

      cleanOnRerun: true,
    },
  },
});