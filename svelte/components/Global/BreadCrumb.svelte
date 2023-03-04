<script lang="ts">
  import { refPageFromUrlHash, refPage2UrlHash, refPage2Breadcrumb } from "@helpers/refPage";
  import { onMount } from "svelte";

  /////////////////////////////////////////////////
  // <BreadCrumbSimple bind:{chainId} bind:{address} bind:{account}  />
  // Get/Set chainId from url
  /////////////////////////////////////////////////
  export let chainId: number = undefined;
  export let address: string = undefined;
  export let tokenID: string = undefined;
  export let account: string = undefined;
  export let signer: string = undefined;
  export let display: boolean = false;

  $: console.log("BREADCRUMB", refPage2Breadcrumb({ chainId, address, tokenID, account, signer }));
</script>

{#if display}
  <p>
    {refPage2Breadcrumb({ chainId, address, tokenID, account, signer })}
  </p>
{/if}
