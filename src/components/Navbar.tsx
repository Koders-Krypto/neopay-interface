'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import ConnectButton from './ConnectButton'
import { usePathname } from 'next/navigation'
import { GiftIcon } from '@heroicons/react/20/solid'
import { useWalletClient } from 'wagmi'
import { FAUCET_ADDRESS } from '../utils/constants'
import { parseAbi } from 'viem'

export default function Navbar() {
  const pathname = usePathname()
  const { data: walletClient } = useWalletClient()
  const [navbarBgColor, setNavbarBgColor] = useState('bg-transparent')

  const changeBackground = () => {
    if (window.scrollY >= 66) {
      setNavbarBgColor('bg-black/80 shadow-2xl')
    } else {
      setNavbarBgColor('bg-transparent')
    }
  }

  const handleFaucet = async () => {
    await walletClient?.writeContract({
      address: FAUCET_ADDRESS,
      abi: parseAbi(['function claim() external']),
      functionName: 'claim',
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', changeBackground)
    return () => {
      window.removeEventListener('scroll', changeBackground)
    }
  })

  return (
    <div className="fixed w-full mt-4">
      <div
        className={`flex justify-between items-center z-50 p-3 pl-6 text-white rounded-full max-w-7xl mx-auto ${navbarBgColor}`}
      >
        <Link href="/">
          <Image
            src="/neopay-logo.png"
            alt="neopay logo"
            height="160"
            width="160"
          />
        </Link>
        {pathname === '/app' ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleFaucet}
              className="bg-primary px-4 py-2 rounded-full flex items-center gap-2"
            >
              <span className="hidden md:block">Faucet</span>
              <GiftIcon className="h-5 w-5" />
            </button>
            <ConnectButton />
          </div>
        ) : (
          <Link
            href="/app"
            className="px-4 py-2 text-white uppercase rounded-full shadow-md md:text-lg bg-primary md:px-6"
          >
            Launch App
          </Link>
        )}
      </div>
    </div>
  )
}
