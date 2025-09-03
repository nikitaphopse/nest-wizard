import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface PersonalInfo {
  firstName: string
  lastName: string
  dateOfBirth: string
}

interface ContactInfo {
  email: string
  phone: string
}

interface LoanInfo {
  amount: number
  upfront: number
  terms: number
}

interface FinancialInfo {
  monthlySalary: number
  hasAdditionalIncome: boolean
  additionalIncome?: number
  hasMortgage: boolean
  mortgage?: number
  hasOtherCredits: boolean
  otherCredits?: number
}

interface WizardData {
  uid?: string
  personalInfo?: PersonalInfo
  contactInfo?: ContactInfo
  loanInfo?: LoanInfo
  financialInfo?: FinancialInfo
}

interface WizardStateType {
  wizardData: WizardData
  setWizardData: React.Dispatch<React.SetStateAction<WizardData>>
}

const WizardStateContext = createContext<WizardStateType | undefined>(undefined)

export const WizardStateProvider = ({ children }: { children: ReactNode }) => {
  const [wizardData, setWizardData] = useState<WizardData>({})

  return (
    <WizardStateContext.Provider value={{ wizardData, setWizardData }}>
      {children}
    </WizardStateContext.Provider>
  )
}

export const useWizardState = (): WizardStateType => {
  const context = useContext(WizardStateContext)
  if (!context) {
    throw new Error('useWizardState must be used within a WizardStateProvider')
  }
  return context
}
