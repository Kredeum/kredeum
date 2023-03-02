<script lang="ts">
  import BreadCrumbSimple from "./BreadCrumbSimple.svelte";
  import NetworkListSelectSimple from "./Network/NetworkListSelectSimple.svelte";
  import MetamaskSimple from "./Network/MetamaskSimple.svelte";
  import CollectionSelectSimple from "./CollectionList/CollectionSelectSimple.svelte";
  import { providerSetFallback } from "@lib/common/provider-get";

  ///////////////////////////////////////////////////////////////////////////////////////
  // Home04 : chainId, address and account sync between Url, NetworkListSelect and Metamask
  // Dipslay BreadCrumb
  // Display Network Selector and Collection Selector for account and network (selected)
  ///////////////////////////////////////////////////////////////////////////////////////

  let chainId: number;
  let address: string;
  let account: string;
  let signer: string;
  let init = true;

  $: providerSetFallback(chainId);
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
    <BreadCrumbSimple bind:chainId bind:account />
  </p>
  <p>
    <NetworkListSelectSimple bind:chainId />
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
