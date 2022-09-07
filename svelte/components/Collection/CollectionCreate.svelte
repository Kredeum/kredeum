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
  let settingDefaultPrice = false;
  let defaultPriceTxHash: string = null;
  let defaultPriceSetted = false;

  let settingRoyaltyInfo = false;
  let royaltiesTxHash: string = null;
  let defaultRoyaltyInfoSetted = false;

  let inputCollectionDefaultPrice: string;
  let inputCollectionDefaultRoyaltyAmount: string;
  let inputCollectionDefaultRoyaltiesReceiver: string;

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

              settingDefaultPrice = true;

              const txRespYield = setDefautCollectionPrice(
                chainId,
                collectionCreated.address,
                collectionDefaultPrice,
                $metamaskSigner
              );

              const txResp = (await txRespYield.next()).value;
              if (txResp) {
                defaultPriceTxHash = txResp.hash;
                const txReceipt = (await txRespYield.next()).value;
              }
              settingDefaultPrice = false;
              defaultPriceSetted = true;
            }
            if (inputCollectionDefaultRoyaltiesReceiver || inputCollectionDefaultRoyaltyAmount) {
              settingRoyaltyInfo = true;
              const txRespYield = setDefautCollectionRoyalty(
                chainId,
                collectionCreated.address,
                inputCollectionDefaultRoyaltiesReceiver,
                Math.round(Number(inputCollectionDefaultRoyaltyAmount) * 100).toString(),
                $metamaskSigner
              );

              const txResp = (await txRespYield.next()).value;
              if (txResp) {
                royaltiesTxHash = txResp.hash;
                const txReceipt = (await txRespYield.next()).value;
              }
              settingRoyaltyInfo = false;
              defaultRoyaltyInfoSetted = true;
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
      inputCollectionDefaultPrice = "";
      inputCollectionDefaultRoyaltyAmount = "";
      inputCollectionDefaultRoyaltiesReceiver = "";
      collectionDefaultPrice = "";
      settingDefaultPrice = false;
      defaultPriceTxHash = null;
      defaultPriceSetted = false;
      settingRoyaltyInfo = false;
      royaltiesTxHash = null;
      defaultRoyaltyInfoSetted = false;
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
            <div class="section">
              <div class="flex">
                <a class="link" href={explorerTxUrl(chainId, cloningTxHash)} target="_blank"
                  >{textShort(cloningTxHash)}</a
                >
              </div>
            </div>
          </div>
          {#if settingDefaultPrice}
            <div class="titre">
              <i class="fas fa-sync fa-left c-green" />Setting default Nft minting price for this collection to {ethers.utils.formatEther(
                collectionDefaultPrice
              )} Eth
            </div>
            <div class="section">
              {#if defaultPriceTxHash}
                Wait till completed, it may take one minute or more.
              {:else}
                Sign the transaction
              {/if}
            </div>
          {:else if defaultPriceSetted}
            <div class="titre">
              <i class="fas fa-check fa-left c-green" />
              default Nft minting price setted to {ethers.utils.formatEther(collectionDefaultPrice)} Eth for this collection
            </div>
            <div class="section">
              <div class="flex">
                <a class="link" href={explorerTxUrl(chainId, defaultPriceTxHash)} target="_blank"
                  >{textShort(defaultPriceTxHash)}</a
                >
              </div>
            </div>
            {#if settingRoyaltyInfo}
              <div>
                <div class="titre">
                  <i class="fas fa-sync fa-left c-green" />Setting default royalty infos for this collection to :
                </div>
                <div class="section">
                  Fraction : {inputCollectionDefaultRoyaltyAmount} %<br />
                  Receiver : {inputCollectionDefaultRoyaltiesReceiver}
                </div>
                {#if royaltiesTxHash}
                  Wait till completed, it may take one minute or more.
                {:else}
                  Sign the transaction
                {/if}
              </div>
            {:else if defaultRoyaltyInfoSetted}
              <div class="titre">
                <i class="fas fa-check fa-left c-green" />
                default Nft Royalty info setted to :<br />
              </div>
              <div class="section">
                Fraction : {inputCollectionDefaultRoyaltyAmount} %<br />
                Receiver : {inputCollectionDefaultRoyaltiesReceiver}
                <div class="flex">
                  <a class="link" href={explorerTxUrl(chainId, royaltiesTxHash)} target="_blank"
                    >{textShort(royaltiesTxHash)}</a
                  >
                </div>
              </div>
            {/if}
          {/if}
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
        {#if cloningTxHash && !collectionCreated}
          <div class="flex">
            <a class="link" href={explorerTxUrl(chainId, cloningTxHash)} target="_blank">{textShort(cloningTxHash)}</a>
          </div>
        {/if}
        {#if defaultPriceTxHash && !defaultPriceSetted}
          <div class="flex">
            <a class="link" href={explorerTxUrl(chainId, defaultPriceTxHash)} target="_blank"
              >{textShort(defaultPriceTxHash)}</a
            >
          </div>
        {/if}
        {#if royaltiesTxHash && !defaultRoyaltyInfoSetted}
          <div class="flex">
            <a class="link" href={explorerTxUrl(chainId, royaltiesTxHash)} target="_blank"
              >{textShort(royaltiesTxHash)}</a
            >
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
