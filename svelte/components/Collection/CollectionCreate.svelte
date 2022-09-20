<script lang="ts">
  import type { CollectionType } from "@lib/common/ktypes";

  import { BigNumber, constants, ethers, utils } from "ethers";

  import { getContext, onMount } from "svelte";
  import { Writable } from "svelte/store";

  import { explorerTxLog, explorerTxUrl, explorerAddressUrl, textShort } from "@lib/common/kconfig";
  import { collectionClone, collectionCloneAddress } from "@lib/collection/kcollection-clone";

  import { createEventDispatcher } from "svelte";
  import { metamaskSigner } from "@main/metamask";

  import CollectionTemplates from "./CollectionTemplates.svelte";
  // import { setDefautCollectionPrice, setDefautCollectionRoyalty } from "@lib/nft/kautomarket";

  // up to parent
  export let chainId: number;
  export let collection: CollectionType = undefined;

  let template: string = undefined;

  let cloning: number;
  let cloneError: string;

  let collectionName = "";
  let collectionSymbol = "";

  let collectionCreated: CollectionType = null;

  let cloningTxHash: string = null;
  // let defaultPriceTxHash: string = null;
  // let royaltiesTxHash: string = null;

  let inputPrice: string = "0";
  let inputFee: string = "0";
  let inputReceiver: string;

  // Context for refreshCollectionList
  ///////////////////////////////////////////////////////////
  let refreshCollectionList: Writable<number> = getContext("refreshCollectionList");
  ///////////////////////////////////////////////////////////

  $: if (inputPrice) {
    let price = inputPrice.replace(/[^0-9.,]/g, "").replace(/[,]/g, ".") + "X";

    do price = price.slice(0, -1);
    while (price.split(".")[1]?.length > 18);

    inputPrice = price;
  }

  const dispatch = createEventDispatcher();

  const _cloneError = (err: string): void => {
    cloneError = err;
    console.error(cloneError);
    cloning = 0;
  };

  const _resetError = (): void => {
    _cloneInit();
    cloneError = null;
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
  // Collection Created
  //    |
  //  STATE 5
  // Ask for Price signature
  //    |
  //  TEST TxResp --> ERROR sending Price TX
  //    |
  //  STATE 6 Wait TX & display Price TX Hash
  //    |
  //  TEST TxReceipt --> ERROR inside Price TX
  //    |
  //  STATE 7
  // Defaut collection price setted
  //    |
  //  STATE 8
  // Ask for Royalties signature
  //    |
  //  TEST TxResp --> ERROR sending Royalties TX
  //    |
  //  STATE 9 Wait TX & display Royalties TX Hash
  //    |
  //  TEST TxReceipt --> ERROR inside Royalties TX
  //    |
  //  STATE 10 End TX & Refresh
  //    |
  //  CLICK Close
  //    |
  //  STATE 0 popup closed

  // STATES : S0 -S8
  const S1_CONFIRM = 1;
  const S2_SIGN_CLONE_TX = 2;
  const S3_WAIT_CLONE_TX = 3;
  const S4_COLL_CREATED = 4;
  // const S5_SIGN_PRICE_TX = 5;
  // const S6_WAIT_PRICE_TX = 6;
  // const S7_PRICE_SETTED = 7;
  // const S8_SIGN_ROYALTIES_TX = 8;
  // const S9_WAIT_ROYALTIES_TX = 9;
  // const S10_MINTED = 10;

  const _cloneInit = async () => {
    cloningTxHash = null;
    collectionCreated = null;

    cloning = S1_CONFIRM;
  };

  const _validFee = (fee: string): boolean => Number(fee) >= 0 && Number(fee) <= 10000;
  const _validFeeNotZero = (fee: string): boolean => _validFee(fee) && Number(fee) > 0;
  // const _validPriceNotZero = (price: string): boolean => Number(price) > 0;
  const _validAddressNotZero = (addr: string): boolean => utils.isAddress(addr) && addr != constants.AddressZero;

  const _cloneConfirm = async () => {
    if (
      (_validAddressNotZero(inputReceiver) && !_validFeeNotZero(inputFee)) ||
      (!_validAddressNotZero(inputReceiver) && _validFeeNotZero(inputFee))
    )
      return _cloneError("Royalties amount and Royalty receiver must be declared together");
    console.log("const_cloneConfirm= ~ inputFee", inputFee);

    cloning = S2_SIGN_CLONE_TX;
    const cloneTxRespYield = collectionClone(
      chainId,
      collectionName,
      collectionSymbol,
      template,
      $metamaskSigner,
      ethers.utils.parseEther(inputPrice) || BigNumber.from(0),
      inputReceiver || constants.AddressZero,
      BigNumber.from(Math.round(Number(inputFee) * 100))
    );
    //   defaultPrice: BigNumber = BigNumber.from(0),
    // receiver: string = constants.AddressZero,
    // fee: BigNumber = BigNumber.from(0)

    const cloneTxResp = (await cloneTxRespYield.next()).value;

    if (!cloneTxResp) return _cloneError("ERROR collectionClone no cloneTxResp");

    explorerTxLog(chainId, cloneTxResp);
    cloningTxHash = cloneTxResp.hash;

    cloning = S3_WAIT_CLONE_TX;

    const cloneTxReceipt = (await cloneTxRespYield.next()).value;

    if (!cloneTxReceipt.status)
      return _cloneError(`ERROR collectionClone bad status ${JSON.stringify(cloneTxReceipt, null, 2)}`);

    collectionCreated = {
      chainId: chainId,
      name: collectionName,
      address: collectionCloneAddress(cloneTxReceipt),
      owner: await $metamaskSigner.getAddress()
    };
    collection = collectionCreated;

    dispatch("collection", { collection: collectionCreated.address });

    cloning = S4_COLL_CREATED;

    // if (template === "OpenAutoMarket/ownable") {
    //   if (_validPriceNotZero(inputPrice)) {
    //     cloning = S5_SIGN_PRICE_TX;

    //     const setDefaultPriceTxRespYield = setDefautCollectionPrice(
    //       chainId,
    //       collection.address,
    //       ethers.utils.parseEther(inputPrice) || BigNumber.from(0),
    //       $metamaskSigner
    //     );

    //     const setDefaultPriceTxResp = (await setDefaultPriceTxRespYield.next()).value;

    //     if (!setDefaultPriceTxResp) return _cloneError("ERROR collectionPrice no setDefaultPriceTxResp");

    //     explorerTxLog(chainId, setDefaultPriceTxResp);
    //     defaultPriceTxHash = setDefaultPriceTxResp.hash;

    //     cloning = S6_WAIT_PRICE_TX;

    //     const setDefaultPriceTxReceipt = (await setDefaultPriceTxRespYield.next()).value;

    //     if (!setDefaultPriceTxReceipt.status)
    //       return _cloneError(`ERROR collectionPrice bad status ${JSON.stringify(setDefaultPriceTxReceipt, null, 2)}`);

    //     cloning = S7_PRICE_SETTED;
    //   }

    //   if (inputReceiver || _validFeeNotZero(inputFee)) {
    //     cloning = S8_SIGN_ROYALTIES_TX;

    //     const setDefaultRoyaltyTxRespYield = setDefautCollectionRoyalty(
    //       chainId,
    //       collectionCreated.address,
    //       inputReceiver,
    //       BigNumber.from(inputFee).mul(100),
    //       $metamaskSigner
    //     );

    //     const setDefaultRoyaltyTxResp = (await setDefaultRoyaltyTxRespYield.next()).value;

    //     if (!setDefaultRoyaltyTxResp) return _cloneError("ERROR collectionRoyalties no setDefaultRoyaltyTxResp");

    //     explorerTxLog(chainId, setDefaultRoyaltyTxResp);
    //     royaltiesTxHash = setDefaultRoyaltyTxResp.hash;

    //     cloning = S9_WAIT_ROYALTIES_TX;

    //     const setDefaultRpyaltyReceipt = (await setDefaultRoyaltyTxRespYield.next()).value;

    //     if (!setDefaultRpyaltyReceipt.status)
    //       return _cloneError(
    //         `ERROR collectionRoyalties bad status ${JSON.stringify(setDefaultRpyaltyReceipt, null, 2)}`
    //       );

    //     cloning = S10_MINTED;
    //   }
    // }

    $refreshCollectionList += 1;
  };

  const resetCollMint = () => {
    if (collectionCreated) {
      cloningTxHash = null;
      collectionCreated = null;
      collectionName = "";
      collectionSymbol = "";
      inputPrice = "";
      inputFee = "0";
      inputReceiver = "";
      // defaultPriceTxHash = null;
      // royaltiesTxHash = null;
      cloneError = null;
      cloning = S1_CONFIRM;
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
      <div class="titre">
        <i class="fas fa-plus fa-left c-green" />Create Collection ({cloning})
      </div>

      <div>
        {#if cloning == S1_CONFIRM}
          <CollectionTemplates bind:template />

          <div class="titre">Name your Collection</div>

          <div class="section">
            <div class="form-field">
              <input
                type="text"
                class=" kre-field-outline"
                placeholder="My NFTs collection"
                bind:value={collectionName}
              />
            </div>
          </div>

          <div class="titre">Attach a Symbol to your Collection</div>

          <div class="section">
            <div class="form-field">
              <input type="text" class=" kre-field-outline" placeholder="MYNFT" bind:value={collectionSymbol} />
            </div>
          </div>

          {#if template === "OpenAutoMarket/ownable"}
            <!-- <div class="section">
              <div class="titre">Mint price (ETH)</div>
              <div class="form-field">
                <input
                  type="text"
                  class=" kre-field-outline"
                  placeholder="0"
                  bind:value={inputPrice}
                  id="mint-price-nft"
                />
              </div>
            </div> -->
            <div class="section">
              <div class="titre">Royalties (%)</div>
              <div class="form-field">
                <input
                  type="text"
                  class=" kre-field-outline"
                  placeholder="0"
                  bind:value={inputFee}
                  id="royalty-amount-nft"
                />
              </div>
            </div>
            <div class="section">
              <div class="titre">Royalty receiver</div>
              <div class="form-field">
                <input
                  type="text"
                  class=" kre-field-outline"
                  placeholder="Ethereum receiver address"
                  bind:value={inputReceiver}
                  id="royalties-reveiver-nft"
                />
              </div>
            </div>
          {/if}

          <div class="txtright">
            <button class="btn btn-default btn-sell" type="submit" on:click={_cloneConfirm}>Create</button>
          </div>
        {/if}
        {#if cloning >= S2_SIGN_CLONE_TX && cloning < S4_COLL_CREATED}
          <div class="titre">
            <i class="fas fa-sync fa-left c-green" />Creating new Collection...
          </div>
        {/if}
        {#if cloning == S2_SIGN_CLONE_TX}
          <div class="section">Please, sign the transaction</div>
        {:else if cloning == S3_WAIT_CLONE_TX}
          <div class="section">Wait till completed, it may take one minute or more.</div>
          <div class="flex">
            <a class="link" href={explorerTxUrl(chainId, cloningTxHash)} target="_blank">{textShort(cloningTxHash)}</a>
          </div>
        {/if}
        {#if cloning > S3_WAIT_CLONE_TX}
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
        {/if}
        <!-- 
        {#if cloning >= S5_SIGN_PRICE_TX && inputPrice}
          <div class="kre-modal-block">
            {#if cloning >= S5_SIGN_PRICE_TX && cloning < S7_PRICE_SETTED}
              <div class="titre">
                <i class="fas fa-sync fa-left c-green" />Setting default Nft minting price for this collection to {ethers.utils.formatEther(
                  inputPrice
                )} ETH
              </div>
            {/if}
            {#if cloning == S5_SIGN_PRICE_TX}
              <div class="section">Please, sign the transaction</div>
            {:else if cloning == S6_WAIT_PRICE_TX}
              <div class="section">Wait till completed, it may take one minute or more.</div>
              <div class="flex">
                <a class="link" href={explorerTxUrl(chainId, defaultPriceTxHash)} target="_blank"
                  >{textShort(defaultPriceTxHash)}</a
                >
              </div>
            {/if}
            {#if cloning >= S7_PRICE_SETTED}
              <div class="titre">
                <i class="fas fa-check fa-left c-green" />
                default Nft minting price setted to {ethers.utils.formatEther(inputPrice)} ETH for this collection
              </div>
              <div class="section">
                <div class="flex">
                  <a class="link" href={explorerTxUrl(chainId, defaultPriceTxHash)} target="_blank"
                    >{textShort(defaultPriceTxHash)}</a
                  >
                </div>
              </div>
            {/if}
          </div>
        {/if}

        {#if cloning >= S8_SIGN_ROYALTIES_TX}
          <div class="kre-modal-block">
            {#if cloning >= S8_SIGN_ROYALTIES_TX && cloning < S10_MINTED}
              <div>
                <div class="titre">
                  <i class="fas fa-sync fa-left c-green" />Setting default royalty infos for this collection to :
                </div>
                <div class="section">
                  Fee : {inputFee} %<br />
                  Receiver : {inputReceiver}
                </div>
              </div>
            {/if}
            {#if cloning == S8_SIGN_ROYALTIES_TX}
              <div class="section">Sign the transaction</div>
            {:else if cloning == S9_WAIT_ROYALTIES_TX}
              <div class="section">Wait till completed, it may take one minute or more.</div>
              <div class="flex">
                <a class="link" href={explorerTxUrl(chainId, royaltiesTxHash)} target="_blank"
                  >{textShort(royaltiesTxHash)}</a
                >
              </div>
            {:else if cloning == S10_MINTED}
              <div class="titre">
                <i class="fas fa-check fa-left c-green" />
                default Nft Royalty info setted to :<br />
              </div>
              <div class="section">
                Fee : {inputFee} %<br />
                Receiver : {inputReceiver}
                <div class="flex">
                  <a class="link" href={explorerTxUrl(chainId, royaltiesTxHash)} target="_blank"
                    >{textShort(royaltiesTxHash)}</a
                  >
                </div>
              </div>
            {/if}
          </div>
        {/if} -->

        {#if cloneError}
          <div class="section">
            <div class="form-field kre-warning-msg">
              <p><i class="fas fa-exclamation-triangle fa-left c-red" />{cloneError}</p>
            </div>
          </div>
          <div class="txtright">
            <button class="btn btn-default btn-sell" type="submit" on:click={_resetError}
              ><i class="fas fa-chevron-left fa-left" />Back</button
            >
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
