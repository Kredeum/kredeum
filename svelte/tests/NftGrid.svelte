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
  ///////////////////////////////////////////////////////////
  $: nft = nftStore(chainId, address, tokenID);
  ///////////////////////////////////////////////////////////
</script>

{#if $nft}
  <Nft {chainId} {address} {tokenID} {owner} />
{/if}
