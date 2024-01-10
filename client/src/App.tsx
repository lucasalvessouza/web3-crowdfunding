import Navbar from "./components/Navbar";
import {Route, Routes} from "react-router-dom";
import CampaignList from "./components/CampaignList";
import CampaignDetail from "./components/CampaignDetail";
import CampaignCreate from "./components/CampaignCreate";

function App() {
  return (
    <>
        <div>
            <Navbar />

            <div className="flex-1 max-sm:w-full max-w-[1366px] mx-auto p-3">
                <Routes>
                    <Route path="/" element={<CampaignList />}/>
                    <Route path="/campaigns/:id" element={<CampaignDetail />}/>
                    <Route path="/campaigns/create" element={<CampaignCreate />}/>
                    <Route path="/my-campaigns" element={<h1>My-camp!</h1>}/>
                </Routes>
            </div>
        </div>
    </>
  )
}

export default App
