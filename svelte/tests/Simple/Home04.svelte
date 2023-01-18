<script lang="ts">
  import BreadCrumbSimple from "./BreadCrumbSimple.svelte";
  import NetworkSelectSimple from "./Network/NetworkSelectSimple.svelte";
  import MetamaskSimple from "./Network/MetamaskSimple.svelte";
  import CollectionSelectSimple from "./Collection/CollectionSelectSimple.svelte";

  ///////////////////////////////////////////////////////////////////////////////////////
  // Home04 : chainId, address and account sync between Url, NetworkSelect and Metamask
  // Dipslay BreadCrumb
  // Display Network Selector and Collection Selector for account and network (selected)
  ///////////////////////////////////////////////////////////////////////////////////////

  let chainId;
  let address;
  let account;
  let signer;
  let init = true;

  $: signer && handleSigner();
  const handleSigner = () => {
    if (init) {
      account ||= signer;
      init = false;
    } else account = signer;
  };
</script>

<div>
  <p>
    <BreadCrumbSimple bind:chainId bind:account  />
  </p>
  <p>
    <NetworkSelectSimple bind:chainId />
  </p>
  <p>
    <CollectionSelectSimple bind:chainId bind:address {account} />
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
