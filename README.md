# Loan Wizard (Fullstack)

A **React + NestJS fullstack application** for managing loan applications.  
The project provides a multi-step loan wizard frontend with a backend API for customer data persistence and loan validation.  

---

## Features

### Frontend (React + TanStack Router + TypeScript)
- **Multi-step wizard interface** with 5 steps:
  1. Personal Information (name, date of birth)  
  2. Contact Details (email, phone)  
  3. Loan Request (amount, upfront payment, terms)  
  4. Financial Information (salary, additional income, mortgage, credits)  
  5. Final Review and Confirmation  
- **Real-time validation** at each step  
- **Responsive design** with clean, modern UI  
- **Type-safe** with TypeScript  
- **State management** with React Context  

### Backend (NestJS + File-based persistence)
- RESTful API for customer management  
- Validates financial data before finalizing loan requests  
- Data stored in `data/customers.json`  
- Error handling for missing or invalid information  

---

## Tech Stack

- **Frontend**: React, TanStack Router, TypeScript, Axios  
- **Backend**: NestJS, TypeScript  
- **Storage**: JSON file (development)  
- **Containerization**: Docker & Docker Compose  
- **Web Server**: Nginx (serving frontend build)  

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)  
- npm or yarn  
- Docker & Docker Compose  

---

## Run with Docker (recommended)
1. Build and start services:  
   ```bash
   docker-compose up --build
2. Access the app:
    Frontend → http://localhost
    Backend API → http://localhost:3000
3. Data storage:
    Customer data is stored in ./api/data/customers.json

----

Run locally (manual setup)
Backend
cd api
npm install
npm run start:dev -> Backend runs on http://localhost:3000

Frontend
cd frontend
npm install
npm run dev -> Frontend runs on http://localhost:5173

---