<script lang="ts">
  import Nft from "../Nft/Nft.svelte";
  import { NftType } from "@lib/common/types";

  /////////////////////////////////////////////////
  //  <NftsGrid {nfts} {tokenID} />
  // Display NFTs Grid
  /////////////////////////////////////////////////
  export let nfts: Map<string, NftType>;
  export let tokenID: string = undefined;
  export let owner: string = undefined;
  export let platform = undefined;
</script>

<div class="row grid-krd">
  {#if nfts?.size > 0}
    {#each [...nfts.values()] as nft}
      <div class="col col-xs-12 col-sm-4 col-md-3 col-lg-2" on:mousedown={() => (tokenID = nft.tokenID)}>
        <Nft chainId={nft.chainId} address={nft.address} tokenID={nft.tokenID} {platform} {owner} mode="grid" />
      </div>
    {/each}
  {/if}
</div>
