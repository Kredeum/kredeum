<script lang="ts">
  // import { currentAction } from "@main/current";
  // import NftMint from "../Nft/NftMint.svelte";
  import CollectionCreate from "../Collection/CollectionCreate.svelte";

  import NftMint from "../Nft/NftMint.svelte";

  /////////////////////////////////////////////////
  //  <Create {chainId} {storage} />
  // Create Collection or Nft
  /////////////////////////////////////////////////
  export let chainId: number;
  export let storage: string;

  // const create = () => ($currentAction = "create");
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
        <!-- <a href="#create-nft" class="btn btn-default" title="Mint NFT">Mint NFT</a> -->
        <NftMint {storage} />
        <span class="or">or</span>
        <a href="#add-collection" class="btn btn-second" title="Add a new collection">Create Collection</a>
      </div>
    </div>
  </div>
</div>

<!-- SubModal create NFT -->
<!-- <div id="create-nft" class="modal-window">
  <NftMint {chainId} />
</div> -->

<!-- SubModal create collection -->
<div id="add-collection" class="modal-window">
  <CollectionCreate {chainId} />
</div>
