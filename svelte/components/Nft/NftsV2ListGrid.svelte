<script lang="ts">
  import type { Readable } from "svelte/store";
  import type { NftType } from "lib/ktypes";

  import NftGrid from "./NftV2Grid.svelte";
  /////////////////////////////////////////////////
  //  <NftListGrid {account} {nfts} {platform}? />
  // Display NFTs List in Grid mode
  /////////////////////////////////////////////////
  export let account: string = undefined;

  export let nfts: Readable<Map<string, NftType>>;

  let clickedIndex;

  // export let platform: string = "dapp";

  const handleClick = (evt: Event) => {
    const evtTarget = evt.target as HTMLInputElement;
    if (evtTarget.classList.contains("video-play-icon")) {
      if (evtTarget.closest("div [data-index]")) {
        evt.preventDefault();
        if (evtTarget.closest("div [data-index]").getAttribute("data-index") !== clickedIndex) {
          clickedIndex = evtTarget.closest("div [data-index]").getAttribute("data-index");
        } else {
          clickedIndex = undefined;
        }
      }
    }
  };
</script>

<div on:click={(evt) => handleClick(evt)}>
  <div class="row grid-krd">
    {#each [...$nfts.values()] as nft, index}
      <NftGrid {nft} {account} {index} paused={Number(clickedIndex) !== index} />
    {/each}
  </div>
</div>
