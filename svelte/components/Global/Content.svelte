<script lang="ts">
  // import { displayedTokenID } from "main/diplayedNft";

  import Nft from "../Nft/Nft.svelte";
  import NftList from "../Nft/NftList.svelte";

  export let chainId: number;
  export let address: string;
  export let account: string;
  export let platform: string;
  export let refreshing: boolean;
  export let refresh: number;

  let tokenID: string = "";

  // $: tokenID = $displayedTokenID;

  $: account && chainId && address && handleChange();
  const handleChange = () => {
    tokenID = "";
  };

  const handleClick = (evt) => {
    console.log(evt);
    if (!evt.target.classList.contains("btn")) {
      if (evt.target.closest("div [data-tokenid]")) {
        evt.preventDefault();
        tokenID = evt.target.closest("div [data-tokenid]").dataset.tokenid;
      } else if (evt.target.getAttribute("data-back") === "backtocoll") {
        evt.preventDefault();
        tokenID = "";
      }
    }
  };
</script>

<div on:click={(evt) => handleClick(evt)}>
  {#if tokenID}
    <Nft {chainId} {address} {tokenID} {account} {platform} />
  {:else}
    {#key address}
      <NftList {chainId} {address} {account} {refresh} bind:refreshing {platform} />
    {/key}
  {/if}
</div>
