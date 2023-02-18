<script lang="ts">
  import { urlHash2RefNFT, ref2UrlHash, ref2Breadcrumb } from "@helpers/breadcrumb";

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

  $: console.log("BREADCRUMB", ref2Breadcrumb({ chainId, address, tokenID, account, signer }));

  // change url on chainId, address or account change
  $: window.location.hash = ref2UrlHash({ chainId, address, tokenID, account });

  // change chainId or address on url change
  $: ({ chainId, address, tokenID, account } = urlHash2RefNFT(window.location.hash));
</script>

{#if display}
  <pre>
    {ref2Breadcrumb({ chainId, address, tokenID, account, signer })}
  </pre>
{/if}
