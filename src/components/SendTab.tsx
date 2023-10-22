import React, { Fragment, SVGProps, useState } from 'react'
import { QrReader } from 'react-qr-reader'
import {
  erc20ABI,
  useAccount,
  useContractReads,
  useContractWrite,
  useEnsName,
  usePublicClient,
} from 'wagmi'
import { tokenList } from '../utils/tokenList'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import { formatUnits, parseUnits } from 'viem'
import truncate from '../utils/truncate'
import {
  Fetcher,
  Percent,
  Route,
  Router,
  Token,
  TokenAmount,
  Trade,
  TradeType,
} from 'moonbeamswap'
import { router02Abi } from '../assets/abi/router02Abi'
import { ROUTER02_CONTRACT_ADDRESS } from '../utils/constants'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { waitForTransactionReceipt } from 'viem/public'
import toast from 'react-hot-toast'

const CheckmarkIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12.75l6 6 9-13.5"
    />
  </svg>
)

const CashIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
    />
  </svg>
)

const UserIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
)

interface QrDataInterface {
  amount: `${number}`
  token: Token
  receiver: `0x${string}`
}

function SendTab() {
  const { open } = useWeb3Modal()
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()

  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [qrData, setQrData] = useState<QrDataInterface>()
  const [selectedToken, setSelectedToken] = useState(tokenList[0])

  const { data: tokenBalances } = useContractReads({
    contracts: tokenList.map(
      (token) =>
        ({
          address: token.token.address as `0x${string}`,
          abi: erc20ABI,
          functionName: 'balanceOf',
          args: [address!],
        } as const)
    ),
    enabled: !!address,
    watch: true,
  })

  const { data: receiverEnsName } = useEnsName({
    address: qrData?.receiver,
    chainId: 1,
    enabled: !!qrData,
  })

  const { writeAsync: swapAndTransfer } = useContractWrite({
    address: ROUTER02_CONTRACT_ADDRESS,
    abi: router02Abi,
    functionName: 'swapTokensForExactTokens',
    account: address,
  })

  const { writeAsync: transfer } = useContractWrite({
    address: selectedToken.token.address as `0x${string}`,
    abi: erc20ABI,
    functionName: 'transfer',
    account: address,
  })

  const { writeAsync: approve } = useContractWrite({
    address: selectedToken.token.address as `0x${string}`,
    abi: erc20ABI,
    functionName: 'approve',
    account: address,
  })

  const handlePay = async () => {
    if (!qrData || !address) return

    const transferAmount = parseUnits(qrData.amount, qrData.token.decimals)

    if (qrData.token.equals(selectedToken.token)) {
      const transferTx = await transfer({
        args: [qrData.receiver, transferAmount],
      })
      toast.promise(
        waitForTransactionReceipt(publicClient, { hash: transferTx.hash }),
        {
          error: `Failed to pay ${qrData.amount} ${qrData.token.symbol} to ${
            receiverEnsName ?? truncate(qrData.receiver, 14, '...')
          }`,
          loading: `Paying ${qrData.amount} ${qrData.token.symbol} to ${
            receiverEnsName ?? truncate(qrData.receiver, 14, '...')
          }`,
          success: `Paid ${qrData.amount} ${qrData.token.symbol} to ${truncate(
            qrData.receiver,
            14,
            '...'
          )}`,
        }
      )
    } else {
      const pair = await Fetcher.fetchPairData(
        selectedToken.token,
        qrData.token
      )
      const route = new Route([pair], selectedToken.token)
      const trade = new Trade(
        route,
        new TokenAmount(qrData.token, transferAmount),
        TradeType.EXACT_OUTPUT
      )

      const swapParams = Router.swapCallParameters(trade, {
        ttl: 50,
        recipient: qrData.receiver,
        allowedSlippage: new Percent('1', '100'),
      })

      const allowance = await publicClient.readContract({
        address: selectedToken.token.address as `0x${string}`,
        abi: erc20ABI,
        functionName: 'allowance',
        args: [address, ROUTER02_CONTRACT_ADDRESS],
      })

      if (allowance < transferAmount) {
        const approveTx = await approve({
          args: [ROUTER02_CONTRACT_ADDRESS, transferAmount],
        })
        toast.promise(
          waitForTransactionReceipt(publicClient, { hash: approveTx.hash }),
          {
            error: `Approval failed`,
            loading: `Approving ${qrData.token.symbol}`,
            success: `Approved ${qrData.token.symbol}`,
          }
        )
      }

      //@ts-ignore
      const swapAndTransferTx = await swapAndTransfer({ args: swapParams.args })
      toast.promise(
        waitForTransactionReceipt(publicClient, {
          hash: swapAndTransferTx.hash,
        }),
        {
          error: `Failed to pay ${
            receiverEnsName ?? truncate(qrData.receiver, 14, '...')
          }, ${qrData.amount} ${qrData.token.symbol}`,
          loading: `Paying ${
            receiverEnsName ?? truncate(qrData.receiver, 14, '...')
          }, ${qrData.amount} ${
            qrData.token.symbol
          } with ${trade.executionPrice.toSignificant(6)} ${
            selectedToken.token.symbol
          }`,
          success: `Paid ${
            receiverEnsName ?? truncate(qrData.receiver, 14, '...')
          }, ${qrData.amount} ${
            qrData.token.symbol
          } with ${trade.executionPrice.toSignificant(6)} ${
            selectedToken.token.symbol
          }`,
        }
      )
    }
  }

  if (!cameraEnabled) {
    return (
      <div className="flex justify-center items-center h-[21rem]">
        <button
          className="bg-primary flex justify-center items-center gap-2 px-4 py-2.5 rounded-md shadow-sm"
          onClick={() => setCameraEnabled(true)}
        >
          <CheckmarkIcon
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          />
          <span className="block">Allow camera access</span>
        </button>
      </div>
    )
  }

  return (
    <>
      {!qrData ? (
        <QrReader
          onResult={async (result, error) => {
            if (!!result) {
              const {
                amount,
                token: { chainId, address, decimals, symbol, name },
                receiver,
              } = JSON.parse(result.getText())
              const token = new Token(chainId, address, decimals, symbol, name)
              setQrData({ amount, token, receiver })
            }

            if (!!error) return
          }}
          videoContainerStyle={{
            borderRadius: '8px',
            border: '2px dashed #01AE92',
          }}
          constraints={{
            aspectRatio: 1 / 1,
            facingMode: 'environment',
          }}
        />
      ) : (
        <div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <CashIcon
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                />
                <span className="block">
                  Amount: {qrData.amount} {qrData.token.symbol}
                </span>
              </div>
              <div className="flex items-center gap-2 font-bold">
                <UserIcon
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                />
                <span className="block">
                  Receiver:{' '}
                  {receiverEnsName ?? truncate(qrData.receiver, 14, '...')}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm" htmlFor="token">
                Select a Token to Pay
              </label>
              <Listbox value={selectedToken} onChange={setSelectedToken}>
                <div className="relative mt-1 bg-white rounded-lg z-50">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md">
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-200 p-1.5 rounded-full">
                        <div className="relative h-4 w-4">
                          <Image
                            src={selectedToken.logoURI}
                            alt={selectedToken.token.name ?? ''}
                            sizes="16px"
                            fill
                            style={{
                              objectFit: 'contain',
                            }}
                          />
                        </div>
                      </div>
                      <span className="block truncate text-gray-900">
                        {selectedToken.token.symbol}
                      </span>
                    </div>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
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
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none">
                      {tokenList.map((token, i) => (
                        <Listbox.Option
                          key={token.token.address}
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
                                  <div className="relative h-4 w-4">
                                    <Image
                                      src={token.logoURI}
                                      alt={token.token.name ?? ''}
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
                                    {token.token.name}
                                  </span>
                                  <span className={`block truncate text-xs`}>
                                    {token.token.symbol}
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
                                          token.token.decimals
                                        )
                                      )
                                    )}
                                  </span>
                                )}
                                {selected && (
                                  <CheckIcon className="h-4 w-4 text-primary" />
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
          </div>
          <div className="mt-3 space-y-2">
            {isConnected ? (
              <button
                className="w-full bg-primary rounded-md shadow-sm py-2.5 text-white flex items-center justify-center gap-2"
                onClick={handlePay}
              >
                Pay
              </button>
            ) : (
              <button
                className="w-full bg-primary rounded-md shadow-sm py-2.5 text-white"
                onClick={() => open()}
              >
                Connect Wallet
              </button>
            )}
            <button
              className="w-full pt-1 text-white"
              onClick={() => setQrData(undefined)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default SendTab
