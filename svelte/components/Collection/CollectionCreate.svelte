<script lang="ts">
  import type { CollectionType } from "@lib/common/ktypes";

  import { BigNumber, utils } from "ethers";

  import { getContext, onMount } from "svelte";
  import { Writable } from "svelte/store";

  import { explorerTxLog, explorerTxUrl, explorerAddressUrl, textShort, getCurrency } from "@lib/common/kconfig";
  import { getRoyaltyAmount } from "@lib/nft/kautomarket";
  import { collectionClone, collectionCloneAddress } from "@lib/collection/kcollection-clone";

  import { createEventDispatcher } from "svelte";
  import { metamaskAccount, metamaskSigner } from "@main/metamask";

  import CollectionTemplates from "./CollectionTemplates.svelte";
  import InputPrice from "../Global/InputPrice.svelte";
  import { parseEther } from "ethers/lib/utils";

  ///////////////////////////////////////////////////////////
  // <CollectionCreate chainId collection
  ///////////////////////////////////////////////////////////
  export let chainId: number;
  // export let account: string;
  export let collection: CollectionType = undefined;
  ///////////////////////////////////////////////////////////

  let template: string = undefined;
  let minRoyalty: boolean;

  let cloning: number;
  let cloneError: string;

  let collectionName = "";
  let collectionSymbol = "";

  let collectionCreated: CollectionType = null;

  let cloningTxHash: string = null;

  let price: BigNumber;
  let inputFee: string = "";
  let inputReceiver: string;

  // Context for refreshCollectionList
  ///////////////////////////////////////////////////////////
  let refreshCollectionList: Writable<number> = getContext("refreshCollectionList");
  ///////////////////////////////////////////////////////////

  const dispatch = createEventDispatcher();

  const _cloneError = (err: string): void => {
    cloneError = err;
    console.error(cloneError);
    cloning = 0;
  };

  // const _resetError = (): void => {
  //   _cloneInit();
  //   cloneError = null;
  // };

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

  const _cloneInit = async () => {
    cloningTxHash = null;
    collectionCreated = null;

    cloning = S1_CONFIRM;
  };

  const _cloneConfirm = async () => {
    cloning = S2_SIGN_CLONE_TX;
    const cloneTxRespYield = collectionClone(
      chainId,
      collectionName,
      collectionSymbol,
      template,
      $metamaskSigner,
      price,
      inputReceiver || $metamaskAccount,
      Math.round((Number(inputFee) || 0) * 100),
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

    $refreshCollectionList += 1;
  };

  const resetCollMint = () => {
    if (collectionCreated) {
      cloningTxHash = null;
      collectionCreated = null;
      collectionName = "";
      collectionSymbol = "";
      price = BigNumber.from(0);
      inputFee = "";
      inputReceiver = "";
      cloneError = null;
      cloning = S1_CONFIRM;
    }
  };

  const templateName = (template: string) => template?.split("/")[0];
  const templateConf = (template: string) => template?.split("/")[1];

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
          <CollectionTemplates bind:template bind:minRoyalty />

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
                  placeholder={$metamaskAccount}
                  bind:value={inputReceiver}
                  id="royalties-reveiver-nft"
                />
              </div>
            </div>
          {/if}

          {#if templateName(template) === "OpenAutoMarket" && (templateConf(template) === "generic" || minRoyalty)}
            <div class="section">
              <div class="titre">Mint price ({getCurrency(chainId)})</div>
              <InputPrice {chainId} bind:price />
            </div>
            {#if minRoyalty}
              <div class="section">
                <div class="titre">Minimum Royalty ({getCurrency(chainId)})</div>
                {utils.formatEther(getRoyaltyAmount(Number(inputFee) * 100, price))}
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
