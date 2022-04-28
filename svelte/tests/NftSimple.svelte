<script lang="ts">
  import type { Readable } from "svelte/store";

  import type { NftType } from "lib/ktypes";
  import { nftGetImageLink } from "lib/knft-get-metadata";
  import { onMount } from "svelte";

  import { nftStore } from "stores/nft/nft";

  /////////////////////////////////////////////////
  //  <Nft {chainId} {address} {tokenID} {account}? {index}? {more}? {platform}? />
  // Display NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let account: string = undefined;

  let nft: Readable<NftType>;

  // let i = 1;
  // HANDLE CHANGE : on truthy chainId and address, and whatever account
  $: account, chainId && address && tokenID && handleChange();
  const handleChange = (): void => {
    // console.log(`NFT CHANGE #${i++} ${nftKey(chainId, address, tokenID)}`);

    // STATE VIEW : sync get Nft
    nft = nftStore.getOneStore(chainId, address, tokenID);

    // ACTION : async refresh Nft
    nftStore.refreshOne(chainId, address, tokenID).catch(console.error);
  };

  onMount(() => {
    console.log("NFT", $nft);
  });
</script>

{#if nft}
  <p>
    NAME <strong>{$nft.name}</strong> : DESCRIPTION {$nft.description}
  </p>
  <p>
    REF nft://{chainId}/{address}/{tokenID}@{$nft.owner} @{account}
  </p>
  <p>
    TOKEN URI <a href={$nft.tokenURI}>{$nft.tokenURI}</a><br />
  </p>
  <p>
    IMAGE LINK ORIGIN <a href={$nft.image}>{$nft.image}</a>
  </p>
  <p>
    IMAGE LINK <a href={nftGetImageLink($nft)}> {nftGetImageLink($nft)}</a>
  </p>
  <p>
    {#if $nft?.contentType?.startsWith("video")}
      VIDEO <video preload="metadata" style="border-radius: initial; height: 100px">
        <track kind="captions" />
        <source src={nftGetImageLink($nft)} type="video/mp4" />
      </video>
    {:else}
      IMAGE <img alt={$nft.name} width="100px" src={nftGetImageLink($nft)} />
    {/if}
  </p>
  <hr />
{:else}
  <p>
    LOADING... nft://{chainId}/{address}/{tokenID}
  </p>
{/if}
