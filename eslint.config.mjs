import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginReact from 'eslint-plugin-react'
import pluginNext from '@next/eslint-plugin-next' // Import the Next.js ESLint plugin

export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: globals.browser
    },
    plugins: {
      react: pluginReact,
      next: pluginNext // Include the Next.js plugin
    },
    rules: {
      // Remove unused imports
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          ignoreRestSiblings: true
        }
      ],
      'react-in-jsx-scope': 'off' // React 17+ doesn't require React in scope
    },
    settings: {
      react: {
        version: 'detect' // Automatically detects React version
      }
    }
  },
  pluginJs.configs.recommended, // Recommended JavaScript config
  pluginReact.configs.flat.recommended, // Recommended React config
  pluginNext.configs.core // Next.js core rules
]
