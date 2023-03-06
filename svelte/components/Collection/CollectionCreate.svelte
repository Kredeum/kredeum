<script lang="ts">
  import type { Writable } from "svelte/store";
  import { constants, utils } from "ethers";
  import { getContext, onMount, createEventDispatcher } from "svelte";

  import type { CollectionType } from "@lib/common/types";
  import {
    explorerTxLog,
    explorerTxUrl,
    explorerAddressUrl,
    textShort,
    getCurrency,
    isNumeric,
    isAddress,
    MAX_FEE
  } from "@lib/common/config";
  import { collectionClone, collectionCloneAddress } from "@lib/collection/collection-clone";
  import { getReceiverAmount } from "@lib/nft/nft-automarket-get";

  import { metamaskSignerAddress, metamaskSigner } from "@main/metamask";

  import CollectionTemplates from "./CollectionTemplates.svelte";
  import InputPrice from "../Input/InputPrice.svelte";
  import InputEthAddress from "../Input/InputEthAddress.svelte";

  ///////////////////////////////////////////////////////////
  // <CollectionCreate {chainId} {collection} />
  ///////////////////////////////////////////////////////////
  export let chainId: number;
  export let collection: CollectionType = undefined;
  // export let account: string;
  ///////////////////////////////////////////////////////////

  let template: string = undefined;
  let minRoyalty: boolean = true;

  let cloning: number;
  let cloneError: string;

  let collectionName = "";
  let collectionSymbol = "";

  let collectionCreated: CollectionType = null;

  let cloningTxHash: string = null;

  let inputMintPrice = constants.Zero;

  let inputFee = "0";
  let inputFeeNumber = 0;
  $: inputFee && handleInputFee();
  const handleInputFee = () => {
    // fee ~ 333.22 is from 0 to 10_000 base points (= 0.01%)
    let tmpFee = "X" + inputFee.replace(/[^0-9.,]/g, "").replace(/[,]/g, ".") + "X";

    do tmpFee = tmpFee.slice(0, -1);
    while (tmpFee.split(".")[1]?.length > 2);

    do tmpFee = tmpFee.slice(1);
    while (tmpFee.split(".")[0]?.length > 2);

    inputFee = tmpFee;
    if (isNumeric(inputFee)) inputFeeNumber = Math.min(Math.round(Number(tmpFee) * 100), MAX_FEE);
  };

  // inputPrice = isNumeric(tmpPrice) ? tmpPrice : "0.0";
  // price = utils.parseEther(inputPrice);

  let inputReceiver = "";

  const invalidInputParams = (): boolean => !(isAddress(inputReceiver) && isNumeric(inputFee));

  // Context for refreshCollections
  ///////////////////////////////////////////////////////////
  let refreshCollections: Writable<number> = getContext("refreshCollections");
  ///////////////////////////////////////////////////////////

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
  // Collection Created
  //    |
  //  CLICK Close
  //    |
  //  STATE 0 popup closed

  // STATES : S1 - S4
  const S1_CONFIRM = 1;
  const S2_SIGN_CLONE_TX = 2;
  const S3_WAIT_CLONE_TX = 3;
  const S4_COLL_CREATED = 4;

  $: minimumRoyalty = utils.formatEther(getReceiverAmount(inputMintPrice, inputFeeNumber));

  const _cloneInit = async () => {
    cloningTxHash = null;
    collectionCreated = null;

    collectionName = "";
    collectionSymbol = "";
    inputMintPrice = constants.Zero;
    inputFee = "0";
    inputReceiver = $metamaskSignerAddress || constants.AddressZero;
    cloneError = null;

    cloning = S1_CONFIRM;
  };

  const _cloneConfirm = async () => {
    if (invalidInputParams()) return _cloneError("ERROR invalid parameters");

    cloning = S2_SIGN_CLONE_TX;

    const cloneTxRespYield = collectionClone(
      chainId,
      collectionName,
      collectionSymbol,
      template,
      inputMintPrice,
      inputReceiver,
      inputFeeNumber,
      minRoyalty
    );
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

    $refreshCollections += 1;
  };

  const templateName = (template: string) => template?.split("/")[0];
  const templateConf = (template: string) => template?.split("/")[1];

  onMount(() => {
    _cloneInit();
  });
</script>

<div id="kredeum-create-collection">
  <div class="modal-content">
    <a href="./#" on:click={_cloneInit} title="Close" class="modal-close"><i class="fa fa-times" /></a>

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

          {#if templateName(template) === "OpenAutoMarket"}
            <div class="section">
              <div class="titre">Royalty Fee (%)</div>
              <div class="form-field kre-field-percent">
                <input
                  type="text"
                  class=" kre-field-outline"
                  placeholder="00.00"
                  bind:value={inputFee}
                  id="royalty-amount-nft"
                />
              </div>
            </div>
            <div class="section">
              <div class="titre">Royalty Receiver</div>
              <div class="form-field">
                <InputEthAddress bind:ethAddress={inputReceiver} />
              </div>
            </div>
          {/if}

          {#if templateName(template) === "OpenAutoMarket" && (templateConf(template) === "generic" || minRoyalty)}
            <div class="section">
              <div class="titre">Recommended Price</div>
              <InputPrice {chainId} bind:price={inputMintPrice} />
            </div>

            {#if minRoyalty}
              <div class="section">
                <div class="titre">Minimum Royalty</div>
                {minimumRoyalty}
                {getCurrency(chainId)}
              </div>
            {/if}
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
            <a class="link" href={explorerTxUrl(chainId, cloningTxHash)} target="_blank" rel="noreferrer"
              >{textShort(cloningTxHash)}</a
            >
          </div>
        {/if}

        {#if cloning > S3_WAIT_CLONE_TX}
          <div>
            <div class="titre">
              <i class="fas fa-check fa-left c-green" />
              Collection '<a
                class="link"
                href={explorerAddressUrl(chainId, collectionCreated.address)}
                target="_blank"
                rel="noreferrer">{collectionCreated?.name}</a
              >' created!
            </div>
            <div class="section">
              <div class="flex">
                <a class="link" href={explorerTxUrl(chainId, cloningTxHash)} target="_blank" rel="noreferrer"
                  >{textShort(cloningTxHash)}</a
                >
              </div>
            </div>
          </div>
        {/if}

        {#if cloneError}
          <div class="section">
            <div class="form-field kre-warning-msg">
              <p><i class="fas fa-exclamation-triangle fa-left c-red" />{cloneError}</p>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .kre-field-percent {
    position: relative;
  }
  .kre-field-percent::before {
    content: "%";
    color: #1e1e43;
    position: absolute;
    right: 25px;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
