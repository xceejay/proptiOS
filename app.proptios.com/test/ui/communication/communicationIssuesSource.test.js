import fs from 'node:fs'
import path from 'node:path'

describe('ParentCommunicationViewIssues source contracts', () => {
  it('loads issues from the communication API instead of demo fixtures', () => {
    const source = fs.readFileSync(
      path.resolve(process.cwd(), 'src/ui/communication/ParentCommunicationViewIssues.js'),
      'utf8'
    )

    expect(source).toContain('communication.getIssues(')
    expect(source).not.toContain('Loud Music Late at Night')
    expect(source).not.toContain('Trash Left in Hallway')
    expect(source).not.toContain('Broken Elevator')
  })

  it('creates issues through the communication context and no longer hardcodes Current User', () => {
    const source = fs.readFileSync(
      path.resolve(process.cwd(), 'src/ui/communication/ParentCommunicationViewIssues.js'),
      'utf8'
    )

    expect(source).toContain('communication.addIssue(')
    expect(source).toContain('communication.addIssueComment(')
    expect(source).toContain('communication.updateIssueStatus(')
    expect(source).not.toContain('Current User')
  })
})
