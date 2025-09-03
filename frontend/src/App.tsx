import { RouterProvider } from '@tanstack/react-router'
import { WizardStateProvider } from './states/wizard-state'
import { router } from './router'

function App() {
  return (
    <WizardStateProvider>
      <RouterProvider router={router} />
    </WizardStateProvider>
  )
}

export default App
