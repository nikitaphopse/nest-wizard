import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import axios from 'axios'
import { useWizardState } from '../states/wizard-state'

const FinancialInfo = () => {
  const router = useRouter()
  const { wizardData, setWizardData } = useWizardState()

  const [monthlySalary, setMonthlySalary] = useState(wizardData.financialInfo?.monthlySalary?.toString() || '')
  const [hasAdditionalIncome, setHasAdditionalIncome] = useState(wizardData.financialInfo?.hasAdditionalIncome || false)
  const [additionalIncome, setAdditionalIncome] = useState(wizardData.financialInfo?.additionalIncome?.toString() || '')
  const [hasMortgage, setHasMortgage] = useState(wizardData.financialInfo?.hasMortgage || false)
  const [mortgage, setMortgage] = useState(wizardData.financialInfo?.mortgage?.toString() || '')
  const [hasOtherCredits, setHasOtherCredits] = useState(wizardData.financialInfo?.hasOtherCredits || false)
  const [otherCredits, setOtherCredits] = useState(wizardData.financialInfo?.otherCredits?.toString() || '')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleNext = async () => {
    setError(null)

    // Client-side validation
    const salaryNum = parseFloat(monthlySalary)
    const additionalIncomeNum = hasAdditionalIncome ? parseFloat(additionalIncome) || 0 : 0
    const mortgageNum = hasMortgage ? parseFloat(mortgage) || 0 : 0
    const otherCreditsNum = hasOtherCredits ? parseFloat(otherCredits) || 0 : 0

    if (!monthlySalary || isNaN(salaryNum) || salaryNum <= 0) {
      setError('Monthly salary is required and must be greater than 0')
      return
    }

    if (hasAdditionalIncome && (!additionalIncome || isNaN(additionalIncomeNum) || additionalIncomeNum < 0)) {
      setError('Additional income must be a valid number >= 0')
      return
    }

    if (hasMortgage && (!mortgage || isNaN(mortgageNum) || mortgageNum < 0)) {
      setError('Mortgage amount must be a valid number >= 0')
      return
    }

    if (hasOtherCredits && (!otherCredits || isNaN(otherCreditsNum) || otherCreditsNum < 0)) {
      setError('Other credits amount must be a valid number >= 0')
      return
    }

    // Financial validation: (Monthly Salary + Additional Income - Mortgage - Other Credits) * terms * 0.5 > Loan Amount
    if (wizardData.loanInfo) {
      const netMonthlyIncome = salaryNum + additionalIncomeNum - mortgageNum - otherCreditsNum
      const requiredIncome = (wizardData.loanInfo.amount / (wizardData.loanInfo.terms * 0.5))
      
      if (netMonthlyIncome <= requiredIncome) {
        setError(
          `Insufficient income. Your net monthly income (€${netMonthlyIncome.toFixed(2)}) is too low for this loan amount. ` +
          `Please reduce the loan amount or restart with a new person.`
        )
        return
      }
    }

    setLoading(true)
    try {
      if (!wizardData.uid) {
        setError('No customer ID found. Please start from step 1.')
        return
      }

      const financialData = {
        monthlySalary: salaryNum,
        hasAdditionalIncome,
        additionalIncome: hasAdditionalIncome ? additionalIncomeNum : undefined,
        hasMortgage,
        mortgage: hasMortgage ? mortgageNum : undefined,
        hasOtherCredits,
        otherCredits: hasOtherCredits ? otherCreditsNum : undefined,
      }

      await axios.patch(`http://localhost:3000/customer/${wizardData.uid}/financial-info`, financialData)

      setWizardData({
        ...wizardData,
        financialInfo: financialData,
      })

      router.navigate({ to: '/wizard/step5' })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error saving financial info')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="step-container">
      <h2>Step 4: Financial Information</h2>

      <div className="form-group">
        <label>
          Monthly Salary (€):
          <input
            type="number"
            value={monthlySalary}
            onChange={(e) => setMonthlySalary(e.target.value)}
            placeholder="3000"
            min="0.01"
            step="0.01"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={hasAdditionalIncome}
            onChange={(e) => setHasAdditionalIncome(e.target.checked)}
          />{' '}
          I have additional income
        </label>
        {hasAdditionalIncome && (
          <div style={{ marginTop: '0.5rem' }}>
            <input
              type="number"
              value={additionalIncome}
              onChange={(e) => setAdditionalIncome(e.target.value)}
              placeholder="500"
              min="0"
              step="0.01"
            />
          </div>
        )}
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={hasMortgage}
            onChange={(e) => setHasMortgage(e.target.checked)}
          />{' '}
          I have a mortgage
        </label>
        {hasMortgage && (
          <div style={{ marginTop: '0.5rem' }}>
            <input
              type="number"
              value={mortgage}
              onChange={(e) => setMortgage(e.target.value)}
              placeholder="800"
              min="0"
              step="0.01"
            />
          </div>
        )}
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={hasOtherCredits}
            onChange={(e) => setHasOtherCredits(e.target.checked)}
          />{' '}
          I have other credits
        </label>
        {hasOtherCredits && (
          <div style={{ marginTop: '0.5rem' }}>
            <input
              type="number"
              value={otherCredits}
              onChange={(e) => setOtherCredits(e.target.value)}
              placeholder="200"
              min="0"
              step="0.01"
            />
          </div>
        )}
      </div>

      {error && <div className="error">{error}</div>}

      <div className="button-group">
        <button onClick={() => router.navigate({ to: '/wizard/step3' })}>
          Back
        </button>
        <button onClick={handleNext} disabled={loading}>
          {loading ? 'Saving...' : 'Next'}
        </button>
      </div>
    </div>
  )
}

export default FinancialInfo
