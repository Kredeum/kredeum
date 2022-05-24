<script lang="ts">
  import type { Readable } from "svelte/store";
  import type { NftType } from "lib/ktypes";

  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  import NftGrid from "../Nft/NftGrid.svelte";
  /////////////////////////////////////////////////
  //  <NftsListGrid {account} {nfts} />
  // Display NFTs List in Grid mode
  /////////////////////////////////////////////////
  export let account: string = undefined;

  export let nfts: Readable<Map<string, NftType>>;

  let toPlayIndex = writable();
  setContext("toPlayIndex", toPlayIndex);
</script>

<div class="row grid-krd">
  {#each [...$nfts.values()] as nft, index}
    <NftGrid {nft} {account} {index} />
  {/each}
</div>
