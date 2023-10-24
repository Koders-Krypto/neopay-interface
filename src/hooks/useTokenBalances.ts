import { useContractReads, erc20ABI, useAccount, useNetwork } from 'wagmi'
import { tokenList } from '../utils/tokenList'

export const useTokenBalances = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()

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
    watch: true,
    enabled: !!address && chain && !chain.unsupported,
  })

  return tokenBalances
}
