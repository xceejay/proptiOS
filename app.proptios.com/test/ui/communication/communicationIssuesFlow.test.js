import fs from 'node:fs'
import path from 'node:path'

describe('communication issues flow contracts', () => {
  it('creates issues by updating issue state and selecting the new issue', () => {
    const source = fs.readFileSync(
      path.resolve(process.cwd(), 'src/ui/communication/ParentCommunicationViewIssues.js'),
      'utf8'
    )

    expect(source).toContain('setIssues(prevIssues => [nextIssue, ...prevIssues])')
    expect(source).toContain('setSelectedIssue(nextIssueId)')
    expect(source).toContain('handleCloseCreateIssue()')
  })
})
