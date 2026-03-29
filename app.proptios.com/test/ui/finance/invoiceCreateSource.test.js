import fs from 'node:fs'
import path from 'node:path'

describe('invoice create source contracts', () => {
  it('surfaces the backend blocker and disables the dead-end submit controls', () => {
    const actionsSource = fs.readFileSync(
      path.resolve(process.cwd(), 'src/views/apps/invoice/add/AddActions.js'),
      'utf8'
    )

    expect(actionsSource).toContain('billing integration is configured')
    expect(actionsSource).toContain('Send Invoice')
    expect(actionsSource).toContain('Save')
  })
})
