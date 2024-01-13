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
import {WalletInstance} from "@thirdweb-dev/react-core/dist/declarations/src/core/types/wallet";

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
    userCampaignsList: CampaignType[] | []
    campaignsList: CampaignType[] | []
    loadingPageMessage?: string,
    isProjectCreated: boolean,
    setIsProjectCreated: (value: boolean) => void
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
    deadline: string
    image: string
}

export type CampaignType = CampaignCreateType & {
    amountCollected: unknown
    donators: string[]
    donations: unknown[]
    status: string
    target: unknown
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
    isProjectCreated: false
})

export const CrowdfundingProvider = ({ children }: { children: any }) => {
    const { contract } = useContract(contractAddress, contractABI);
    const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');
    const { mutateAsync: getCampaigns } = useContractWrite(contract, 'getCampaigns');

    const connect = useConnect();
    const disconnect = useDisconnect()
    const currentAccount = useAddress();
    const balance = useBalance()

    const [currentWallet, setCurrentWallet] = useState<WalletInstance>()
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
            const wallet = await connect(metamaskWallet())
            setCurrentWallet(wallet)
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
        } catch (error) {
            console.log(error)
            throw new Error("No ethereum object")
        } finally {
            setLoadingPageMessage(undefined)
        }
    }

    const formatCampaign = (campaign: CampaignType) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: useEthAmountParser(campaign.target._hex, 4),
        amountCollected: useEthAmountParser(campaign.amountCollected._hex, 4),
        deadline: useTimestampParser(campaign.deadline._hex),
        image: campaign.image,
        status: campaign.status
    })

    const getAllProjects = async () => {
        try {
            if (!contract) {
                return
            }
            setIsLoading(true)
            const campaigns = await getCampaigns({});
            const campaignsFormatted = campaigns.map(formatCampaign)
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

            const campaigns = await getCampaigns({});
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
        isProjectCreated
    }
    return (
        <CrowdfundingContext.Provider value={providerData}>
            {children}
        </CrowdfundingContext.Provider>
    )
}