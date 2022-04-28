<script lang="ts">
  import type { NftType } from "lib/ktypes";
  import { claimNftResponse, claimNftReceipt } from "lib/kclaim";
  import { explorerNftUrl, explorerTxUrl, textShort } from "lib/kconfig";
  import { metamaskSigner } from "main/metamask";

  import NetworkList from "../Network/NetworkList.svelte";

  /////////////////////////////////////////////////
  //  <Nft {chainId} {address} {tokenID} />
  // Display NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;

  let claimTxHash: string = null;
  let claiming = false;
  let claimed = false;

  const claim = async () => {
    if ($metamaskSigner) {
      claimTxHash = null;
      claiming = true;
      claimed = false;

      // switch to kovan

      const txResp = await claimNftResponse(chainId, address, tokenID, $metamaskSigner);
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
              NFT
              <a class="link" href="{explorerNftUrl(chainId, { chainId, address, tokenID })}}" target="_blank"
                >#{tokenID}</a
              >
              claimed!
            </div>
          </div>
        {:else if claiming}
          <div class="titre">
            <i class="fas fa-sync fa-left c-green" />Claiming NFT...
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
            <i class="fas fa-exclamation" /> Claim this NFT #{tokenID} to Kovan ?
          </div>

          <NetworkList />

          <div class="txtright">
            <button class="btn btn-default btn-sell" type="submit" on:click={() => claim()}>Claim</button>
          </div>
        {/if}
        {#if claimTxHash}
          <div class="flex">
            <a class="link" href={explorerTxUrl(chainId, claimTxHash)} target="_blank">{textShort(claimTxHash)}</a>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
