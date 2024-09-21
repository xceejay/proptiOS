const navigation = () => {
  return [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'tabler:smart-home',
      action: 'read', // Action for viewing
      subject: 'dashboard' // Subject linked to permissions
    },
    {
      title: 'Properties',
      path: '/properties',
      icon: 'tabler:home-edit',
      action: 'read',
      subject: 'properties'
    },
    {
      title: 'Tenants',
      icon: 'tabler:friends',
      path: '/tenants',
      action: 'read',
      subject: 'tenants'
    },
    {
      title: 'Leases',
      path: '/leases',
      icon: 'tabler:contract',
      disabled: false,
      action: 'read',
      subject: 'leases'
    },
    {
      title: 'Finance',
      path: '/finance',
      icon: 'tabler:file-dollar',
      disabled: true,
      action: 'read',
      subject: 'finance'
    },

    {
      title: 'Reports',
      path: '/reports',
      icon: 'tabler:receipt',
      action: 'read',
      disabled: true,
      subject: 'reports'
    },
    {
      title: 'User Management',
      path: '/users',
      icon: 'tabler:users',
      disabled: true,
      action: 'read',
      subject: 'users'
    },
    {
      title: 'Audit Log',
      path: '/audit',
      icon: 'tabler:eye',
      disabled: true,
      action: 'read',
      subject: 'audit'
    },
    {
      title: 'Communication',
      path: '/communication',
      icon: 'tabler:brand-telegram',
      disabled: true,
      action: 'read',
      subject: 'communication'
    },
    {
      title: 'Support',
      path: 'https://manages.homes/support',
      disabled: true,
      icon: 'tabler:help',
      action: 'read',
      subject: 'support'
    }
  ]
}

export default navigation
