<script lang="ts">
  import { nftName } from "@lib/common/config";
  import { nftStore } from "@stores/nft/nft";
  import Media from "../components/Media/Media.svelte";
  import Nft from "../components/Nft/Nft.svelte";

  /////////////////////////////////////////////////
  // <NftGrid {chainId} {address} {tokenID} />
  // Display NFT card for Grid mode
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let owner: string = undefined;
  export let platform: string = undefined;
  export let exchange: boolean = false;
  ///////////////////////////////////////////////////////////
  $: nft = nftStore.getOne(chainId, address, tokenID);
  ///////////////////////////////////////////////////////////
</script>

{#if $nft}
  <Nft {chainId} {address} {tokenID} {owner} platform="web" {exchange} />
{/if}

<style>
  .grid-card-krd h3 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-height: 20.8px;
  }
</style>
