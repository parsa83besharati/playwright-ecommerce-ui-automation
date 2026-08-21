import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import playwright from 'eslint-plugin-playwright';

export default [
  // Base config for TypeScript files in tests folder only
  {
    files: ['tests/**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      // ============ TypeScript Rules ============
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-inferrable-types': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
        },
      ],

      // ============ General Rules ============
      'no-console': [
        'error',
        {
          allow: ['error', 'warn', 'info'],
        },
      ],
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
    },
  },

  // Playwright-specific rules for test files only
  {
    files: [
      'tests/**/*.spec.ts',
      'tests/**/*.test.ts',
      'tests/api-bdd/**/*.ts',
      'tests/ui/**/*.ts',
    ],
    plugins: {
      playwright: playwright,
    },
    rules: {
      // ============ Critical Playwright Rules ============
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-force-option': 'error',
      'playwright/missing-playwright-await': 'error',
      'playwright/no-conditional-in-test': 'error',
      'playwright/no-standalone-expect': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/no-skipped-test': 'warn',
      'playwright/valid-expect': 'error',

      // ============ Best Practice Rules ============
      'playwright/prefer-web-first-assertions': 'error',
      'playwright/prefer-to-be': 'error',
      'playwright/prefer-to-have-length': 'error',
      'playwright/prefer-to-have-count': 'warn',
      'playwright/require-to-throw-message': 'warn',
      'playwright/max-nested-describe': ['warn', { max: 3 }],
    },
  },

  // Page object files (less strict)
  {
    files: ['tests/pages/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'playwright/no-force-option': 'off',
    },
  },

  // Ignore everything else
  {
    ignores: [
      'node_modules/',
      'dist/',
      'playwright-report/',
      'test-results/',
      'logs/',
      'coverage/',
      'utils/',
      'fixtures.ts',
      'playwright.config.ts',
      'eslint.config.mjs',
      '*.config.js',
      '*.config.ts',
    ],
  },
];
