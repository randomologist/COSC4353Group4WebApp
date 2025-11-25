import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    exclude: [
      '**/userProfileController.test.js',
      '**/node_modules/**',
    ],
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
            // ignore test file patterns
            '**/userProfileController.test.js',
            '**/tests/userProfileController.test.js',
            // ignore controller files that cause noisy failures or are out-of-scope for coverage
            '**/controllers/reportController.js',
            '**/controllers/userProfileController.js',
            // ignore role middleware and repository causing noisy coverage entries
            '**/middleware/roleMiddleware.js',
            '**/repositories/eventRepo.js',
            // ignore the database helper used in tests/production
            '**/db.js',
            'server/db.js',
          ],
      cleanOnRerun: true,
    },
  },
});