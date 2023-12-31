'use client'

import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { Token, tokenList } from '../utils/tokenList'
import { formatUnits } from 'viem'
import { useTokenBalances } from '../hooks/useTokenBalances'

type Props = {
  selectionToken: Token | undefined
  setSelectionToken: React.Dispatch<React.SetStateAction<Token | undefined>>
  setSelectionIndex: React.Dispatch<React.SetStateAction<number>>
  otherToken: Token | undefined
}

export default function SelectChain({
  otherToken,
  selectionToken,
  setSelectionIndex,
  setSelectionToken,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const tokenBalances = useTokenBalances()

  return (
    <>
      {selectionToken?.address ? (
        <div
          className="flex flex-row items-center justify-between gap-1 px-2 py-1 text-center rounded-full shadow-md cursor-default bg-primary"
          onClick={() => setIsOpen(true)}
        >
          <div className="flex items-center justify-center w-5 h-5 bg-white rounded-full">
            <Image
              src={selectionToken.logoURI}
              alt={selectionToken.name}
              height={'15'}
              width={'15'}
            />
          </div>
          <span>{selectionToken.symbol}</span>
          <div className="w-4 h-4">
            <ChevronDownIcon />
          </div>
        </div>
      ) : (
        <button
          className="px-2 py-1 rounded-full bg-primary"
          onClick={() => setIsOpen(true)}
        >
          Select a Token
        </button>
      )}
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        show={isOpen}
      >
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          {/* The backdrop, rendered as a fixed sibling to the panel container */}
          <div className="fixed inset-0 bg-black/90" aria-hidden="true" />

          {/* Full-screen container to center the panel */}
          <div className="fixed inset-0 flex items-center justify-center w-screen p-4">
            {/* The actual dialog panel  */}
            <Dialog.Panel className="flex flex-col w-full max-w-md gap-4 p-4 mx-auto text-white bg-black border rounded-lg shadow-lg border-white/20">
              <div className="flex flex-row items-center justify-between">
                <Dialog.Title>Select a Token</Dialog.Title>
                <div className="w-5 h-5" onClick={() => setIsOpen(false)}>
                  <XMarkIcon />
                </div>
              </div>
              <div className="flex flex-row items-center justify-start gap-2 px-2 py-2 rounded-full bg-slate-800">
                <div className="w-5 h-5">
                  <MagnifyingGlassIcon />
                </div>
                <input
                  placeholder="Search"
                  className="w-full bg-slate-800 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-4 pt-3 overflow-y-scroll border-t no-scrollbar border-white/20 h-96">
                {tokenList.map(
                  (token, i) =>
                    token.address !== selectionToken?.address &&
                    token.address !== otherToken?.address && (
                      <div
                        className="flex flex-row items-center justify-between px-2 py-1 rounded-lg cursor-pointer hover:bg-white/10"
                        key={i}
                        onClick={() => {
                          setSelectionToken(token)
                          setSelectionIndex(i)
                          setIsOpen(false)
                        }}
                      >
                        <div className="flex flex-row items-center justify-center gap-2">
                          <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full">
                            <Image
                              src={token.logoURI}
                              alt={token.name}
                              height={'20'}
                              width={'20'}
                            />
                          </div>
                          <div>
                            <h3>{token.name}</h3>
                            <h4 className="text-xs">{token.symbol}</h4>
                          </div>
                        </div>
                        <div>
                          {tokenBalances && tokenBalances?.[i] && (
                            <span>
                              {Intl.NumberFormat('en-US', {
                                maximumFractionDigits: 2,
                              }).format(
                                parseFloat(
                                  formatUnits(
                                    tokenBalances[i].result as bigint,
                                    tokenList[i].decimals
                                  )
                                )
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                )}
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
