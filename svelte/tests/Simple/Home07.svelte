<script lang="ts">
  import BreadCrumbSimple from "./BreadCrumbSimple.svelte";
  import NftSimple from "./Nft/NftSimple.svelte";
  import {  providerSetFallback } from "@lib/common/provider-get";

  ///////////////////////////////////////////////////////////////////////////////////////
  // Home07 : chainId, address, tokenID
  // Dipslay NftSimple
  ///////////////////////////////////////////////////////////////////////////////////////

  let chainId: number;
  let address: string;
  let tokenID: string;
  $: providerSetFallback(chainId);
</script>

<div>
  <p>
    <BreadCrumbSimple bind:chainId bind:address bind:tokenID  />
  </p>
  <p>
    <NftSimple {chainId} {address} {tokenID} />
  </p>
</div>

<style>
  div {
    width: 800px;
    padding: 30px;
  }
</style>
