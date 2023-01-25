<script lang="ts">
  import type { RefBreadcrumb } from "@helpers/breadcrumb";
  import { urlHash2RefNFT, ref2UrlHash, ref2Breadcrumb } from "@helpers/breadcrumb";

  import { metamaskChainId, metamaskSignerAddress } from "@main/metamask";
  import { /*currentCollection, currentTokenID,*/ currentAction } from "@main/current";

  export let display = false;

  let refBreadcrumb: RefBreadcrumb;

  // INITIAL urlHash values
  const { /*address, tokenID,*/ action } = urlHash2RefNFT(window.location.hash);
  // console.log("INITIAL urlHash values", address, tokenID, action);
  // $currentCollection = address;
  // $currentTokenID = tokenID;
  $currentAction = action;

  // Refresh ref breadcrumb
  $: refBreadcrumb = {
    chainId: $metamaskChainId,
    // address: $currentCollection,
    // tokenID: $currentTokenID,
    account: $metamaskSignerAddress,
    action: $currentAction
  };

  // Refresh browser url hash
  $: window.location.hash = ref2UrlHash(refBreadcrumb);
</script>

{#if display}
  <p>{ref2Breadcrumb(refBreadcrumb)}</p>
{/if}
