import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginReact from 'eslint-plugin-react'
import pluginNext from '@next/eslint-plugin-next'
import pluginUnusedImports from 'eslint-plugin-unused-imports'

export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  },
  pluginJs.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    plugins: {
      react: pluginReact
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off'
    },
    settings: {
      react: {
        version: 'detect',
        runtime: 'automatic'
      }
    }
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    plugins: {
      '@next/next': pluginNext
    },
    rules: {
      ...pluginNext.configs.recommended.rules
    }
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    plugins: {
      'unused-imports': pluginUnusedImports
    },
    rules: {
      'no-unused-vars': 'off', // Disable base rule as it conflicts with unused-imports
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          ignoreRestSiblings: true
        }
      ],
      'react/prop-types': 'warn',
      'react/jsx-key': 'warn'
    }
  }
]
