import { ethers } from "ethers"
import { createContext, useEffect, useState } from "react"
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
    userCampaignsList: CampaignType[]
    campaignsList: CampaignType[]
    loadingPageMessage?: string
}

type AlertMessage = {
    title: string,
    body: string
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
    amountCollected: any
    donators: string[]
    donations: any[]
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
    loadingPageMessage: undefined
})

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const { ethereum } = window;
const getEthereumContract  = () => {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    return new ethers.Contract(contractAddress, contractABI, signer)
}
export const CrowdfundingProvider = ({ children }: { children: any }) => {
    const [currentAccount, setCurrentAccount] = useState()
    const [walletBalance, setWalletBalance] = useState<string>()
    const [alertMessage, setAlertMessage] = useState<AlertMessage | undefined>()
    const [isWalletLoading, setIsWalletLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [loadingPageMessage, setLoadingPageMessage] = useState<string | undefined>()
    const [userCampaignsList, setUserCampaignsList] = useState<CampaignType[] | []>()
    const [campaignsList, setCampaignsList] = useState<CampaignType[] | []>()

    useEffect(() => {
        checkIfWalletIsConnected()
    }, []);

    useEffect(() => {
        getWalletBalance()
        getAllProjects()
    }, [currentAccount]);

    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) {
                return alert('Please install metamask!')
            }

            const accounts = await ethereum.request({ method: 'eth_accounts' })
            if (!accounts.length) {
                console.log("No accounts found")
                return
            }
            setCurrentAccount(accounts[0])
        } catch (error) {
            console.log(error)
            throw new Error("No ethereum object")
        }
    }
    const getWalletBalance = async () => {
        if (!currentAccount) {
            return
        }
        const balance = await ethereum.request({ method: 'eth_getBalance', params: [currentAccount] })
        // eslint-disable-next-line react-hooks/rules-of-hooks
        setWalletBalance(useEthAmountParser(balance, 4))
    }

    const connectWallet = async () => {
        try {
            if(!ethereum) {
                return alert('Please install metamask!')
            }
            setIsWalletLoading(true)
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
            setCurrentAccount(accounts[0])
        } catch (error) {
            console.log(error)
            throw new Error("No ethereum object")
        } finally {
            setIsWalletLoading(false)
        }
    }

    const disconnectedWallet = async () => {
        if(!ethereum) {
            return alert('Please install metamask!')
        }
        await ethereum.request({
            "method": "wallet_revokePermissions",
            "params": [
                {
                    "eth_accounts": {}
                }
            ]
        })
        setCurrentAccount(undefined)
        setWalletBalance('-')
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
            if(!ethereum) {
                return alert('Please install metamask!')
            }

            setLoadingPageMessage("Your project is being created!")
            const crowdfundingContract = getEthereumContract()

            const targetParsed = ethers.utils.parseEther(target)

            const transactionHash = await crowdfundingContract.createCampaign(
                owner,
                title,
                description,
                targetParsed,
                Date.parse(deadline),
                image
            )

            setIsLoading(true)
            console.log(`Loading - ${transactionHash.hash}`)
            await transactionHash.wait()
            setIsLoading(false)
            console.log(`Success = ${transactionHash.hash}`)
            getAllProjects()
        } catch (error) {
            console.log(error)
            throw new Error("No ethereum object")
        } finally {
            setLoadingPageMessage(undefined)
        }
    }

    const getAllProjects = async () => {
        try {
            if(!ethereum) {
                return alert('Please install metamask!')
            }
            if (!currentAccount) {
                setCampaignsList([])
                setUserCampaignsList([])
                return
            }

            const crowdfundingContract = getEthereumContract()
            const campaigns = await crowdfundingContract.getCampaigns()
            const campaignsFormatted = campaigns.map((campaign: CampaignType) => ({
                owner: campaign.owner,
                title: campaign.title,
                description: campaign.description,
                target: useEthAmountParser(campaign.target._hex, 4),
                amountCollected: useEthAmountParser(campaign.amountCollected._hex, 4),
                deadline: useTimestampParser(campaign.deadline._hex),
                image: campaign.image
            }))
            setCampaignsList(campaignsFormatted)
            setUserCampaignsList(campaignsFormatted.filter((campaign: CampaignType) => campaign.owner.toUpperCase() === currentAccount.toUpperCase()))
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
        loadingPageMessage
    }
    return (
        <CrowdfundingContext.Provider value={providerData}>
            {children}
        </CrowdfundingContext.Provider>
    )
}