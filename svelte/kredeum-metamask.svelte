<script lang="ts">
  import type { Web3Provider, Provider } from "@ethersproject/providers";
  import type { EthereumProvider } from "hardhat/types";
  import type { Network } from "lib/ktypes";
  import type { Signer } from "ethers";

  import {
    getShortAddress,
    textShort,
    numberToHexString,
    explorerAddressLink,
    explorerAddressUrl,
    explorerOpenNFTsUrl
  } from "lib/knfts";
  import { getChecksumAddress, getNetwork, getEnsName, networks } from "lib/kconfig";
  import detectEthereumProvider from "@metamask/detect-provider";
  import { onMount } from "svelte";
  import { ethers } from "ethers";

  // down to component
  export let txt: boolean = undefined;
  export let autoconnect: string = undefined;
  // up to parent
  export let chainId: number = undefined;
  export let signer: Signer = undefined;

  let chainIdSelected: number;

  const testnets = true;

  let ethereumProvider: EthereumProvider;
  let ethersProvider: Web3Provider;

  let network: Network;
  let nameOrAddress = "";
  let address = "";

  const connectMetamaskMessage = "Connect to Metamask";
  const installMetamaskMessage = "Please install MetaMask extension to connect";
  let noMetamask = false;
  let targetChain = false;

  let open = false;

  $: if (address) setEnsName();
  const setEnsName = async () => {
    nameOrAddress = address;
    nameOrAddress = await getEnsName(address);
  };

  const strUpFirst = (str: string): string =>
    str.length >= 1 ? str.charAt(0).toUpperCase() + str.substr(1) : "";

  const getChainname = (_network: Network): string => _network?.chainName || "unknown";
  const getChainName = (_network: Network): string =>
    strUpFirst(getChainname(_network)) + (_network?.nftsFactory ? "" : " (soon available)");

  const addEthereumChain = async (_chainId) => {
    if (_chainId) {
      console.log("addEthereumChain", _chainId);

      if (targetChain) {
        console.log("already connecting network...");
      }
      targetChain = true;

      // no need to add default ethereum chain
      if (_chainId !== 1) {
        const _network = getNetwork(_chainId);
        if (_network) {
          // EIP-3085 fields only or fails
          type EthereumChainParameter = {
            chainId: string;
            blockExplorerUrls?: string[];
            chainName?: string;
            iconUrls?: string[];
            nativeCurrency?: {
              name: string;
              symbol: string;
              decimals: number;
            };
            rpcUrls?: string[];
          };
          const params: EthereumChainParameter = {
            chainId: numberToHexString(_network.chainId),
            blockExplorerUrls: _network.blockExplorerUrls,
            chainName: _network.chainName,
            iconUrls: [],
            nativeCurrency: _network.nativeCurrency,
            rpcUrls: _network.rpcUrls
          };

          // add new chain to metamask
          ethereumProvider
            .request({
              method: "wallet_addEthereumChain",
              params: [params]
            })
            .catch((e) => console.error("ERROR wallet_addEthereumChain", e));
        }
      }
    }
  };

  const handleChainId = async (_chainId) => {
    // console.log("<kredeum-metamask/> handleChainId", _chainId);

    if (_chainId && _chainId != chainId) {
      const _network = getNetwork(_chainId);
      if (_network) {
        chainId = Number(_chainId);
        console.log("chainId", chainId);
        network = _network;
      } else {
        // _chainId not accepted : add first accepted chainId
        switchEthereumChain(networks[0].chainId);
      }
    }
  };

  const switchEthereumChain = async (_chainId, e?: Event) => {
    e?.preventDefault();
    if (_chainId && _chainId != chainId) {
      console.log("switchEthereumChain", _chainId, numberToHexString(_chainId));
      try {
        await ethereumProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: numberToHexString(_chainId) }]
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          addEthereumChain(_chainId);
        }
      }
    }
  };

  const handleAccounts = async (_accounts) => {
    // console.log("handleAccounts", _accounts);

    if (_accounts?.length === 0) {
      if (autoconnect !== "off") connectMetamask();
    } else if (_accounts[0] !== address) {
      address = getChecksumAddress(_accounts[0]);
      signer = ethersProvider.getSigner(0);
    }
  };

  const connectMetamask = async (e?: Event) => {
    e.preventDefault();
    // console.log("connectMetamask");

    ethereumProvider
      .request({
        method: "eth_requestAccounts"
      })
      .then(handleAccounts)
      .catch((e) => {
        if (e.code === 4001) {
          alert(connectMetamaskMessage);
        } else {
          console.error("ERROR eth_requestAccounts", e);
        }
      });
  };

  onMount(async () => {
    // console.log("init");
    const provider = await detectEthereumProvider();
    if (provider) {
      noMetamask = false;

      if (provider !== window.ethereum) {
        alert("Do you have multiple wallets installed?");
      }

      ethereumProvider = window.ethereum as EthereumProvider;
      ethersProvider = new ethers.providers.Web3Provider(window.ethereum);

      ethereumProvider
        .request({
          method: "eth_accounts"
        })
        .then(handleAccounts)
        .catch((e) => console.error("ERROR eth_accounts", e));

      ethereumProvider
        .request({
          method: "eth_chainId"
        })
        .then(handleChainId)
        .catch((e) => console.error("ERROR eth_chainId", e));

      ethereumProvider.on("chainChanged", handleChainId);

      ethereumProvider.on("accountsChanged", handleAccounts);
    } else {
      noMetamask = true;
      console.log(installMetamaskMessage);
    }

    window.addEventListener("click", (e: Event): void => {
      const select = document.querySelector(".select-network");
      if (select && !select.contains(e.target as HTMLElement)) {
        open = false;
      }
    });
  });
