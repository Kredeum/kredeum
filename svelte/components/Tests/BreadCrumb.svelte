<script lang="ts">
  import { urlHash, breadcrumb } from "helpers/refNft";
  import { metamaskChainId, metamaskAccount } from "main/metamask";
  import { currentCollection, currentTokenID, currentAction } from "main/current";

  export let display = false;

  $: refNFT = {
    chainId: $metamaskChainId,
    account: $metamaskAccount,
    tokenID: $currentTokenID,
    collection: $currentCollection,
    action: $currentAction
  };

  // refresh hash
  $: window.location.hash = urlHash(refNFT);
</script>

{#if display}
  <p><small>{breadcrumb(refNFT)}</small></p>
{/if}
