<script lang="ts">
  import type { CollectionType } from "@lib/common/ktypes";
  import type { TransactionResponse } from "@ethersproject/providers";

  import { ethers } from "ethers";

  import { getContext } from "svelte";
  import { Writable } from "svelte/store";

  import { explorerTxLog, explorerTxUrl, explorerAddressUrl, textShort } from "@lib/common/kconfig";
  import {
    collectionCloneResponse,
    collectionCloneReceipt,
    collectionCloneAddress
  } from "@lib/collection/kcollection-clone";

  import { createEventDispatcher } from "svelte";
  import { metamaskSigner } from "@main/metamask";

  import CollectionTemplates from "./CollectionTemplates.svelte";
  import { setDefautCollectionPrice, setDefautCollectionRoyalty } from "@lib/nft/kautomarket";

  // up to parent
  export let chainId: number;
  export let collection: CollectionType = undefined;

  let template: string = undefined;

  let cloning = false;
  let cloningTxHash: string = null;
  let collectionCreated: CollectionType = null;

  let collectionName = "";
  let collectionSymbol = "";

  let collectionDefaultPrice: string;

  let inputCollectionDefaultPrice: string;
  let inputCollectionDefaultRoyaltyAmount: string;
  let inputCollectionDefaultRoyaltiesReceiver: string;

  let defaultPriceTxHash: string;

  // Context for refreshCollectionList
  ///////////////////////////////////////////////////////////
  let refreshCollectionList: Writable<number> = getContext("refreshCollectionList");
  ///////////////////////////////////////////////////////////

  $: inputCollectionDefaultPrice && handlePrice();
  /// manage ethers input with 18 decimals
  const handlePrice = () => {
    inputCollectionDefaultPrice = inputCollectionDefaultPrice.replace(/[^0-9.,]/g, "");
    let formatedInputPrice = inputCollectionDefaultPrice.replace(/[,]/g, ".");
    const decimals = formatedInputPrice.split(".")[1];
    if (decimals?.length > 18) {
      inputCollectionDefaultPrice = inputCollectionDefaultPrice.slice(0, -1);
      formatedInputPrice = formatedInputPrice.slice(0, -1);
    }

    // const priceToConvert = inputPrice.replace(/[,]/g, ".").replace(/[^0-9.]/g, "");
    if (inputCollectionDefaultPrice) collectionDefaultPrice = ethers.utils.parseEther(formatedInputPrice).toString();

    console.log("collectionDefaultPrice : ", collectionDefaultPrice, " Wei");
  };

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
        explorerTxLog(chainId, txResp);

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
          if (template === "OpenNFTsV4/automarket") {
            if (inputCollectionDefaultPrice) {
              console.log(
                "🚀 ~ file: CollectionCreate.svelte ~ line 112 ~ createCollection ~ collectionCreated.address",
                collectionCreated.address
              );
              const txRespYield = setDefautCollectionPrice(
                chainId,
                collectionCreated.address,
                inputCollectionDefaultPrice,
                $metamaskSigner
              );

              const txResp = (await txRespYield.next()).value;
              if (txResp) {
                defaultPriceTxHash = txResp.hash;
                const txReceipt = (await txRespYield.next()).value;
              }
            }
            if (inputCollectionDefaultRoyaltiesReceiver && inputCollectionDefaultRoyaltyAmount) {
              const txRespYield = setDefautCollectionRoyalty(
                chainId,
                collectionCreated.address,
                inputCollectionDefaultRoyaltiesReceiver,
                inputCollectionDefaultRoyaltyAmount,
                $metamaskSigner
              );

              const txResp = (await txRespYield.next()).value;
              if (txResp) {
                defaultPriceTxHash = txResp.hash;
                const txReceipt = (await txRespYield.next()).value;
              }
            }
          }
        }
      }
    }
    cloning = false;
    $refreshCollectionList += 1;
  };

  const resetCollMint = () => {
    if (collectionCreated) {
      cloningTxHash = null;
      collectionCreated = null;
      collectionName = "";
      collectionSymbol = "";
    }
  };
</script>

<div id="kredeum-create-collection">
  <div class="modal-content">
    <a href="./#" on:click={resetCollMint} title="Close" class="modal-close"><i class="fa fa-times" /></a>

    <div class="modal-body">
      <div>
        {#if collectionCreated}
          <div>
            <div class="titre">
              <i class="fas fa-check fa-left c-green" />
              Collection '<a class="link" href={explorerAddressUrl(chainId, collectionCreated.address)} target="_blank"
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
            <CollectionTemplates bind:template />
          </div>
          {#if template === "OpenNFTsV4/automarket"}
            <div class="section">
              <span class="label label-big">Default collection price (Eth)</span>
              <div class="form-field">
                <input type="text" placeholder="0" bind:value={inputCollectionDefaultPrice} id="mint-price-nft" />
              </div>
            </div>
            <div class="section">
              <span class="label label-big">Default collection royalty Ammount (%)</span>
              <div class="form-field">
                <input
                  type="text"
                  placeholder="0"
                  bind:value={inputCollectionDefaultRoyaltyAmount}
                  id="royalty-amount-nft"
                />
              </div>
            </div>
            <div class="section">
              <span class="label label-big">Default collection royalties receiver address</span>
              <div class="form-field">
                <input
                  type="text"
                  placeholder=""
                  bind:value={inputCollectionDefaultRoyaltiesReceiver}
                  id="royalties-reveiver-nft"
                />
              </div>
            </div>
          {/if}

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
