<script lang="ts">
  import BreadCrumbSimple from "./BreadCrumbSimple.svelte";
  import Nft from "../../components/Nft/Nft.svelte";
  import {  providerSetFallback } from "@lib/common/provider-get";

  ///////////////////////////////////////////////////////////////////////////////////////
  // Home08 : chainId, address, tokenID
  // Display Nft
  ///////////////////////////////////////////////////////////////////////////////////////

  let chainId: number;
  let address: string;
  let tokenID: string;
  $: providerSetFallback(chainId);
</script>

<div>
  <p>
    <BreadCrumbSimple bind:chainId bind:address bind:tokenID />
  </p>
  <p>
    <Nft {chainId} {address} {tokenID} />
  </p>
</div>

<style>
  div {
    width: 800px;
    padding: 30px;
  }
</style>
