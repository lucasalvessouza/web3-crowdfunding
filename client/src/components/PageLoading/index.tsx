import { useContext } from "react";
import Loader from "../Loader";
import {CrowdfundingContext} from "../../context/CrowdfundingContext";


const PageLoading = () => {
    const { loadingPageMessage } = useContext(CrowdfundingContext)
    return (
        <>
            {loadingPageMessage &&
                <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
                    <Loader />
                    <h2 className="text-center text-white text-xl font-semibold">Loading...</h2>
                    <p className="w-1/3 text-center text-white mt-2">{loadingPageMessage}</p>
                </div>
            }
        </>
    )
}

export default PageLoading