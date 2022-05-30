<script lang="ts">
  import type { NftType } from "lib/ktypes";
  import NftStorage from "lib/knft-storage";
  import { getOpenMulti, explorerNftUrl, explorerTxUrl, textShort, ipfsToUrlHttp } from "lib/kconfig";
  import { nftMint3TxResponse, nftMint4 } from "lib/knft-mint";
  import { cidToInt } from "lib/kcid";

  import type { Readable } from "svelte/store";
  import { nftStore } from "stores/nft/nft";
  import { metamaskSigner, metamaskAccount } from "main/metamask";

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

  $: console.log("NftClaim", $nft);

  const claim = async () => {
    if ($metamaskSigner && $nft) {
      claimTxHash = null;
      claiming = true;
      claimed = false;
      let claimingError: string;

      const targetAddress = getOpenMulti(targetChainId);
      console.log("claim", targetChainId, targetAddress);

      try {
        if (!$nft.tokenURI) claimingError = "No metadata found on this NFT";
        else {
          console.log("claim", $nft.tokenURI);

          nftStorage ||= new NftStorage();
          const cid = await nftStorage.pinUrl(ipfsToUrlHttp($nft.tokenURI));

          if (!cid.startsWith("bafkrei")) claimingError = `Not CID V1 raw ${cid}`;
          else {
            console.log("cidToInt(cid)", cidToInt(cid));
            const txResp = await nftMint3TxResponse(targetChainId, targetAddress, cidToInt(cid), $metamaskSigner);
            console.log("txResp", txResp);

            const mintedNft = await nftMint4(targetChainId, targetAddress, txResp, $nft.tokenURI, $metamaskAccount);
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

          <NetworkList bind:chainId={targetChainId} />

          <div class="txtright">
            <button class="btn btn-default btn-sell" type="submit" on:click={() => claim()}>Claim</button>
          </div>

          <div>
            {chainId} :
            {targetChainId}
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
