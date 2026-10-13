import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import { defineConfig, globalIgnores } from 'eslint/config';

// The demo runs on invented data only. These imports would reach Supabase,
// so lint fails if anything under the demo uses them.
const demoOnlyLocalData = {
  files: ['app/demo/**', 'features/demo/**'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@supabase/*', '@/lib/supabase/*'],
            message: 'The demo never talks to Supabase.',
          },
          {
            group: [
              '@/features/*/queries',
              '@/features/*/actions',
              '@/features/auth/guard',
            ],
            message:
              'The demo uses local data. Pass mock data to the display component instead.',
          },
        ],
      },
    ],
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  demoOnlyLocalData,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
