<script lang="ts">
  import { onMount } from "svelte";

  import Home from "./Home.svelte";
  import BreadCrumb from "./BreadCrumb.svelte";
  import AccountConnect from "./AccountConnect.svelte";
  import NetworkSelect from "./NetworkSelect.svelte";
  import CollectionSelect from "./CollectionSelect.svelte";
  import NftsList from "./NftsList.svelte";
  import NftGet from "./NftGet.svelte";
  import RefreshButton from "./RefreshButton.svelte";
  import { metamaskInit } from "helpers/metamask";
  import { metamaskChainId, metamaskAccount } from "main/metamask";

  let account: string;
  let chainId: number;
  let collection: string;
  let tokenID: string;

  let refreshing: boolean;
  let nftsList: () => Promise<void>;
  let platform: string = "dapp";
</script>

<main>
  <div>
    {chainId}/{collection || ""}@{account}

    <BreadCrumb display={true} />
  </div>

  <div>
    <!-- <Home /> -->

    <AccountConnect bind:account />

    <NetworkSelect bind:chainId />

    {#if chainId && account}
      <CollectionSelect {chainId} {account} bind:collection />
    {/if}
  </div>

  <div>
    <!-- <RefreshButton {refreshing} {nftsList} /> -->
    {#if tokenID}
      <NftGet {chainId} {collection} {tokenID} />
    {:else}
      <NftsList {chainId} {collection} {account} bind:refreshing {platform} bind:nftsList />
    {/if}
  </div>
</main>

<style>
  div {
    padding: 30px;
  }
</style>
