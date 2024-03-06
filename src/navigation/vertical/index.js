const navigation = () => {
  return [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'tabler:smart-home'
    },

    {
      title: 'Tenants',
      icon: 'tabler:friends',
      path: '/tenants'

      // children: [
      // {
      //   title: 'Tenant Quick Setup',
      //   path: '/tenants/quick-setup'
      // },
      // {
      //   title: 'Manage Tenants',
      //   path: '/tenants/manage'

      // children: [{}]
      // }

      // {
      //   title: 'Tenant Search',
      //   path: '/tenants/search',
      //   badgeContent: ''
      // },
      // ]
    },

    {
      title: 'Properties',
      path: '/properties',
      icon: 'tabler:home-edit'

      // children: [
      // {
      //   title: 'Property Quick Setup',
      //   path: '/properties/quick-setup'
      // },
      // {
      //   title: 'Manage properties',
      //   path: '/properties/manage'
      // }

      // {
      //   title: 'Property Search',
      //   path: '/properties/search',
      //   badgeContent: ''
      // }
      // ]
    },

    // {
    // title: 'Notifications',
    // path: '/notifications',
    //
    // icon: 'tabler:bell',
    // badgeContent: '3',
    // badgeColor: 'success'
    // },
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

    // {
    //   title: 'Second Page',
    //   path: '/second-page',
    //   icon: 'tabler:mail'
    // },
    // {
    // path: '/acl',
    // action: 'read',
    // subject: 'acl-page',
    // title: 'Access Control',
    // icon: 'tabler:shield'
    // },
    {
      title: 'Communication',
      path: '/communication',
      icon: 'tabler:brand-telegram',
      badgeContent: '3',
      badgeColor: 'success'
    },

    {
      title: 'Support',
      path: '/support',
      icon: 'tabler:help',

      // badgeContent: '3',
      badgeColor: 'success'
    }
  ]
}

export default navigation
