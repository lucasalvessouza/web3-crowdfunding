import CampaignCard from "../CampaignCard";
import {useContext} from "react";
import { CrowdfundingContext } from "../../context/CrowdfundingContext";


const MyCampaigns = () => {
    const { userCampaignsList } = useContext(CrowdfundingContext)

    return (
        <>
            <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">My Campaigns</h1>
            <div className="flex flex-wrap mt-[20px] gap-[26px]">
                {userCampaignsList && userCampaignsList.map(campaign => (
                    <CampaignCard {...campaign} />
                ))}
            </div>
            {/*{userCampaignsList.length === 0 &&*/}
			{/*				<div className="font-epilogue font-medium text-[16px] text-white text-center">*/}
			{/*					<p>Oops! No matching projects found. Try adjusting your filters!</p>*/}
			{/*					<button*/}
			{/*						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3"*/}
			{/*						onClick={() => setCampaigns(initialCampaigns)}*/}
			{/*					>Show me all!</button>*/}
			{/*				</div>}*/}
        </>
    )
}

export default MyCampaigns