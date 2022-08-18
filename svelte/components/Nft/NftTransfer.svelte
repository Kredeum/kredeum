<script lang="ts">
  import { transferNftResponse, transferNftReceipt } from "@lib/ktransfer";
  import { explorerNftUrl, explorerTxUrl, textShort } from "@lib/kconfig";

  import { metamaskChainId, metamaskSigner } from "@main/metamask";

  /////////////////////////////////////////////////
  //  <NftTransfer {chainId} {address} {tokenID} />
  // Display NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;

  let transferTxHash: string = null;
  let transfering = false;
  let transfered = false;

  let destinationAddress = "";

  const transfer = async () => {
    if ($metamaskSigner) {
      transferTxHash = null;
      transfering = true;
      transfered = false;

      const txResp = await transferNftResponse(chainId, address, tokenID, destinationAddress, $metamaskSigner);
      transferTxHash = txResp.hash;

      const txReceipt = await transferNftReceipt(txResp);

      transfered = Boolean(txReceipt.status);
      transfering = false;
    }
  };
</script>

<div id="kredeum-transfer-nft">
  <div class="modal-content">
    <a href="./#" title="Close" class="modal-close"><i class="fa fa-times" /></a>

    <div class="modal-body">
      <div>
        {#if transfered}
          <div>
            <div class="titre">
              <i class="fas fa-check fa-left c-green" />
              NFT
              <a class="link" href="{explorerNftUrl(chainId, { chainId, address, tokenID })}}" target="_blank"
                >#{tokenID}</a
              >
              transfered!
            </div>
          </div>
        {:else if transfering}
          <div class="titre">
            <i class="fas fa-sync fa-left c-green" />Transfering NFT...
          </div>
          <div class="section">
            {#if transferTxHash}
              Wait till completed, it may take one minute or more.
            {:else}
              Sign the transaction
            {/if}
          </div>
        {:else}
          <div class="titre">
            <i class="fas fa-gift" /> Transfer this NFT #{tokenID} to what address ?
          </div>

          <div class="section">
            <div class="form-field">
              <input type="text" placeholder="destinator address" bind:value={destinationAddress} />
            </div>
          </div>

          <div class="txtright">
            <button class="btn btn-default btn-sell" type="submit" on:click={() => transfer()}>Transfer</button>
          </div>
        {/if}
        {#if transferTxHash}
          <div class="flex">
            <a class="link" href={explorerTxUrl($metamaskChainId, transferTxHash)} target="_blank"
              >{textShort(transferTxHash)}</a
            >
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
