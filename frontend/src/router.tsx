import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import Home from './routes/home'
import PersonalInfo from './steps/personal-info'
import ContactInfo from './steps/contact-info'
import LoanInfo from './steps/loan-info'
import FinancialInfo from './steps/financial-info'
import Final from './steps/final'

// Root layout
const rootRoute = createRootRoute({
    component: () => (
      <div style={{ padding: '2rem' }}>
        <h1>Loan Wizard</h1>
        <Outlet />
      </div>
    ),
  })

// Home route
const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: Home,
})

// Wizard step routes
const step1Route = createRoute({
    getParentRoute: () => rootRoute,
    path: '/wizard/step1',
    component: PersonalInfo,
})

const step2Route = createRoute({
    getParentRoute: () => rootRoute,
    path: '/wizard/step2',
    component: ContactInfo,
})

const step3Route = createRoute({
    getParentRoute: () => rootRoute,
    path: '/wizard/step3',
    component: LoanInfo,
})

const step4Route = createRoute({
    getParentRoute: () => rootRoute,
    path: '/wizard/step4',
    component: FinancialInfo,
})

const step5Route = createRoute({
    getParentRoute: () => rootRoute,
    path: '/wizard/step5',
    component: Final,
})

// Create the route tree
const routeTree = rootRoute.addChildren([
    homeRoute,
    step1Route,
    step2Route,
    step3Route,
    step4Route,
    step5Route,
])

// Create the router
export const router = createRouter({ routeTree })

// Register the router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
