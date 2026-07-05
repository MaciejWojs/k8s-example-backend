// @ts-check

import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import perfectionist from 'eslint-plugin-perfectionist';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['.dist/**']),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  stylistic.configs.recommended,
  prettier,
  {
    plugins: {
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort,
      perfectionist: perfectionist
    },
    rules: {
      '@stylistic/lines-between-class-members': [
        'error',
        'always',
        {
          exceptAfterSingleLine: false,
          exceptAfterOverload: true
        }
      ],
      '@stylistic/comma-dangle': ['error', 'never'],
      '@typescript-eslint/no-unused-vars': 'off',
      '@stylistic/template-curly-spacing': ['error', 'never'],
      'perfectionist/sort-classes': [
        'error',
        {
          groups: [
            'index-signature',
            'static-property',
            'property',
            'constructor',
            'static-method',
            'method'
          ]
          // 'partitionByNewLine': true,
        }
      ],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_'
        }
      ]
    }
  }
);
