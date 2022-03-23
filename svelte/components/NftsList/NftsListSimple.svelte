<script lang="ts">
  import type { Nft as NftType } from "lib/ktypes";
  import NftSimple from "../Nft/NftSimple.svelte";

  export let nfts: Map<string, NftType>;
</script>

NftsList ?
{#if nfts}
  NftsList ok
  {#each [...nfts.values()] as nft, index}
    <NftSimple {nft} />
  {/each}
{/if}
