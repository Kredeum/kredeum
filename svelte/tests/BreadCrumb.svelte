<script lang="ts">
  import type { RefNFT } from "@helpers/refNft";

  import { refNFT2UrlHash, refNFT2Breadcrumb } from "@helpers/refNft";
  import { urlHash2RefNFT } from "@helpers/urlHash";

  import { metamaskChainId, metamaskAccount } from "@main/metamask";
  import { /*currentCollection, currentTokenID,*/ currentAction } from "@main/current";

  export let display = false;

  let refNFT: RefNFT;

  // INITIAL urlHash values
  const { /*address, tokenID,*/ action } = urlHash2RefNFT(window.location.hash);
  // console.log("INITIAL urlHash values", address, tokenID, action);
  // $currentCollection = address;
  // $currentTokenID = tokenID;
  $currentAction = action;

  // Refresh NFT ref
  $: refNFT = {
    chainId: $metamaskChainId,
    // address: $currentCollection,
    // tokenID: $currentTokenID,
    account: $metamaskAccount,
    action: $currentAction
  };

  // Refresh browser url hash
  $: window.location.hash = refNFT2UrlHash(refNFT);
</script>

{#if display}
  <p>{refNFT2Breadcrumb(refNFT)}</p>
{/if}
