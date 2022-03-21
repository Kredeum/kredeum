<script lang="ts">
  import { refs } from "helpers/refs";
  import { metamaskChainId, metamaskAccount } from "main/metamask";
  import { currentCollection, currentAction } from "main/current";

  export let display: boolean = false;

  $: refNFT = {
    chainId: $metamaskChainId,
    account: $metamaskAccount,
    collection: $currentCollection,
    action: $currentAction
  };

  // refresh hash
  $: window.location.hash = refs(refNFT).hash;
</script>

{#if display}
  <p><small>{refs(refNFT).breadcrumb} </small></p>
{/if}
