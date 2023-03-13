<script lang="ts">
  import NftStorage from "@lib/nft/storage/nft-storage";
  import {
    getOpenMulti,
    explorerTxLog,
    explorerNftUrl,
    explorerTxUrl,
    textShort,
    storageLinkToUrlHttp
  } from "@lib/common/config";
  import { nftMint, nftClaim4 } from "@lib/nft/nft-mint";
  import { cidToInt } from "@lib/common/cid";

  import { nftStore } from "@stores/nft/nft";
  import { metamaskSigner, metamaskSignerAddress } from "@main/metamask";

  import NetworkSelect from "../Network/NetworkSelect.svelte";

  /////////////////////////////////////////////////
  //  <NftClaim {chainId} {address} {tokenID} />
  // Display NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  $: nft = nftStore.getOne(chainId, address, tokenID);
  ///////////////////////////////////////////////////////////

  let targetChainId = chainId;
  let claimTxHash: string = null;
  let claiming = false;
  let claimed = false;

  let nftStorage: NftStorage;

  $: console.info("NftClaim", $nft);

  const claim = async () => {
    if ($metamaskSigner && $nft) {
      claimTxHash = null;
      claiming = true;
      claimed = false;
      let claimingError: string;

      const targetAddress = getOpenMulti(targetChainId);
      // console.log("claim", targetChainId, targetAddress);

      try {
        if (!$nft.tokenURI) claimingError = "No metadata found on this NFT";
        else {
          // console.log("claim", $nft.tokenURI);

          nftStorage ||= new NftStorage();
          const cid = await nftStorage.pinUrl(storageLinkToUrlHttp($nft.tokenURI));

          if (!cid.startsWith("bafkrei")) claimingError = `Not CID V1 raw ${cid}`;
          else {
            // console.log("cidToInt(cid)", cidToInt(cid));
            const txResp = await nftMint(targetChainId, targetAddress, cidToInt(cid), $metamaskSigner);
            explorerTxLog(chainId, txResp);

            const mintedNft = await nftClaim4(
              targetChainId,
              targetAddress,
              txResp,
              $nft.tokenURI,
              $metamaskSignerAddress
            );
            console.log("mintedNft", mintedNft);

            claimed = true;
          }
        }
      } catch (error) {
        claimingError = "Problem with transaction\n" + String(error.message || "");
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
              <a
                class="link"
                href="{explorerNftUrl(chainId, { chainId, address, tokenID })}}"
                target="_blank"
                rel="noreferrer">#{tokenID}</a
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
          <div class="titre overflow-ellipsis">
            <i class="fas fa-exclamation" /> Claim this NFT on another network ? #{tokenID}
          </div>

          <NetworkSelect bind:chainId={targetChainId} />

          <div class="txtright">
            <button class="btn btn-default btn-sell" type="submit" on:click={() => claim()}>Claim</button>
          </div>
        {/if}
        {#if claimTxHash}
          <div class="flex">
            <a class="link" href={explorerTxUrl(chainId, claimTxHash)} target="_blank" rel="noreferrer"
              >{textShort(claimTxHash)}</a
            >
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>
