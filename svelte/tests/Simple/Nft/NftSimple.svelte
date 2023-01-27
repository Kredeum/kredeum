<script lang="ts">
  import NftDataSimple from "./NftDataSimple.svelte";

  export let chainId: number;
  export let address: string;
  export let tokenID: string;
</script>

<NftDataSimple {chainId} {address} {tokenID} let:nft>
  {#if nft}
    {nft.name || "no name"} - #{nft.tokenID} -
    {nft.description || "no description"}
    <br />
    <img width="200" src={nft.image} alt={nft.image} />
  {/if}
</NftDataSimple>
