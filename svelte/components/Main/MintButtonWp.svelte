<script lang="ts">
  import { onMount } from "svelte";
  import { metamaskInit } from "@helpers/metamask";

  import { metamaskChainId, metamaskSignerAddress } from "@stores/metamask";
  import NftMintPopup from "../Nft/NftMintPopup.svelte";
  import { getDappUrl, ipfsLinkToCid } from "@lib/common/config";
  import { NftType, StorageOptionType } from "@lib/common/types";
  import { nftStorageSet } from "@lib/nft/storage/nft-uri";

  ////////////////////////////////////////////////////////////////
  // <MintButtonWp  />
  // Main Mint popup
  ////////////////////////////////////////////////////////////////
  export let src: string;
  export let metadata: string = undefined;
  export let alt: string = undefined;
  export let pid: string = undefined;
  export let nid: string = undefined;

  /////////////////////////////////////////////////

  let open = false;
  const toggle = (): boolean => (open = !open);
  let nft: NftType = undefined;
  let refThis: HTMLElement;

  $: chainId = $metamaskChainId;
  $: signer = $metamaskSignerAddress;

  $: nft && handleNft();
  const handleNft = (): void => {
    // Dispacth "token" event to be catched
    // in wordpress/plugins/kredeum-nfts/admin/ajax/ajax.js
    nid = nft.nid;
    const detail = { nid, pid };
    const event = new CustomEvent("token", { detail, bubbles: true });

    console.log("handleNft dispatchEvent", detail);
    refThis.dispatchEvent(event);
  };

  const view = (evt: Event): void => {
    location.href = `./admin.php?page=nfts#/${nid.replace("nft://", "")}`;
  };

  onMount(async () => {
    await metamaskInit();
  });
</script>

<div bind:this={refThis}>
  <div class="kredeum-button">
    {#if nid}
      <button on:click|preventDefault={view} class="btn btn-small btn-view"> VIEW NFT </button>
    {:else}
      <button on:click|preventDefault={toggle} class="btn btn-small btn-mint"> MINT NFT </button>
    {/if}
  </div>

  {#if open}
    <NftMintPopup {chainId} {signer} {src} name={alt} description={alt} {metadata} {toggle} bind:nft />
  {/if}
</div>

<style>
  .kredeum-button {
    padding: 20px;
  }
  button.btn {
    color: white;
    background-color: #2a81de;
    border: 0px;
    margin: 10px;
    padding: 8px 15px;
    border-radius: 360px;
    border: none;
    width: fit-content;
    transition: all 300ms ease-in-out;
    display: inline-block;
    vertical-align: middle;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 12px;
    cursor: pointer;
  }
  button.btn-mint {
    background-color: #2a81de;
  }
  button.btn-mint:hover {
    background-color: black;
    cursor: pointer;
  }
  button.btn-view {
    background-color: #3acf6e;
  }
  button.btn-view:hover {
    background-color: #2aac57;
  }
</style>
