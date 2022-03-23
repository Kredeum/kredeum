<script lang="ts">
  // import { onMount } from "svelte";

  // import Home from "./HomeView.svelte";
  import BreadCrumb from "./BreadCrumb.svelte";
  import Metamask from "./Metamask.svelte";
  import AccountConnect from "../Account/AccountConnect.svelte";
  import NetworkSelect from "../Network/NetworkSelect.svelte";
  import CollectionListData from "../CollectionList/CollectionListGet.svelte";
  // import NftsList from "./NftsList.svelte";
  import NftsListData from "../NftsList/NftsListGet.svelte";
  // import NftGet from "./NftData.svelte";
  import RefreshButton from "../NftsList/NftsListRefresh.svelte";
  // import { metamaskInit } from "helpers/metamask";
  // import { metamaskChainId, metamaskAccount } from "main/metamask";

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  import type { Collection as CollectionType } from "lib/ktypes";
  import { collectionGet } from "lib/kcollection-get";
  // import NftDetail from "./NftDetail.svelte";
  import { metamaskProvider } from "main/metamask";

  let collectionObject: CollectionType;
  $: _collectionGet(collection).catch(console.error);
  const _collectionGet = async (collection: string): Promise<void> => {
    collectionObject = await collectionGet(chainId, collection, $metamaskProvider, account);
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  let account: string;
  let chainId: number;
  let collection: string;
  let tokenID: string;

  let refreshing: boolean;
  let nftsList: () => Promise<void>;
  let platform = "dapp";
</script>

<main>
  <div>
    {chainId}/{collection || ""}/{tokenID || ""}@{account}

    <BreadCrumb display={true} />
  </div>

  <div>
    <!-- <Home /> -->

    <!-- <Metamask bind:account bind:chainId /> -->

    <AccountConnect bind:account />

    <NetworkSelect bind:chainId />

    {#if chainId && account}
      <CollectionListData {chainId} {account} bind:collection />
    {/if}
  </div>

  <div>
    <RefreshButton {refreshing} {nftsList} />

    {#if chainId && collection}
      <NftsListData {chainId} {collection} {account} bind:refreshing {platform} bind:nftsList />
    {/if}
  </div>
</main>

<style>
  div {
    padding: 30px;
  }
</style>
