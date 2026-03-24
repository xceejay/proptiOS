const emptyParty = {
  name: '',
  email: '',
  tel_number: ''
}

const emptyProperty = {
  name: ''
}

const emptyUnit = {
  name: ''
}

const toDisplayDate = value => {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString()
}

const toAmount = value => {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)

    return Number.isNaN(parsed) ? value : parsed
  }

  return 0
}

export const normalizeTransactionPreview = transaction => {
  if (!transaction) {
    return null
  }

  const amount = toAmount(transaction.amount ?? transaction.total ?? transaction.total_paid)
  const total = toAmount(transaction.total ?? transaction.total_paid ?? transaction.amount)

  return {
    ...transaction,
    id: transaction.id ?? transaction.uuid ?? '',
    uuid: transaction.uuid ?? transaction.id ?? '',
    payment_type: transaction.payment_type ?? transaction.type ?? '',
    amount,
    total,
    currency: transaction.currency ?? transaction.currency_code ?? 'GHC',
    issuedDate: transaction.issuedDate ?? transaction.created_at ?? transaction.payment_date ?? '',
    issuedDateLabel: toDisplayDate(transaction.issuedDate ?? transaction.created_at ?? transaction.payment_date),
    tenant: transaction.tenant ?? {
      ...emptyParty,
      name: transaction.tenant_name ?? '',
      email: transaction.tenant_email ?? '',
      tel_number: transaction.tenant_phone ?? transaction.tenant_tel_number ?? ''
    },
    property: transaction.property ?? {
      ...emptyProperty,
      name: transaction.property_name ?? transaction.property?.property_name ?? ''
    },
    unit: transaction.unit ?? {
      ...emptyUnit,
      name: transaction.unit_name ?? transaction.unit?.unit_name ?? ''
    }
  }
}
