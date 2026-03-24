import fs from 'node:fs'
import path from 'node:path'

describe('settings source contracts', () => {
  it('surfaces the backend blocker and disables the incorrect save path', () => {
    const accountSource = fs.readFileSync(
      path.resolve(process.cwd(), 'src/ui/settings/ParentSettingsAccountSettings.js'),
      'utf8'
    )
    const siteSource = fs.readFileSync(
      path.resolve(process.cwd(), 'src/ui/settings/ParentSettingsSiteSettings.js'),
      'utf8'
    )

    expect(accountSource).toContain('Save Disabled')
    expect(accountSource).toContain('posted to /users')
    expect(accountSource).not.toContain('editUsers(')
    expect(siteSource).toContain('Save Disabled')
    expect(siteSource).toContain('posted to /users')
    expect(siteSource).not.toContain('editUsers(')
  })
})
