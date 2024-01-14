const navigation = () => {
  return [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'tabler:smart-home'
    },

    {
      title: 'Notifications',
      path: '/notifications',
      icon: 'tabler:bell'
    },
    {
      title: 'Accounting',
      path: '/accounting',
      icon: 'tabler:file-dollar'
    },
    {
      title: 'Reports',
      path: '/reports',
      icon: 'tabler:receipt'
    },
    {
      title: 'Manage Properties',
      path: '/manage-properties',
      icon: 'tabler:home-edit'
    },
    {
      title: 'Manage Tenants',
      path: '/manage-properties',
      icon: 'tabler:friends'
    }

    // {
    //   title: 'Second Page',
    //   path: '/second-page',
    //   icon: 'tabler:mail'
    // },
    // {
    //   path: '/acl',
    //   action: 'read',
    //   subject: 'acl-page',
    //   title: 'Access Control',
    //   icon: 'tabler:shield'
    // }
  ]
}

export default navigation
