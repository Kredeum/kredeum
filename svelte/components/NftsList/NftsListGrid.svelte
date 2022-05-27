<script lang="ts">
  import type { Readable } from "svelte/store";
  import type { NftType } from "lib/ktypes";

  import NftGrid from "../Nft/NftGrid.svelte";
  /////////////////////////////////////////////////
  //  <NftsListGrid {account} {nfts} />
  // Display NFTs List in Grid mode
  /////////////////////////////////////////////////
  export let account: string = undefined;

  export let nfts: Readable<Map<string, NftType>>;
  export let platform: string = undefined;
</script>

<div class="row grid-krd">
  {#each [...$nfts.values()] as nft, index}
    <NftGrid {nft} {account} {index} />
  {/each}
</div>
