<script lang="ts">
  import { getContext } from "svelte";
  import { Writable } from "svelte/store";

  import { burnNft, burnNftAddressDead } from "@lib/nft/kburn";
  import { explorerNftUrl, explorerTxUrl, explorerTxLog, textShort } from "@lib/common/kconfig";

  import { metamaskChainId, metamaskSigner, metamaskAccount } from "@main/metamask";

  import { nftStore } from "@stores/nft/nft";

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
  let burnImplossibleAddressDead = false;

  // Context for refreshCollectionList
  ///////////////////////////////////////////////////////////
  let refreshCollectionList: Writable<number> = getContext("refreshCollectionList");
  let refreshNftsList: Writable<number> = getContext("refreshNftsList");
  ///////////////////////////////////////////////////////////

  const burn = async (dEaDBurn = false) => {
    if ($metamaskSigner) {
      burnTxHash = null;
      burnImplossible = false;
      burning = true;
      burned = false;

      const txRespYield = dEaDBurn
        ? await burnNftAddressDead(chainId, address, tokenID, $metamaskSigner)
        : await burnNft(chainId, address, tokenID, $metamaskSigner);

      const txResp = (await txRespYield.next()).value;
      console.log("🚀 ~ file: NftBurn.svelte ~ line 42 ~ burn ~ txResp", txResp);

      if (txResp.hash) {
        burnTxHash = txResp.hash;
        const txReceipt = (await txRespYield.next()).value;

        burned = Boolean(txReceipt.status);
        burning = false;

        // nftStore.nftRemoveOne(chainId, address, tokenID);
        $refreshCollectionList += 1;
        $refreshNftsList += 1;
      } else {
        dEaDBurn ? (burnImplossibleAddressDead = true) : (burnImplossible = true);
      }
    }
  };

  const returnNftsList = () => {
    if (burned) {
    }
  };
</script>

<div id="kredeum-burn-nft">
  <div class="modal-content">
    <a href="./#" title="Close" on:click={returnNftsList} class="modal-close"><i class="fa fa-times" /></a>

    <div class="modal-body">
      <div class="titre">
        <i class="fas fa-fire" /> Burn this NFT #{tokenID} Forever ?
      </div>
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
          <div class="section">
            <div class="form-field kre-burn-warning">
              <p>
                <i class="fas fa-exclamation-triangle fa-left c-red" /> NFT can't be burned with normalized burn function!
              </p>
              <p>Do you want to burn it afterall buy transfer it at "address dEaD"</p>
            </div>
          </div>
          <div class="txtright">
            <button class="btn btn-default btn-sell" type="submit" on:click={() => burn(true)}
              >Yes, burn to address dEaD</button
            >
          </div>
        {:else if burnImplossibleAddressDead}
          <div class="section">
            <div class="form-field kre-burn-warning">
              <p>
                <i class="fas fa-exclamation-triangle fa-left c-red" /> NFT can't be burned !
              </p>
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
          <div class="section">
            <div class="form-field kre-burn-warning">
              <p>
                <i class="fas fa-exclamation-triangle fa-left c-red" /> Be carefull, you're about to burn this NFT #{tokenID}
              </p>
              <p>this operation is irreversible !!!</p>
            </div>
          </div>

          <div class="txtright">
            <button class="btn btn-default btn-sell" type="submit" on:click={() => burn()}>Yes, I want to burn</button>
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
  .kre-burn-warning {
    background-color: rgba(255, 0, 0, 0.07);
    border-radius: 6px;
    padding: 15px 30px;
  }
</style>
