export const filterTransactions = (
  rows = [],
  { search = '', status = '', paymentMethod = '', paymentType = '' } = {}
) => {
  const normalizedSearch = search.trim().toLowerCase()

  return rows.filter(row => {
    const matchesStatus = status ? row.status === status : true
    const matchesPaymentMethod = paymentMethod ? row.payment_method === paymentMethod : true
    const matchesPaymentType = paymentType ? row.payment_type === paymentType : true
    const matchesSearch = normalizedSearch
      ? [row.uuid, row.property_name, row.unit_name, row.tenant_name, row.payment_method].some(field =>
          (field || '').toLowerCase().includes(normalizedSearch)
        )
      : true

    return matchesStatus && matchesPaymentMethod && matchesPaymentType && matchesSearch
  })
}
