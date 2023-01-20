<script lang="ts">
  import NftListDataSimple from "./NftListDataSimple.svelte";

  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let account: string = undefined;

  const _setNftFromEvent = (evt: Event) => (tokenID = (evt.target as HTMLInputElement).value);
</script>

<NftListDataSimple {chainId} {address} {account} let:nfts>
  <select on:change={_setNftFromEvent}>
    {#if nfts}
      {#if nfts.size > 0}
        {#each [...nfts] as [key, nft]}
          <option id={key} selected={nft.tokenID == tokenID} value={nft.tokenID}>
            {nft.name || "no name"} - #{nft.tokenID}
          </option>
        {/each}
      {:else}
        <option value="">LOADING NFT LIST...</option>
      {/if}
    {/if}
  </select>
</NftListDataSimple>
