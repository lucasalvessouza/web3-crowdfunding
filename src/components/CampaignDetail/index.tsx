import CampaignStats from "../CampaignStats";


const CampaignDetail = () => {
    return (
        <div className="flex-col">
            <div className="flex flex-col md:flex-row lg:flex-row gap-5">
                <img
                    src="https://images.unsplash.com/reserve/YEc7WB6ASDydBTw6GDlF_antalya-beach-lulu.jpg?q=80&w=1601&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    className="w-full h-[410px] object-cover rounded-xl"
                    alt="Project image"
                />
                <div className="flex flex-col justify-between gap-4">
                    <CampaignStats title="3" description="Days Left"/>
                    <CampaignStats title="0.0" description="Raised of 0.5"/>
                    <CampaignStats title="0" description="Total Backers"/>
                </div>
            </div>

            <div className="mt-[60px] flex lg:flex-row flex-col gap-[40px] md:gap-0 lg:gap-0">
                <div className="flex-[2] flex flex-col gap-[40px]">
                    <div className="flex flex-col">
                        <span className="font-epilogue font-bold text-[20px] text-white mb-3">CREATOR</span>
                        <div className="flex flex-col md:flex-row lg:flex-row gap-3">
                            <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg"
                                 width="25"
                                 height="40">
                                <mask id=":r7:" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36">
                                    <rect width="36" height="36" rx="72" fill="#FFFFFF"></rect>
                                </mask>
                                <g mask="url(#:r7:)">
                                    <rect width="36" height="36" fill="#ff005b"></rect>
                                    <rect x="0" y="0" width="36" height="36"
                                          transform="translate(0 0) rotate(324 18 18) scale(1)" fill="#ffb238"
                                          rx="36"></rect>
                                    <g transform="translate(-4 -4) rotate(-4 18 18)">
                                        <path d="M15 19c2 1 4 1 6 0" stroke="#000000" fill="none"
                                              strokeLinecap="round"></path>
                                        <rect x="10" y="14" width="1.5" height="2" rx="1" stroke="none"
                                              fill="#000000"></rect>
                                        <rect x="24" y="14" width="1.5" height="2" rx="1" stroke="none"
                                              fill="#000000"></rect>
                                    </g>
                                </g>
                            </svg>
                            <div className="flex flex-col">
                            <span
                                className="text-white font-bold text-justify">0xC6223A6544A8441Ec74E4E70f16ED29868CcDE6D</span>
                                <span
                                    className="text-white font-normal text-[12px] text-justify">10 campaigns</span>
                            </div>

                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-epilogue font-bold text-[20px] text-white">STORY</span>
                        <span className="font-epilogue font-normal text-[14px] text-gray-400">Building a PC</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-epilogue font-bold text-[20px] text-white">Donators</span>
                        <span className="font-epilogue font-normal text-[14px] text-gray-400">No donators yet. Be the first one!</span>
                    </div>
                </div>
                <div className="flex-1">
                    <span className="font-epilogue font-bold text-[20px] text-white">FUND</span>
                    <div className="flex flex-col gap-[20px] w-full p-[20px] bg-gray-800 rounded-2xl mt-4">
                            <span
                                className="font-epilogue font-bold text-[18px] text-[#808191]">Fund the campaign</span>
                        <input
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                               defaultValue={0.1}
                               type="number"
                               step="0.1"
                        />
                        <div className="p-[20px] bg-[#242424] rounded-2xl">
                            <p className="text-white font-bold text-justify">🔥 Fuel the Dream.</p>
                            <p className="text-gray-400 mt-3">Join us in making a meaningful impact! Your generous contribution will fuel the success of our crowdfund project and help bring our shared vision to life. Together, let's turn dreams into reality—click the button below to make a difference today.</p>
                        </div>
                        <button className="bg-purple-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Fund Campaign
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CampaignDetail