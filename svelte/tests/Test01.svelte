<script lang="ts">
  import AccountConnect from "../components/Account/AccountConnect.svelte";
  import NetworkList from "../components/Network/NetworkList.svelte";
  // import NftMintButton from "../Nft/NftMintButton.svelte";
  import NftsList from "../components/Nft/NftsList.svelte";
  import NftsListSimple from "./NftsListSimple.svelte";
  import CollectionList from "../components/Collection/CollectionList.svelte";
  import BreadCrumb from "../tests/BreadCrumb.svelte";
  import Metamask from "../tests/Metamask.svelte";

  let account: string;
  let chainId: number;
  let collection: string;
</script>

<div>
  <BreadCrumb display={true} />

  <Metamask bind:account />
  <!-- <Metamask /> -->
  <!-- <AccountConnect bind:account /> -->
  <NetworkList bind:chainId />

  <!-- <NftMintButton /> -->
  <CollectionList {chainId} bind:collection {account} mintable={false} />

  <!-- <NftsListSimple {chainId} address={collection} {account} />   -->
  <NftsList {chainId} address={collection} {account} />
</div>

<style>
  div {
    padding: 30px;
  }
</style>
