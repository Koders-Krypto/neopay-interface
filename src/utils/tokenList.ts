import EthereumLogo from '../assets/logos/ethereum-logo.svg'
import UsdCoinLogo from '../assets/logos/usd-coin-logo.svg'
import DaiLogo from '../assets/logos/dai-logo.svg'
import ChainlinkLogo from '../assets/logos/chainlink-logo.svg'
import { Token } from 'moonbeamswap'

const WETH_NEO = new Token(
  2970385,
  '0x2aCB7bfB8D91E998C33B90D5C3980fe9A2c9dF2d',
  18,
  'WETH',
  'Wrapped Ether'
)

const USDC_NEO = new Token(
  2970385,
  '0xD0d4C08136877F7E25A355900B20100fBF19562A',
  6,
  'USDC',
  'USDCoin'
)

const DAI_NEO = new Token(
  2970385,
  '0x43B0f98ED4f1f008375882934f35b2620E8aE0a1',
  18,
  'DAI',
  'Dai Stablecoin'
)

const LINK_NEO = new Token(
  2970385,
  '0x6Edfe03bA366C1A6b571Ac583fa4E4500b682C3f',
  18,
  'LINK',
  'ChainLink Token'
)

export const tokenList: Array<{ logoURI: string; token: Token }> = [
  {
    logoURI: EthereumLogo,
    token: WETH_NEO,
  },
  {
    logoURI: UsdCoinLogo,
    token: USDC_NEO,
  },
  {
    logoURI: DaiLogo,
    token: DAI_NEO,
  },
  {
    logoURI: ChainlinkLogo,
    token: LINK_NEO,
  },
]
