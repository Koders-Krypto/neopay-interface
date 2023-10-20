'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Web3Button } from './Web3Button'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const [navbarBgColor, setNavbarBgColor] = useState('bg-transparent')

  const changeBackground = () => {
    if (window.scrollY >= 66) {
      setNavbarBgColor('bg-black/80 shadow-2xl')
    } else {
      setNavbarBgColor('bg-transparent')
    }
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
          <Image src="/neopay-logo.png" alt="neopay" height="150" width="150" />
        </Link>
        {pathname === '/app' ? (
          <Web3Button />
        ) : (
          <Link
            href="/app"
            className="md:text-lg text-white shadow-md bg-[#01AE92] px-4 md:px-6 py-2 rounded-full uppercase"
          >
            Launch App
          </Link>
        )}
      </div>
    </div>
  )
}
