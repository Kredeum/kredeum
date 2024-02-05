<script lang="ts">
  // import { currentAction } from "@kredeum/svelte/src/stores/current";
  // import NftMint from "../Nft/NftMint.svelte";
  import { metamaskSigner } from "@kredeum/svelte/src/stores/metamask";
  import CollectionCreate from "../Collection/CollectionCreate.svelte";

  import NftMintPopup from "../Nft/NftMintPopup.svelte";

  /////////////////////////////////////////////////
  //  <Create {chainId} {signer} />
  // Create Collection or Nft
  /////////////////////////////////////////////////
  export let chainId: number | undefined = undefined;
  export let signer: string | undefined = undefined;

  let open = false;
  const toggle = () => (open = !open);
</script>

<a href="#create-modal" class="btn btn-default" title="Mint"><i class="fas fa-plus fa-left" />Create</a>

<!-- Modal create -->
<div class="modal-window" id="create-modal">
  <div class="modal-content">
    <a href="./#" title="Close" class="modal-close"><i class="fa fa-times" /></a>

    <div class="modal-body">
      <div class="titre">
        <i class="fas fa-plus fa-left c-green" />What do you want to do ?
      </div>

      <div class="txtcenter">
        <span role="button" tabindex="0" on:click={toggle} on:keydown={toggle} class="btn btn-default" title="Mint NFT"
          >Mint NFT</span
        >
        <span class="or">or</span>
        <a href="#add-collection" class="btn btn-second" title="Add a new collection">Create Collection</a>
      </div>
    </div>
  </div>
</div>

{#if chainId && signer}
  <!-- SubModal create NFT -->
  {#if open}
    <NftMintPopup {chainId} {signer} {toggle} />
  {/if}

  <!-- SubModal create collection  -->
  <div id="add-collection" class="modal-window">
    <CollectionCreate {chainId} {signer} />
  </div>
{/if}
