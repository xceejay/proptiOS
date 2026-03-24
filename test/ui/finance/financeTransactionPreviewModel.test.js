import { normalizeTransactionPreview } from 'src/ui/finance/financeTransactionPreviewModel'

describe('financeTransactionPreviewModel', () => {
  it('normalizes flat transaction payloads for receipt and invoice previews', () => {
    expect(
      normalizeTransactionPreview({
        uuid: 'txn-123',
        payment_type: 'rent',
        amount: '1250',
        tenant_name: 'Alice',
        tenant_email: 'alice@example.com',
        property_name: 'Sunset Villas',
        unit_name: 'A1',
        created_at: '2026-03-20T12:00:00.000Z'
      })
    ).toMatchObject({
      uuid: 'txn-123',
      payment_type: 'rent',
      amount: 1250,
      total: 1250,
      currency: 'GHC',
      tenant: { name: 'Alice', email: 'alice@example.com' },
      property: { name: 'Sunset Villas' },
      unit: { name: 'A1' }
    })
  })
})
