<script lang="ts">
  import { refPageFromUrlHash, refPage2UrlHash, refPage2Breadcrumb } from "@helpers/refPage";

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
  $: window.location.hash = refPage2UrlHash({ chainId, address, tokenID });

  // change chainId or address on url change
  $: ({ chainId, address, tokenID, account } = refPageFromUrlHash(window.location.hash));
</script>

<p>{@html refPage2Breadcrumb({ chainId, address, tokenID, account })}</p>
