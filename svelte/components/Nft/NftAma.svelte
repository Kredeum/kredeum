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

  import { metamaskChainId, metamaskProvider } from "main/metamask";

  import { slide } from "svelte/transition";

  /////////////////////////////////////////////////
  //  <NftAma {chainId} {address} {tokenID} {account}? {tokenIdClaimed}? />
  // Display Minted POAP
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let account: string = undefined;
  export let claimChainId: number = undefined;
  export let tokenIdClaimed: string = undefined;

  let chainTab: number = 1;

  let nft: Readable<NftType>;
  let nftClaimed: Readable<NftType>;

  // let i = 1;
  // HANDLE CHANGE : on truthy chainId and address, and whatever account
  $: account, chainId && address && tokenID && $metamaskProvider && $metamaskChainId && handleChange();
  const handleChange = async (): Promise<void> => {
    // console.log(`NFTDETAIL CHANGE #${i++} ${nftKey(chainId, address, tokenID)}`);

    // STATE VIEW : sync get Nft
    nft = nftStore.getOneStore(chainId, address, tokenID);

    // ACTION : async refresh Nft
    await nftStore.refreshOne(chainId, address, tokenID).catch(console.error);
  };

  $: console.log("Nft", $nft, " | tokenIdClaimed : ", tokenIdClaimed);
</script>

{#if $nft}
  <div class="row krd-nft-solo">
    <div class="col col-xs-12 col-sm-4 col-md-3">
      <div class="card-krd">
        <MediaPreview nft={$nft} />
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
          {#if tokenIdClaimed}
            <div class="ama-tab optimism-tab {chainTab === 2 ? 'ama-active-tab' : ''}">
              <label for="optimism"><span class="ama-chain-logo ama-logo-optimism" /> Optimism</label>
            </div>
          {/if}
        </div>
      </div>
      {#if chainTab === 1}
        <div class="card-krd" transition:slide>
          <h3>{$nft.name}</h3>
          <p>
            {$nft.description}
          </p>

          <ul class="steps">
            <li>
              <div class="flex"><span class="label"><strong>Token ID</strong></span></div>
              <div class="flex overflow-ellipsis" title="Token ID #{tokenID}"><strong>#{tokenID}</strong></div>
            </li>
            <li>
              <div class="flex"><span class="label">Owner</span></div>
              <div class="flex">{@html explorerAddressLink(chainId, $nft.owner, 15)}</div>
            </li>
            <li>
              <div class="flex"><span class="label">Permanent link</span></div>
              <div class="flex">
                <a
                  class="link overflow-ellipsis"
                  href={kredeumNftUrl(chainId, $nft)}
                  title={nftUrl($nft, 10)}
                  target="_blank"
                >
                  {@html nftUrl($nft, 10)}
                </a>
              </div>
            </li>
            <li>
              <div class="flex"><span class="label">collection @</span></div>
              <div class="flex">
                <a
                  class="link overflow-ellipsis"
                  href={explorerCollectionUrl(chainId, address)}
                  title={address}
                  target="_blank"
                >
                  {address}
                </a>
              </div>
            </li>
            <li>
              <div class="flex"><span class="label">Metadata</span></div>
              <div class="flex">
                {#if $nft.tokenURI}
                  <a class="link overflow-ellipsis" href={$nft.tokenURI} title={$nft.ipfsJson} target="_blank"
                    >{$nft.tokenURI}</a
                  >
                {:else}
                  NO metadata
                {/if}
              </div>
            </li>
            <li>
              <div class="flex"><span class="label">Image</span></div>
              <div class="flex">
                <a class="link overflow-ellipsis" href={$nft.image} title={$nft.ipfs} target="_blank">
                  {$nft.image || ""}
                </a>
              </div>
            </li>
          </ul>
          <a href={nftOpenSeaUrl($nft.chainId, $nft)} class="btn btn-small btn-sell" title="Sell" target="_blank">
            View on OpenSea
          </a>
        </div>
      {:else if chainTab === 2}
        <div class="card-krd" transition:slide>
          <a href={nftOpenSeaUrl($nft?.chainId, $nft)} class="btn btn-small btn-sell" title="Sell" target="_blank">
            View on OpenSea
          </a>
        </div>
      {/if}
    </div>
  </div>
{/if}

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
