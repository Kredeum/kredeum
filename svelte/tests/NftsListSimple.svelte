<script lang="ts">
  import NftSimple from "./NftSimple.svelte";
  import { nftListStore } from "stores/nft/nftList";

  export let chainId: number;
  export let address: string;
  export let account: string = undefined;

  // ACTION : async NFT list update
  $: nftListStore.refresh(chainId, address, account).catch(console.error);

  // STATE VIEW : NFT list
  $: nfts = nftListStore.getSubList(chainId, address);
</script>

{#if $nfts}
  {#each [...$nfts.values()] as nft, index}
    <NftSimple chainId={nft.chainId} address={nft.address} tokenID={nft.tokenID} />
  {/each}
{/if}
