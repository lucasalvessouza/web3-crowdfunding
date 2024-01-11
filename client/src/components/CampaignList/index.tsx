import CampaignCard from "../CampaignCard";
import {useContext, useEffect, useState} from "react";
import {CrowdfundingContext} from "../../context/CrowdfundingContext";


const CampaignList = () => {
    // const initialCampaigns = [
    //     {
    //         "title": "QuantumLeap Smartwatch",
    //         "description": "Revolutionize your daily life with the QuantumLeap Smartwatch, packed with advanced features like health tracking, real-time language translation, and holographic display. Join us on this journey into the future of wearable technology!",
    //         "daysLeft": "28 days",
    //         "totalRaised": "150 ETH",
    //         "totalGoal": "300 ETH",
    //         "category": "Technology",
    //         image: "https://images.unsplash.com/photo-1523395243481-163f8f6155ab?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    //     },
    //     {
    //         "title": "EcoHarvest Urban Garden Kit",
    //         "description": "Grow your own fresh, organic produce at home with the EcoHarvest Urban Garden Kit. Perfect for small spaces, this kit includes everything you need to cultivate a sustainable and thriving garden right in the heart of your city.",
    //         "daysLeft": "15 days",
    //         "totalRaised": "42 ETH",
    //         "totalGoal": "50 ETH",
    //         "category": "Home & Garden",
    //         image: "https://images.unsplash.com/photo-1460533893735-45cea2212645?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    //     },
    //     {
    //         "title": "StellarVR: Immersive Virtual Reality Experience",
    //         "description": "Dive ino a new dimension with StellarVR, a groundbreaking virtual reality experience that combines cutting-edge graphics and immersive storytelling. Join us on this cosmic journey through the stars and beyond!",
    //         "daysLeft": "35 days",
    //         "totalRaised": "120 ETH",
    //         "totalGoal": "250 ETH",
    //         "category": "Entertainment",
    //         image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?q=80&w=&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    //     },
    //     {
    //         "title": "ZenCalm Meditation App",
    //         "description": "Find your inner peace with ZenCalm, a meditation app designed to reduce stress and promote mindfulness. With guided meditations, soothing sounds, and personalized mindfulness exercises, ZenCalm is your path to tranquility.",
    //         "daysLeft": "20 days",
    //         "totalRaised": "29 ETH",
    //         "totalGoal": "40 ETH",
    //         "category": "Health & Wellness",
    //         image: "https://images.unsplash.com/reserve/YEc7WB6ASDydBTw6GDlF_antalya-beach-lulu.jpg?q=80&w=1601&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    //     },
    //     {
    //         "title": "RetroRevival Classic Arcade Console",
    //         "description": "Relive the golden age of gaming with RetroRevival, a classic arcade console featuring a collection of your favorite retro games. Immerse yourself in nostalgia with this console that brings back the joy of arcade gaming.",
    //         "daysLeft": "25 days",
    //         "totalRaised": "65 ETH",
    //         "totalGoal": "80 ETH",
    //         "category": "Gaming",
    //         image: "https://images.unsplash.com/photo-1511882150382-421056c89033?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    //     }
    // ]
    const { campaignsList } = useContext(CrowdfundingContext)

    const [search, setSearch] = useState("")
    const [campaigns, setCampaigns] = useState(campaignsList)

    useEffect(() => {
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
            {campaigns?.length === 0 &&
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