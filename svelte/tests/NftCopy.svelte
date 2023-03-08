<script lang="ts">
  import type { Readable } from "svelte/store";
  import type { NftType } from "@lib/common/types";
  import { explorerTxLog, explorerNftUrl, explorerTxUrl, textShort } from "@lib/common/config";
  import { metamaskSigner, metamaskSignerAddress } from "@main/metamask";
  import { nftMint, nftMint4 } from "@lib/nft/nft-mint";

  import Networks from "../components/Network/NetworkSelect.svelte";
  import { nftStore } from "@stores/nft/nft";

  /////////////////////////////////////////////////
  //  <Nft {chainId} {address} {tokenID} />
  // Display NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;

  let copyTxHash: string = null;
  let copying = false;
  let copied = false;

  let nft: Readable<NftType>;
  $: chainId && address && tokenID && handleChange();
  const handleChange = (): void => {
    // STATE VIEW : sync get Nft
    nft = nftStore.getOne(chainId, address, tokenID);
  };

  // $: console.log("NftClaim", $nft);

  const copy = async () => {
    if ($metamaskSigner && $nft) {
      copyTxHash = null;
      copying = true;
      copied = false;
      let copyingError: string;

      if ($nft.tokenURI) {
        const txResp = await nftMint(chainId, address, $nft.tokenURI, $metamaskSigner);
        explorerTxLog(chainId, txResp);

        if (txResp) {
          const mintedNft = await nftMint4(chainId, address, txResp, $nft.tokenURI, $metamaskSignerAddress);
          if (mintedNft) {
            copied = true;
          } else {
            copyingError = "Problem with sent transaction";
          }
        } else {
          copyingError = "Problem while sending transaction";
        }
      } else {
        copyingError = `Problem whith tokenURI ${String($nft)}`;
      }
      copying = false;
      copyingError && console.error(copyingError);
    }
  };
</script>

<div id="kredeum-copy-nft">
  <div class="modal-content">
    <a href="./#" title="Close" class="modal-close"><i class="fa fa-times" /></a>

    <div class="modal-body">
      <div>
        {#if copied}
          <div>
            <div class="titre">
              <i class="fas fa-check fa-left c-green" />
              NFT
              <a
                class="link"
                href="{explorerNftUrl(chainId, { chainId, address, tokenID })}}"
                target="_blank"
                rel="noreferrer">#{tokenID}</a
              >
              copied!
            </div>
          </div>
        {:else if copying}
          <div class="titre">
            <i class="fas fa-sync fa-left c-green" />Claiming NFT...
          </div>
          <div class="section">
            {#if copyTxHash}
              Wait till completed, it may take one minute or more.
            {:else}
              Sign the transaction
            {/if}
          </div>
        {:else}
          <div class="titre">
            <i class="fas fa-exclamation" /> Claim this NFT #{tokenID} on another network ?
          </div>

          <Networks bind:chainId />

          <div class="txtright">
            <button class="btn btn-default btn-sell" type="submit" on:click={() => copy()}>Claim</button>
          </div>
        {/if}
        {#if copyTxHash}
          <div class="flex">
            <a class="link" href={explorerTxUrl(chainId, copyTxHash)} target="_blank" rel="noreferrer"
              >{textShort(copyTxHash)}</a
            >
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
