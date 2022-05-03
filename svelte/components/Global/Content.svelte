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

  $: chainId && address && handleChange();
  const handleChange = () => {
    toDisplayTokenID = "";
  };

  const handleClick = (evt) => {
    if (evt.target.closest("div [data-tokenid]")) {
      evt.preventDefault();
      toDisplayTokenID = evt.target.closest("div [data-tokenid]")?.dataset.tokenid;
    }
    console.log(
      "🚀 ~ file: Content.svelte ~ line 17 ~ toDisplayTokenID",
      evt.target.closest("div [data-tokenid]")?.dataset.tokenid
    );
  };
</script>

{#if toDisplayTokenID}
  <Nft {chainId} {address} bind:tokenID={toDisplayTokenID} {account} {platform} />
{:else}
  {#key address}
    <div on:click={(evt) => handleClick(evt)}>
      <NftList {chainId} {address} {account} {refresh} bind:refreshing {platform} />
    </div>
  {/key}
{/if}
