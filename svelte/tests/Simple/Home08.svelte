<script lang="ts">
  import BreadCrumbSimple from "./BreadCrumbSimple.svelte";
  import Nft from "../../components/Nft/NftOld.svelte";

  ///////////////////////////////////////////////////////////////////////////////////////
  // Home07 : chainId, address, tokenID
  // Dipslay Nft
  ///////////////////////////////////////////////////////////////////////////////////////

  let chainId: number;
  let address: string;
  let tokenID: string;
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
