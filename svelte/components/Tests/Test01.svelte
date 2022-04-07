<script lang="ts">
  // import AccountConnect from "../Account/AccountConnect.svelte";
  // import NetworkList from "../Network/NetworkList.svelte";
  // import NftMintButton from "../Nft/NftMintButton.svelte";
  import CollectionList from "../Collection/CollectionList.svelte";
  import BreadCrumb from "./BreadCrumb.svelte";
  import Metamask from "./Metamask.svelte";

  let account: string;
  let chainId: number;
  let collection: string;
</script>

<main>
  <BreadCrumb display={true} />

  <!-- <Metamask /> -->
  <Metamask bind:account bind:chainId />
  <!-- <AccountConnect bind:account /> -->
  <!-- <NetworkList bind:chainId /> -->

  <!-- <NftMintButton /> -->
  <CollectionList {chainId} {account} />
</main>
