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
      path: '/lease',
      icon: 'tabler:contract',
      action: 'read',
      subject: 'leases'
    },
    {
      title: 'Accounting',
      path: '/accounting',
      icon: 'tabler:file-dollar',
      action: 'read',
      subject: 'accounting'
    },

    {
      title: 'Reports',
      path: '/reports',
      icon: 'tabler:receipt',
      action: 'read',
      subject: 'reports'
    },
    {
      title: 'User Management',
      path: '/user-management',
      icon: 'tabler:users',
      action: 'read',
      subject: 'user-management'
    },
    {
      title: 'Communication',
      path: '/communication',
      icon: 'tabler:brand-telegram',
      action: 'read',
      subject: 'communication'
    },
    {
      title: 'Support',
      path: 'https://manages.homes/support',
      icon: 'tabler:help',
      action: 'read',
      subject: 'support'
    }
  ]
}

export default navigation
