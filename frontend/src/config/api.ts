const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const API_ENDPOINTS = {
  CUSTOMER: {
    PERSONAL_INFO: `${API_BASE_URL}/customer/personal-info`,
    CONTACT_INFO: (uid: string) => `${API_BASE_URL}/customer/${uid}/contact-info`,
    LOAN_INFO: (uid: string) => `${API_BASE_URL}/customer/${uid}/loan-info`,
    FINANCIAL_INFO: (uid: string) => `${API_BASE_URL}/customer/${uid}/financial-info`,
    FINALIZE: (uid: string) => `${API_BASE_URL}/customer/${uid}/finalize`,
  }
}
