import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter as Router } from "react-router-dom";
import { CrowdfundingProvider } from "./context/CrowdfundingContext"
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";

createRoot(document.getElementById('root')!).render(
  <ThirdwebProvider activeChain={Sepolia}>
    <CrowdfundingProvider>
      <Router>
        <App />
      </Router>
    </CrowdfundingProvider>,
  </ThirdwebProvider>
)
