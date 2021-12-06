<script lang="ts">
  import type { Collection } from "lib/ktypes";
  import type { Signer } from "ethers";

  import { CloneResponse, CloneReceipt, CloneAddress } from "lib/klist-collections";
  import { explorerTxUrl, explorerAddressUrl, textShort } from "lib/knfts";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let chainId: number = undefined;
  export let signer: Signer = undefined;
  export let collection: Collection = undefined;

  let cloning = false;
  let cloningTxHash: string;
  let collectionCreated: Collection;
  let collectionName: string;

  const createCollection = async () => {
    // console.log("<kredeum-nfts-create /> createCollection");
    if (signer) {
      cloning = true;
      cloningTxHash = null;
      collectionCreated = null;

      const txResp = await CloneResponse(chainId, collectionName, signer);
      cloningTxHash = txResp.hash;

      const txReceipt = await CloneReceipt(txResp);
      collectionCreated = {
        openNFTsVersion: 2,
        chainId,
        name: collectionName,
        address: CloneAddress(txReceipt)
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
              Collection '<a
                class="link"
                href={explorerAddressUrl(chainId, collectionCreated.address)}
                target="_blank">{collectionCreated?.name}</a
              >' created!
            </div>
          </div>
        {:else if cloning}
          <div class="titre">
            <i class="fas fa-sync fa-left c-green" />Creating new collection...
          </div>
          <div class="section">
            {#if cloningTxHash}
              Wait till completed, it may takes one minute or more.
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
            <button class="btn btn-default btn-sell" type="submit" on:click={createCollection}
              >Create</button
            >
          </div>
        {/if}
        {#if cloningTxHash}
          <div class="flex">
            <a class="link" href={explorerTxUrl(chainId, cloningTxHash)} target="_blank"
              >{textShort(cloningTxHash)}</a
            >
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
