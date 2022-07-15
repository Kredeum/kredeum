<script lang="ts">
  import type { NftType } from "lib/ktypes";
  import NftStorage from "lib/knft-storage";
  import { storageLinkToUrlHttp, explorerTxUrl, textShort, getChainName, getNetwork } from "lib/kconfig";
  import { metamaskChainId, metamaskAccount, metamaskSigner } from "main/metamask";
  import { metamaskSwitchChain } from "helpers/metamask";
  import type { Readable } from "svelte/store";
  import { nftStore } from "stores/nft/nft";
  import type { OpenBound as OpenBoundType } from "types/OpenBound";
  import openBoundAbi from "abis/OpenBound.json";
  import { Contract } from "ethers";

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

  let openBound: OpenBoundType;
  let openBoundAddress: string;

  let nftStorage: NftStorage;

  let nft: Readable<NftType>;

  $: chainId && address && tokenID && handleNftChange();
  const handleNftChange = (): void => {
    // STATE VIEW : sync get Nft
    nft = nftStore.getOneStore(chainId, address, tokenID);
  };

  $: console.log("NftClaim", $nft);

  const handleChainChange = async (): Promise<void> => {
    if ($metamaskChainId !== chainId) {
      alert(`Switch to ${getChainName(chainId)}`);
      await metamaskSwitchChain(chainId);
    }
  };

  const claim = async () => {
    if (!($metamaskChainId && chainId && $metamaskSigner && $nft)) return;

    await handleChainChange();

    claimTxHash = null;
    claiming = true;
    claimed = false;
    let claimingError: string;

    openBoundAddress = getNetwork(chainId).openBound;
    openBound = new Contract(openBoundAddress, openBoundAbi, $metamaskSigner) as unknown as OpenBoundType;
    if (!openBound) return;

    try {
      const owner = await openBound.ownerOf(tokenID);
      if (owner != $metamaskAccount) claimingError = "Not owner";
    } catch (error) {
      claimingError = "Problem with transaction\n" + String(error.message || "");
    }
    claiming = false;
    claimingError && console.error(claimingError);
  };
</script>

<div id="kredeum-claim-nft">
  {#if claimed}
    <div>
      <div class="titre">
        <i class="fas fa-check fa-left c-green" />
        NFT claimed!
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
    <div>
      <button class="btn btn-default btn-sell" type="submit" on:click={() => claim()}>Claim on Optimism</button>
    </div>
  {/if}
  {#if claimTxHash}
    <div class="flex">
      <a class="link" href={explorerTxUrl(chainId, claimTxHash)} target="_blank">{textShort(claimTxHash)}</a>
    </div>
  {/if}
</div>
