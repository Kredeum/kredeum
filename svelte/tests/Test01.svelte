<script lang="ts">
  // import type { Readable } from "svelte/store";

  // import AccountConnect from "../components/Account/AccountConnect.svelte";
  import NetworkList from "../components/Network/NetworkList.svelte";
  // import NftMintButton from "../Nft/NftMintButton.svelte";
  // import NftsList from "../components/Nft/NftsList.svelte";
  import NftsListSimple from "./NftsListSimple.svelte";
  // import CollectionList from "../components/Collection/CollectionList.svelte";
  import CollectionListSimple from "../tests/CollectionListSimple.svelte";
  import BreadCrumb from "./BreadCrumb.svelte";
  import Metamask from "../tests/Metamask.svelte";

  let account: string;
  let signer: string;
  let chainId: number;
  let address: string;
</script>

<div>
  <BreadCrumb display={true} bind:account />

  <Metamask bind:signer />
  <!-- <Metamask /> -->
  <!-- <AccountConnect bind:account /> -->
  <NetworkList bind:chainId />

  <!-- <NftMintButton /> -->
  <!-- <CollectionList {chainId} bind:address {account} mintable={false} /> -->
  <CollectionListSimple {chainId} bind:address {account} mintable={false} />

  <NftsListSimple {chainId} {address} {account} />
</div>

<style>
  div {
    padding: 30px;
  }
</style>
