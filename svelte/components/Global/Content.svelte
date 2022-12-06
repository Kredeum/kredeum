<script lang="ts">
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  import Nft from "../Nft/NftOld.svelte";
  import NftsList from "../NftsList/NftsList.svelte";

  ////////////////////////////////////////////////////////////////////
  // <ContentV2 {chainId} {address} {account} {platform}? />
  // Content placeholder for Dapp
  ////////////////////////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let account: string;
  export let platform: string = undefined;
  export let tokenID: string = "";

  let first = true;
  $: chainId && address && handleChange();
  const handleChange = () => {
    if (first) {
      first = false;
    } else {
      tokenID = "";
      window.location.hash = "";
    }
  };

  const handleClick = (evt: Event) => {
    const evtTarget = evt.target as HTMLInputElement;
    if (!evtTarget.classList.contains("btn") && !evtTarget.classList.contains("video-play-icon")) {
      if (evtTarget.closest("div [data-tokenid]")) {
        evt.preventDefault();
        tokenID = evtTarget.closest("div [data-tokenid]").getAttribute("data-tokenid");
      }
    }
  };

  let toPlayTokenID = writable("");
  setContext("toPlayTokenID", toPlayTokenID);
</script>

<!-- {tokenID} -->
<div on:click={handleClick} on:keydown={handleClick}>
  {#if tokenID !== ""}
    <h2 class="m-b-20 return">
      <i class="fa fa-arrow-left fa-left" />
      <span on:click={handleChange} on:keydown={handleChange} class="link">Return to collection</span>
    </h2>

    <Nft {chainId} {address} {tokenID} {account} {platform} />
  {:else}
    <NftsList {chainId} {address} {account} {platform} />
  {/if}
</div>
