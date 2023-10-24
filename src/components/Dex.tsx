import React, { useState } from 'react'
import { erc20ABI, useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { Token, tokenList } from '../utils/tokenList'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { formatUnits, parseUnits } from 'viem'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import SelectToken from './SelectToken'
import { useTokenBalances } from '../hooks/useTokenBalances'
import {
  getExecutionPriceExactIn,
  getExecutionPriceExactOut,
  getSwapParamsExactIn,
  getSwapParamsExactOut,
} from '../utils/swap'
import { ROUTER02_CONTRACT_ADDRESS } from '../utils/constants'
import { router02Abi } from '../assets/abi/router02Abi'
import { waitForTransaction } from '@wagmi/core'
import toast from 'react-hot-toast'

enum TradeType {
  EXACT_INPUT = 'swapExactTokensForTokens',
  EXACT_OUTPUT = 'swapTokensForExactTokens',
}

function Dex() {
  const { address, isConnected } = useAccount()
  const { open } = useWeb3Modal()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const tokenBalances = useTokenBalances()

  const [tokenA, setTokenA] = useState<Token | undefined>(tokenList[0])
  const [indexA, setIndexA] = useState<number>(0)
  const [amountA, setAmountA] = useState('0')
  const [tokenB, setTokenB] = useState<Token | undefined>()
  const [indexB, setIndexB] = useState<number>(-1)
  const [amountB, setAmountB] = useState('0')
  const [tradeType, setTradeType] = useState<TradeType>(TradeType.EXACT_INPUT)

  const inverseToken = () => {
    setTokenA(tokenB)
    setIndexA(indexB)
    setTokenB(tokenA)
    setIndexB(indexA)
  }

  const handleAmountAChange = async (amount: string) => {
    setAmountA(amount)
    if (!tokenA || !tokenB || !amount) return
    const inputAmount = parseUnits(amount, tokenA.decimals)
    if (inputAmount <= 0) return
    const executionPrice = await getExecutionPriceExactIn(
      tokenA,
      tokenB,
      inputAmount,
      publicClient
    )
    setAmountB(formatUnits(executionPrice, tokenB.decimals))
    setTradeType(TradeType.EXACT_INPUT)
  }

  const handleAmountBChange = async (amount: string) => {
    setAmountB(amount)
    if (!tokenA || !tokenB || !amount) return
    const outputAmount = parseUnits(amount, tokenB.decimals)
    if (outputAmount <= 0) return
    const executionPrice = await getExecutionPriceExactOut(
      tokenA,
      tokenB,
      outputAmount,
      publicClient
    )
    setAmountA(formatUnits(executionPrice, tokenA.decimals))
    setTradeType(TradeType.EXACT_OUTPUT)
  }

  const handleSwap = async () => {
    if (!tokenA || !tokenB || !amountA || !address || !walletClient) return

    const swapConfig = {
      allowedSlippage: BigInt(100),
      recipient: address,
      ttl: 50,
    }
    const inputAmount = parseUnits(amountA, tokenA.decimals)
    const outputAmount = parseUnits(amountB, tokenB.decimals)
    let swapParams
    if (tradeType === TradeType.EXACT_INPUT) {
      swapParams = await getSwapParamsExactIn(
        tokenA,
        tokenB,
        inputAmount,
        publicClient,
        swapConfig
      )
    } else {
      swapParams = await getSwapParamsExactOut(
        tokenA,
        tokenB,
        outputAmount,
        publicClient,
        swapConfig
      )
    }

    const allowance = await publicClient.readContract({
      address: tokenA.address,
      abi: erc20ABI,
      functionName: 'allowance',
      args: [address, ROUTER02_CONTRACT_ADDRESS],
    })
    if (allowance < inputAmount) {
      const approveTx = await walletClient.writeContract({
        address: tokenA.address,
        abi: erc20ABI,
        functionName: 'approve',
        args: [ROUTER02_CONTRACT_ADDRESS, inputAmount],
      })
      toast.promise(waitForTransaction({ hash: approveTx }), {
        error: `Approval failed`,
        loading: `Approving ${amountA} ${tokenA.symbol}`,
        success: `Approved ${amountA} ${tokenA.symbol}`,
      })
    }

    const swapTx = await walletClient.writeContract({
      address: ROUTER02_CONTRACT_ADDRESS,
      abi: router02Abi,
      functionName: tradeType,
      args: [swapParams],
    })
    toast.promise(waitForTransaction({ hash: swapTx }), {
      error: `Swap failed`,
      loading: `Swapping ${amountA} ${tokenA.symbol} for ${amountB} ${tokenB.symbol}`,
      success: `Swapped ${amountA} ${tokenA.symbol} for ${amountB} ${tokenB.symbol}`,
    })
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
                  value={amountA}
                  onChange={({ target }) => handleAmountAChange(target.value)}
                />

                <SelectToken
                  selectionToken={tokenA}
                  setSelectionToken={setTokenA}
                  setSelectionIndex={setIndexA}
                  otherToken={tokenB}
                />
              </div>

              {tokenBalances && tokenBalances?.[indexA] && (
                <h5 className="text-xs self-end">
                  Balance:{' '}
                  <span>
                    {Intl.NumberFormat('en-US', {
                      maximumFractionDigits: 2,
                    }).format(
                      parseFloat(
                        formatUnits(
                          tokenBalances[indexA].result as bigint,
                          tokenList[indexA].decimals
                        )
                      )
                    )}
                  </span>
                  <button
                    className="ml-1 font-semibold text-primary"
                    onClick={() =>
                      handleAmountAChange(
                        formatUnits(
                          tokenBalances[indexA].result as bigint,
                          tokenList[indexA].decimals
                        )
                      )
                    }
                  >
                    Max
                  </button>
                </h5>
              )}
            </div>
          </div>
          <div className="absolute flex items-center justify-center left-0 right-0 m-auto top-[42.5%]">
            <div
              className="w-9 h-9 p-1 bg-black/90 border-[3px] border-slate-800 rounded-lg shadow-md"
              onClick={inverseToken}
            >
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
                  value={amountB}
                  onChange={({ target }) => handleAmountBChange(target.value)}
                />

                <SelectToken
                  selectionToken={tokenB}
                  setSelectionToken={setTokenB}
                  setSelectionIndex={setIndexB}
                  otherToken={tokenA}
                />
              </div>

              {tokenBalances && tokenBalances?.[indexB] && (
                <h5 className="text-xs self-end">
                  Balance:{' '}
                  <span>
                    {Intl.NumberFormat('en-US', {
                      maximumFractionDigits: 2,
                    }).format(
                      parseFloat(
                        formatUnits(
                          tokenBalances[indexB].result as bigint,
                          tokenList[indexB].decimals
                        )
                      )
                    )}
                  </span>
                  <button
                    className="ml-1 font-semibold text-primary"
                    onClick={() =>
                      handleAmountBChange(
                        formatUnits(
                          tokenBalances[indexB].result as bigint,
                          tokenList[indexB].decimals
                        )
                      )
                    }
                  >
                    Max
                  </button>
                </h5>
              )}
            </div>
          </div>
        </div>
        {isConnected ? (
          <button
            disabled={!amountA || !amountB}
            className={`w-full  rounded-lg shadow-sm py-3 text-white text-lg ${
              !amountA || !amountB ? 'bg-black/60' : 'bg-primary'
            }`}
            onClick={handleSwap}
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
