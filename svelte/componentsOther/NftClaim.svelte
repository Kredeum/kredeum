<script lang="ts">
  import type { Nft } from "lib/ktypes";
  import { claimNftResponse, claimNftReceipt } from "lib/kclaim";
  import { explorerNftUrl, explorerTxUrl, textShort } from "lib/kconfig";

  import NetworkSelect from "../components/NetworkSelect.svelte";

  export let nft: Nft = undefined;

  let claimTxHash: string = null;
  let claiming = false;
  let claimed = false;

  let destinationAddress = "";

  const claim = async () => {
    if ($signer) {
      claimTxHash = null;
      claiming = true;
      claimed = false;

      // switch to kovan

      const txResp = await claimNftResponse(nft.chainId, nft.collection, nft.tokenID, destinationAddress, $signer);
      claimTxHash = txResp.hash;

      const txReceipt = await claimNftReceipt(txResp);

      claimed = Boolean(txReceipt.status);
      claiming = false;
    }
  };
</script>

<div id="kredeum-claim-nft">
  <div class="modal-content">
    <a href="." title="Close" class="modal-close"><i class="fa fa-times" /></a>

    <div class="modal-body">
      <div>
        {#if claimed}
          <div>
            <div class="titre">
              <i class="fas fa-check fa-left c-green" />
              NFT <a class="link" href="{explorerNftUrl($chainId, nft)}}" target="_blank">#{nft?.tokenID}</a>
              claimed!
            </div>
          </div>
        {:else if claiming}
          <div class="titre">
            <i class="fas fa-sync fa-left c-green" />Transfering NFT...
          </div>
          <div class="section">
            {#if claimTxHash}
              Wait till completed, it may take one minute or more.
            {:else}
              Sign the transaction
            {/if}
          </div>
        {:else}
          <div class="titre">
            <i class="fas fa-exclamation" /> Claim this NFT #{nft.tokenID} to Kovan ?
          </div>

          <NetworkSelect />

          <div class="txtright">
            <button class="btn btn-default btn-sell" type="submit" on:click={() => claim()}>Claim</button>
          </div>
        {/if}
        {#if claimTxHash}
          <div class="flex">
            <a class="link" href={explorerTxUrl($chainId, claimTxHash)} target="_blank">{textShort(claimTxHash)}</a>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
