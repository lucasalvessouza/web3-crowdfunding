import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter as Router } from "react-router-dom";
import { CrowdfundingProvider } from "./context/CrowdfundingContext"

createRoot(document.getElementById('root')!).render(
    <CrowdfundingProvider>
        <Router>
            <App />
        </Router>
    </CrowdfundingProvider>,
)
