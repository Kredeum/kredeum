<script lang="ts">
  import Nft from "../Nft/Nft.svelte";
  import { NftType } from "@lib/common/types";

  /////////////////////////////////////////////////
  //  <NftsGrid {nfts} {tokenID} {mode?}/>
  // Display NFTs Grid
  /////////////////////////////////////////////////
  export let nfts: Map<string, NftType>;
  export let tokenID: string = undefined;
  export let owner: string = undefined;
  export let mode = undefined;
  /////////////////////////////////////////////////

  const colClass = (mode: string): string => {
    if (mode === "grid6") return "col col-xs-12 col-sm-4 col-md-3 col-lg-2";
    else if (mode === "grid4") return "col col-xs-12 col-sm-6 col-md-4 col-lg-3";
    else if (mode === "grid3") return "col col-xs-12 col-sm-12 col-md-6 col-lg-4";
    else return "col";
  };
</script>

<div class="row grid-krd">
  {#if nfts?.size > 0}
    {#each [...nfts.values()] as nft}
      <div class={colClass(mode)} on:click={() => (tokenID = nft.tokenID)}>
        <Nft chainId={nft.chainId} address={nft.address} tokenID={nft.tokenID} {owner} {mode} />
      </div>
    {/each}
  {/if}
</div>
