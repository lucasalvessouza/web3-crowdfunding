
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
            <div className="px-6 py-4">
                <span
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#{category}</span>

                <div className="flex mt-3 items-center">
                    <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="25"
                         height="80">
                        <mask id=":r7:" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36">
                            <rect width="36" height="36" rx="72" fill="#FFFFFF"></rect>
                        </mask>
                        <g mask="url(#:r7:)">
                            <rect width="36" height="36" fill="#ff005b"></rect>
                            <rect x="0" y="0" width="36" height="36"
                                  transform="translate(0 0) rotate(324 18 18) scale(1)" fill="#ffb238" rx="36"></rect>
                            <g transform="translate(-4 -4) rotate(-4 18 18)">
                                <path d="M15 19c2 1 4 1 6 0" stroke="#000000" fill="none" strokeLinecap="round"></path>
                                <rect x="10" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect>
                                <rect x="24" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect>
                            </g>
                        </g>
                    </svg>
                    <span className="text-[#808191] text-base text-justify ml-2">by <b>0xC6223A6544A8...</b></span>
                </div>
            </div>
        </div>
    )
}

export default CampaignCard