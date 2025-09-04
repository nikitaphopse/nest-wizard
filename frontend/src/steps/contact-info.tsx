import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import axios from 'axios'
import { useWizardState } from '../states/wizard-state'
import { API_ENDPOINTS } from '../config/api'

const ContactInfo = () => {
  const router = useRouter()
  const { wizardData, setWizardData } = useWizardState()

  const [email, setEmail] = useState(wizardData.contactInfo?.email || '')
  const [phone, setPhone] = useState(wizardData.contactInfo?.phone || '')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+[1-9]\d{1,14}$/
    return phoneRegex.test(phone)
  }

  const handleNext = async () => {
    setError(null)

    // Client-side validation
    if (!email.trim()) {
      setError('Email is required')
      return
    }
    if (!phone.trim()) {
      setError('Phone is required')
      return
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }
    if (!validatePhone(phone)) {
      setError('Please enter a valid phone number in E.164 format (e.g., +1234567890)')
      return
    }

    setLoading(true)
    try {
      if (!wizardData.uid) {
        setError('No customer ID found. Please start from step 1.')
        return
      }

      await axios.patch(API_ENDPOINTS.CUSTOMER.CONTACT_INFO(wizardData.uid), {
        email,
        phone,
      })

      setWizardData({
        ...wizardData,
        contactInfo: { email, phone },
      })

      router.navigate({ to: '/wizard/step3' })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error saving contact info')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="step-container">
      <h2>Step 2: Contact Information</h2>

      <div className="form-group">
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
          />
        </label>
      </div>

      <div className="form-group">
        <label>
          Phone:
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1234567890"
          />
        </label>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="button-group">
        <button onClick={() => router.navigate({ to: '/wizard/step1' })}>
          Back
        </button>
        <button onClick={handleNext} disabled={loading}>
          {loading ? 'Saving...' : 'Next'}
        </button>
      </div>
    </div>
  )
}

export default ContactInfo
