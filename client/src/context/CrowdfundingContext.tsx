import { ethers } from "ethers"
import { createContext, useEffect, useState } from "react"
import {
    useAddress,
    useContract,
    useContractWrite,
    useConnect,
    metamaskWallet,
    useDisconnect, useBalance
} from '@thirdweb-dev/react';
import { contractABI, contractAddress } from "../utils/constants"
import useEthAmountParser from "../hooks/useEthAmountParser";
import useTimestampParser from "../hooks/useTimestampParser";

type CrowdfundingProviderType = {
    currentAccount?: string
    connectWallet: () => void
    disconnectedWallet: () => void
    createCrowdfundingProject: (data: CampaignCreateType) => void
    walletBalance?: string
    isWalletLoading: boolean
    isLoading: boolean
    alertMessage?: AlertMessage
    setAlertMessage: (message: AlertMessage) => void,
    userCampaignsList: CampaignType[] | [] | undefined
    campaignsList: CampaignType[] | [] | undefined
    loadingPageMessage?: string,
    isProjectCreated: boolean,
    setIsProjectCreated: (value: boolean) => void,
    getProject: (id: string) => Promise<CampaignType | undefined>,
    contract: any,
    donate: (id: number, amount: string) => Promise<void>
    getProjectDonators: (id: string) => Promise<string[] | undefined>,
    deactivateProject: (id: number) => Promise<void>,
    getUserProjects: () => void,
    claimProject: (id: number) => Promise<void>
}

type AlertMessage = {
    title: string,
    body: string,
    type: 'success' | 'error'
}

export type CampaignCreateType = {
    owner: string
    title: string
    description: string
    target: string
    deadline: any
    image: string
}

export type CampaignType = CampaignCreateType & {
    id: string
    amountCollected: any
    donators: string[]
    donations: unknown[]
    status: string
    statusName: string
    target: any
    canUserClaimFunds?: boolean
    isRefunded?: boolean
}

export const CrowdfundingContext = createContext<CrowdfundingProviderType>({
    connectWallet: () => undefined,
    disconnectedWallet: () => undefined,
    setAlertMessage: () => undefined,
    createCrowdfundingProject: () => undefined,
    isWalletLoading: false,
    isLoading: false,
    userCampaignsList: [],
    campaignsList: [],
    loadingPageMessage: undefined,
    setIsProjectCreated: () => undefined,
    isProjectCreated: false,
    getProject: () => new Promise(() => undefined),
    contract: undefined,
    donate: () => new Promise(() => undefined),
    getProjectDonators: () => new Promise(() => undefined),
    deactivateProject: () => new Promise(() => undefined),
    getUserProjects: () => new Promise(() => undefined),
    claimProject: () => new Promise(() => undefined)
})

