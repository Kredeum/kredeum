<script lang="ts">
  import type { RefNFT } from "@helpers/refNft";

  import { onMount } from "svelte";
  import { refNFT2UrlHash, refNFT2Breadcrumb } from "@helpers/refNft";
  import { urlHash2RefNFT } from "@helpers/urlHash";

  /////////////////////////////////////////////////
  // <BreadCrumbSimple bind:{chainId} bind:{address} bind:{account}  />
  // Get/Set chainId from url
  /////////////////////////////////////////////////
  export let chainId: number = undefined;
  export let address: string = undefined;
  export let tokenID: string = undefined;
  export let account: string = undefined;

  $: console.log("BreadCrumbSimple chainId CHANGE", chainId);
  $: console.log("BreadCrumbSimple address CHANGE", address);
  $: console.log("BreadCrumbSimple tokenID CHANGE", tokenID);
  $: console.log("BreadCrumbSimple account CHANGE", account);

  // change url on chainId, address or account change
  $: window.location.hash = refNFT2UrlHash({ chainId, address, tokenID, account });

  // change chainId or address on url change
  $: ({ chainId, address, tokenID, account } = urlHash2RefNFT(window.location.hash));
</script>

<p>{@html refNFT2Breadcrumb({ chainId, address, tokenID, account })}</p>
