<script lang="ts">
  import type { Collection } from "lib/ktypes";
  import { factoryGetAddress } from "lib/kfactory-get";
  import { getCreate, config } from "lib/kconfig";

  import AccountConnect from "./AccountConnect.svelte";
  import NetworkSelect from "./NetworkSelectLabel.svelte";
  import CollectionSelect from "./CollectionSelectLabel.svelte";
  import CollectionCreate from "./CollectionCreate.svelte";
  import CreateModal from "./CreateModal.svelte";
  import MintButton from "./MintButton.svelte";
  import Navigation from "./Navigation.svelte";
  import NftList from "./NftList.svelte";
  import NftMint from "./NftMint.svelte";
  import RefreshButton from "./RefreshButton.svelte";
  import Title from "./Title.svelte";
  import BreadCrumb from "./BreadCrumb.svelte";
  import HomeLayout from "../layouts/HomeLayout.svelte";

  import { metamaskChainId, metamaskAccount } from "main/metamask";

  export let platform = "dapp";

  let collection: Collection;
  let refreshing: boolean;
  let nftsList: () => Promise<void>;
</script>

<HomeLayout>
  <span slot="nav">
    <Navigation />
  </span>

  <span slot="header">
    <Title />

    {#if $metamaskAccount && getCreate($metamaskChainId)}
      <MintButton />
    {/if}

    <BreadCrumb display={true} />

    <div class="row alignbottom">
      <!-- View account -->
      <AccountConnect />

      <!-- Select network -->
      <NetworkSelect label={true} />

      <!-- Select collection -->
      <CollectionSelect bind:collection />

      {#if $metamaskAccount && collection && factoryGetAddress($metamaskChainId)}
        <!-- Refresh button -->
        <RefreshButton bind:refreshing bind:nftsList />
      {/if}
    </div>
  </span>

  <span slot="content">
    <!-- NFTs list -->
    <NftList {collection} bind:refreshing bind:nftsList {platform} />
  </span>

  <span slot="modals">
    <!-- Modal create -->
    <div id="create" class="modal-window">
      <CreateModal />
    </div>

    <!-- SubModal create NFT -->
    <div id="create-nft" class="modal-window">
      <NftMint bind:collection />
    </div>

    <!-- SubModal create collection -->
    <div id="add-collection" class="modal-window">
      <CollectionCreate bind:collection />
    </div>
  </span>
</HomeLayout>
