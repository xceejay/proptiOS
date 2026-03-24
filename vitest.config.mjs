import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.js'],
    css: true,
    include: ['src/**/*.test.{js,jsx}', 'test/**/*.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage'
    }
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/@core'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@menu': path.resolve(__dirname, './src/@core/components/menu'),
      '@configs': path.resolve(__dirname, './src/configs'),
      '@store': path.resolve(__dirname, './src/store'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@api': path.resolve(__dirname, './src/api'),
      '@ui': path.resolve(__dirname, './src/ui'),
      '@views': path.resolve(__dirname, './src/views')
    }
  }
})
