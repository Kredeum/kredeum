<script lang="ts">
  import CollectionCreate from "../Collection/CollectionCreate.svelte";

  import InputImportCollection from "../Input/InputImportCollection.svelte";
  import NftMintPopup from "../Nft/NftMintPopup.svelte";
  import { networks } from "@kredeum/common/src/common/networks";

  /////////////////////////////////////////////////
  //  <Create {chainId} {signer} />
  // Create Collection or Nft
  /////////////////////////////////////////////////
  export let chainId: number;
  export let signer: string;

  let open = false;
  const toggle = () => (open = !open);

  $: mint = networks.getCreate(chainId);
</script>

<a href="#create-modal" class="btn btn-default" title="Mint" id="addPopup"><i class="fas fa-plus fa-left" />Add</a>

<!-- Modal create -->
<div class="modal-window" id="create-modal">
  <div class="modal-content">
    <a href="./#" title="Close" class="modal-close"><i class="fa fa-times" /></a>

    <div class="modal-body">
      <div class="titre" id="addTitle">
        <i class="fas fa-plus fa-left c-green" />What do you want to do ?
      </div>

      <div class="txtcenter">
        <span
          role="button"
          tabindex="0"
          on:click={toggle}
          on:keydown={toggle}
          class="btn btn-default"
          title="Mint NFT"
          id="mintPopup">Mint NFT</span
        >
        {#if mint}
          <span class="or">or</span>
          <a href="#add-collection" class="btn btn-second" title="Add a new collection">Create Collection</a>
        {/if}
      </div>

      <div class="add-collection-address">
        <div class="titre">
          {#if mint}
            <span class="or">or</span>
          {:else}
            <i class="fas fa-plus fa-left c-green" />
          {/if}
          Add Custom Collection
        </div>
        <InputImportCollection />
      </div>
    </div>
  </div>
</div>

<!-- SubModal create NFT -->
{#if open}
  <NftMintPopup {chainId} {signer} {toggle} />
{/if}

<!-- SubModal create collection  -->
<div id="add-collection" class="modal-window">
  <CollectionCreate {chainId} {signer} />
</div>

<style>
  .add-collection-address {
    margin-top: 8rem;
  }
</style>
