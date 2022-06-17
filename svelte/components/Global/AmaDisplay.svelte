<script lang="ts">
  import type { Readable } from "svelte/store";

  import type { NftType } from "lib/ktypes";
  import {
    nftUrl,
    explorerCollectionUrl,
    explorerAddressLink,
    kredeumNftUrl,
    getNetwork,
    nftOpenSeaUrl,
    addressSame
  } from "lib/kconfig";
  import MediaPreview from "../Media/MediaPreview.svelte";

  import { nftStore } from "stores/nft/nft";

  import { metamaskChainId, metamaskProvider, metamaskSigner, metamaskAccount } from "main/metamask";

  import { slide } from "svelte/transition";

  import NftAma from "../Nft/NftAma.svelte";
  import { chainId } from "main/network";

  import NftAmaDetail from "../Nft/NftAmaDetail.svelte";

  /////////////////////////////////////////////////
  //  <NftAma {chainId} {address} {tokenID} {account}? {tokenIdClaimed}? />
  // Display Minted POAP
  /////////////////////////////////////////////////
  //   export let chainId: number;
  //   export let address: string;
  export let tokenID: string;
  //   export let account: string = undefined;
  let chainId: number = $metamaskChainId;
  let address: string = getNetwork($metamaskChainId).openBoundAma;
  let account: string = $metamaskAccount;

  let nft: Readable<NftType>;
  let nfts: Map<string, NftType> = new Map();

  const prod = process.env.ENVIR === "PROD";
  const mintChainId = prod ? 137 : 80001;
  const claimChainId = prod ? 10 : 42;

  let chainTab: number = 1;

  // $: account, chainId && address && tokenID && $metamaskProvider && $metamaskChainId && handleChange();
  // const handleChange = async (): Promise<void> => {

  //   nft = nftStore.getOneStore(chainId, address, tokenID);

  //   await nftStore.refreshOne(chainId, address, tokenID).catch(console.error);
  // };

  $: tokenID && localStorage.length && nftAmaGetLocalStorage();
  const nftAmaGetLocalStorage = (): void => {
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);

      if (key?.startsWith("nft://")) {
        nfts.set(key, JSON.parse(localStorage.getItem(key)) as NftType);
      }
    }
  };

  $: console.log("nfts", nfts);
</script>

{#if tokenID}
  <div class="row krd-nft-solo">
    <div class="col col-xs-12 col-sm-4 col-md-3">
      <div class="card-krd">
        {#if nfts[0]?.tokenID}
          <MediaPreview nft={nfts[0]} />
        {/if}
      </div>
    </div>

    <div class="col col-xs-12 col-sm-8 col-md-9">
      <div class="ama-chains-tabs">
        <div class="ama-tabs-container">
          <input type="radio" bind:group={chainTab} id="matic" name="chainTab" value={1} />
          <input type="radio" bind:group={chainTab} id="optimism" name="chainTab" value={2} />
          <div class="ama-tab matic-tab {chainTab === 1 ? 'ama-active-tab' : ''}">
            <label for="matic"><span class="ama-chain-logo ama-logo-matic" /> Matic</label>
          </div>
          {#if tokenID}
            <div class="ama-tab optimism-tab {chainTab === 2 ? 'ama-active-tab' : ''}">
              <label for="optimism"><span class="ama-chain-logo ama-logo-optimism" /> Optimism</label>
            </div>
          {/if}
        </div>
      </div>
      {#if chainTab === 1}
        <NftAmaDetail {chainId} {address} {tokenID} {account} />
      {:else if chainTab === 2}
        <NftAmaDetail {chainId} {address} {tokenID} {account} />
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

  .ama-chains-tabs {
    width: fit-content;
    height: auto;
    border-radius: 6px;
    background-color: white;
    margin-bottom: -10px;
    padding: 15px;
  }

  .ama-tabs-container {
    display: flex;
    /* border-bottom: 1px solid #1e1e43; */
    border-bottom: 1px solid #3acf6e;
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
    bottom: 0;
    border-bottom: 2px solid #1e1e43;
    transition: width 0.3s ease-in-out;
  }

  .ama-tab {
    align-items: center;
    padding: 15px;
    position: relative;
  }

  .ama-tab label {
    display: flex;
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
