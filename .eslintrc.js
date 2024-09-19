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
      // Add any custom React-related ESLint rules here if necessary
    },
    settings: {
      react: {
        version: 'latest' // Automatically detects the React version
      }
    }
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended
]
