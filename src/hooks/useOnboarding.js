import { useContext } from 'react'
import { OnboardingContext as OnboardingContext } from 'src/context/OnboardingContext'

export const useOnboarding = () => useContext(OnboardingContext)
