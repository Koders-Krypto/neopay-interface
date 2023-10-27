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
    address: '0xbD3eB6b39CcC68dE73b9d0951432bF29d5ABF0ad',
    name: 'Wrapped Ether',
    symbol: 'WETH',
    decimals: 18,
  },
  {
    logoURI: UsdCoinLogo,
    address: '0xFA4aBB6EC55CA20Fda79F7D50dE9aC58C932fa86',
    name: 'USDCoin',
    symbol: 'USDC',
    decimals: 6,
  },
  {
    logoURI: DaiLogo,
    address: '0x5A4B8d5337C4d6440c3aB74828Cea0fB0CE306d4',
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: 18,
  },
  {
    logoURI: ChainlinkLogo,
    address: '0x853fa1a0DFBF47257eF01F7033eAB8192e406087',
    name: 'ChainLink Token',
    symbol: 'LINK',
    decimals: 18,
  },
]
