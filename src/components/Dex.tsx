import React, { Fragment, SVGProps, useCallback, useRef, useState } from 'react'
import QRCode from 'react-qr-code'
import { erc20ABI, useAccount, useConnect, useContractReads } from 'wagmi'
import { tokenList } from '../utils/tokenList'
import { Listbox, Transition } from '@headlessui/react'
import Image from 'next/image'
import {
  ArrowDownIcon,
  CheckIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/20/solid'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { formatUnits } from 'viem'
import { ArrowsUpDownIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import SelectChain from './SelectToken'

function Dex() {
  const { address, isConnected } = useAccount()
  const { open } = useWeb3Modal()
  const [select, setSelect] = useState()
  const [amount, setAmount] = useState(0)

  const { data: tokenBalances } = useContractReads({
    contracts: tokenList.map(
      (token) =>
        ({
          address: token.address,
          abi: erc20ABI,
          functionName: 'balanceOf',
          args: [address!],
        } as const)
    ),
    enabled: !!address,
  })

  function payAmountChange(e: number) {
    if (e > 0) {
      setAmount(e)
    } else {
      setAmount(0)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="relative flex flex-col gap-2">
          <div className="flex flex-col gap-2 p-4 rounded-lg bg-black/60">
            <label className="block text-sm" htmlFor="token">
              You Pay
            </label>

            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center justify-between">
                <input
                  className="w-1/2 text-2xl font-medium bg-transparent focus:outline-none"
                  min="0"
                  placeholder="0"
                  inputMode="decimal"
                  autoComplete="off"
                  autoCorrect="off"
                  type="number"
                  pattern="^[0-9]*[.,]?[0-9]*$"
                  minLength={1}
                  maxLength={79}
                  spellCheck="false"
                  onChange={(e) => payAmountChange(parseFloat(e.target.value))}
                />

                <SelectChain tokens={tokenList} selected={tokenList[0]} />
              </div>
              <div className={amount ? 'block' : 'invisible'}>
                <div className="flex flex-row items-center justify-between text-xs">
                  <h4>$1,606.18</h4>
                  <div className="flex flex-row gap-1">
                    <h5>Balance: 0.014</h5>
                    <button className="font-semibold text-primary">Max</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute flex items-center justify-center centered">
            <div className="w-9 h-9 p-1 bg-black/90 border-[3px] border-slate-800 rounded-lg shadow-md">
              <ArrowsUpDownIcon />
            </div>
          </div>
          <div className="flex flex-col gap-2 p-4 rounded-lg bg-black/60">
            <label className="block text-sm" htmlFor="token">
              You Recieve
            </label>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center justify-between">
                <input
                  className="w-1/2 text-2xl font-medium bg-transparent focus:outline-none"
                  type="number"
                  min="0"
                  placeholder="0"
                />
                <SelectChain tokens={tokenList} selected={setSelect} />
              </div>
              <div className="invisible ">
                <div className="flex flex-row items-center justify-between text-xs">
                  <h4>$1,606.18</h4>
                  <div className="flex flex-row gap-1">
                    <h5>Balance: 0.014</h5>
                    <button className="font-semibold text-primary">Max</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isConnected ? (
          <button
            disabled={!amount}
            className={`w-full  rounded-lg shadow-sm py-3 text-white text-lg ${
              !amount ? 'bg-black/60' : 'bg-primary'
            }`}
          >
            Swap
          </button>
        ) : (
          <button
            className="w-full py-3 text-lg text-white rounded-lg shadow-sm bg-primary"
            onClick={() => open()}
          >
            Connect wallet
          </button>
        )}
      </div>
    </>
  )
}

export default Dex
