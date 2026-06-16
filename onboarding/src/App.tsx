import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import StepSupabase from "./pages/StepSupabase";
import StepWorker from "./pages/StepWorker";
import StepClaude from "./pages/StepClaude";
import StepTest from "./pages/StepTest";

export default function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Navigate to="/step/1" replace />} />
                <Route path="/step/1" element={<StepSupabase />} />
                <Route path="/step/2" element={<StepWorker />} />
                <Route path="/step/3" element={<StepClaude />} />
                <Route path="/step/4" element={<StepTest />} />
            </Routes>
        </Layout>
    );
}
