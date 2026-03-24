import { render, screen } from './test-utils'

function SmokeComponent() {
  return <div>Test harness ready</div>
}

describe('test harness', () => {
  it('renders a basic component in jsdom', () => {
    render(<SmokeComponent />)

    expect(screen.getByText('Test harness ready')).toBeInTheDocument()
  })
})