</script>

{#if txt}
  {#if address}
    Network
    <select on:change={(e) => switchEthereumChain(e.target.value)}>
      {#each networks.filter((nw) => nw.mainnet && nw.nftsFactory) as _network}
        <option value={_network.chainId} selected={_network.chainId == chainId}>
          {getChainName(_network)}
          &nbsp;
        </option>{/each}
    </select>
    {nameOrAddress}@{getChainname(network)}
  {:else if noMetamask}
    {installMetamaskMessage}
  {:else}
    <a href="." on:click={connectMetamask}>{connectMetamaskMessage}</a>
  {/if}
{:else}
  <div class="col col-xs-12 col-sm-3">
    {#if address}
      <span class="label"
        >Address
        <a
          class="info-button"
          href={explorerAddressUrl(chainId, address)}
          target="_blank"
          title="&#009;Account address (click to view account in explorer )&#013;{address}"
          ><i class="fas fa-info-circle" /></a
        >
      </span>
      <div class="form-field">
        <input type="text" value={getShortAddress(nameOrAddress, 10)} />
      </div>
    {:else if noMetamask}
      <div class="btn btn-light btn-metamask">
        {installMetamaskMessage}
      </div>
    {:else}
      <a href="." on:click={connectMetamask} class="btn btn-light btn-metamask"
        >{connectMetamaskMessage}</a
      >
    {/if}
  </div>

  <div class="col col-xs-12 col-sm-3">
    {#if address}
      <span class="label"
        >Network
        <a
          class="info-button"
          href={explorerOpenNFTsUrl(chainId)}
          target="_blank"
          title="&#009;ChainId {chainId?.toString()} (click to view default collection in explorer )"
          ><i class="fas fa-info-circle" /></a
        >
      </span>

      <div class="select-wrapper select-network" on:click={() => (open = !open)}>
        <div class="select" class:open>
          <div class="select-trigger">
            <span class={getChainname(network)}>{getChainName(network)}</span>
          </div>
          <div class="custom-options">
            {#each networks.filter((nw) => nw.mainnet) as _network}
              <span
                class="custom-option {_network.chainId == chainId && 'selected'}"
                data-value={getChainname(_network)}
                on:click={(e) => switchEthereumChain(_network.chainId, e)}
              >
                {getChainName(_network)}
              </span>
            {/each}
            {#if network?.testnet}
              {#each networks.filter((nw) => nw.testnet && nw.nftsFactory) as _network}
                <span
                  class="custom-option {_network.chainId == chainId && 'selected'}"
                  data-value={getChainname(_network)}
                  on:click={(e) => switchEthereumChain(_network.chainId, e)}
                >
                  {getChainName(_network)}
                </span>
              {/each}
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>
{/if}
