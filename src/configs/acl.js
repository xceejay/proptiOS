import { AbilityBuilder, Ability } from '@casl/ability'

export const AppAbility = Ability

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (user_type, subject) => {
  const { can, rules } = new AbilityBuilder(AppAbility)

  if (user_type === 'property_manager' || user_type === 'property_coordinator') {
    can('manage', 'all') // Full access
  } else if (user_type === 'maintenance_worker') {
    can('read', ['maintenance', 'properties', 'support']) // Maintenance can view specific pages
  } else if (user_type === 'accounting_staff') {
    can('read', ['accounting', 'support']) // Accounting can view dashboard and accounting sections
  } else if (user_type === 'vendor') {
    can('read', ['vendor', 'support']) // Vendors can view specific pages
  } else if (user_type === 'inspector') {
    can('read', ['inspections', 'support']) // Inspectors can view dashboard and inspections
  } else {
    can('read', subject) // Default rule for other roles
  }

  return rules
}

export const buildAbilityFor = (user_type, subject) => {
  return new AppAbility(defineRulesFor(user_type, subject), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object.type
  })
}

export const defaultACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
