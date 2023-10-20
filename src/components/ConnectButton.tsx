'use client'
import {
  ArrowRightOnRectangleIcon,
  WalletIcon,
} from '@heroicons/react/24/outline'
import { useWeb3Modal } from '@web3modal/wagmi/react'

import { useAccount, useEnsName } from 'wagmi'
import Truncate from './utils/Truncate'

export default function ConnectButton() {
  const { open, close } = useWeb3Modal()
  const { address, isConnected } = useAccount()
  const {
    data: ensName,
    isError,
    isLoading,
  } = useEnsName({
    address: address,
    chainId: 1,
    enabled: !!address,
  })
  return (
    <>
      {isConnected ? (
        <button
          className="flex flex-row items-center justify-center gap-2 px-4 py-2 rounded-full shadow-sm bg-primary"
          onClick={() => open()}
        >
          {ensName ? ensName : Truncate(address, 14, '...')}

          <div className="w-5 h-5">
            <ArrowRightOnRectangleIcon />
          </div>
        </button>
      ) : (
        <button
          className="flex flex-row items-center justify-center gap-2 px-4 py-2 rounded-full shadow-sm bg-primary"
          onClick={() => open()}
        >
          <WalletIcon className="w-5 h-5" />
          Connect Wallet
        </button>
      )}
    </>
  )
}
