'use client'
import { WalletIcon } from '@heroicons/react/24/outline'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useEffect } from 'react'

export default function ConnectButton() {
  const { open, close } = useWeb3Modal()

  return (
    <>
      <button
        className="flex flex-row items-center justify-center gap-2 px-4 py-2 rounded-full shadow-sm bg-primary"
        onClick={() => open()}
      >
        <WalletIcon className="w-5 h-5" />
        Connect Wallet
      </button>
    </>
  )
}
