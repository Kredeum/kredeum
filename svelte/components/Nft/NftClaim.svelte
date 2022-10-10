<script lang="ts">
  import type { Readable, Writable } from "svelte/store";
  import type { NftType } from "@lib/common/ktypes";
  import NftStorage from "@lib/nft/storage/knft-storage";
  import {
    getOpenMulti,
    explorerTxLog,
    explorerNftUrl,
    explorerTxUrl,
    textShort,
    storageLinkToUrlHttp,
    METAMASK_ACTION_REJECTED
  } from "@lib/common/kconfig";
  import { nftClaim3TxResponse, nftClaim4 } from "@lib/nft/knft-mint";
  import { cidToInt } from "@lib/common/kcid";

  import { getContext } from "svelte";
  import { nftStore } from "@stores/nft/nft";
  import { metamaskSigner, metamaskAccount } from "@main/metamask";

  import NetworkList from "../Network/NetworkList.svelte";

  /////////////////////////////////////////////////
  //  <NftClaim {chainId} {address} {tokenID} />
  // Display NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;

  let targetChainId = chainId;
  let claimTxHash: string = null;
  let claiming = false;
  let claimed = false;

  let nftStorage: NftStorage;

  let nft: Readable<NftType>;
  $: chainId && address && tokenID && handleChange();
  const handleChange = (): void => {
    // STATE VIEW : sync get Nft
    nft = nftStore.getOneStore(chainId, address, tokenID);
  };

  $: console.info("NftClaim", $nft);

  // Context for catchError component
  let catchError: Writable<string> = getContext("catchError");
  ///////////////////////////////////////////////////////////

  const _claimingError = (err: string): void => {
    $catchError;
    console.error(err);
    claimTxHash = null;
    claiming = false;
    claimed = false;
  };

  const claim = async () => {
    if ($metamaskSigner && $nft) {
      claimTxHash = null;
      claiming = true;
      claimed = false;

      const targetAddress = getOpenMulti(targetChainId);
      // console.log("claim", targetChainId, targetAddress);

      try {
        if (!$nft.tokenURI) _claimingError("No metadata found on this NFT");
        else {
          // console.log("claim", $nft.tokenURI);

          nftStorage ||= new NftStorage();
          const cid = await nftStorage.pinUrl(storageLinkToUrlHttp($nft.tokenURI));

          if (!cid.startsWith("bafkrei")) _claimingError(`Not CID V1 raw ${cid}`);
          else {
            // console.log("cidToInt(cid)", cidToInt(cid));
            const txResp = await nftClaim3TxResponse(targetChainId, targetAddress, cidToInt(cid), $metamaskSigner);
            explorerTxLog(chainId, txResp);

            const mintedNft = await nftClaim4(targetChainId, targetAddress, txResp, $nft.tokenURI, $metamaskAccount);
            console.log("mintedNft", mintedNft);

            claimed = true;
          }
        }
      } catch (e) {
        if (e.code !== METAMASK_ACTION_REJECTED) {
          _claimingError(e.error.message || "");
        }
      }
      claiming = false;
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
          <div class="titre overflow-ellipsis">
            <i class="fas fa-exclamation" /> Claim this NFT on another network ? #{tokenID}
          </div>

          <NetworkList bind:chainId={targetChainId} />

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
