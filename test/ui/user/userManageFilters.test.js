import { filterUsers } from 'src/ui/user/userManageFilters'

const users = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    status: 'active',
    invitation_status: 'pending'
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    status: 'disabled',
    invitation_status: 'accepted'
  }
]

describe('userManageFilters', () => {
  it('matches quick search against name', () => {
    expect(filterUsers({ users, search: 'alice' })).toEqual([users[0]])
  })

  it('matches quick search against email', () => {
    expect(filterUsers({ users, search: 'bob@example.com' })).toEqual([users[1]])
  })

  it('combines account and invitation filters', () => {
    expect(
      filterUsers({
        users,
        search: 'bob',
        status: 'disabled',
        invitationStatus: 'accepted'
      })
    ).toEqual([users[1]])
  })
})
