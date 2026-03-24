import { filterTransactions } from 'src/ui/finance/financeTableFilters'

const rows = [
  {
    uuid: 'txn-1',
    property_name: 'Sunset Villas',
    unit_name: 'A1',
    tenant_name: 'Alice',
    payment_method: 'mobile_money',
    payment_type: 'rent',
    status: 'completed'
  },
  {
    uuid: 'txn-2',
    property_name: 'Palm Court',
    unit_name: 'B2',
    tenant_name: 'Bob',
    payment_method: 'bank_transfer',
    payment_type: 'maintenance_and_repairs',
    status: 'pending'
  }
]

describe('financeTableFilters', () => {
  it('matches quick search across visible finance fields', () => {
    expect(filterTransactions(rows, { search: 'alice' })).toEqual([rows[0]])
    expect(filterTransactions(rows, { search: 'bank_transfer' })).toEqual([rows[1]])
  })

  it('combines quick search with status and payment filters', () => {
    expect(
      filterTransactions(rows, {
        search: 'palm',
        status: 'pending',
        paymentMethod: 'bank_transfer',
        paymentType: 'maintenance_and_repairs'
      })
    ).toEqual([rows[1]])
  })
})
