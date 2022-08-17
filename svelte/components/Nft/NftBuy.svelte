<script lang="ts">
  import { transferNftResponse, transferNftReceipt } from "lib/ktransfer";
  import { explorerNftUrl, explorerTxUrl, textShort } from "lib/kconfig";

  import { metamaskChainId, metamaskSigner } from "main/metamask";

  /////////////////////////////////////////////////
  //  <NftTransfer {chainId} {address} {tokenID} />
  // Display NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let nftPrice: string;

  let buyTxHash: string = null;
  let buying = false;
  let buyed = false;

  let destinationAddress = "";

  const buy = async () => {
    if ($metamaskSigner) {
      buyTxHash = null;
      buying = true;
      buyed = false;

      const txResp = await transferNftResponse(chainId, address, tokenID, destinationAddress, $metamaskSigner);
      buyTxHash = txResp.hash;

      const txReceipt = await transferNftReceipt(txResp);

      buyed = Boolean(txReceipt.status);
      buying = false;
    }
  };
</script>

<div id="kredeum-transfer-nft">
  <div class="modal-content">
    <a href="./#" title="Close" class="modal-close"><i class="fa fa-times" /></a>

    <div class="modal-body">
      <div>
        {#if buyed}
          <div>
            <div class="titre">
              <i class="fas fa-check fa-left c-green" />
              NFT
              <a class="link" href="{explorerNftUrl(chainId, { chainId, address, tokenID })}}" target="_blank"
                >#{tokenID}</a
              >
              buyed!
            </div>
          </div>
        {:else if buying}
          <div class="titre">
            <i class="fas fa-sync fa-left c-green" />buying NFT...
          </div>
          <div class="section">
            {#if buyTxHash}
              Wait till completed, it may take one minute or more.
            {:else}
              Sign the transaction
            {/if}
          </div>
        {:else}
          <div class="titre">
            <i class="fas fa-shopping-cart" /> Buy this NFT #{tokenID} at {nftPrice} Eth ?
          </div>

          <div class="txtright">
            <button class="btn btn-default btn-sell" type="submit" on:click={() => buy()}>Buy</button>
          </div>
        {/if}
        {#if buyTxHash}
          <div class="flex">
            <a class="link" href={explorerTxUrl($metamaskChainId, buyTxHash)} target="_blank">{textShort(buyTxHash)}</a>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
