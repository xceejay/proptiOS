import fs from 'node:fs'
import path from 'node:path'

describe('communication issues flow contracts', () => {
  it('keeps a create issue dialog and empty state in the real inbox flow', () => {
    const source = fs.readFileSync(
      path.resolve(process.cwd(), 'src/ui/communication/ParentCommunicationViewIssues.js'),
      'utf8'
    )

    expect(source).toContain("const [createIssueOpen, setCreateIssueOpen] = useState(false)")
    expect(source).toContain("const handleOpenCreateIssue = () => {")
    expect(source).toContain("aria-label='Create new Issue' onClick={handleOpenCreateIssue}")
    expect(source).toContain("<Dialog open={createIssueOpen} onClose={handleCloseCreateIssue} fullWidth maxWidth='sm'>")
    expect(source).toContain('No issues yet')
  })
})
