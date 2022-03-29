<script lang="ts">
  import { currentAction } from "main/current";
  import NftMint from "../Nft/NftMint.svelte";
  import CollectionCreate from "../Collection/CollectionCreate.svelte";

  export let chainId: number;

  const create = () => ($currentAction = "create");
</script>

<span on:click={create} class="btn btn-default" title="Mint"><i class="fas fa-plus fa-left" />Mint</span>

<!-- Modal create -->
<div class="modal-window  {$currentAction == 'create' && 'target'}">
  <div class="modal-content">
    <a href="." title="Close" class="modal-close"><i class="fa fa-times" /></a>

    <div class="modal-body">
      <div class="titre">
        <i class="fas fa-plus fa-left c-green" />What do you want to do ?
      </div>

      <div class="txtcenter">
        <a href="#create-nft" class="btn btn-default" title="Mint NFT">Mint NFT</a>
        <span class="or">Or</span>
        <a href="#add-collection" class="btn btn-second" title="Add a new collection">Add a new collection</a>
      </div>
    </div>
  </div>
</div>

<!-- SubModal create NFT -->
<div id="create-nft" class="modal-window">
  <NftMint {chainId} />
</div>

<!-- SubModal create collection -->
<div id="add-collection" class="modal-window">
  <CollectionCreate {chainId} />
</div>
