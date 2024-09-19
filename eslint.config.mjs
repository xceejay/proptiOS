import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginReact from 'eslint-plugin-react'
import pluginNext from '@next/eslint-plugin-next'

export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    languageOptions: {
      globals: globals.browser
    },
    plugins: {
      react: pluginReact,
      next: pluginNext
    },
    rules: {
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          ignoreRestSiblings: true
        }
      ],
      'react-in-jsx-scope': 'off'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    ...pluginJs.configs.recommended,
    ...pluginReact.configs.flat.recommended,
    ...pluginNext.configs.recommended
  }
]
