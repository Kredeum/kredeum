<script lang="ts">
  import NftListDataSimple from "./NftListDataSimple.svelte";
  
  export let chainId: number;
  export let address: string;
  export let account: string = undefined;
</script>

<NftListDataSimple {chainId} {address} {account} let:nfts>
  {#if nfts}
    {#if nfts.size > 0}
      {#each [...nfts.values()] as nft}
        <p>
          <img width="30" src={nft.image} alt={nft.tokenID} />
          {nft.name} - #{nft.tokenID}
        </p>
      {/each}
    {:else}
      <p>LOADING NFT LIST...</p>
    {/if}
  {/if}
</NftListDataSimple>
