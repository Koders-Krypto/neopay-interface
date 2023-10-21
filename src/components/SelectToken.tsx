'use client'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { tokenList } from '../utils/tokenList'
import { formatUnits, parseUnits } from 'viem'

export default function SelectChain(props: any) {
  const [selected, setSelected] = useState(props.select)
  const [other, setOther] = useState(props.other)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setSelected(props.select)
    setOther(props.other)
  }, [props])
  return (
    <>
      {selected?.address ? (
        <div
          className="flex flex-row items-center justify-between gap-1 px-2 py-1 text-center rounded-full shadow-md cursor-default bg-slate-800"
          onClick={() => setIsOpen(true)}
        >
          <div className="flex items-center justify-center w-5 h-5 bg-white rounded-full">
            <Image
              src={selected.logoURI}
              alt={selected.name}
              height={'15'}
              width={'15'}
            />
          </div>
          <span>{selected.symbol}</span>
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
            <Dialog.Panel className="flex flex-col w-full max-w-md gap-4 p-4 mx-auto text-white rounded-lg bg-black/95">
              <div className="flex flex-row items-center justify-between">
                <Dialog.Title>Select a Token</Dialog.Title>
                <div className="w-5 h-5" onClick={() => setIsOpen(false)}>
                  <XMarkIcon />
                </div>
              </div>
              {tokenList.map(
                (token: any, i: number) =>
                  token.address !== selected?.address &&
                  token.address !== other?.address && (
                    <div
                      className="flex flex-row items-center justify-between cursor-pointer"
                      key={i}
                      onClick={() => {
                        props.index(i)
                        props.tokenID(token)
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
                        {props?.balances && props.balances?.[i] && (
                          <span>
                            {formatUnits(
                              props.balances?.[i].result,
                              token.decimals
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  )
              )}

              {/* ... */}
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
