import { store } from 'src/store'

describe('store bootstrap', () => {
  it('creates a Redux store with the app slice registered', () => {
    const state = store.getState()

    expect(state).toHaveProperty('app')
    expect(state.app).toEqual({})
  })
})
