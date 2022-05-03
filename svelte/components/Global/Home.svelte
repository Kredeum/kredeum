<script lang="ts">
  import { factoryGetAddress } from "lib/kfactory-get";
  import { getCreate } from "lib/kconfig";

  import AccountConnect from "../Account/AccountConnect.svelte";
  import NetworkList from "../Network/NetworkList.svelte";
  import CollectionList from "../Collection/CollectionList.svelte";

  import Create from "../Global/Create.svelte";
  import Navigation from "../Global/Navigation.svelte";

  import NftsListRefresh from "../Nft/NftsListRefresh.svelte";

  import Title from "../Global/Title.svelte";
  // import BreadCrumb from "../../tests/BreadCrumb.svelte";
  import HomeLayout from "../Global/HomeLayout.svelte";

  import Content from "./Content.svelte";

  // import { metamaskProvider } from "main/metamask";

  export let platform: string = "dapp";

  let chainId: number;
  let address: string;
  // let tokenID: string;
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
    </div>
  </span>

  <span slot="content">
    {#if chainId && account && address}
      {#key chainId && account}
        <Content {chainId} {address} {account} {platform} bind:refreshing {refresh} />
      {/key}
    {/if}
  </span>
</HomeLayout>

<style>
  div {
    /* DO NOT REMOVE ! */
    visibility: visible;
  }
</style>
