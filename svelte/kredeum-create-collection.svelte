<script lang="ts">
  import { CloneResponse, CloneReceipt, CloneAddress } from "../lib/nfts-factory";
  import { explorerAddressLink, explorerTxLink } from "../lib/knfts";
  import type { Collection } from "../lib/kconfig";
  import type { Signer } from "ethers";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let chainId: number = undefined;
  export let address: string = undefined;
  export let signer: Signer = undefined;
  export let collection: Collection = undefined;

  let cloning: boolean = false;
  let cloningTxHash: string;
  let collectionCreated: Collection;
  let collectionName: string;

  const createCollection = async () => {
    // console.log("<kredeum-nfts-create /> createCollection");
    if (signer) {
      cloning = true;
      cloningTxHash = null;
      collectionCreated = null;

      const txResp = await CloneResponse(chainId, address, collectionName, signer);
      cloningTxHash = txResp.hash;

      const txReceipt = await CloneReceipt(txResp);
      collectionCreated = { chainId, name: collectionName, address: CloneAddress(txReceipt) };
      collection = collectionCreated;

      dispatch("collection", { collection: collectionCreated.address });

      cloning = false;
    } else {
      console.error("<kredeum-nfts-create /> not signer");
    }
  };
</script>

<div id="kredeum-create-collection">
  <div class="modal-content">
    <a href="." title="Close" class="modal-close"><i class="fa fa-times"></i></a>

    <div class="modal-body">
      <div>
        {#if collectionCreated}
          <div>
            <div class="titre">
              <i class="fas fa-check fa-left c-green"></i>
              Collection created @ {@html explorerAddressLink(chainId, collectionCreated.address)}
            </div>
          </div>
        {:else if cloning}
          <div class="titre">
            <i class="fas fa-sync fa-left c-green"></i>Creating new collection...
          </div>
          <div>Sign the transaction and wait till completed, it may takes one minute or more.</div>
        {:else}
          <div class="titre">
            <i class="fas fa-plus fa-left c-green"></i>Name your collection
          </div>

          <div class="section">
            <div class="form-field">
              <input type="text" placeholder="My collection" bind:value="{collectionName}" />
            </div>
          </div>

          <div class="txtright">
            <button class="btn btn-default btn-sell" type="submit" on:click="{createCollection}"
              >Create</button
            >
          </div>
        {/if}
        {#if cloningTxHash}
          <div>
            Transaction : {@html explorerTxLink(chainId, cloningTxHash)}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
