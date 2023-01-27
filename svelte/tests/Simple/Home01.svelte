<script lang="ts">
  import BreadCrumbSimple from "./BreadCrumbSimple.svelte";
  import NetworkListSelectSimple from "./Network/NetworkListSelectSimple.svelte";
  import MetamaskSimple from "./Network/MetamaskSimple.svelte";

  ////////////////////////////////////////////////////////////////
  // Home01 : chainId sync between Url, NetworkListSelect and Metamask
  // Dipslay BreadCrumb
  // Display Network Selector
  ////////////////////////////////////////////////////////////////

  let chainId: number;
  $: console.log("Home01 chainId CHANGE", chainId);
</script>

<div>
  <p>
    <BreadCrumbSimple bind:chainId />
  </p>
  <p>
    <NetworkListSelectSimple bind:chainId />
  </p>
  <p>
    <MetamaskSimple bind:chainId />
  </p>
</div>
