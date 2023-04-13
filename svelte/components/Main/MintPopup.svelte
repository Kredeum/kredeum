<script lang="ts">
  import { onMount } from "svelte";
  import { metamaskInit } from "@helpers/metamask";

  import { metamaskChainId, metamaskSignerAddress } from "@main/metamask";
  import NftMintPopup from "../Nft/NftMintPopup.svelte";

  ////////////////////////////////////////////////////////////////
  // <MintPopup  />
  // Main Mint popup
  ////////////////////////////////////////////////////////////////

  let open = false;
  const toggleOpen = () => (open = true);

  $: chainId = $metamaskChainId;
  $: signer = $metamaskSignerAddress;

  onMount(async () => {
    await metamaskInit();
  });
</script>

<main id="kredeum-mint-popup">
  <span on:click={toggleOpen} on:keydown={toggleOpen} class="btn btn-default" title="Mint NFT">Mint NFT</span>
</main>

{#if open}
  <NftMintPopup {chainId} {signer} />
{/if}

<style>
  #kredeum-mint-popup {
    padding: 20px;
  }
</style>
