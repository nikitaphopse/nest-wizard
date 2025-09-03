import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import axios from 'axios'
import { useWizardState } from '../states/wizard-state'

const Final = () => {
  const router = useRouter()
  const { wizardData } = useWizardState()
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFinalize = async () => {
    if (!confirmed) return
    
    setLoading(true)
    setError(null)
    
    try {
      if (!wizardData.uid) {
        setError('No customer ID found. Please start from step 1.')
        return
      }

      await axios.patch(`http://localhost:3000/customer/${wizardData.uid}/finalize`)
      
      alert('Application finalized successfully!')
      router.navigate({ to: '/' })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error finalizing application')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-EU')
  }

  return (
    <div className="step-container">
      <h2>Step 5: Review and Finalize</h2>
      
      <div className="review-section">
        <h3>Personal Information</h3>
        <p><strong>Name:</strong> {wizardData.personalInfo?.firstName} {wizardData.personalInfo?.lastName}</p>
        <p><strong>Date of Birth:</strong> {wizardData.personalInfo?.dateOfBirth ? formatDate(wizardData.personalInfo.dateOfBirth) : 'N/A'}</p>
        
        <h3>Contact Information</h3>
        <p><strong>Email:</strong> {wizardData.contactInfo?.email || 'N/A'}</p>
        <p><strong>Phone:</strong> {wizardData.contactInfo?.phone || 'N/A'}</p>
        
        <h3>Loan Information</h3>
        <p><strong>Loan Amount:</strong> {wizardData.loanInfo?.amount ? formatCurrency(wizardData.loanInfo.amount) : 'N/A'}</p>
        <p><strong>Upfront Payment:</strong> {wizardData.loanInfo?.upfront ? formatCurrency(wizardData.loanInfo.upfront) : 'N/A'}</p>
        <p><strong>Terms:</strong> {wizardData.loanInfo?.terms ? `${wizardData.loanInfo.terms} months` : 'N/A'}</p>
        
        <h3>Financial Information</h3>
        <p><strong>Monthly Salary:</strong> {wizardData.financialInfo?.monthlySalary ? formatCurrency(wizardData.financialInfo.monthlySalary) : 'N/A'}</p>
        {wizardData.financialInfo?.hasAdditionalIncome && (
          <p><strong>Additional Income:</strong> {formatCurrency(wizardData.financialInfo.additionalIncome || 0)}</p>
        )}
        {wizardData.financialInfo?.hasMortgage && (
          <p><strong>Mortgage:</strong> {formatCurrency(wizardData.financialInfo.mortgage || 0)}</p>
        )}
        {wizardData.financialInfo?.hasOtherCredits && (
          <p><strong>Other Credits:</strong> {formatCurrency(wizardData.financialInfo.otherCredits || 0)}</p>
        )}
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
          />{' '}
          I confirm all information is correct
        </label>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="button-group">
        <button onClick={() => router.navigate({ to: '/wizard/step4' })}>
          Back
        </button>
        <button disabled={!confirmed || loading} onClick={handleFinalize}>
          {loading ? 'Finalizing...' : 'Finalize'}
        </button>
      </div>
    </div>
  )
}

export default Final
