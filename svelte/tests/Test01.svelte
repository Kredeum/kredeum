<script lang="ts">
  // import AccountConnect from "../Account/AccountConnect.svelte";
  // import NetworkList from "../Network/NetworkList.svelte";
  // import NftMintButton from "../Nft/NftMintButton.svelte";
  import CollectionList from "../components/Collection/CollectionList.svelte";
  import BreadCrumb from "../tests/BreadCrumb.svelte";
  import Metamask from "../tests/Metamask.svelte";

  let account: string;
  let chainId: number;
  let collection: string;
</script>

<div>
  <BreadCrumb display={true} />

  <!-- <Metamask /> -->
  <Metamask bind:account bind:chainId />
  <!-- <AccountConnect bind:account /> -->
  <!-- <NetworkList bind:chainId /> -->

  <!-- <NftMintButton /> -->
  <CollectionList {chainId} {account} mintable={false} />
</div>

<style>
  div {
    padding: 30px;
  }
</style>
