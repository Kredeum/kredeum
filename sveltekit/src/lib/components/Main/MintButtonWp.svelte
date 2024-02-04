<script lang="ts">
  import { onMount } from "svelte";
  import { metamaskInit } from "@kredeum/sveltekit/src/lib/helpers/metamask";

  import { metamaskChainId, metamaskSignerAddress } from "@kredeum/sveltekit/src/lib/stores/metamask";
  import NftMintPopup from "../Nft/NftMintPopup.svelte";
  import type { NftType } from "@kredeum/common/lib/common/types";
  import { storageConfigSet } from "@kredeum/common/lib/storage/storage";

  ////////////////////////////////////////////////////////////////
  // <MintButtonWp  />
  // Main Mint popup
  ////////////////////////////////////////////////////////////////
  export let src: string;
  export let metadata: string | undefined = undefined;
  export let alt: string | undefined = undefined;
  export let pid: string | undefined = undefined;
  export let nid: string | undefined = undefined;
  export let storage: string | undefined = undefined;
  export let content_type: string | undefined = undefined;
  export let external_url: string | undefined = undefined;
  export const post_title: string | undefined = undefined;
  export const post_content: string | undefined = undefined;
  export const post_author: string | undefined = undefined;
  export const post_date: string | undefined = undefined;
  /////////////////////////////////////////////////

  let open = false;
  const toggle = (): boolean => (open = !open);
  let nft: NftType | undefined = undefined;
  let refThis: HTMLElement;

  $: chainId = $metamaskChainId;
  $: signer = $metamaskSignerAddress;

  $: nft && handleNft();
  const handleNft = (): void => {
    if (!nft) return;

    // Dispacth "token" event to be catched
    // in wordpress/plugins/kredeum-nfts/admin/ajax/ajax.js
    nid = nft.nid;
    const detail = { nid, pid };
    const event = new CustomEvent("token", { detail, bubbles: true });

    console.log("handleNft dispatchEvent", detail);
    refThis.dispatchEvent(event);
  };

  const view = (evt: Event) => nid && (location.href = `./admin.php?page=nfts#/${nid.replace("nft://", "")}`);

  onMount(async () => {
    // SET storage type IPFS / Swarm or ArWeave
    if (storage) storageConfigSet({ default: storage });

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
    <NftMintPopup
      {chainId}
      {signer}
      {src}
      name={alt}
      description={alt}
      {metadata}
      {content_type}
      {external_url}
      {toggle}
      bind:nft
    />
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
