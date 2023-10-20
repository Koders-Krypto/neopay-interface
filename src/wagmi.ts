import { w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Chain, configureChains, createConfig } from 'wagmi'

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
      address: '0x76C2Bdd0456c73151f20e3D7C937ba53BD1288b5',
      blockCreated: 992350,
    },
  },
} as const satisfies Chain

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [neo],
  [w3mProvider({ projectId: walletConnectProjectId })]
)

export const config = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({
    chains,
    projectId: walletConnectProjectId,
    version: 2,
  }),
  publicClient,
  webSocketPublicClient,
})

export { chains }
