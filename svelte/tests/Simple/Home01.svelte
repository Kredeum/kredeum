<script lang="ts">
  import BreadCrumbSimple from "./BreadCrumbSimple.svelte";
  import NetworksSelectSimple from "./Network/NetworkListSelectSimple.svelte";
  import MetamaskSimple from "./Network/MetamaskSimple.svelte";

  ////////////////////////////////////////////////////////////////
  // Home01 : chainId sync between Url, NetworksSelect and Metamask
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
    <NetworksSelectSimple bind:chainId />
  </p>
  <p>
    <MetamaskSimple bind:chainId />
  </p>
</div>
