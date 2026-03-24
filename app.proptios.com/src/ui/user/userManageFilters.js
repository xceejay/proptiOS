export const filterUsers = ({ users = [], search = '', status = '', invitationStatus = '' }) => {
  const normalizedValue = search.trim().toLowerCase()

  return users.filter(row => {
    const matchesStatus = status ? row.status === status : true
    const matchesInvitationStatus = invitationStatus ? row.invitation_status === invitationStatus : true
    const matchesSearch = normalizedValue
      ? [row.name, row.email].some(field => (field?.toLowerCase() || '').includes(normalizedValue))
      : true

    return matchesStatus && matchesInvitationStatus && matchesSearch
  })
}
