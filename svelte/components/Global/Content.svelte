<script lang="ts">
  import { displayedTokenID } from "main/diplayedNft";

  import Nft from "../Nft/Nft.svelte";
  import NftList from "../Nft/NftList.svelte";

  export let chainId: number;
  export let address: string;
  export let account: string;
  export let platform: string;
  export let refreshing: boolean;
  export let refresh: number;

  let toDisplayTokenID: string = "";

  // $: toDisplayTokenID = $displayedTokenID;

  // $: refreshing, chainId, account, address && handleClick();

  const handleClick = (evt) => {
    evt.preventDefault();
    // displayedTokenID.set(evt.target.tokenID);
    // toDisplayTokenID = evt.target.tokenID;
    console.log("🚀 ~ file: Content.svelte ~ line 17 ~ toDisplayTokenID", evt);
    // console.log("🚀 ~ file: Content.svelte ~ line 17 ~ toDisplayTokenID", evt.target.id);
    console.log("🚀 ~ file: Content.svelte ~ line 9 ~ address", address);
  };
</script>

{#key toDisplayTokenID}
  {#if toDisplayTokenID}
    <Nft {chainId} {address} tokenID={toDisplayTokenID} {account} {platform} />
  {:else}
    {#key chainId}
      <div on:click={handleClick}>
        <NftList {chainId} {address} {account} {refresh} bind:refreshing {platform} />
      </div>
    {/key}
  {/if}
{/key}
