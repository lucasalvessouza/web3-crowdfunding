import Navbar from "./components/Navbar";
import {Route, Routes} from "react-router-dom";
import CampaignList from "./components/CampaignList";
import CampaignDetail from "./components/CampaignDetail";

function App() {
  return (
    <>
        <div>
            <Navbar/>

            <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto p-3">
                <Routes>
                    <Route path="/" element={<CampaignList />}/>
                    <Route path="/campaign/:id" element={<CampaignDetail />}/>
                    <Route path="/my-campaigns" element={<h1>My-camp!</h1>}/>
                </Routes>
            </div>
        </div>
    </>
  )
}

export default App
