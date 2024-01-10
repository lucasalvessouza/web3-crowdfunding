import { ethers } from "ethers"
import { createContext, useEffect, useState } from "react"
import { contractABI, contractAddress } from "../utils/constants"
import useEthAmountParser from "../hooks/useEthAmountParser";

type CrowdfundingProviderType = {
    currentAccount?: string,
    connectWallet: () => void,
    disconnectedWallet: () => void,
    walletBalance?: string,
    isWalletLoading: boolean
}
export const CrowdfundingContext = createContext<CrowdfundingProviderType>({})

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
    const [isWalletLoading, setIsWalletLoading] = useState(false)

    useEffect(() => {
        checkIfWalletIsConnected()
    }, []);

    useEffect(() => {
        getWalletBalance()
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

    const providerData = {
        currentAccount,
        connectWallet,
        disconnectedWallet,
        walletBalance,
        isWalletLoading
    }
    return (
        <CrowdfundingContext.Provider value={providerData}>
            {children}
        </CrowdfundingContext.Provider>
    )
}