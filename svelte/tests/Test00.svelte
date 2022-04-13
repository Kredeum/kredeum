<script lang="ts">
  // import { onMount } from "svelte";
  import { getCreate } from "lib/kconfig";

  import BreadCrumb from "../tests/BreadCrumb.svelte";
  import Metamask from "../tests/Metamask.svelte";

  // import Home from "./HomeView.svelte";
  // import AccountConnect from "../Account/AccountConnect.svelte";
  // import NetworkSelect from "../Network/NetworkSelect.svelte";
  import CollectionList from "../Collection/CollectionList.svelte";
  // import NftsList from "./NftsList.svelte";
  // import NftsListGet from "../Nft/NftsListGet.svelte";
  // import RefreshButton from "../Nft/NftsListRefresh.svelte";
  // import { metamaskInit } from "helpers/metamask";
  // import { metamaskChainId, metamaskAccount } from "main/metamask";
  // import Create from "./Create.svelte";
  // import NftDetail from "./NftDetail.svelte";
  // import NftMint from "../Nft/NftMint.svelte";

  let account: string;
  let chainId: number;
  let address: string;
  let tokenID: string;

  // let refreshing: boolean;
  // let nftsList: () => Promise<void>;
  // let platform = "dapp";
  // let refresh: number;
</script>

<main>
  <div>
    {chainId}/{address || ""}/{tokenID || ""}@{account}

    <BreadCrumb display={true} />

    {#if account && getCreate(chainId)}
      <!-- <Create {chainId} /> -->
      <!-- <NftMint {chainId} /> -->
    {/if}
  </div>

  <div>
    <!-- <Home /> -->

    <Metamask bind:account bind:chainId />

    <!-- <AccountConnect bind:account /> -->

    <!-- <NetworkSelect bind:chainId /> -->

    {#if chainId && account}
      <CollectionList {chainId} {account} bind:address mintable={true} />
    {/if}
  </div>

  <!-- <div>
    <RefreshButton {refreshing} bind:refresh />

    {#if chainId && address}
      <NftsListGet {chainId} {address} {account} bind:refreshing {refresh} />
    {/if}
  </div> -->
</main>

<style>
  div {
    padding: 30px;
  }
</style>
