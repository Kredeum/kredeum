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

  $: toDisplayTokenID = $displayedTokenID;

  $: chainId && address && account, handleChange();

  //   $: chainId || address || account || displayedTokenID || handleChange();
  const handleChange = () => {
    displayedTokenID.set("");
    console.log("🚀 ~ file: Content.svelte ~ line 17 ~ toDisplayTokenID", toDisplayTokenID);
  };
</script>

{#if chainId && account && address}
  {#if toDisplayTokenID}
    <Nft {chainId} {address} tokenID={toDisplayTokenID} {account} {platform} />
  {:else}
    <NftList {chainId} {address} {account} {refresh} bind:refreshing {platform} />
  {/if}
{/if}
