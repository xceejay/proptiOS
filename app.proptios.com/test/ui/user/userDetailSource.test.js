import fs from 'node:fs'
import path from 'node:path'

describe('user detail source contracts', () => {
  it('renders an explicit transactions error state instead of crashing on missing user data', () => {
    const transactionsSource = fs.readFileSync(
      path.resolve(process.cwd(), 'src/ui/user/UserViewTransactions.js'),
      'utf8'
    )
    const rightPanelSource = fs.readFileSync(
      path.resolve(process.cwd(), 'src/ui/user/UserViewRight.js'),
      'utf8'
    )

    expect(transactionsSource).toContain("User details could not be loaded, so transactions are unavailable for this route.")
    expect(transactionsSource).toContain('userData.transactions || []')
    expect(rightPanelSource).toContain('if (userData || id)')
  })
})
