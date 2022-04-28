<script lang="ts">
  import type { CollectionType } from "lib/ktypes";

  import { explorerTxUrl, explorerAddressUrl, textShort } from "lib/kconfig";
  import { collectionCloneResponse, collectionCloneReceipt, collectionCloneAddress } from "lib/kcollection-clone";

  import { createEventDispatcher } from "svelte";
  import { metamaskSigner } from "main/metamask";

  import CollectionTemplates from "./CollectionTemplates.svelte";

  // up to parent
  export let chainId: number;
  export let collection: CollectionType = undefined;
  let template: string = undefined;

  let cloning = false;
  let cloningTxHash: string = null;
  let collectionCreated: CollectionType = null;

  let collectionName = "";
  let collectionSymbol = "";

  const dispatch = createEventDispatcher();

  const createCollection = async () => {
    // console.log(createCollection createCollection");
    cloning = true;
    cloningTxHash = null;
    collectionCreated = null;

    if (!$metamaskSigner) console.error("ERROR createCollection not signer");
    else {
      const txResp = await collectionCloneResponse(
        chainId,
        collectionName,
        collectionSymbol,
        template,
        $metamaskSigner
      );

      if (!txResp) console.error("ERROR createCollection no txResp");
      else {
        cloningTxHash = txResp.hash;
        const txReceipt = await collectionCloneReceipt(txResp);

        if (!txReceipt.status) console.error("ERROR createCollection bad status");
        else {
          collectionCreated = {
            chainId: chainId,
            name: collectionName,
            address: collectionCloneAddress(txReceipt),
            owner: await $metamaskSigner.getAddress()
          };

          if (!collectionCreated) console.error("ERROR createCollection no collection created");
          else {
            collection = collectionCreated;

            dispatch("collection", { collection: collectionCreated.address });
          }
        }
      }
    }
    cloning = false;
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
              CollectionType '<a
                class="link"
                href={explorerAddressUrl(chainId, collectionCreated.address)}
                target="_blank">{collectionCreated?.name}</a
              >' created!
            </div>
          </div>
        {:else if cloning}
          <div class="titre">
            <i class="fas fa-sync fa-left c-green" />Creating new CollectionType...
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
            <i class="fas fa-plus fa-left c-green" />Name your CollectionType
          </div>

          <div class="section">
            <div class="form-field">
              <input type="text" placeholder="My NFTs collection" bind:value={collectionName} />
            </div>
          </div>

          <div class="titre">
            <i class="fas fa-plus fa-left c-green" />Attach a Symbol to your CollectionType
          </div>

          <div class="section">
            <div class="form-field">
              <input type="text" placeholder="MYNFT" bind:value={collectionSymbol} />
            </div>
          </div>

          <div class="section">
            <CollectionTemplates bind:template />
          </div>

          <div class="txtright">
            <button class="btn btn-default btn-sell" type="submit" on:click={createCollection}>Create</button>
          </div>
        {/if}
        {#if cloningTxHash}
          <div class="flex">
            <a class="link" href={explorerTxUrl(chainId, cloningTxHash)} target="_blank">{textShort(cloningTxHash)}</a>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
