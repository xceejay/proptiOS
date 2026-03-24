import fs from 'node:fs'
import path from 'node:path'
import { removePropertyById } from 'src/ui/property/propertyManageModel'

describe('propertyManageModel', () => {
  it('removes the deleted property from the current rows', () => {
    expect(
      removePropertyById(
        [
          { id: 1, name: 'A' },
          { id: 2, name: 'B' }
        ],
        2
      )
    ).toEqual([{ id: 1, name: 'A' }])
  })

  it('keeps the delete table action wired to toast and the context delete method', () => {
    const source = fs.readFileSync(
      path.resolve(process.cwd(), 'src/ui/property/PropertyManageTable.js'),
      'utf8'
    )

    expect(source).toContain("import toast from 'react-hot-toast'")
    expect(source).toContain('deleteProperties={properties.deleteProperties}')
    expect(source).toContain("toast.success('Property deleted successfully')")
    expect(source).toContain("toast.error('Error deleting property')")
  })
})
