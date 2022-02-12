<script lang="ts">
  import type { Collection } from "lib/ktypes";
  import type { JsonRpcSigner } from "@ethersproject/providers";

  import { explorerTxUrl, explorerAddressUrl, textShort } from "lib/kconfig";
  import { collectionCloneResponse, collectionCloneReceipt, collectionCloneAddress } from "lib/kcollection-clone";

  import { createEventDispatcher } from "svelte";

  import { chainId, signer } from "./network";

  // up to parent
  export let collection: Collection = undefined;

  let cloning = false;
  let cloningTxHash: string;
  let collectionCreated: Collection;
  let collectionName: string;

  const dispatch = createEventDispatcher();

  const createCollection = async () => {
    // console.log("<kredeum-nfts-create /> createCollection");
    if ($signer) {
      cloning = true;
      cloningTxHash = null;
      collectionCreated = null;

      const txResp = await collectionCloneResponse($chainId, collectionName, $signer);
      cloningTxHash = txResp.hash;

      const txReceipt = await collectionCloneReceipt(txResp);
      collectionCreated = {
        openNFTsVersion: 2,
        chainId: $chainId,
        name: collectionName,
        address: collectionCloneAddress(txReceipt),
        user: await $signer.getAddress()
      };
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
    <a href="." title="Close" class="modal-close"><i class="fa fa-times" /></a>

    <div class="modal-body">
      <div>
        {#if collectionCreated}
          <div>
            <div class="titre">
              <i class="fas fa-check fa-left c-green" />
              Collection '<a class="link" href={explorerAddressUrl($chainId, collectionCreated.address)} target="_blank"
                >{collectionCreated?.name}</a
              >' created!
            </div>
          </div>
        {:else if cloning}
          <div class="titre">
            <i class="fas fa-sync fa-left c-green" />Creating new collection...
          </div>
          <div class="section">
            {#if cloningTxHash}
              Wait till completed, it may take one minute or more.
            {:else}
              Sign the transaction
            {/if}
          </div>
        {:else}
          <div class="titre">
            <i class="fas fa-plus fa-left c-green" />Name your collection
          </div>

          <div class="section">
            <div class="form-field">
              <input type="text" placeholder="My collection" bind:value={collectionName} />
            </div>
          </div>

          <div class="txtright">
            <button class="btn btn-default btn-sell" type="submit" on:click={createCollection}>Create</button>
          </div>
        {/if}
        {#if cloningTxHash}
          <div class="flex">
            <a class="link" href={explorerTxUrl($chainId, cloningTxHash)} target="_blank">{textShort(cloningTxHash)}</a>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
