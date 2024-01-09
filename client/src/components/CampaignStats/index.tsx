
type CampaignStatsType = {
    title: string,
    description: string
}

const CampaignStats = (data: CampaignStatsType) => {
    const {
        title,
        description
    } = data
    return (
        <>
            <div className="flex flex-col bg-gray-700 text-center w-full min-w-[150px] rounded-lg">
                <span className="font-epilogue font-bold text-[30px] text-white py-2">{title}</span>
                <span
                    className="font-epilogue font-normal text-[18px] text-gray-400 bg-gray-600  rounded-b-lg py-2 ">{description}</span>
            </div>
        </>
    )
}

export default CampaignStats