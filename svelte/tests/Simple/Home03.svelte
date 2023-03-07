<script lang="ts">
  import BreadCrumbSimple from "./BreadCrumbSimple.svelte";
  import MetamaskSimple from "./Network/MetamaskSimple.svelte";
  import CollectionsSimple from "./CollectionList/CollectionListSimple.svelte";
  import { providerSetFallback } from "@lib/common/provider-get";

  /////////////////////////////////////////////////////////////////////////
  // Home03 : chainId and account sync between Url and Metamask
  // Dipslay BreadCrumb
  // Display list of collections on chainId for account
  /////////////////////////////////////////////////////////////////////////

  let chainId: number;
  let account: string;
  let signer: string;
  let init = true;

  $: console.log("Home03 chainId CHANGE", chainId);
  $: console.log("Home03 account CHANGE", account);
  $: console.log("Home03 signer CHANGE", signer);
  $: console.log("Home03 init CHANGE", init);

  $: providerSetFallback(chainId);
  $: signer && handleSigner();
  const handleSigner = () => {
    console.log("Home03 handleSigner", init, account, signer);
    if (init) {
      account ||= signer;
      init = false;
    } else account = signer;
  };
</script>

<div>
  <p>
    <BreadCrumbSimple bind:chainId bind:account />
  </p>
  <p>
    <CollectionsSimple bind:chainId {account} />
  </p>
  <p>
    <MetamaskSimple bind:chainId bind:signer />
  </p>
</div>

<style>
  div {
    padding: 30px;
  }
</style>
