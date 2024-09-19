/**
 *  Set Dashboard URL based on User Roles
 */
const getDashboardRoute = user_type => {
  switch (user_type) {
    case 'property_manager':
    case 'property_coordinator':
      return '/dashboard' // Full access
    case 'maintenance_worker':
      return '/maintenance'
    case 'financial_staff':
      return '/financial'
    case 'vendor':
      return '/vendor'
    case 'inspector':
      return '/inspections'
    default:
      return '/login'
  }
}

export default getDashboardRoute
