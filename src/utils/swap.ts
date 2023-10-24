import {
  PublicClient,
  encodePacked,
  getAddress,
  getContractAddress,
  keccak256,
  parseUnits,
} from 'viem'
import { FACTORY_ADDRESS, INIT_CODE_HASH } from './constants'
import { v2PairAbi } from '../assets/abi/v2PairAbi'
import { Token } from './tokenList'

let PAIR_ADDRESS_CACHE: {
  [token0Address: `0x${string}`]: {
    [token1Address: `0x${string}`]: `0x${string}`
  }
} = {}

const getPairAddress = (tokenA: Token, tokenB: Token): `0x${string}` => {
  const tokens =
    tokenA.address.toLowerCase() < tokenB.address.toLowerCase()
      ? [tokenA, tokenB]
      : [tokenB, tokenA] // does safety checks

  if (
    PAIR_ADDRESS_CACHE?.[tokens[0].address]?.[tokens[1].address] === undefined
  ) {
    PAIR_ADDRESS_CACHE = {
      ...PAIR_ADDRESS_CACHE,
      [tokens[0].address]: {
        ...PAIR_ADDRESS_CACHE?.[tokens[0].address],
        [tokens[1].address]: getContractAddress({
          from: FACTORY_ADDRESS,
          opcode: 'CREATE2',
          salt: keccak256(
            encodePacked(
              ['address', 'address'],
              [tokens[0].address, tokens[1].address]
            ),
            'bytes'
          ),
          bytecodeHash: INIT_CODE_HASH,
        }),
      },
    }
  }

  return PAIR_ADDRESS_CACHE[tokens[0].address][tokens[1].address]
}

const fetchPairData = async (
  tokenA: Token,
  tokenB: Token,
  publicClient: PublicClient
) => {
  const address = getPairAddress(tokenA, tokenB)
  const [reserves0, reserves1] = await publicClient.readContract({
    address,
    abi: v2PairAbi,
    functionName: 'getReserves',
  })
  const balances =
    tokenA.address.toLowerCase() < tokenB.address.toLowerCase()
      ? [reserves0, reserves1]
      : [reserves1, reserves0]
  return balances
}

export const getExecutionPriceExactIn = async (
  tokenA: Token,
  tokenB: Token,
  inputAmount: bigint,
  publicClient: PublicClient
) => {
  const reserves = await fetchPairData(tokenA, tokenB, publicClient)
  let inputReserve = reserves[0]
  let outputReserve = reserves[1]

  const outputAmount =
    (inputAmount * BigInt(997) * outputReserve) /
    (inputReserve * BigInt(1000) + inputAmount * BigInt(997))

  return (
    (parseUnits(outputAmount.toString(), tokenA.decimals) *
      parseUnits('1', tokenB.decimals)) /
    parseUnits(inputAmount.toString(), tokenB.decimals)
  )
}

export const getExecutionPriceExactOut = async (
  tokenA: Token,
  tokenB: Token,
  outputAmount: bigint,
  publicClient: PublicClient
) => {
  const reserves = await fetchPairData(tokenA, tokenB, publicClient)
  let inputReserve = reserves[0]
  let outputReserve = reserves[1]

  const inputAmount =
    (inputReserve * outputAmount * BigInt(1000)) /
      ((outputReserve - outputAmount) * BigInt(997)) +
    BigInt(1)

  return (
    (parseUnits(inputAmount.toString(), tokenB.decimals) *
      parseUnits('1', tokenA.decimals)) /
    parseUnits(outputAmount.toString(), tokenA.decimals)
  )
}

export const getSwapParamsExactIn = async (
  tokenA: Token,
  tokenB: Token,
  inputAmount: bigint,
  publicClient: PublicClient,
  options: { recipient: `0x${string}`; ttl: number; allowedSlippage: bigint }
): Promise<[bigint, bigint, `0x${string}`[], `0x${string}`, bigint]> => {
  const to = getAddress(options.recipient)
  const reserves = await fetchPairData(tokenA, tokenB, publicClient)

  let inputReserve = reserves[0]
  let outputReserve = reserves[1]

  const outputAmount =
    (inputAmount * BigInt(997) * outputReserve) /
    (inputReserve * BigInt(1000) + inputAmount * BigInt(997))
  const slippageAdjustedAmountOut =
    (options.allowedSlippage * outputAmount) / BigInt(100)
  const path = [tokenA.address, tokenB.address]
  const deadline = BigInt(Math.floor(new Date().getTime() / 1000) + options.ttl)

  return [inputAmount, slippageAdjustedAmountOut, path, to, deadline]
}

export const getSwapParamsExactOut = async (
  tokenA: Token,
  tokenB: Token,
  outputAmount: bigint,
  publicClient: PublicClient,
  options: { recipient: `0x${string}`; ttl: number; allowedSlippage: bigint }
): Promise<[bigint, bigint, `0x${string}`[], `0x${string}`, bigint]> => {
  const to = getAddress(options.recipient)
  const reserves = await fetchPairData(tokenA, tokenB, publicClient)

  let inputReserve = reserves[0]
  let outputReserve = reserves[1]
  const inputAmount =
    (inputReserve * outputAmount * BigInt(1000)) /
    ((outputReserve - outputAmount) * BigInt(997))
  const slippageAdjustedAmountIn =
    (options.allowedSlippage * inputAmount) / BigInt(100) + BigInt(1)
  const path = [tokenA.address, tokenB.address]
  const deadline = BigInt(Math.floor(new Date().getTime() / 1000) + options.ttl)

  return [outputAmount, slippageAdjustedAmountIn, path, to, deadline]
}
