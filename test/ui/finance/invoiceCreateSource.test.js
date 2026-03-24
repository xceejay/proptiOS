import fs from 'node:fs'
import path from 'node:path'

describe('invoice create source contracts', () => {
  it('surfaces the backend blocker and disables the dead-end submit controls', () => {
    const actionsSource = fs.readFileSync(
      path.resolve(process.cwd(), 'src/views/apps/invoice/add/AddActions.js'),
      'utf8'
    )

    expect(actionsSource).toContain('Invoice creation is backend-blocked')
    expect(actionsSource).toContain('Send Disabled')
    expect(actionsSource).toContain('Save Disabled')
  })
})
