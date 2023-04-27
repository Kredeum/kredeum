<script lang="ts">
  import type { Readable } from "svelte/store";
  import { onMount } from "svelte";
  import { metamaskInit } from "@helpers/metamask";

  import type { NftType } from "@lib/common/types";
  import { ipfsLinkToCid } from "@lib/common/config";

  import { metamaskChainId, metamaskSignerAddress, metamaskSigner } from "@stores/metamask";

  import AccountConnect from "../components/Account/AccountConnect.svelte";
  import NetworkSelect from "../components/Network/NetworkSelect.svelte";
  import CollectionSelect from "../components/Collection/CollectionSelect.svelte";

  import NftMintButton from "../components/Nft/NftMintButton.svelte";

  /////////////////////////////////////////////////
  // <MintButton {src} {metadata} {alt} {pid} {width} {display} />
  // Mint Button
  /////////////////////////////////////////////////
  export let src: string;
  export let metadata: string = undefined;
  export let alt: string = undefined;
  export let pid: string = undefined;
  export let nid: string = undefined;
  export let width = 100;
  export let display = false;
  export let txt = true;
  /////////////////////////////////////////////////

  let nft: NftType = undefined;
  let address: string;
  let refThis: HTMLElement;
  let chainId: number;
  let signer: string;

  // ON network or account change
  $: $metamaskChainId && $metamaskSigner && handleChange().catch(console.error);
  const handleChange = async () => {
    chainId = $metamaskChainId;
    signer = $metamaskSignerAddress;
    // console.log("handleChange ~ address", $address);
  };

  $: nft && handleNft();
  const handleNft = () => {
    console.log("handleNft", handleNft);
    // Dispacth "token" event to be catched in wordpress/plugins/kredeum-nfts/admin/ajax/ajax.js
    const detail = { nid: nft.nid, pid: pid, cid: ipfsLinkToCid(nft.ipfs) };
    const event = new CustomEvent("token", { detail, bubbles: true });

    console.log("handleNft ~ detail:", detail);
    refThis.dispatchEvent(event);
  };

  const view = (evt: Event): void => {
    evt.preventDefault();
    location.href = `./admin.php?page=nfts/#/${nid.replace("nft://", "")}`;
  };

  let mint = () => Promise<void>;
  const _mint = async (evt: Event): Promise<void> => {
    evt.preventDefault();
    await mint();
  };

  onMount(async () => await metamaskInit());
</script>

<main id="kredeum-mint" bind:this={refThis}>
  {#if display && src}
    <img {src} {alt} {width} /><br />
  {/if}

  {#if src && chainId && address && signer}
    <NftMintButton {src} {chainId} {address} {signer} {metadata} bind:nft bind:mint />
  {:else}
    <p><AccountConnect {txt} label={false} /></p>
    <p><NetworkSelect {txt} label={false} bind:chainId /></p>
    <p><CollectionSelect {txt} label={false} mintable={true} {chainId} bind:address account={signer} /></p>
  {/if}
</main>
