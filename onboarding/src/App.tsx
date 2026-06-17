import { useState } from "react";
import Layout from "./components/Layout";
import StepSupabase from "./pages/StepSupabase";
import StepWorker from "./pages/StepWorker";
import StepClaude from "./pages/StepClaude";
import StepTest from "./pages/StepTest";

export default function App() {
    const [step, setStep] = useState(1);

    return (
        <Layout step={step} onStepChange={setStep}>
            {step === 1 && <StepSupabase onNext={() => setStep(2)} />}
            {step === 2 && <StepWorker onBack={() => setStep(1)} onNext={() => setStep(3)} />}
            {step === 3 && <StepClaude onBack={() => setStep(2)} onNext={() => setStep(4)} />}
            {step === 4 && <StepTest onBack={() => setStep(3)} />}
        </Layout>
    );
}
