import CampaignCard from "../CampaignCard";
import {useContext, useEffect} from "react";
import { CrowdfundingContext } from "../../context/CrowdfundingContext";
import Loader from "../Loader";


const MyCampaigns = () => {
    const { userCampaignsList, isLoading, currentAccount, getUserProjects } = useContext(CrowdfundingContext)

    useEffect(() => {
      getUserProjects()
    }, [])

    return (
        <>
            <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">My Campaigns</h1>
            <div className="flex flex-wrap mt-[20px] gap-[26px]">
                {userCampaignsList && userCampaignsList.map(campaign => (
                    <CampaignCard {...campaign} />
                ))}
            </div>
            {!userCampaignsList?.length &&
						<div className="font-epilogue font-medium text-[16px] text-white flex justify-center items-center">
              {currentAccount ?
                <p>No projects yet? No worries! The adventure begins when you hit 'Create Campaign' Ready, set, go!</p>
                :
                <p>Connect your wallet first to show yours projects.</p>}
						</div>}
          {isLoading && <div className="flex justify-center items-center"><Loader/></div>}
        </>
    )
}

export default MyCampaigns