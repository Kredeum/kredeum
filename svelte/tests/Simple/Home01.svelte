<script lang="ts">
  import BreadCrumbSimple from "./BreadCrumbSimple.svelte";
  import NetworkSelectSimple from "./Network/NetworkSelectSimple.svelte";
  import MetamaskSimple from "./Network/MetamaskSimple.svelte";

  ////////////////////////////////////////////////////////////////
  // Home01 : chainId sync between Url, NetworkSelect and Metamask
  // Dipslay BreadCrumb
  // Display Network Selector
  ////////////////////////////////////////////////////////////////

  let chainId;
  $: console.log("Home01 chainId CHANGE", chainId);
</script>

<div>
  <p>
    <BreadCrumbSimple bind:chainId />
  </p>
  <p>
    <NetworkSelectSimple bind:chainId />
  </p>
  <p>
    <MetamaskSimple bind:chainId />
  </p>
</div>
