import EthereumLogo from '../assets/logos/ethereum-logo.svg'
import UsdCoinLogo from '../assets/logos/usd-coin-logo.svg'
import DaiLogo from '../assets/logos/dai-logo.svg'
import ChainlinkLogo from '../assets/logos/chainlink-logo.svg'

export interface Token {
  logoURI: string
  address: `0x${string}`
  name: string
  symbol: string
  decimals: number
}

export const tokenList: Token[] = [
  {
    logoURI: EthereumLogo,
    address: '0x2aCB7bfB8D91E998C33B90D5C3980fe9A2c9dF2d',
    name: 'Wrapped Ether',
    symbol: 'WETH',
    decimals: 18,
  },
  {
    logoURI: UsdCoinLogo,
    address: '0xD0d4C08136877F7E25A355900B20100fBF19562A',
    name: 'USDCoin',
    symbol: 'USDC',
    decimals: 6,
  },
  {
    logoURI: DaiLogo,
    address: '0x43B0f98ED4f1f008375882934f35b2620E8aE0a1',
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: 18,
  },
  {
    logoURI: ChainlinkLogo,
    address: '0x6Edfe03bA366C1A6b571Ac583fa4E4500b682C3f',
    name: 'ChainLink Token',
    symbol: 'LINK',
    decimals: 18,
  },
]
