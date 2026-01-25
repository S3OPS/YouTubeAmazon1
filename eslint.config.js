const js = require('@eslint/js');
const prettier = require('eslint-config-prettier');

module.exports = [
    js.configs.recommended,
    prettier,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                console: 'readonly',
                process: 'readonly',
                require: 'readonly',
                module: 'readonly',
                __dirname: 'readonly',
                Buffer: 'readonly',
                setTimeout: 'readonly',
                fetch: 'readonly',
                document: 'readonly',
                window: 'readonly',
                DOMContentLoaded: 'readonly'
            }
        },
        rules: {
            'no-console': ['warn', { allow: ['error', 'warn'] }],
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'prefer-const': 'error',
            'no-var': 'error',
            'eqeqeq': ['error', 'always'],
            'curly': ['error', 'all'],
            'no-eval': 'error',
            'no-implied-eval': 'error',
            'no-new-func': 'error',
            'prefer-arrow-callback': 'warn'
        }
    },
    {
        ignores: ['node_modules/**', 'dist/**', 'build/**', '.husky/**']
    }
];
