import logo from '../../assets/logo.png'
import { FaPlus } from 'react-icons/fa'
import { PiPlugsConnectedFill } from "react-icons/pi";
import {useContext, useState} from "react";
import { Link } from "react-router-dom"
import { CrowdfundingContext } from "../../context/CrowdfundingContext";
import Loader from "../Loader";

const Navbar = () => {
    const [toggleMenu, setToggleMenu] = useState<boolean>(false)
    const { connectWallet, disconnectedWallet, currentAccount, isWalletLoading, walletBalance } = useContext(CrowdfundingContext)
    return (
        <nav className="bg-gray-800 py-2">
            <div className="mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button type="button"
                                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                aria-controls="mobile-menu" aria-expanded="false"
                                onClick={() => setToggleMenu(!toggleMenu)}>
                            <span className="absolute -inset-0.5"></span>
                            <span className="sr-only">Open main menu</span>
                            <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                 stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
                            </svg>
                            <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                 stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex flex-shrink-0 items-center">
                            <img className="h-[60px] w-auto"
                                 src={logo}
                                 alt="Your Company"/>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex h-auto items-center">
                            <ul className="flex space-x-4">
                                <li
                                    className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                                    <Link to={""}>Campaigns</Link>
                                </li>
                                <li
                                    className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                                    <Link to={"/my-campaigns"}>My Campaigns</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="hidden md:flex lg:flex flex-end gap-3">
                        <Link to="/campaigns/create">
                            <button
                                className="flex items-center bg-[#1dc071] hover:bg-[#4acc8d] font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px]"
                            >
                                <FaPlus className="w-3 mr-2"/>
                                Create campaign
                            </button>
                        </Link>
                        {currentAccount && <div className="flex items-center font-epilogue bg-blue-600 font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px]">ETH: {walletBalance}</div>}
                        <button
                            onClick={currentAccount? disconnectedWallet : connectWallet}
                            className={`flex items-center ${!currentAccount ? 'bg-blue-600 hover:bg-[#3a72ba]' : 'bg-purple-600 hover:bg-purple-400'} font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px]`}>
                            {isWalletLoading && <Loader style={"mr-3"}/>}
                            {currentAccount && <PiPlugsConnectedFill className="w-[30px]" />}
                            {currentAccount ? 'Disconnect Wallet' : 'Connect Wallet'}
                        </button>
                    </div>
                </div>
            </div>

            {toggleMenu &&
                <div className="sm:hidden mb-3 transform transition duration-500" id="mobile-menu">
                    <ul className="space-y-1 px-2 pb-3 pt-2">
                        <li
                            className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                            <Link to={""}>Campaigns</Link>
                        </li>
                        <li
                            className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                            <Link to={"/my-campaigns"}>My Campaigns</Link>
                        </li>
                        <li
                            className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                            <Link to={"/campaigns/create"}>Create campaign</Link>
                        </li>
                        <li
                            className="flex flex-col  gap-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                            {currentAccount && <div className="flex items-center font-epilogue bg-blue-600 font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px]">ETH: {walletBalance}</div>}
                            <button
                              onClick={currentAccount ? disconnectedWallet : connectWallet}
                              className={`flex items-center ${!currentAccount ? 'bg-blue-600 hover:bg-[#3a72ba]' : 'bg-purple-600 hover:bg-purple-400'} font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] text-center`}>
                                {isWalletLoading && <Loader style={"mr-3"}/>}
                                {currentAccount && <PiPlugsConnectedFill className="w-[30px]"/>}
                                {currentAccount ? 'Disconnect Wallet' : 'Connect Wallet'}
                            </button>
                        </li>
                    </ul>
                </div>
            }

        </nav>
    )
}

export default Navbar