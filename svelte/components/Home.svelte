<script lang="ts">
  import type { Collection } from "lib/ktypes";
  import { factoryGetAddress } from "lib/kfactory-get";
  import { getCreate, config } from "lib/kconfig";
  import { collectionGet } from "lib/kcollection-get";

  import AccountConnect from "./AccountConnect.svelte";
  import NetworkSelect from "./NetworkSelect.svelte";
  import CollectionSelect from "./CollectionSelect.svelte";
  import CollectionCreate from "./CollectionCreate.svelte";

  import MintButton from "./MintButton.svelte";
  import Navigation from "./Navigation.svelte";

  import NftGet from "./NftGet.svelte";
  import NftsList from "./NftsList.svelte";

  import NftMint from "./NftMint.svelte";
  import RefreshButton from "./RefreshButton.svelte";
  import Title from "./Title.svelte";
  import BreadCrumb from "./BreadCrumb.svelte";
  import HomeLayout from "../layouts/HomeLayout.svelte";

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  import NftsListOld from "./NftsListOld.svelte";
  import NftDetail from "./NftDetail.svelte";
  import { metamaskProvider } from "main/metamask";

  let collectionObject: Collection;
  $: _collectionGet(collection);
  const _collectionGet = async (collection: string): Promise<void> => {
    collectionObject = await collectionGet(chainId, collection, $metamaskProvider);
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  export let platform = "dapp";

  let chainId: number;
  let collection: string;
  let tokenID: string;
  let account: string;
  let refreshing: boolean;
  let nftsList: () => Promise<void>;
</script>

<HomeLayout>
  <span slot="nav">
    <Navigation />
  </span>

  <span slot="header">
    <Title />

    {#if account && getCreate(chainId)}
      <MintButton />
    {/if}

    <BreadCrumb display={true} />

    <div class="row alignbottom">
      <!-- View account -->
      <AccountConnect bind:account />

      <!-- Select network -->
      <NetworkSelect bind:chainId />

      <!-- Select collection -->
      {#if chainId && account}
        <CollectionSelect {chainId} {account} bind:collection />
      {/if}

      {#if account && collection && factoryGetAddress(chainId)}
        <!-- Refresh button -->
        <RefreshButton bind:refreshing bind:nftsList />
      {/if}
    </div>
  </span>

  <span slot="content">
    <!-- NFTs list -->
    {#if chainId && account && collection}
      {#if tokenID}
        <NftGet {chainId} {collection} {tokenID} />
        <!-- <NftDetail collection={collectionObject} {tokenID} /> -->
      {:else}
        <NftsList {chainId} {collection} {account} bind:tokenID bind:refreshing bind:nftsList {platform} />
        <!-- <NftsListOld {collection} refreshing bind:nftsList {platform} /> -->
      {/if}
    {/if}
  </span>

  <span slot="modals" />
</HomeLayout>
