<script lang="ts">
  import type { CollectionType } from "@lib/common/ktypes";
  import type { TransactionResponse } from "@ethersproject/providers";

  import { ethers } from "ethers";

  import { getContext, onMount } from "svelte";
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

  let cloning: number;
  let cloneError: string;
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

  const _cloneError = (err: string): void => {
    cloneError = err;
    console.error(cloneError);
    cloning = 0;
  };

  // CREATING STATES
  //
  //  STATE 0 Start
  //    |
  //  STATE 1 Confirm Clone
  //    |
  //  STATE 2
  // Ask for Clone signature
  //    |
  //  TEST TxResp --> ERROR sending Clone TX
  //    |
  //  STATE 3 Wait TX & display Clone TX Hash
  //    |
  //  TEST TxReceipt --> ERROR inside Clone TX
  //    |
  //  STATE 4
  // Ask for Price signature
  //    |
  //  TEST TxResp --> ERROR sending Price TX
  //    |
  //  STATE 5 Wait TX & display Price TX Hash
  //    |
  //  TEST TxReceipt --> ERROR inside Price TX
  //    |
  //  STATE 6
  // Ask for Royalties signature
  //    |
  //  TEST TxResp --> ERROR sending Royalties TX
  //    |
  //  STATE 7 Wait TX & display Royalties TX Hash
  //    |
  //  TEST TxReceipt --> ERROR inside Royalties TX
  //    |
  //  STATE 8 End TX & Refresh
  //    |
  //  CLICK Close
  //    |
  //  STATE 0 popup closed

  // STATES : S0 -S8
  const S0_START = 0;
  const S1_CONFIRM = 1;
  const S2_SIGN_CLONE_TX = 2;
  const S3_WAIT_CLONE_TX = 3;
  const S4_SIGN_PRICE_TX = 4;
  const S5_WAIT_PRICE_TX = 5;
  const S6_SIGN_ROYALTIES_TX = 6;
  const S7_WAIT_ROYALTIES_TX = 7;
  const S8_MINTED = 8;

  const _cloneInit = async () => {
    cloningTxHash = null;
    collectionCreated = null;

    cloning = S1_CONFIRM;
  };

  const _cloneConfirm = async () => {
    const txResp = await collectionCloneResponse(chainId, collectionName, collectionSymbol, template, $metamaskSigner);

    cloning = S2_SIGN_CLONE_TX;

    if (!txResp) return _cloneError("ERROR collectionClone no txResp");

    explorerTxLog(chainId, txResp);
    cloningTxHash = txResp.hash;

    cloning = S3_WAIT_CLONE_TX;

    const txReceipt = await collectionCloneReceipt(txResp);

    if (!txReceipt.status) return _cloneError(`ERROR collectionClone bad status ${JSON.stringify(txReceipt, null, 2)}`);

    collectionCreated = {
      chainId: chainId,
      name: collectionName,
      address: collectionCloneAddress(txReceipt),
      owner: await $metamaskSigner.getAddress()
    };

    if (!collectionCreated) return _cloneError("ERROR collectionClone no collection created");

    collection = collectionCreated;

    dispatch("collection", { collection: collectionCreated.address });

    if (template === "OpenNFTsV4/automarket") {
      if (inputCollectionDefaultPrice) {
        settingDefaultPrice = true;
        cloning = S4_SIGN_PRICE_TX;

        const txRespYield = setDefautCollectionPrice(
          chainId,
          collectionCreated.address,
          collectionDefaultPrice,
          $metamaskSigner
        );

        const txResp = (await txRespYield.next()).value;

        if (!txResp) return _cloneError("ERROR collectionPrice no txResp");

        cloning = S5_WAIT_PRICE_TX;

        defaultPriceTxHash = txResp.hash;
        const txReceipt = (await txRespYield.next()).value;

        settingDefaultPrice = false;
        defaultPriceSetted = true;
      }

      if (inputCollectionDefaultRoyaltiesReceiver || inputCollectionDefaultRoyaltyAmount) {
        settingRoyaltyInfo = true;

        cloning = S6_SIGN_ROYALTIES_TX;

        const txRespYield = setDefautCollectionRoyalty(
          chainId,
          collectionCreated.address,
          inputCollectionDefaultRoyaltiesReceiver,
          Math.round(Number(inputCollectionDefaultRoyaltyAmount) * 100).toString(),
          $metamaskSigner
        );

        const txResp = (await txRespYield.next()).value;

        if (!txResp) return _cloneError("ERROR collectionRoyalties no txResp");
        royaltiesTxHash = txResp.hash;

        cloning = S7_WAIT_ROYALTIES_TX;

        const txReceipt = (await txRespYield.next()).value;

        cloning = S8_MINTED;

        settingRoyaltyInfo = false;
        defaultRoyaltyInfoSetted = true;
      }
    }
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

  onMount(() => {
    _cloneInit();
  });
</script>

<div id="kredeum-create-collection">
  <div class="modal-content">
    <a href="./#" on:click={resetCollMint} title="Close" class="modal-close"><i class="fa fa-times" /></a>

    <div class="modal-body">
      <div>
        {#if cloning == S1_CONFIRM}
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
            <button class="btn btn-default btn-sell" type="submit" on:click={_cloneConfirm}>Create</button>
          </div>
        {:else if cloning == S2_SIGN_CLONE_TX}
          <div class="section">Please, sign the transaction</div>
        {:else if cloning == S3_WAIT_CLONE_TX}
          <div class="section">Wait till completed, it may take one minute or more.</div>
        {:else if cloning == S4_SIGN_PRICE_TX}
          ---
        {:else if cloning == S5_WAIT_PRICE_TX}
          ---
        {:else if cloning == S6_SIGN_ROYALTIES_TX}
          ---
        {:else if cloning == S7_WAIT_ROYALTIES_TX}
          ---
        {:else if cloning == S8_MINTED}
          ---
        {/if}

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
                  Fee : {inputCollectionDefaultRoyaltyAmount} %<br />
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
                Fee : {inputCollectionDefaultRoyaltyAmount} %<br />
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
            <button class="btn btn-default btn-sell" type="submit" on:click={_cloneConfirm}>Create</button>
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

        {#if cloneError}
          <div class="section">{cloneError}</div>
        {/if}
      </div>
    </div>
  </div>
</div>
