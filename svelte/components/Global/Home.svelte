<script lang="ts">
  import { onMount, setContext } from "svelte";
  import { Writable, writable } from "svelte/store";

  import { getCreate, config } from "@lib/common/config";

  import Create from "../Global/Create.svelte";
  import Navigation from "../Global/Navigation.svelte";
  import HomeLayout from "../Global/HomeLayout.svelte";
  import Title from "../Global/Title.svelte";
  // import BreadCrumb from "./BreadCrumb.svelte";

  import Content from "../Global/Content.svelte";

  import NetworkList from "../Network/NetworkList.svelte";
  import AccountConnect from "../Account/AccountConnect.svelte";
  import NftsListRefresh from "../NftsList/NftsListRefresh.svelte";
  import CollectionList from "../Collection/CollectionList.svelte";

  import { urlHash2RefNFT } from "@helpers/urlHash";
  import type { RefNFT } from "@helpers/refNft";

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
  let refNFT: RefNFT;

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
    refNFT = urlHash2RefNFT(window.location.hash);
    ({ chainId, address, tokenID } = refNFT);
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

    <!-- <BreadCrumb {refNFT} /> -->

    <div class="row alignbottom">
      <AccountConnect bind:account />

      <NetworkList bind:chainId />

      {#if chainId}
        <CollectionList {chainId} {account} bind:address />
        <!-- <CollectionListSimple {chainId} {account} bind:address /> -->

        {#if account && address}
          <NftsListRefresh />
        {/if}
      {/if}
    </div>
  </span>

  <span slot="content">
    {#if chainId && account && address}
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
