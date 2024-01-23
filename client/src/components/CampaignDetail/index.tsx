import CampaignStats from "../CampaignStats";
import {useContext, useEffect, useState} from "react";
import {CampaignType, CrowdfundingContext} from "../../context/CrowdfundingContext.tsx";
import {useNavigate, useParams} from "react-router-dom";
import Loader from "../Loader";
import moment from "moment/moment";
import {shortenAddress} from "../../utils";
const generateDonatorsAvatar = (item: string) => {
    return (
      <div className="flex items-end gap-2" key={item}>
          <img  className="bg-gray-400 rounded-full" src={`https://api.dicebear.com/7.x/personas/svg?seed=${item}`} width={50} alt="avatar" />
          <span className="text-white">{item}</span>
      </div>
    )
}

const CampaignDetail = () => {
    const navigate = useNavigate()
    const {getProject, contract, currentAccount, donate, getProjectDonators, deactivateProject, claimProject} = useContext(CrowdfundingContext)
    const {id} = useParams()
    const [project, setProject] = useState<CampaignType>()
    const [projectShouldBeDeactivated, setProjectShouldBeDeactivated] = useState(false)
    const [donationValue, setDonationValue] = useState("0.1")
    const [isProjectLoading, setIsProjectLoading] = useState(true)
    const [donators, setDonators] = useState<string[]>()

    useEffect(() => {
        setIsProjectLoading(true)
        if (id && contract) {
            getProject(id)
              ?.then((campaign: any) => {
                  if (!campaign) {
                      navigate('/')
                  }
                  setProject(campaign)
              }).finally(() => {
                setIsProjectLoading(false)
            })
        }

    }, [id, contract]);

    useEffect(() => {
        if (project) {
            getProjectDonators(project.id)
              .then((donators: any) => {
                  setDonators(donators.map((donator: string) => shortenAddress(donator)));
              })

            if (moment(project.deadline).diff(moment(), 'days') <= 0 && Number(project.status) === 0 && !project.canUserClaimFunds) {
                setProjectShouldBeDeactivated(true)
            }
        }
    }, [project]);

    const donateToCampaign = () => {
        if (!project) {
            return
        }
        donate(Number(project.id), donationValue)
          .then(() => navigate(0))
    }

    const submitDeactivateProject = () => {
        if (!project) {
            return
        }
        deactivateProject(Number(project.id))
          .then(() => navigate('/my-campaigns'))
    }

    const claimProjectFunds = () => {
        if (!project) {
            return
        }
        claimProject(Number(project.id))
          .then(() => navigate('/my-campaigns'))
    }

    if (!project && !isProjectLoading) {
        return (
          <div className="font-epilogue font-medium text-[16px] text-white flex justify-center items-center">
            <p>Project not found!</p>
          </div>
        )
    }

    if (isProjectLoading && !project) {
        return (
          <div className="flex justify-center items-center"><Loader/></div>
        )
    }

    return project && (
      <div className="flex-col">
          <div className="flex flex-col md:flex-row lg:flex-row gap-5">
              <img
                src={project.image}
                className="w-full h-[410px] object-cover rounded-xl"
                alt="Project image"
              />
              <div className="flex flex-col justify-between gap-4">
                  <CampaignStats title={moment(project.deadline).diff(moment(), 'days').toString()} description="Days Left"/>
                  <CampaignStats title={project?.amountCollected || "0"} description="Raised of 0.5"/>
                  <CampaignStats title={(donators?.length || 0).toString()} description="Total Backers"/>
              </div>
          </div>

          <div className="mt-[60px] flex lg:flex-row flex-col gap-[40px] md:gap-2 lg:gap-2">
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
                              className="text-white font-bold text-justify">{project.owner}</span>
                              <span
                                className="text-white font-normal text-[12px] text-justify">10 campaigns</span>
                          </div>

                      </div>
                  </div>
                  <div className="flex flex-col">
                      <span className="font-epilogue font-bold text-[20px] text-white">NAME</span>
                      <span className="font-epilogue font-normal text-[14px] text-gray-400">{project.title}</span>
                  </div>
                  {!projectShouldBeDeactivated ?
                    <>
                        <div className="flex flex-col">
                            <span className="font-epilogue font-bold text-[20px] text-white">STORY</span>
                            <span
                              className="font-epilogue font-normal text-[14px] text-gray-400">{project.description}</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <span className="font-epilogue font-bold text-[20px] text-white">STATUS</span>
                            {project.statusName &&
                              <div>
                                <span
                                  className={`${project.statusName === 'ACTIVE' ? 'bg-green-600' : 'bg-red-500'} p-[10px] rounded-[10px] font-bold text-white mt-3`}>{project.statusName}</span>
                              </div>
                            }
                        </div>
                        <div className="flex flex-col">
                            <span className="font-epilogue font-bold text-[20px] text-white">DONATORS</span>
                            {project.isRefunded && donators?.length && <span className="my-2 text-white font-bold">All donations were refunded</span>}
                            {
                                !donators?.length
                                  ?
                                  <span className="font-epilogue font-normal text-[14px] text-gray-400">No donators yet. Be the first one!</span>
                                  :
                                  <div className="flex flex-row flex-wrap gap-4">
                                      {donators.map(generateDonatorsAvatar)}
                                  </div>
                            }
                        </div>
                    </> :
                    <div className="text-white text-center font-bold">
                        {
                            currentAccount === project.owner ?
                              <>
                                  <h1>This project achieved its deadline and unfortunately, the target amount was not
                                      achieved.</h1>
                                  <h1>Click in the button below to deactivate the project and refund the donators,
                                      please.</h1>
                              </> :
                              <>
                                  <h1>This project achieved its deadline and will be deactivated soon.</h1>
                              </>
                        }
                    </div>
                  }
                  {currentAccount === project.owner && Number(project.status) === 0 &&
                    <div className="flex gap-3">
                    <button
                          className="relative inline-flex items-center justify-center rounded-md p-2 text-white bg-red-500"
                          onClick={submitDeactivateProject}>Deactivate project
                        </button>
                        {
                          project.canUserClaimFunds &&
                          <button
                            className="relative inline-flex items-center justify-center rounded-md p-2 text-white bg-blue-600"
                            onClick={claimProjectFunds}>Claim Funds
                          </button>
                        }
                    </div>
                  }
              </div>
              {currentAccount !== project.owner && !projectShouldBeDeactivated &&
                <div className="flex-1">
                    <span className="font-epilogue font-bold text-[20px] text-white">FUND</span>
                    <div className="flex flex-col gap-[20px] w-full p-[20px] bg-gray-800 rounded-2xl mt-4">
                            <span
                              className="font-epilogue font-bold text-[18px] text-[#808191]">Fund the campaign</span>
                        <input
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          defaultValue={donationValue}
                          onChange={(e) => setDonationValue(e.target.value.toString())}
                          type="number"
                          step="0.1"
                        />
                        <div className="p-[20px] bg-[#242424] rounded-2xl">
                            <p className="text-white font-bold text-justify">🔥 Fuel the Dream.</p>
                            <p className="text-gray-400 mt-3">Join us in making a meaningful impact! Your generous
                                contribution will fuel the success of our crowdfund project and help bring our shared
                                vision to life. Together, let's turn dreams into reality—click the button below to make
                                a
                                difference today.</p>
                        </div>
                        <button
                          onClick={donateToCampaign}
                          className="bg-purple-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Fund Campaign
                        </button>
                    </div>
                </div>
              }
          </div>
      </div>
    )
}

export default CampaignDetail