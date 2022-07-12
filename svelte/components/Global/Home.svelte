<script lang="ts">
  import { getNftsFactory, getCreate, config } from "lib/kconfig";

  import AccountConnect from "../Account/AccountConnect.svelte";
  import NetworkList from "../Network/NetworkList.svelte";
  import CollectionList from "../Collection/CollectionList.svelte";

  import Create from "../Global/Create.svelte";
  import Navigation from "../Global/Navigation.svelte";

  import NftsListRefresh from "../NftsList/NftsListRefresh.svelte";

  import Title from "../Global/Title.svelte";
  // import BreadCrumb from "../../tests/BreadCrumb.svelte";
  import HomeLayout from "../Global/HomeLayout.svelte";

  import Content from "./Content.svelte";

  // import { metamaskProvider } from "main/metamask";

  // export let storage: string = "swarm";
  export let storage: string = config.storage;
  export let platform: string = "dapp";

  let chainId: number;
  let address: string;
  let account: string;
  let refreshing: boolean;
  let refresh: number;
</script>

<HomeLayout>
  <span slot="nav">
    <Navigation />
  </span>

  <span slot="header">
    <Title />

    {#if account && getCreate(chainId)}
      <Create {chainId} {storage} bind:refresh />
    {/if}

    <!-- <BreadCrumb display={true} /> -->

    <div class="row alignbottom">
      <!-- View account -->
      <AccountConnect bind:account />

      <!-- Select network -->
      <NetworkList bind:chainId />

      <!-- Select collection -->
      {#if chainId && account}
        <CollectionList {chainId} {account} bind:address bind:refreshing {refresh} />

        {#if account && address && getNftsFactory(chainId)}
          <!-- Refresh button -->
          <NftsListRefresh {refreshing} bind:refresh />
        {/if}
      {/if}
    </div>
  </span>

  <span slot="content">
    {#if chainId && account && address}
      <Content {chainId} {address} {account} {platform} bind:refreshing {refresh} />
    {/if}
  </span>
</HomeLayout>

<style>
  div {
    /* DO NOT REMOVE ! */
    visibility: visible;
  }
</style>
