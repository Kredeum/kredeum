<script lang="ts">
  import NftsListData from "./NftsListData.svelte";
  import NftGrid from "../Nft/NftGrid.svelte";

  /////////////////////////////////////////////////
  // <NftsListGrid {chainId} {address} {account} />
  // Display NFTs List in Grid mode
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string = undefined;
  export let account: string = undefined;

  $: tokenID && console.log("tokenID", tokenID);
</script>

<NftsListData {chainId} {address} {account} let:nfts>
  <div class="row grid-krd">
    {#if nfts?.size > 0}
      {#each [...nfts.values()] as nft}
        <!-- {#if nft.owner === account} -->
          <div class="col col-xs-12 col-sm-4 col-md-3 col-lg-2" on:mousedown={() => (tokenID = nft.tokenID)}>
            <NftGrid chainId={nft.chainId} address={nft.address} tokenID={nft.tokenID}  />
          </div>
        <!-- {/if} -->
      {/each}
    {/if}
  </div>
</NftsListData>
