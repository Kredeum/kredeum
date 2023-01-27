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

  $: console.log("BreadCrumbSimple chainId CHANGE", chainId);
  $: console.log("BreadCrumbSimple address CHANGE", address);
  $: console.log("BreadCrumbSimple tokenID CHANGE", tokenID);
  $: console.log("BreadCrumbSimple account CHANGE", account);

  // change url on chainId, address or account change
  $: window.location.hash = ref2UrlHash({ chainId, address, tokenID });

  // change chainId or address on url change
  $: ({ chainId, address, tokenID, account } = urlHash2RefNFT(window.location.hash));
</script>

<p>{@html ref2Breadcrumb({ chainId, address, tokenID, account })}</p>
