<svelte:options tag="kredeum-metamask" />

<script>
  import { ethers } from 'ethers';
  import detectEthereumProvider from '@metamask/detect-provider';
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let signer;
  export let address;
  export let chainId = 'Ox89';
  export let autoconnect = 'off';

  let targetChain = false;
  let connectmetamask = "Connect to Metamask";

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
    ]
  ]);

  async function connectNetwork() {
    if (targetChain) {
      //console.log('already connecting network...');
    }
    targetChain = true;
    //console.log('connectNetwork', chainId);
    ethereum
      .request({
        method: 'wallet_addEthereumChain',
        params: [networks.get(chainId)]
      })
      .catch((e) => console.error('ERROR wallet_addEthereumChain', e));
  }

  async function handleChainId(_chainId) {
    //console.log('handleChainId <=', _chainId);
    if (_chainId) {
      //console.log('_chainId', _chainId);
      if (_chainId != chainId) connectNetwork();
    }
  }

  async function handleAccounts(_accounts) {
    if (_accounts?.length === 0) {
      if (autoconnect !== 'off') connectMetamask();
    } else if (_accounts[0] !== address) {
      address = _accounts[0];
      signer = new ethers.providers.Web3Provider(ethereum).getSigner(0);
      dispatch('address', { address: address });
    }
  }
  async function connectMetamask() {
    //console.log('connectMetamask');

    ethereum
      .request({
        method: 'eth_requestAccounts'
      })
      .then(handleAccounts)
      .catch((e) => {
        if (e.code === 4001) {
          alert('Please connect to MetaMask.');
        } else {
          //console.error('ERROR eth_requestAccounts', e);
        }
      });
  }
  onMount(async function () {
    //console.log('init');
    const provider = await detectEthereumProvider();
    if (provider) {
      if (provider !== window.ethereum) {
        alert('Do you have multiple wallets installed?');
      }

      ethereum
        .request({
          method: 'eth_accounts'
        })
        .then(handleAccounts)
        .catch((e) => console.error('ERROR eth_accounts', e));

      ethereum
        .request({
          method: 'eth_chainId'
        })
        .then(handleChainId)
        .catch((e) => console.error('ERROR eth_chainId', e));

      ethereum.on('chainChanged', handleChainId);

      ethereum.on('accountsChanged', handleAccounts);
    } else {
      //console.log('Please install MetaMask!');
      connectmetamask = "Please install MetaMask chrome extension to connect your blockchain address to your site";
    }
  });
</script>

{#if address}
  {address}
{:else}
  <button on:click="{connectMetamask}">{connectmetamask}</button>
{/if}
