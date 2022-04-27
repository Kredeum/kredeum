<script lang="ts">
  import { factoryGetAddress } from "lib/kfactory-get";
  import { getCreate } from "lib/kconfig";

  import AccountConnect from "../Account/AccountConnect.svelte";
  import NetworkList from "../Network/NetworkList.svelte";
  import CollectionList from "../Collection/CollectionList.svelte";

  import Create from "../Global/Create.svelte";
  import Navigation from "../Global/Navigation.svelte";

  import NftDetail from "../Nft/NftDetail.svelte";
  import NftsList from "../Nft/NftsList.svelte";
  import NftGridView from "../Nft/NftsGridView.svelte";
  import NftsListRefresh from "../Nft/NftsListRefresh.svelte";

  import Title from "../Global/Title.svelte";
  // import BreadCrumb from "../../tests/BreadCrumb.svelte";
  import HomeLayout from "../Global/HomeLayout.svelte";

  // import { metamaskProvider } from "main/metamask";

  let chainId: number;
  let address: string;
  let tokenID: string;
  let account: string;
  let refreshing: boolean;
  let refresh: number;

  // DISPLAY TYPE --> //////////////////////////////////////////////
  import NftsDisplayType from "./NftsDisplayType.svelte";

  let mainContentDisplayComponent: string;

  $: console.log("chainId", chainId);
  $: console.log("address", address);
  $: console.log("tokenID", tokenID);
  $: console.log("account", account);
  // --> DISPLAY TYPE //////////////////////////////////////////////
</script>

<HomeLayout>
  <span slot="nav">
    <Navigation />
  </span>

  <span slot="header">
    <Title />

    {#if account && getCreate(chainId)}
      <Create {chainId} />
    {/if}

    <!-- <BreadCrumb display={true} /> -->

    <div class="row alignbottom">
      <!-- View account -->
      <AccountConnect bind:account />

      <!-- Select network -->
      <NetworkList bind:chainId />

      <!-- Select collection -->
      {#if chainId && account}
        <CollectionList {chainId} {account} bind:address />

        {#if account && address && factoryGetAddress(chainId)}
          <!-- Refresh button -->
          <NftsListRefresh {refreshing} bind:refresh />
        {/if}
      {/if}
      <NftsDisplayType bind:mainContentDisplayComponent />
    </div>
  </span>

  <span slot="content">
    {#if chainId && account && address}
      <!-- {#if tokenID} -->
      {#if "nft" === mainContentDisplayComponent && chainId && address && tokenID}
        <NftDetail {chainId} {address} bind:tokenID {account} bind:mainContentDisplayComponent />
      {:else if "grid" === mainContentDisplayComponent}
        <NftGridView
          {chainId}
          {address}
          bind:tokenID
          {account}
          {refresh}
          bind:mainContentDisplayComponent
          bind:refreshing
        />
      {:else if "list" === mainContentDisplayComponent}
        <NftsList {chainId} {address} {account} {refresh} bind:refreshing />
      {/if}
    {/if}
  </span>
</HomeLayout>

<style>
  div {
    /* DO NOT REMOVE ! */
    visibility: visible;
  }
</style>
