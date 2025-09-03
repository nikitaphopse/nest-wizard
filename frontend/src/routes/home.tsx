import { useRouter } from '@tanstack/react-router'

const Home = () => {
    const router = useRouter()

    return (
        <div className="step-container">
            <h1>Welcome to the Loan Wizard</h1>
            <p style={{ textAlign: 'center', fontSize: '1.2em', marginBottom: '2rem' }}>
                Complete our simple 5-step process to apply for your loan.
            </p>
            <div className="button-group">
                <button onClick={() => router.navigate({ to: '/wizard/step1' })}>
                    Start Wizard
                </button>
            </div>
        </div>
    )
}

export default Home
