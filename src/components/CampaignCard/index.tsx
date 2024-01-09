
type Campaign = {
    title: string,
    description: string,
    daysLeft: string,
    totalRaised: string,
    totalGoal: string,
    category: string,
    image: string
}
const CampaignCard = (campaign: Campaign) => {
    const {
        title,
        description,
        daysLeft,
        totalRaised,
        totalGoal,
        category,
        image
    } = campaign
    return (
        <div className="sm:w-[288px] min-w-[301px]  w-full overflow-hidden shadow-lg rounded-[15px] bg-[#1c1c24] cursor-pointer text-white transform transition duration-500 hover:scale-105">
            <img className="w-full h-[158px] object-cover" src={image} alt="Sunset in the mountains" />
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{title}</div>
                <p className="text-[#808191] text-base text-justify">
                    {description}
                </p>
            </div>
            <div className="flex px-6 py-4 justify-between">
                <div className="flex flex-col">
                    <span className="font-bold">{totalRaised}</span>
                    <span className="font-medium text-[#808191]">Raised of {totalGoal}</span>
                </div>
                <div className="flex flex-col text-right">
                    <span className="font-bold">{daysLeft}</span>
                    <span className="font-medium text-[#808191]">Days Left</span>
                </div>

            </div>
            <div className="px-6 pt-4 pb-2">
                <span
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{category}</span>
            </div>
        </div>
    )
}

export default CampaignCard