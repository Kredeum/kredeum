<script lang="ts">
  import type { Writable } from "svelte/store";
  import { writable } from "svelte/store";
  import { onMount, setContext } from "svelte";

  import { getCreate, config } from "@lib/common/config";

  import Create from "../../svelte/components/Global/Create.svelte";
  import Navigation from "../../svelte/components/Global/Navigation.svelte";
  import HomeLayout from "../../svelte/components/Global/HomeLayout.svelte";
  import Title from "../../svelte/components/Global/Title.svelte";
  import BreadCrumb from "../../svelte/components/Global/BreadCrumb.svelte";

  import Content from "../../svelte/components/Global/Content.svelte";

  import NetworkSelect from "../../svelte/components/Network/NetworkListSelect.svelte";
  import AccountConnect from "../../svelte/components/Account/AccountConnect.svelte";
  import NftsListRefresh from "../../svelte/components/NftsList/NftsListRefresh.svelte";
  import CollectionList from "../Collection/CollectionList.svelte";

  import type { RefBreadcrumb } from "@helpers/breadcrumb";
  import { urlHash2RefNFT, refBreadcrumb } from "@helpers/breadcrumb";

  ////////////////////////////////////////////////////////////////////
  // <Home {storage} {platform}/>
  // storage : file storage used : ipfs, swarm or arweave
  // platform : app container : dapp or wordpress
  ////////////////////////////////////////////////////////////////////
  export let storage: string = config.storage.type;
  export let platform: string = "dapp";
  ////////////////////////////////////////////////////////////////////

  let chainId: number;
  let address: string;
  let tokenID: string;
  let account: string;
  let refBreadcrumb: RefBreadcrumb;

  ////////////////////////////////////////////////////////////////////
  // Context for refreshCollectionList & refreshNftsList & refreshing
  ////////////////////////////////////////////////////////////////////
  let refreshCollectionList: Writable<number> = writable(1);
  setContext("refreshCollectionList", refreshCollectionList);

  let refreshNftsList: Writable<number> = writable(1);
  setContext("refreshNftsList", refreshNftsList);

  let refreshing: Writable<boolean> = writable(false);
  setContext("refreshing", refreshing);
  ////////////////////////////////////////////////////////////////////

  onMount(() => {
    refBreadcrumb = urlHash2RefNFT(window.location.hash);
    ({ chainId, address, tokenID } = refBreadcrumb);
  });
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

    <BreadCrumb {refBreadcrumb} />

    <div class="row alignbottom">
      <AccountConnect bind:account />

      <NetworkSelect bind:chainId />

      {#if chainId}
        <CollectionList {chainId} {account} bind:address />

        {#if address}
          <NftsListRefresh />
        {/if}
      {/if}
    </div>
  </span>

  <span slot="content">
    {#if chainId && address}
      <Content {chainId} {address} bind:tokenID {account} {platform} />
    {/if}
  </span>
</HomeLayout>

<style>
  div {
    /* DO NOT REMOVE ! */
    visibility: visible;
  }
</style>
