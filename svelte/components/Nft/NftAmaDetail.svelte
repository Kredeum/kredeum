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
  export let refresh: boolean = false;

  let nft: Readable<NftType>;

  // let i = 1;
  // HANDLE CHANGE : on truthy chainId and address, and whatever account
  $: account, chainId && address && tokenID && $metamaskProvider && $metamaskChainId && handleChange();
  const handleChange = async (): Promise<void> => {
    // console.log(`NFTDETAIL CHANGE #${i++} ${nftKey(chainId, address, tokenID)}`);

    // STATE VIEW : sync get Nft
    nft = nftStore.getOneStore(chainId, address, tokenID);

    // ACTION : async refresh Nft
    await nftStore.refreshOne(chainId, address, tokenID).catch(console.error);
    refresh = true;
  };

  $: console.log("Nft", $nft);
</script>

{#if $nft}
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
{/if}
