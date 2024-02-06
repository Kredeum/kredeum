<script lang="ts">
  import NftStorage from "@common/storage/nftstorage";
  import { getOpenBound, explorerTxLog, explorerNftUrl, explorerTxUrl, textShort } from "@common/common/config";
  import { nftMint, nftClaimed } from "@common/nft/nft-mint";
  import { cidToInt } from "@common/common/cid";

  import { nftStore } from "@svelte/stores/nft/nft";
  import { metamaskSigner, metamaskSignerAddress } from "@svelte/stores/metamask";

  import NetworkSelect from "../Network/NetworkSelect.svelte";
  import { storageLinkToUrlHttp } from "@common/storage/storage";

  /////////////////////////////////////////////////
  //  <NftClaim {chainId} {address} {tokenID} />
  // Display NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  $: nft = nftStore(chainId, address, tokenID);
  ///////////////////////////////////////////////////////////

  let targetChainId = chainId;
  let claimTxHash = "";
  let claiming = false;
  let claimed = false;

  let nftStorage: NftStorage;
  let claimingError = "";

  $: claimingError && console.error(claimingError);

  const claim = async () => {
    claimTxHash = "";
    claiming = true;
    claimed = false;
    claimingError = "";
    const targetAddress = getOpenBound(targetChainId);
    const tokenURI = $nft.tokenURI;

    if (!$metamaskSigner) {
      claimingError = "No signer";
      return;
    }
    if (!(chainId && address && tokenID)) {
      claimingError = "No NFT";
      return;
    }
    if (!tokenURI) {
      claimingError = "No metadata found on this NFT";
      return;
    }
    if (!targetAddress) {
      claimingError = `No target address on target network ${targetChainId}`;
      return;
    }

    console.log("CLAIM", chainId, address, tokenID, tokenURI, targetChainId, targetAddress);

    nftStorage ||= new NftStorage();
    const cid = await nftStorage.pinUrl(storageLinkToUrlHttp(tokenURI));

    if (!cid.startsWith("bafkrei")) {
      claimingError = `Not CID V1 raw ${cid}`;
      return;
    }

    console.log("cidToInt(cid)", cidToInt(cid));

    const txResp = await nftMint(targetChainId, targetAddress, cidToInt(cid), $metamaskSignerAddress);
    if (!txResp) {
      claimingError = `No Mint tx response`;
      return;
    }
    explorerTxLog(chainId, txResp);

    const mintedNft = await nftClaimed(targetChainId, targetAddress, txResp, tokenURI, $metamaskSignerAddress);
    if (!mintedNft) {
      claimingError = `No Claim tx response`;
      return;
    }
    console.info("mintedNft", mintedNft);

    claimed = true;
    claiming = false;
    claimingError && console.error(claimingError);
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
                rel="noreferrer">#{textShort(tokenID)}</a
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
            <i class="fas fa-hand-holding-usd" /> Claim this NFT #{textShort(tokenID, 4)} on another network ?
          </div>

          <NetworkSelect bind:chainId={targetChainId} label={true} />

          <div class="txtright">
            <button class="btn btn-default btn-sell" type="submit" on:click={claim}>Claim</button>
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
