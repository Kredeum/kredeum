<script lang="ts">
  import type { Readable } from "svelte/store";

  import type { NftType } from "lib/ktypes";
  import {
    nftUrl,
    explorerCollectionUrl,
    explorerAddressLink,
    kredeumNftUrl,
    getNetwork,
    getChainName,
    nftOpenSeaUrl,
    addressSame
  } from "lib/kconfig";
  import MediaPreview from "../Media/MediaPreview.svelte";

  import { nftStore } from "stores/nft/nft";

  import { metamaskChainId, metamaskProvider, metamaskSigner, metamaskAccount } from "main/metamask";
  import { metamaskSwitchChain } from "helpers/metamask";

  import { slide } from "svelte/transition";

  import NftAma from "../Nft/NftAma.svelte";
  import { chainId } from "main/network";

  import NetworkListAma from "../Network/NetworkListAma.svelte";
  import NftAmaDetail from "../Nft/NftAmaDetail.svelte";
  import NftMintAma from "../Nft/NftMintAma.svelte";
  import Account from "../Account/Account.svelte";

  import { metamaskInit, metamaskConnect } from "helpers/metamask";
  import { onMount } from "svelte";

  /////////////////////////////////////////////////
  //  <NftAma {chainId} {address} {tokenID} {account}? {tokenIdClaimed}? />
  // Display Minted POAP
  /////////////////////////////////////////////////
  //   export let chainId: number;
  //   export let address: string;
  export let tokenID: string;
  export let nftMinted: NftType;
  export let nftClaimed: NftType;
  export let refresh: boolean;
  export let isClaimed: boolean;
  //   export let account: string = undefined;
  let chainId: number = $metamaskChainId;
  let address: string;
  let account: string = $metamaskAccount;

  let nft: Readable<NftType>;
  // let nfts: Map<string, NftType> = new Map();

  const prod = process.env.ENVIR === "PROD";
  // const mintChainId = prod ? 137 : 80001;
  const mintChainId = prod ? 137 : 137;
  const claimChainId = prod ? 10 : 42;

  // let toClaimChainId: number = undefined;

  onMount(async () => {
    await metamaskInit();
    metamaskConnect();
    account = $metamaskAccount;
  });

  let chainTab: number = 1;
  let switchingTab: boolean = false;
  $: console.log("🚀 ~ file: AmaDisplay.svelte ~ line 56 ~ chainTab", chainTab);

  $: isClaimed && handleClaim();
  const handleClaim = (): void => {
    chainTab = 2;
  };

  $: chainTab && handleSwitchTab();
  const handleSwitchTab = async (): Promise<void> => {
    switchingTab = true;
    chainTab === 1 ? await metamaskSwitchChain(mintChainId) : await metamaskSwitchChain(42);
    switchingTab = false;
  };

  $: $metamaskChainId && handleSwitchChain();
  const handleSwitchChain = (): void => {
    $metamaskChainId === mintChainId ? (chainTab = 1) : (chainTab = 2);
  };

  $: console.log("🚀 ~ TokenID amaDisplay", tokenID);
</script>

{#if tokenID}
  <h1 title="Kredeum NFTs Factory">Kredeum - AMA 22/06/22</h1>
  <div class="row">
    <div class="col col-xs-12 col-sm-6 col-md-2">
      <Account {account} />
    </div>
  </div>
  <div class="row krd-nft-solo">
    <div class="col col-xs-12 col-sm-4 col-md-3">
      <div class="card-krd">
        {#if nftMinted}
          <MediaPreview nft={nftMinted} />
          <div class="ama-claimed-icons">
            <p>Claimed on</p>
            <span class="claimed-icon" data-value={getChainName(nftMinted.chainId)} />
            {#if nftClaimed}
              <span class="claimed-icon" data-value={getChainName(10)} />
            {/if}
          </div>
        {/if}
      </div>
    </div>

    <div class="col col-xs-12 col-sm-8 col-md-9">
      <div class="ama-chains-tabs">
        <div class="ama-tabs-border">
          <div class="ama-tabs-container">
            <input type="radio" bind:group={chainTab} id="matic" name="chainTab" value={1} />
            <input type="radio" bind:group={chainTab} id="optimism" name="chainTab" value={2} />
            <div class="ama-tab matic-tab {chainTab === 1 ? 'ama-active-tab' : ''}">
              <label for="matic"><span class="ama-chain-logo ama-logo-matic" /> Matic</label>
            </div>
            {#if isClaimed}
              <div class="ama-tab optimism-tab {chainTab === 2 ? 'ama-active-tab' : ''}">
                <label for="optimism"><span class="ama-chain-logo ama-logo-optimism" /> Optimism</label>
              </div>
            {/if}
          </div>
          <div class="ama-network">
            <!-- <NetworkListAma bind:toClaimChainId /> -->
            <NftMintAma chainId={claimChainId} {tokenID} type="claim" bind:isClaimed />
          </div>
        </div>
      </div>
      {#if !switchingTab}
        <NftAmaDetail
          chainId={$metamaskChainId}
          address={getNetwork($metamaskChainId).openBoundAma}
          {tokenID}
          {account}
          bind:refresh
        />
      {:else}
        <div class="card-krd" transition:slide>
          <h3>Switching network</h3>
        </div>
      {/if}
    </div>
  </div>
{/if}

<!-- {#if address && tokenID}
  <NftAma chainId={$metamaskChainId} {address} {tokenID} account={$metamaskAccount} />
{/if} -->
<style>
  .krd-nft-solo {
    width: 100%;
    margin-top: 3rem;
  }

  .ama-claimed-icons {
    display: flex;
    align-items: center;
    border-top: 1px solid rgba(30, 30, 67, 0.1);
    color: rgba(30, 30, 67, 0.4);
  }

  .claimed-icon {
    display: block;
    width: 20px;
    height: 20px;
    margin-left: 15px;
    margin-bottom: 3px;
  }

  .ama-chains-tabs {
    /* width: fit-content; */
    height: auto;
    border-radius: 6px;
    background-color: white;
    margin-bottom: -10px;
    padding: 15px;
    /* display: flex; */
  }

  .ama-tabs-border {
    display: flex;
    justify-content: space-between;
    /* align-items: center; */
    border-bottom: 2px solid rgba(30, 30, 67, 0.1);
  }

  .ama-tabs-container {
    display: flex;
    /* border-bottom: 1px solid #1e1e43; */
  }

  .ama-network {
    display: flex;
    align-items: center;
    width: 25%;
    padding-bottom: 20px;
  }

  .ama-tabs-container input {
    display: none;
  }

  .matic-tab.ama-tab::after {
    right: 0;
    left: unset;
  }

  .optimism-tab.ama-tab::after {
    right: unset;
    left: 0;
  }

  .ama-active-tab.ama-tab::after {
    width: 100%;
  }

  .ama-tab::after {
    content: "";
    width: 0%;
    height: 100%;
    display: block;
    position: absolute;
    bottom: -2px;
    border-bottom: 2px solid #1e1e43;
    transition: width 0.3s ease-in-out;
  }

  .ama-tab {
    display: flex;
    align-items: center;
    padding: 15px 15px 0 15px;
    position: relative;
  }

  .ama-tab label {
    display: flex;
    align-items: flex-end;
  }

  .ama-logo-matic {
    background: url("../../../gulp/images/icon-matic.png");
  }

  .ama-logo-optimism {
    background: url("../../../gulp/images/icon-optimism.png");
  }

  .ama-chain-logo {
    display: block;
    width: 3rem;
    height: 3rem;
    background-size: contain;
    background-repeat: no-repeat;
    margin-right: 10px;
  }
</style>
