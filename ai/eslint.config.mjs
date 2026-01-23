import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const IGNORED_PATTERNS = [
  '.next/**',
  'out/**',
  'build/**',
  'next-env.d.ts',
  'node_modules/**',
  '.turbopack/**',
  'dist/**',
]

const CUSTOM_RULES = {
  '@typescript-eslint/no-unused-vars': [
    'warn',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    },
  ],
  '@typescript-eslint/no-explicit-any': 'warn',
}

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: CUSTOM_RULES,
  },
  globalIgnores(IGNORED_PATTERNS),
])

export default eslintConfig
