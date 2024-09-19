import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginReact from 'eslint-plugin-react'

export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: globals.browser
    },
    plugins: {
      react: pluginReact
    },
    rules: {
      // Remove unused imports
      'no-unused-vars': [
        'error',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', ignoreRestSiblings: true }
      ]
    },
    settings: {
      react: {
        version: 'detect' // Automatically detects the React version
      }
    }
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended
]
