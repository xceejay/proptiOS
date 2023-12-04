/**
 *  Set Dashboard URL based on User Roles
 */
const getDashboardRoute = role => {
  if (role === 'client') return '/acl'
  else return '/dashboard'
}

export default getDashboardRoute
