<script lang="ts">
  import { setContext } from "svelte";
  import { Writable, writable } from "svelte/store";

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
  // let refresh: number;

  let refresh: Writable<number> = writable(1);
  setContext("refresh", refresh);
</script>

<HomeLayout>
  <span slot="nav">
    <Navigation />
  </span>

  <span slot="header">
    <Title />

    {#if account && getCreate(chainId)}
      <Create {chainId} {storage} />
    {/if}

    <!-- <BreadCrumb display={true} /> -->

    <div class="row alignbottom">
      <!-- View account -->
      <AccountConnect bind:account />

      <!-- Select network -->
      <NetworkList bind:chainId />

      <!-- Select collection -->
      {#if chainId && account}
        <CollectionList {chainId} {account} bind:address bind:refreshing />

        {#if account && address && getNftsFactory(chainId)}
          <!-- Refresh button -->
          <NftsListRefresh {refreshing} />
        {/if}
      {/if}
    </div>
  </span>

  <span slot="content">
    {#if chainId && account && address}
      <Content {chainId} {address} {account} {platform} bind:refreshing />
    {/if}
  </span>
</HomeLayout>

<style>
  div {
    /* DO NOT REMOVE ! */
    visibility: visible;
  }
</style>
