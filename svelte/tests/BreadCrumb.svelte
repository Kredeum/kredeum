<script lang="ts">
  import { urlHash, breadcrumb } from "helpers/refNft";
  import { metamaskChainId, metamaskAccount } from "main/metamask";
  import { currentTokenID, currentAction } from "main/current";
  import { collectionDefault, collectionDefaultGet } from "stores/collectionDefault";

  export let display = false;

  let collection: string;
  $: {
    console.log("$collectionDefault", $collectionDefault);
  }
  $: {
    const key = `${$metamaskChainId}@${$metamaskAccount}`;
    collection = $collectionDefault?.get(key);
    console.log("BreadCrumb collection", collection, key, $collectionDefault);
    refNFT = refNFT;
  }

  $: refNFT = {
    chainId: $metamaskChainId,
    account: $metamaskAccount,
    tokenID: $currentTokenID,
    collection: collection,
    action: $currentAction
  };

  // refresh hash
  $: window.location.hash = urlHash(refNFT);
</script>

{#if display}
  <p>{breadcrumb(refNFT)}</p>
  <p>{$collectionDefault.size}</p>
{/if}
