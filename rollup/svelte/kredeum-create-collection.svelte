<script lang="ts">
  import type { Collection } from "lib/ktypes";
  import type { JsonRpcSigner } from "@ethersproject/providers";

  import { explorerTxUrl, explorerAddressUrl, textShort } from "lib/kconfig";
  import { collectionCloneResponse, collectionCloneReceipt, collectionCloneAddress } from "lib/kcollection-clone";

  import { createEventDispatcher } from "svelte";

  import { chainId, signer, version } from "./network";

  import KredeumListTemplates from "./kredeum-list-templates.svelte";

  // up to parent
  export let collection: Collection = undefined;
  let template: string = undefined;

  let cloning = false;
  let cloningTxHash: string = null;
  let collectionCreated: Collection = null;

  let collectionName = "";
  let collectionSymbol = "";

  const dispatch = createEventDispatcher();

  const createCollection = async () => {
    // console.log(createCollection createCollection");
    cloning = true;
    cloningTxHash = null;
    collectionCreated = null;

    if (!$signer) console.error("ERROR createCollection not signer");
    else {
      const txResp = await collectionCloneResponse(
        $chainId,
        $version,
        collectionName,
        collectionSymbol,
        template,
        $signer
      );

      if (!txResp) console.error("ERROR createCollection no txResp");
      else {
        cloningTxHash = txResp.hash;
        const txReceipt = await collectionCloneReceipt(txResp);

        if (!txReceipt.status) console.error("ERROR createCollection bad status");
        else {
          collectionCreated = {
            openNFTsVersion: 2,
            chainId: $chainId,
            name: collectionName,
            address: collectionCloneAddress(txReceipt),
            user: await $signer.getAddress()
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
              Collection '<a class="link" href={explorerAddressUrl($chainId, collectionCreated.address)} target="_blank"
                >{collectionCreated?.name}</a
              >' created!
            </div>
          </div>
        {:else if cloning}
          <div class="titre">
            <i class="fas fa-sync fa-left c-green" />Creating new Collection...
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
            <i class="fas fa-plus fa-left c-green" />Name your Collection
          </div>

          <div class="section">
            <div class="form-field">
              <input type="text" placeholder="My NFTs collection" bind:value={collectionName} />
            </div>
          </div>

          <div class="titre">
            <i class="fas fa-plus fa-left c-green" />Attach a Symbol to your Collection
          </div>

          <div class="section">
            <div class="form-field">
              <input type="text" placeholder="MYNFT" bind:value={collectionSymbol} />
            </div>
          </div>

          <div class="section">
            <KredeumListTemplates bind:template />
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
