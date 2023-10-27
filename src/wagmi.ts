import { walletConnectProvider, EIP6963Connector } from '@web3modal/wagmi'
import { Chain, configureChains, createConfig, mainnet } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'

export const walletConnectProjectId = '9577531e389c799d54896f39e80d7bb0'

export const neo = {
  id: 2970385,
  name: 'NeoEVM',
  network: 'neo',
  nativeCurrency: {
    decimals: 18,
    name: 'GAS',
    symbol: 'GAS',
  },
  rpcUrls: {
    public: { http: ['https://neo-jsonrpc-wrapper.vercel.app/api/rpc'] },
    default: { http: ['https://neo-jsonrpc-wrapper.vercel.app/api/rpc'] },
  },
  blockExplorers: {
    etherscan: { name: 'NeoEVMExplorer', url: 'https://evm.ngd.network' },
    default: { name: 'NeoEVMExplorer', url: 'https://evm.ngd.network' },
  },
  contracts: {
    multicall3: {
      address: '0x53a942df46b7253c5aBDE42F39ffaDE279B2d32B',
      blockCreated: 992350,
    },
  },
} as const satisfies Chain

const {
  chains: [, ...chains],
  publicClient,
  webSocketPublicClient,
} = configureChains(
  [mainnet, neo],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: chain.rpcUrls.default.http[0],
      }),
    }),
    publicProvider(),
  ]
)

const metadata = {
  name: 'Neopay',
  description: 'Scan and pay',
  url: 'https://neopaynetwork.com',
  icons: ['https://neopaynetwork.com/neopay-icon.png'],
}

export const config = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({
      chains,
      options: {
        projectId: walletConnectProjectId,
        showQrModal: false,
        metadata,
      },
    }),
    new EIP6963Connector({ chains }),
    new InjectedConnector({ chains, options: { shimDisconnect: true } }),
    new CoinbaseWalletConnector({
      chains,
      options: { appName: metadata.name },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})

export { chains }
