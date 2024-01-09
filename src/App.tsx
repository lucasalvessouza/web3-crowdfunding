import Navbar from "./components/Navbar";
import {Route, Routes} from "react-router-dom";
import CampaignList from "./components/CampaignList";

function App() {
  return (
    <>
        <div>
            <Navbar/>

            <div className="p-5">
                <Routes>
                    <Route path="/" element={<CampaignList />}/>
                    <Route path="/my-campaigns" element={<h1>My-camp!</h1>}/>
                </Routes>
            </div>
        </div>
    </>
  )
}

export default App
