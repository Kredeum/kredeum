<script lang="ts">
  import BreadCrumbSimple from "./BreadCrumbSimple.svelte";
  import NetworksSelectSimple from "./Network/NetworkListSelectSimple.svelte";
  import MetamaskSimple from "./Network/MetamaskSimple.svelte";
  import CollectionSelectSimple from "./CollectionList/CollectionListSelectSimple.svelte";
  import NftListSelectSimple from "./NftList/NftListSelectSimple.svelte";
  import NftSimple from "./Nft/NftSimple.svelte";
  import { providerSetFallback } from "@lib/common/provider-get";

  ///////////////////////////////////////////////////////////////////////////////////////
  // Home06 : chainId, address and account sync between Url, NetworksSelect and Metamask
  // Dipslay BreadCrumb
  // Display Network Selector and Collection Selector
  // Display Nft list for chainId, address and account
  ///////////////////////////////////////////////////////////////////////////////////////

  let chainId: number;
  let address: string;
  let tokenID: string;
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
    <BreadCrumbSimple bind:chainId bind:address bind:tokenID bind:account />
  </p>
  <p>
    <NetworksSelectSimple bind:chainId />
  </p>
  <p>
    <CollectionSelectSimple {chainId} bind:address {account} />
  </p>
  <p>
    <NftListSelectSimple {chainId} {address} bind:tokenID />
  </p>
  <p>
    <NftSimple {chainId} {address} {tokenID} />
  </p>
  <p>
    <MetamaskSimple bind:chainId bind:signer />
  </p>
</div>

<style>
  div {
    width: 800px;
    padding: 30px;
  }
</style>
