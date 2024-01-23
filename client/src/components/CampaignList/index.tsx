import CampaignCard from "../CampaignCard";
import {useContext, useEffect, useState} from "react";
import {CrowdfundingContext} from "../../context/CrowdfundingContext";
import Loader from "../Loader";


const CampaignList = () => {
    const { campaignsList, isLoading } = useContext(CrowdfundingContext)

    const [search, setSearch] = useState("")
    const [campaigns, setCampaigns] = useState(campaignsList)

    useEffect(() => {
        if (!campaignsList) {
          return
        }
        if (search === "" || !search || search.length < 3) {
            setCampaigns(campaignsList)
            return
        }
        setCampaigns(campaignsList.filter(campaign => campaign.title.includes(search)))
    }, [search]);

    useEffect(() => {
        setCampaigns(campaignsList)
    }, [campaignsList]);

    return (
        <>
            <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">All Campaigns</h1>
            <div className="my-[30px]">
                <input type="text" id="search"
                       className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       placeholder="Search the campaign name"
                       onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="flex flex-wrap mt-[20px] gap-[26px]">
                {campaigns && campaigns.map(campaign => (
                    <CampaignCard {...campaign} />
                ))}
            </div>
            {isLoading && <div className="flex justify-center items-center"><Loader /></div>}
            {!isLoading && campaigns?.length === 0 &&
              <div className="font-epilogue font-medium text-[16px] text-white text-center">
                <p>Oops! No matching projects found. Try adjusting your filters!</p>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3"
                  onClick={() => setCampaigns(campaignsList)}
                >Show me all!</button>
              </div>}
        </>
    )
}

export default CampaignList