<script lang="ts">
  import type { Readable } from "svelte/store";

  import type { RefNFT } from "helpers/refNft";
  import { urlHash, breadcrumb } from "helpers/refNft";
  import { metamaskChainId, metamaskAccount } from "main/metamask";
  import { currentTokenID, currentAction } from "main/current";
  import { collectionStore } from "stores/collection/collection";

  export let display = false;

  let refNFT: RefNFT;

  // STATE VIEW : default Collection for chainId and account
  $: address = collectionStore.getDefaultSubStore($metamaskChainId, false, $metamaskAccount);

  // Refresh NFT ref
  $: refNFT = {
    chainId: $metamaskChainId,
    address: $address,
    tokenID: $currentTokenID,
    account: $metamaskAccount,
    action: $currentAction
  };

  // Refresh browser url hash
  $: window.location.hash = urlHash(refNFT);
</script>

{#if display}
  {JSON.stringify(refNFT)}
  <p>{breadcrumb(refNFT)}</p>
{/if}
