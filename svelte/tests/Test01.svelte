<script lang="ts">
  // import type { Readable } from "svelte/store";

  // import AccountConnect from "../components/Account/AccountConnect.svelte";
  import NetworkList from "../components/Network/NetworkList.svelte";
  // import NftMintButton from "../Nft/NftMintButton.svelte";
  // import NftsList from "../components/Nft/NftsList.svelte";
  import NftsListSimple from "./Simple/NftList/NftListSimple.svelte";
  // import CollectionList from "../components/Collection/CollectionList.svelte";
  import CollectionListSelectSimple from "../tests/Simple/CollectionList/CollectionListSelectSimple.svelte";
  import BreadCrumb from "./BreadCrumb.svelte";
  import MetamaskSimple from "../tests/Simple/Network/MetamaskSimple.svelte";

  let account: string;
  let signer: string;
  let chainId: number;
  let address: string;
</script>

<div>
  <BreadCrumb display={true} />

  <MetamaskSimple bind:signer />
  <!-- <MetamaskSimple /> -->
  <!-- <AccountConnect bind:account /> -->
  <NetworkList {chainId} />

  <!-- <NftMintButton /> -->
  <!-- <CollectionList {chainId} bind:address {account} mintable={false} /> -->
  <CollectionListSelectSimple {chainId} bind:address {account} />

  <NftsListSimple {chainId} {address} {account} />
</div>

<style>
  div {
    padding: 30px;
  }
</style>
