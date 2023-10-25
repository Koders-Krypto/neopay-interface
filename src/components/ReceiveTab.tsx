import React, { Fragment, SVGProps, useCallback, useRef, useState } from 'react'
import QRCode from 'react-qr-code'
import { erc20ABI, useAccount, useNetwork, usePublicClient } from 'wagmi'
import { Token, tokenList } from '../utils/tokenList'
import { Listbox, Transition } from '@headlessui/react'
import Image from 'next/image'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { toPng } from 'html-to-image'
import { formatUnits, parseUnits } from 'viem'
import { useTokenBalances } from '../hooks/useTokenBalances'
import toast from 'react-hot-toast'
import truncate from '../utils/truncate'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

const DownloadIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
    />
  </svg>
)

interface QrDataInterface {
  amount: `${number}`
  token: Token
  receiver: `0x${string}`
}

function ReceiveTab() {
  const { address, isConnected } = useAccount()
  const { open } = useWeb3Modal()
  const publicClient = usePublicClient()
  const { chain } = useNetwork()

  const [token, setToken] = useState(tokenList[0])
  const [amount, setAmount] = useState<`${number}`>('10')
  const [qrData, setQrData] = useState<QrDataInterface>()

  const qrRef = useRef<HTMLDivElement>(null)

  const tokenBalances = useTokenBalances()

  const generateQr = () => {
    if (!address) return
    setQrData({
      amount,
      token: token,
      receiver: address,
    })

    const unwatch = publicClient.watchContractEvent({
      address: token.address,
      abi: erc20ABI,
      eventName: 'Transfer',
      args: { to: address },
      onLogs: (logs) => {
        logs.forEach((log) => {
          if (log.eventName === 'Transfer') {
            const amountToReceive = parseUnits(amount, token.decimals)
            if (log.args.value === amountToReceive) {
              toast.success(
                <div>
                  <span>
                    {`Recieved ${amount} ${token.symbol} from ${truncate(
                      log.args.from,
                      14,
                      '...'
                    )}`}
                  </span>
                  <a
                    className="flex items-center gap-2"
                    target="_blank"
                    href={`${chain?.blockExplorers?.default.url}/tx/${log.transactionHash}`}
                  >
                    <span className="font-light underline">
                      View on explorer
                    </span>
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  </a>
                </div>
              )
              unwatch()
            }
          }
        })
      },
    })
  }

  const downloadQr = useCallback(() => {
    if (qrRef.current === null) return

    toPng(qrRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'neopay-qr.png'
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [qrRef])

  return (
    <>
      {!qrData ? (
        <>
          <div className="space-y-1">
            <label className="block text-sm" htmlFor="token">
              Select a Token
            </label>
            <Listbox value={token} onChange={setToken}>
              <div className="relative mt-1 bg-white rounded-lg">
                <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-200 p-1.5 rounded-full">
                      <div className="relative w-4 h-4">
                        <Image
                          src={token.logoURI}
                          alt={token.name ?? ''}
                          sizes="16px"
                          fill
                          style={{
                            objectFit: 'contain',
                          }}
                        />
                      </div>
                    </div>
                    <span className="block text-gray-900 truncate">
                      {token.symbol}
                    </span>
                  </div>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronUpDownIcon
                      className="w-5 h-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 focus:outline-none">
                    {tokenList.map((token, i) => (
                      <Listbox.Option
                        key={token.address}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-3 pr-4 text-gray-900 ${
                            active ? 'bg-blue-200' : 'bg-white'
                          }`
                        }
                        value={token}
                      >
                        {({ selected }) => (
                          <div
                            className={`flex items-center justify-between ${
                              selected ? 'opacity-60' : 'opacity-100'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className="bg-gray-200 p-1.5 rounded-full">
                                <div className="relative w-4 h-4">
                                  <Image
                                    src={token.logoURI}
                                    alt={token.name ?? ''}
                                    sizes="16px"
                                    fill
                                    style={{
                                      objectFit: 'contain',
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="flex flex-col">
                                <span className={`block truncate text-sm`}>
                                  {token.name}
                                </span>
                                <span className={`block truncate text-xs`}>
                                  {token.symbol}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {tokenBalances && tokenBalances?.[i] && (
                                <span className="block">
                                  {Intl.NumberFormat('en-US', {
                                    maximumFractionDigits: 2,
                                  }).format(
                                    parseFloat(
                                      formatUnits(
                                        tokenBalances[i].result as bigint,
                                        token.decimals
                                      )
                                    )
                                  )}
                                </span>
                              )}
                              {selected && (
                                <CheckIcon className="w-4 h-4 text-primary" />
                              )}
                            </div>
                          </div>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
          <div className="mt-4 space-y-1">
            <label className="block text-sm" htmlFor="amount">
              Enter the amount
            </label>
            <input
              id="amount"
              type="number"
              className="w-full bg-white text-gray-900 px-4 py-2.5 rounded-lg focus:outline-none"
              value={amount}
              onChange={(e) => setAmount(e.currentTarget.value as `${number}`)}
            />
          </div>
          {isConnected ? (
            <button
              disabled={!amount}
              className={`mt-6 w-full  rounded-md shadow-sm py-2.5 text-white ${
                !amount ? 'bg-gray-300' : 'bg-primary'
              }`}
              onClick={generateQr}
            >
              Generate QR
            </button>
          ) : (
            <button
              className="mt-6 w-full bg-primary rounded-md shadow-sm py-2.5 text-white"
              onClick={() => open()}
            >
              Connect wallet
            </button>
          )}
        </>
      ) : (
        <>
          <div ref={qrRef}>
            <QRCode
              style={{
                height: 'auto',
                maxWidth: '100%',
                width: '100%',
                borderRadius: '8px',
                border: '28px solid white',
              }}
              value={JSON.stringify(qrData)}
            />
          </div>

          <div className="flex gap-2 mt-3">
            <button
              className="flex items-center justify-center w-full gap-2 py-2 text-white rounded-md shadow-sm bg-primary"
              onClick={downloadQr}
            >
              <DownloadIcon
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              />
              Download
            </button>
            <button
              className="w-full py-2 border rounded-md shadow-sm border-primary text-primary"
              onClick={() => setQrData(undefined)}
            >
              Close
            </button>
          </div>
        </>
      )}
    </>
  )
}

export default ReceiveTab
