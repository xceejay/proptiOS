import fs from 'node:fs'
import path from 'node:path'

describe('ParentCommunicationViewIssues source contracts', () => {
  it('wires the create issue button to open a dialog instead of being a no-op', () => {
    const source = fs.readFileSync(
      path.resolve(process.cwd(), 'src/ui/communication/ParentCommunicationViewIssues.js'),
      'utf8'
    )

    expect(source).toContain("const [createIssueOpen, setCreateIssueOpen] = useState(false)")
    expect(source).toContain("const handleOpenCreateIssue = () => {")
    expect(source).toContain("aria-label='Create new Issue' onClick={handleOpenCreateIssue}")
    expect(source).toContain("<Dialog open={createIssueOpen} onClose={handleCloseCreateIssue} fullWidth maxWidth='sm'>")
  })
})
