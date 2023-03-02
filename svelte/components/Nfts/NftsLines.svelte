<script lang="ts">
  import { getOpenSea } from "@lib/common/config";
  import NftLine from "../Nft/NftLine.svelte";
  import NftsData from "./NftsData.svelte";

  /////////////////////////////////////////////////
  //  <NftListLines {chainId} {address} {account} {platform}? />
  // Display NFTs List
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let account: string = undefined;
  export let platform = undefined;
</script>

<NftsData {chainId} {address} {account} let:nfts>
  <div class="table">
    <div class="table-row table-head hidden-xs">
      <div class="table-col"><span class="label">Media</span></div>
      {#if getOpenSea(chainId)}
        <div class="table-col"><span class="label">Marketplace</span></div>
      {:else}
        <div class="table-col"><span class="label">Infos</span></div>
      {/if}
    </div>
    {#if nfts?.size > 0}
      {#each [...nfts.values()] as nft}
        {#if nft.owner === account}
          <NftLine chainId={nft.chainId} address={nft.address} tokenID={nft.tokenID} {account} {platform} />
        {/if}
      {/each}
    {/if}
  </div>
</NftsData>
