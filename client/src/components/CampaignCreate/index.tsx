import { FaMoneyBill } from 'react-icons/fa'
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import {useContext, useState} from "react";
import {CrowdfundingContext, CampaignCreateType } from "../../context/CrowdfundingContext";

const CampaignCreate = () => {
    const [value, setValue] = useState<DateValueType>({
        startDate: new Date(),
        endDate: new Date()
    });
    const { currentAccount, setAlertMessage, createCrowdfundingProject } = useContext(CrowdfundingContext)
    const [formData, setFormData] = useState<CampaignCreateType>({
        owner: "",
        title: "",
        description: "",
        target: "",
        deadline: "",
        image: "",
    })

    const handleValueChange = (newValue: DateValueType) => {
       if (!newValue?.startDate) {
          return
       }
       setValue({
           startDate: newValue.startDate,
           endDate: newValue.startDate
       })
       setFormData({
           ...formData,
           deadline: newValue.startDate as string
       })
    }

    const createCampaign = () => {
        if (!currentAccount) {
            setAlertMessage({
                title: 'Ops!',
                body: 'Connect your wallet to proceed'
            })
            return
        }
        createCrowdfundingProject({
            ...formData,
            owner: currentAccount,
        })
    }

    const onChange = (event: any) => setFormData({...formData, [event.target.id]: event.target.value})

    return (
        <>
            <h1 className="font-epilogue font-semibold text-[18px] text-white text-left mb-4">Create a campaign</h1>
            <div className="flex flex-col gap-5">
                <div>
                    <label htmlFor="user_name"
                           className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">Your Name *</label>
                    <input type="text" id="user_name"
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           placeholder="John Doe" required
                    />
                </div>
                <div>
                    <label htmlFor="title"
                           className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">Campaign Title *</label>
                    <input
                        type="text"
                        id="title"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Write a title"
                        required
                        onChange={onChange}
                    />
                </div>
                <div>
                    <label htmlFor="description"
                           className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">Story *</label>
                    <textarea
                        id="description"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Write a story (max of 235 characters)"
                        maxLength={235}
                        required
                        onChange={onChange}
                    />
                </div>

                <div className="flex gap-4 items-center bg-purple-500 p-5 rounded-2xl justify-center">
                    <FaMoneyBill className="w-[40px] h-[40px] text-white"/>
                    <p className="font-epilogue font-bold text-[24px] text-white">You will get 100% of the raised
                        amount</p>
                </div>
                <div>
                    <label
                        htmlFor="target"
                        className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">
                        Goal *
                    </label>
                    <input
                        id="target"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        defaultValue={0.1}
                        type="number"
                        step="0.1"
                        onChange={onChange}
                    />
                </div>
                <div>
                    <label htmlFor="campaign_goal"
                           className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">Goal
                        *</label>
                    <div className="w-full">
                        <div className="datepicker">
                            <Datepicker
                                asSingle={true}
                                value={value}
                                onChange={handleValueChange}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="image"
                           className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">Campaign Image
                        *</label>
                    <input
                        type="text"
                        id="image"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Place a image url of your campaign"
                        required
                        onChange={onChange}
                    />
                </div>
                <button
                    className="bg-[#1dc071]  hover:bg-[#4acc8d] font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px]"
                    onClick={createCampaign}
                >
                    Create campaign
                </button>
            </div>
        </>
    )
}

export default CampaignCreate