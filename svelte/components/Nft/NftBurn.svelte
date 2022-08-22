<script lang="ts">
  import { getContext } from "svelte";
  import { Writable } from "svelte/store";

  import { burnNftResponse, burnNftReceipt } from "lib/kburn";
  import { explorerNftUrl, explorerTxUrl, textShort } from "lib/kconfig";

  import { metamaskChainId, metamaskSigner, metamaskAccount } from "main/metamask";

  import { nftStore } from "stores/nft/nft";

  /////////////////////////////////////////////////
  //  <NftBurn {chainId} {address} {tokenID} />
  // Display NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;

  let burnTxHash: string = null;
  let burning = false;
  let burned = false;
  let burnImplossible = false;

  let toDisplayTokenID: Writable<string> = getContext("toDisplayTokenID");

  // Context for refreshCollectionList
  ///////////////////////////////////////////////////////////
  let refreshCollectionList: Writable<number> = getContext("refreshCollectionList");
  ///////////////////////////////////////////////////////////

  const burn = async () => {
    if ($metamaskSigner) {
      burnTxHash = null;
      burning = true;
      burned = false;

      const txResp = await burnNftResponse(chainId, address, tokenID, $metamaskSigner, $metamaskAccount).catch(
        console.error
      );

      if (txResp) {
        burnTxHash = txResp.hash;

        const txReceipt = await burnNftReceipt(txResp);

        burned = Boolean(txReceipt.status);
        burning = false;

        nftStore.nftRemoveOne(chainId, address, tokenID, $metamaskAccount);
        $refreshCollectionList += 1;
      } else {
        burnImplossible = true;
      }
    }
  };

  const returnNftsList = () => {
    if (burned) {
      $toDisplayTokenID = "";
    }
  };
</script>

<div id="kredeum-burn-nft">
  <div class="modal-content">
    <a href="./#" title="Close" on:click={returnNftsList} class="modal-close"><i class="fa fa-times" /></a>

    <div class="modal-body">
      <div>
        {#if burned}
          <div>
            <div class="titre">
              <i class="fas fa-check fa-left c-green" />
              NFT
              <a class="link" href="{explorerNftUrl(chainId, { chainId, address, tokenID })}}" target="_blank"
                >#{tokenID}</a
              >
              burned!
            </div>
          </div>
        {:else if burnImplossible}
          <div>
            <div class="titre">
              <i class="fas fa-exclamation-triangle fa-left c-red" />
              NFT can't be burned!
            </div>
          </div>
        {:else if burning}
          <div class="titre">
            <i class="fas fa-sync fa-left c-green" />burning NFT...
          </div>
          <div class="section">
            {#if burnTxHash}
              Wait till completed, it may take one minute or more.
            {:else}
              Sign the transaction
            {/if}
          </div>
        {:else}
          <div class="titre">
            <i class="fas fa-fire" /> Burn this NFT #{tokenID} Forever ?
          </div>

          <div class="section">
            <div class="form-field">
              <p>Be carefull, you're about to burn this NFT #{tokenID}</p>
              <p>this operation is irreversible !!!</p>
            </div>
          </div>

          <div class="txtright">
            <button class="btn btn-default btn-sell" type="submit" on:click={() => burn()}>Burn</button>
          </div>
        {/if}
        {#if burnTxHash}
          <div class="flex">
            <a class="link" href={explorerTxUrl($metamaskChainId, burnTxHash)} target="_blank"
              >{textShort(burnTxHash)}</a
            >
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .c-red {
    color: red;
  }
</style>
