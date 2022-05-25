<script lang="ts">
  import type { Readable } from "svelte/store";
  import type { NftType } from "lib/ktypes";
  import { explorerNftUrl, explorerTxUrl, textShort } from "lib/kconfig";
  import { metamaskSigner, metamaskAccount } from "main/metamask";
  import { nftMint3TxResponse, nftMint4 } from "lib/knft-mint";

  import NetworkList from "../Network/NetworkList.svelte";
  import { nftStore } from "stores/nft/nft";

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

  let nft: Readable<NftType>;
  $: chainId && address && tokenID && handleChange();
  const handleChange = (): void => {
    // STATE VIEW : sync get Nft
    nft = nftStore.getOneStore(chainId, address, tokenID);
  };

  // $: console.log("NftClaim", $nft);

  const claim = async () => {
    if ($metamaskSigner && $nft) {
      claimTxHash = null;
      claiming = true;
      claimed = false;
      let claimingError: string;

      if ($nft.tokenURI) {
        // switch to kovan
        const txResp = await nftMint3TxResponse(chainId, address, $nft.tokenURI, $metamaskSigner);
        // console.log("txResp", txResp);

        if (txResp) {
          const mintedNft = await nftMint4(chainId, address, txResp, $nft.tokenURI, $metamaskAccount);
          if (mintedNft) {
            claimed = true;
          } else {
            claimingError = "Problem with sent transaction";
          }
        } else {
          claimingError = "Problem while sending transaction";
        }
      } else {
        claimingError = `Problem whith tokenURI ${String($nft)}`;
      }
      claiming = false;
      claimingError && console.error(claimingError);
    }
  };
</script>

<div id="kredeum-claim-nft">
  <div class="modal-content">
    <a href="./#" title="Close" class="modal-close"><i class="fa fa-times" /></a>

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
            <i class="fas fa-exclamation" /> Claim this NFT #{tokenID} on another network ?
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
