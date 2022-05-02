<script lang="ts">
  import type { Readable } from "svelte/store";
  import type { NftType } from "lib/ktypes";

  import NftGrid from "./NftGrid.svelte";
  /////////////////////////////////////////////////
  //  <NftListGrid {account} {nfts} {platform}? />
  // Display NFTs List in Grid mode
  /////////////////////////////////////////////////
  export let account: string = undefined;

  export let nfts: Readable<Map<string, NftType>>;

  export let platform: string = "dapp";
</script>

<div class="row grid-krd">
  {#each [...$nfts.values()] as nft, index}
    <NftGrid {nft} {account} {index} {platform} />
  {/each}
</div>
