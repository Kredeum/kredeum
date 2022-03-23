<script lang="ts">
  import type { Collection as CollectionType } from "lib/ktypes";
  import { factoryGetAddress } from "lib/kfactory-get";
  import { getCreate } from "lib/kconfig";

  import AccountConnect from "./Account/AccountConnect.svelte";
  import NetworkSelect from "./Network/NetworkSelect.svelte";
  import CollectionSelect from "./CollectionList/CollectionListGet.svelte";
  // import CollectionCreate from "./componentsOther/CollectionCreateAction.svelte";

  import MintButton from "./Collection/Mint.svelte";
  import Navigation from "./Global/Navigation.svelte";

  import NftGet from "./Nft/NftGet.svelte";
  import NftsList from "./NftsList/NftsList.svelte";
  import NftsListGet from "./NftsList/NftsListGet.svelte";

  // import NftMint from "./old/NftMintAction.svelte";
  import RefreshButton from "./NftsList/NftsListRefresh.svelte";
  import Title from "./Global/Title.svelte";
  import BreadCrumb from "./Global/BreadCrumb.svelte";
  import HomeLayout from "./Global/HomeLayout.svelte";

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  import { collectionGet } from "lib/kcollection-get";
  // import NftDetail from "./NftDetail.svelte";
  import { metamaskProvider } from "main/metamask";

  let collectionObject: CollectionType;
  $: _collectionGet(collection).catch(console.error);
  const _collectionGet = async (collection: string): Promise<void> => {
    collectionObject = await collectionGet(chainId, collection, $metamaskProvider, account);
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
        <RefreshButton bind:refreshing />
      {/if}
    </div>
  </span>

  <span slot="content">
    <!-- NFTs list -->
    <!-- <NftDetail collection={collectionObject} {tokenID} /> -->
    {#if chainId && account && collection}
      {#if tokenID}
        <NftGet {chainId} {collection} {tokenID} />
      {:else}
        <!-- <NftsList {chainId} {collection} {account} bind:refreshing bind:nftsList {platform} /> -->
        <NftsListGet {chainId} {collection} {account} bind:refreshing {platform} />
      {/if}
    {/if}
  </span>

  <span slot="modals" />
</HomeLayout>
