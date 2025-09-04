# Loan Wizard Frontend

A React-based multi-step wizard application for loan applications, built with TanStack Router and TypeScript.

## Features

- **Multi-step wizard interface** with 5 steps:
  1. Personal Information (name, date of birth)
  2. Contact Details (email, phone)
  3. Loan Request (amount, upfront payment, terms)
  4. Financial Information (salary, additional income, mortgage, credits)
  5. Final Review and Confirmation

- **Real-time validation** at each step
- **API integration** with backend for data persistence
- **Responsive design** with clean, modern UI
- **Type-safe** with TypeScript
- **State management** with React Context

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:3000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Architecture

- **Router**: TanStack Router for type-safe routing
- **State Management**: React Context for wizard state
- **HTTP Client**: Axios for API calls
- **Styling**: Custom CSS with modern design patterns
- **Validation**: Client-side validation with server-side backup

## API Integration

The frontend integrates with the following backend endpoints:

- `POST /customer/personal-info` - Save personal information
- `PATCH /customer/:uid/contact-info` - Update contact information
- `PATCH /customer/:uid/loan-info` - Update loan information
- `PATCH /customer/:uid/financial-info` - Update financial information
- `PATCH /customer/:uid/finalize` - Finalize the application

## Validation Rules

- **Personal Info**: Name validation (Latin/German letters), age limit (79 years)
- **Contact Info**: Email format, E.164 phone format
- **Loan Info**: Amount (€10,000-€70,000), upfront < amount, terms (10-30 months)
- **Financial Info**: Complex income validation based on loan terms
- **Final Step**: Confirmation required before submission