export const CrowdfundingProvider = ({ children }: { children: any }) => {
    const { contract } = useContract(contractAddress, contractABI);
    const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');
    const { mutateAsync: getCampaigns } = useContractWrite(contract, 'getCampaigns');
    const { mutateAsync: getCampaign } = useContractWrite(contract, 'getCampaign');
    const { mutateAsync: donateToCampaign } = useContractWrite(contract, 'donateToCampaign');
    const { mutateAsync: getDonators } = useContractWrite(contract, 'getDonators');
    const { mutateAsync: deactivateCampaign } = useContractWrite(contract, 'deactivateCampaign');
    const { mutateAsync: claim } = useContractWrite(contract, 'claim');

    const connect = useConnect();
    const disconnect = useDisconnect()
    const currentAccount = useAddress();
    const balance = useBalance()

    const [walletBalance, setWalletBalance] = useState<string>()
    const [alertMessage, setAlertMessage] = useState<AlertMessage | undefined>()
    const [isWalletLoading, setIsWalletLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [loadingPageMessage, setLoadingPageMessage] = useState<string | undefined>()
    const [isProjectCreated, setIsProjectCreated] = useState(false)
    const [userCampaignsList, setUserCampaignsList] = useState<CampaignType[] | []>()
    const [campaignsList, setCampaignsList] = useState<CampaignType[] | []>()

    useEffect(() => {
    }, [currentAccount]);

    useEffect(() => {
        getAllProjects()
        getUserProjects()
    }, [contract]);

    useEffect(() => {
        setWalletBalance(balance.data?.displayValue)
    }, [balance]);

    const connectWallet = async () => {
        try {
            setIsWalletLoading(true)
            await connect(metamaskWallet())
        } catch (error) {
            console.log(error)
            throw new Error("No ethereum object")
        } finally {
            setIsWalletLoading(false)
        }
    }

    const disconnectedWallet = async () => {
        if (!currentAccount) {
            return
        }
        console.log("Disconnecting...")
        disconnect().then(() =>  console.log('Disconnected')).catch(() =>  console.log('Error to disconnect'))
    }

    const createCrowdfundingProject = async (data: CampaignCreateType) => {
        const {
            owner,
            title,
            description,
            target,
            deadline,
            image
        } = data
        try {
            setLoadingPageMessage("Your project is being created!")
            const targetParsed = ethers.utils.parseEther(target)
            setIsLoading(true)
            const data = await createCampaign({
                args: [
                    owner,
                    title,
                    description,
                    targetParsed,
                    Date.parse(deadline),
                    image
                ]
            })
            console.log("contract call success", data)
            setIsLoading(false)
            setIsProjectCreated(true)
            getAllProjects()
            getUserProjects()
        } catch (error) {
            console.log(error)
            throw new Error("No ethereum object")
        } finally {
            setLoadingPageMessage(undefined)
        }
    }

    const formatCampaign = (campaign: CampaignType, index: string) => ({
        id: campaign.id || index,
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: useEthAmountParser(campaign.target._hex, 4),
        amountCollected: useEthAmountParser(campaign.amountCollected._hex, 4),
        deadline: useTimestampParser(campaign.deadline._hex),
        image: campaign.image,
        status: campaign.status,
        statusName: campaign.statusName,
        canUserClaimFunds: campaign.canUserClaimFunds,
        isRefunded: campaign.isRefunded
    })

    const getAllProjects = async () => {
        try {
            if (!contract) {
                return
            }
            setIsLoading(true)
            const campaigns = await getCampaigns({}) as any;
            const campaignsFormatted = campaigns.map(formatCampaign).filter((campaign: CampaignType) => Number(campaign.status) === 0)
            setCampaignsList(campaignsFormatted)
        } catch (error) {
            console.log(error)
            throw new Error("No ethereum object")
        } finally {
            setIsLoading(false)
        }
    }

    const getUserProjects = async () => {
        try {
            if (!contract || !currentAccount) {
                setCampaignsList([])
                setUserCampaignsList([])
                return
            }

            const campaigns = await getCampaigns({}) as any;
            if (!campaigns) {
                return
            }
            const campaignsFormatted = campaigns.map(formatCampaign)
            setUserCampaignsList(
              campaignsFormatted.filter((campaign: CampaignType) => campaign.owner.toUpperCase() === currentAccount.toUpperCase())
            )
        } catch (error) {
            console.log(error)
            throw new Error("No ethereum object")
        } finally {
            setLoadingPageMessage(undefined)
        }
    }

    const getProject = async (id: string): Promise<CampaignType | undefined> => {
        try {
            if (!contract || !currentAccount) {
                return
            }
            const [campaign, canUserClaimFunds] = await getCampaign({
                args: [id]
            }) as any;
            if (!campaign) {
                return
            }
            const campaignWithId = {
                ...campaign,
                id,
                canUserClaimFunds
            }
            const [campaignFormatted] = [campaignWithId].map(formatCampaign as any)
            return campaignFormatted as CampaignType
        } catch (error) {
            console.log(error)
            throw new Error("No campaign")
        } finally {
            setLoadingPageMessage(undefined)
        }
    }

    const getProjectDonators = async (id: string): Promise<string[] | undefined> => {
        try {
            if (!contract || !currentAccount) {
                return
            }
            const donators = await getDonators({
                args: [id]
            }) as any;
            return Array.from(new Set(donators[0]))
        } catch (error) {
            console.log(error)
            throw new Error("No campaign")
        } finally {
            setLoadingPageMessage(undefined)
        }
    }

    const donate = async (id: number, amount: string) => {
        try {
            if (!contract || !currentAccount) {
                return
            }
            setLoadingPageMessage("Your donation is being created!")
            const campaign = await donateToCampaign(
              {
                  args: [id],
                  overrides: {
                      value: ethers.utils.parseEther(amount)
                  }
              },
            );
            if (campaign.receipt.status === 1) {
                setAlertMessage({
                    title: 'Congrats!',
                    body: 'Your donation was proced with success',
                    type: 'success'
                })
            }
        } catch (error) {
            console.log(error)
            setAlertMessage({
                title: "Ops!",
                body: "There was an error to process your donation. Please, try again later!",
                type: "error"
            })
            throw new Error("Error to donate")
        } finally {
            setLoadingPageMessage(undefined)
        }
    }

    const deactivateProject = async (id: number) => {
        try {
            if (!contract || !currentAccount) {
                return
            }
            setLoadingPageMessage("We are deactivating your project!")
            await deactivateCampaign({
                args: [id]
            })
            setAlertMessage({
                title: 'Done!',
                body: 'Your project was deactivated with success.',
                type: 'success'
            })
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingPageMessage(undefined)
        }
    }

    const claimProject = async (id: number) => {
        try {
            if (!contract || !currentAccount) {
                return
            }
            setLoadingPageMessage("We are processing your funds!")
            await claim({
                args: [id]
            })
            setAlertMessage({
                title: 'Done!',
                body: 'The projects funds were sent to your account!',
                type: 'success'
            })
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingPageMessage(undefined)
        }
    }

    const providerData = {
        currentAccount,
        connectWallet,
        disconnectedWallet,
        walletBalance,
        isWalletLoading,
        alertMessage,
        setAlertMessage,
        isLoading,
        createCrowdfundingProject,
        userCampaignsList,
        campaignsList,
        loadingPageMessage,
        setIsProjectCreated,
        isProjectCreated,
        getProject,
        contract,
        donate,
        getProjectDonators,
        deactivateProject,
        getUserProjects,
        claimProject
    }
    return (
        <CrowdfundingContext.Provider value={providerData}>
            {children}
        </CrowdfundingContext.Provider>
    )
}