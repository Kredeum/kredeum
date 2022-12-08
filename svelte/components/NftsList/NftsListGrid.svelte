<script lang="ts">
  import type { Readable } from "svelte/store";
  import type { NftType } from "@lib/common/types";

  import NftGrid from "../Nft/NftGrid.svelte";
  /////////////////////////////////////////////////
  //  <NftsListGrid {account} {nfts} />
  // Display NFTs List in Grid mode
  /////////////////////////////////////////////////
  export let nfts: Readable<Map<string, NftType>>;
</script>

<div class="row grid-krd">
  {#each [...$nfts.values()] as nft}
    <NftGrid {nft} />
  {/each}
</div>
