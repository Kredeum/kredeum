<script lang="ts">

  import { refPageFromUrlHash, refPage2UrlHash, refPage2Breadcrumb, RefPageType } from "@helpers/refPage";

  import { metamaskChainId, metamaskSignerAddress } from "@main/metamask";
  import { /*currentCollection, currentTokenID,*/ currentAction } from "@main/current";

  export let display = false;

  let refBreadcrumb: RefPageType;

  // INITIAL urlHash values
  const { /*address, tokenID,*/ action } = refPageFromUrlHash(window.location.hash);
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
  $: window.location.hash = refPage2UrlHash(refBreadcrumb);
</script>

{#if display}
  <p>{refPage2Breadcrumb(refBreadcrumb)}</p>
{/if}
