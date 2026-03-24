import '@testing-library/jest-dom/vitest'
import React from 'react'
import { vi } from 'vitest'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }) =>
    React.createElement('a', { href: typeof href === 'string' ? href : href?.pathname || '#', ...props }, children)
}))

vi.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: vi.fn(() => Promise.resolve(true)),
    replace: vi.fn(() => Promise.resolve(true)),
    prefetch: vi.fn(() => Promise.resolve()),
    back: vi.fn()
  })
}))

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!global.ResizeObserver) {
  global.ResizeObserver = ResizeObserverMock
}

if (!window.matchMedia) {
  window.matchMedia = query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false
  })
}
