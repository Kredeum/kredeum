<script lang="ts">
  import type { Collection } from "lib/ktypes";
  import { factoryGetAddress } from "lib/kfactory-get";
  import { getCreate, config } from "lib/kconfig";

  import AccountConnect from "./AccountConnect.svelte";
  import NetworkSelect from "./NetworkSelect.svelte";
  import CollectionSelect from "./CollectionSelect.svelte";
  import CollectionCreate from "./CollectionCreate.svelte";

  import MintButton from "./MintButton.svelte";
  import Navigation from "./Navigation.svelte";
  import NftsList from "./NftsList.svelte";
  import NftMint from "./NftMint.svelte";
  import RefreshButton from "./RefreshButton.svelte";
  import Title from "./Title.svelte";
  import BreadCrumb from "./BreadCrumb.svelte";
  import HomeLayout from "../layouts/HomeLayout.svelte";

  export let platform = "dapp";

  let chainId: number;
  let collection: string;
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
      <NftsList {chainId} {collection} {account} bind:refreshing bind:nftsList {platform} />
    {/if}
  </span>

  <span slot="modals" />
</HomeLayout>
