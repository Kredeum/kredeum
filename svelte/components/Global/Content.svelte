<script lang="ts">
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  import Nft from "../Nft/Nft.svelte";
  import NftsList from "../NftsList/NftsList.svelte";

  /////////////////////////////////////////////////
  // <ContentV2 {chainId} {address} {account} {platform}? {refreshing}? {refresh}? />
  // Placeholder for content of Dapp
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let account: string;
  export let platform: string = undefined;
  export let refreshing: boolean = false;
  export let refresh: number = undefined;

  let tokenID: string = "";

  $: account && chainId && address && handleChange();
  const handleChange = () => (tokenID = "");

  const handleClick = (evt: Event) => {
    const evtTarget = evt.target as HTMLInputElement;
    if (!evtTarget.classList.contains("btn") && !evtTarget.classList.contains("video-play-icon")) {
      if (evtTarget.closest("div [data-tokenid]")) {
        evt.preventDefault();
        tokenID = evtTarget.closest("div [data-tokenid]").getAttribute("data-tokenid");
      }
    }
  };

  let toPlayIndex = writable(-1);
  setContext("toPlayIndex", toPlayIndex);
</script>

<div on:click={(evt) => handleClick(evt)}>
  {#if Number(tokenID) > 0}
    <h2 class="m-b-20 return">
      <i class="fa fa-arrow-left fa-left" />
      <span on:click={handleChange} class="link">Return to collection</span>
    </h2>

    <Nft {chainId} {address} {tokenID} {account} {platform} />
  {:else}
    <NftsList {chainId} {address} {account} {refresh} bind:refreshing {platform} />
  {/if}
</div>
