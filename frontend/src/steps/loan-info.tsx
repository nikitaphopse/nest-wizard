import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import axios from 'axios'
import { useWizardState } from '../states/wizard-state'

const LoanInfo = () => {
  const router = useRouter()
  const { wizardData, setWizardData } = useWizardState()

  const [amount, setAmount] = useState(wizardData.loanInfo?.amount?.toString() || '')
  const [upfront, setUpfront] = useState(wizardData.loanInfo?.upfront?.toString() || '')
  const [terms, setTerms] = useState(wizardData.loanInfo?.terms?.toString() || '')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const handleNext = async () => {
    setError(null)

    // Client-side validation
    const amountNum = parseFloat(amount)
    const upfrontNum = parseFloat(upfront)
    const termsNum = parseInt(terms)

    if (!amount || isNaN(amountNum)) {
      setError('Loan amount is required and must be a valid number')
      return
    }
    if (!upfront || isNaN(upfrontNum)) {
      setError('Upfront payment is required and must be a valid number')
      return
    }
    if (!terms || isNaN(termsNum)) {
      setError('Terms is required and must be a valid number')
      return
    }

    if (amountNum < 10000 || amountNum > 70000) {
      setError('Loan amount must be between 10,000 and 70,000')
      return
    }
    if (upfrontNum >= amountNum) {
      setError('Upfront payment must be less than loan amount')
      return
    }
    if (termsNum < 10 || termsNum > 30) {
      setError('Terms must be between 10 and 30 months')
      return
    }

    // Check age + terms constraint
    if (wizardData.personalInfo?.dateOfBirth) {
      const age = calculateAge(wizardData.personalInfo.dateOfBirth)
      if (termsNum / 12 + age >= 80) {
        setError('Terms divided by 12 plus your age must be less than 80')
        return
      }
    }

    setLoading(true)
    try {
      if (!wizardData.uid) {
        setError('No customer ID found. Please start from step 1.')
        return
      }

      await axios.patch(`http://localhost:3000/customer/${wizardData.uid}/loan-info`, {
        amount: amountNum,
        upfront: upfrontNum,
        terms: termsNum,
      })

      setWizardData({
        ...wizardData,
        loanInfo: { amount: amountNum, upfront: upfrontNum, terms: termsNum },
      })

      router.navigate({ to: '/wizard/step4' })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error saving loan info')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="step-container">
      <h2>Step 3: Loan Information</h2>

      <div className="form-group">
        <label>
          Loan Amount (€):
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="25000"
            min="10000"
            max="70000"
          />
        </label>
        <p style={{ fontSize: '0.9em', color: '#666', margin: '4px 0' }}>
          Between €10,000 and €70,000
        </p>
      </div>

      <div className="form-group">
        <label>
          Upfront Payment (€):
          <input
            type="number"
            value={upfront}
            onChange={(e) => setUpfront(e.target.value)}
            placeholder="5000"
            min="0"
          />
        </label>
        <p style={{ fontSize: '0.9em', color: '#666', margin: '4px 0' }}>
          Must be less than loan amount
        </p>
      </div>

      <div className="form-group">
        <label>
          Terms (months):
          <input
            type="number"
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            placeholder="24"
            min="10"
            max="30"
          />
        </label>
        <p style={{ fontSize: '0.9em', color: '#666', margin: '4px 0' }}>
          Between 10 and 30 months
        </p>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="button-group">
        <button onClick={() => router.navigate({ to: '/wizard/step2' })}>
          Back
        </button>
        <button onClick={handleNext} disabled={loading}>
          {loading ? 'Saving...' : 'Next'}
        </button>
      </div>
    </div>
  )
}

export default LoanInfo
