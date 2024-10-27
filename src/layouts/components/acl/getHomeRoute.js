/**
 *  Set Dashboard URL based on User Roles
 */
const getDashboardRoute = user_type => {
  switch (user_type) {
    case 'property_manager':
    case 'property_coordinator':
    case 'property_owner':
      return '/dashboard' // Full access
    case 'maintenance_worker':
      return '/properties'
    case 'finance_staff':
      return '/finance'
    case 'vendor':
      return '/vendor'
    case 'inspector':
      return '/inspections'
    default:
      return '/login'
  }
}

export default getDashboardRoute
