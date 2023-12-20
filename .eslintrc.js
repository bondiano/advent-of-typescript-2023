// @ts-check
'use strict';

const OFF = 'off';
const ERROR = 'error';
const WARN = 'warn';

/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  root: true,
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
  },
  extends: ['plugin:prettier/recommended'],
  rules: {
    'no-console': WARN,
    'no-debugger': WARN,
    'max-len': [
      ERROR,
      120,
      4,
      {
        ignoreComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'no-implicit-coercion': ERROR,
    'no-else-return': ERROR,
    'no-duplicate-imports': [ERROR, { includeExports: true }],
    '@typescript-eslint/no-empty-function': [
      ERROR,
      {
        allow: ['arrowFunctions'],
      },
    ],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      plugins: ['@typescript-eslint/eslint-plugin'],
      extends: ['plugin:@typescript-eslint/recommended'],
      parserOptions: {
        ecmaVersion: 2022,
        project: ['tsconfig.json'],
      },
      rules: {
        '@typescript-eslint/no-explicit-any': ERROR,
        '@typescript-eslint/no-unused-vars': OFF,
        '@typescript-eslint/ban-ts-comment': OFF,
        '@typescript-eslint/ban-types': OFF,
        '@typescript-eslint/prefer-optional-chain': ERROR,
        '@typescript-eslint/no-non-null-assertion': ERROR,
      },
    },
  ],
};
