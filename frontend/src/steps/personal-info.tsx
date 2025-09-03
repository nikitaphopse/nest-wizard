import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import axios from 'axios'
import { useWizardState } from '../states/wizard-state'

const PersonalInfo = () => {
    const router = useRouter()
    const { wizardData, setWizardData } = useWizardState()

    const [firstName, setFirstName] = useState(wizardData.personalInfo?.firstName || '')
    const [lastName, setLastName] = useState(wizardData.personalInfo?.lastName || '')
    const [dateOfBirth, setDateOfBirth] = useState(
        wizardData.personalInfo?.dateOfBirth || ''
    )
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleNext = async () => {
        setLoading(true)
        setError(null)
        try {
            // POST to backend
            const res = await axios.post('http://localhost:3000/customer/personal-info', {
                firstName,
                lastName,
                dateOfBirth,
                uid: wizardData.uid, // optional, backend creates if missing
            })

            const data = res.data
            // Save returned uid and personal info in WizardState
            setWizardData({
                ...wizardData,
                uid: data.uid,
                personalInfo: data.personalInfo,
            })

            router.navigate({ to: '/wizard/step2' })
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error saving personal info')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="step-container">
            <h2>Step 1: Personal Information</h2>

            <div className="form-group">
                <label>
                    First Name:
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                    />
                </label>
            </div>

            <div className="form-group">
                <label>
                    Last Name:
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                    />
                </label>
            </div>

            <div className="form-group">
                <label>
                    Date of Birth:
                    <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                </label>
            </div>

            {error && <div className="error">{error}</div>}

            <div className="button-group">
                <button onClick={handleNext} disabled={loading}>
                    {loading ? 'Saving...' : 'Next'}
                </button>
            </div>
        </div>
    )
}

export default PersonalInfo
