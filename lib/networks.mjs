
const networks = new Map([
  [
    '0x1',
    {
      chainId: '0x1',
      chainName: 'Ethereum',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
      },
      rpcUrls: ['https://mainnet.infura.io/v3'],
      blockExplorerUrls: ['https://etherscan.io']
    }
  ],
  [
    '0x89',
    {
      chainId: '0x89',
      chainName: 'Polygon',
      nativeCurrency: {
        name: 'Matic',
        symbol: 'MATIC',
        decimals: 18
      },
      rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
      blockExplorerUrls: ['https://explorer-mainnet.maticvigil.com/']
    }
  ],
  [
    '0x138881',
    {
      chainId: '0x138881',
      chainName: 'Polygon',
      nativeCurrency: {
        name: 'Mumbai',
        symbol: 'TMATIC',
        decimals: 18
      },
      rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
      blockExplorerUrls: ['https://explorer-mumbai.maticvigil.com/']
    }
  ]
]);

export default networks;