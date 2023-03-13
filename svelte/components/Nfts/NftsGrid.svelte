<script lang="ts">
  import NftGrid from "../Nft/NftGrid.svelte";
  import { NftType } from "@lib/common/types";

  /////////////////////////////////////////////////
  //  <NftsGrid {nfts} {tokenID} />
  // Display NFTs Grid
  /////////////////////////////////////////////////
  export let nfts: Map<string, NftType>;
  export let tokenID: string = undefined;
</script>

<div class="row grid-krd">
  {#if nfts?.size > 0}
    {#each [...nfts.values()] as nft}
      <div class="col col-xs-12 col-sm-4 col-md-3 col-lg-2" on:mousedown={() => (tokenID = nft.tokenID)}>
        <NftGrid chainId={nft.chainId} address={nft.address} tokenID={nft.tokenID} />
      </div>
    {/each}
  {/if}
</div>
