<script lang="ts">
  import { getCreate } from "@lib/common/config";

  import Create from "./Create.svelte";
  import Navigation from "./Navigation.svelte";
  import HomeLayout from "./HomeLayout.svelte";
  import Title from "./Title.svelte";
  import BreadCrumb from "./BreadCrumb.svelte";

  import AccountConnect from "../Account/AccountConnect.svelte";
  // import NetworkList from "../Network/NetworkList.svelte";
  import NetworkListSelect from "../Network/NetworkListSelect.svelte";
  import CollectionSelect from "../CollectionList/CollectionListSelect.svelte";
  import NftsList from "../NftsList/NftsList.svelte";
  import Nft from "../Nft/Nft.svelte";
  import { providerSetFallback } from "@lib/common/provider-get";

  ////////////////////////////////////////////////////////////////////
  // <HomeNew />
  ////////////////////////////////////////////////////////////////////

  let chainId: number;
  let address: string;
  let tokenID: string;
  let account: string;
  let signer: string;
  let init = true;
  $: console.log("Home chainId", chainId);
  $: console.log("Home address", address);
  $: console.log("Home tokenID", tokenID);
  $: console.log("Home account", account);
  $: console.log("Home signer", signer);

  $: signer && handleSigner();
  const handleSigner = () => {
    if (init) {
      account ||= signer;
      init = false;
    } else account = signer;
  };

  $: chainId && handleChainId();
  const handleChainId = async () => {
    resetAddress();
    resetTokenID();
    await providerSetFallback(chainId);
  };

  $: address && handleAddress();
  const handleAddress = async () => {
    resetTokenID();
  };

  const resetAddress = () => (address = undefined);
  const resetTokenID = () => (tokenID = undefined);
</script>

<HomeLayout>
  <span slot="nav">
    <Navigation />
  </span>

  <span slot="header">
    <Title />

    {#if signer}
      {#if getCreate(chainId)}
        <Create {chainId} />
      {/if}
    {/if}

    <BreadCrumb bind:chainId bind:address bind:tokenID bind:account />

    <div class="row alignbottom">
      <AccountConnect bind:signer />

      <!-- <NetworkList {chainId} /> -->
      <NetworkListSelect bind:chainId />

      {#if chainId}
        <CollectionSelect {chainId} bind:address {account} />
      {/if}
    </div>
  </span>

  <span slot="content">
    {#if chainId && address}
      {#if tokenID}
        <h2 class="m-b-20 return">
          <i class="fa fa-arrow-left fa-left" />
          <span on:click={resetTokenID} on:keydown={resetTokenID} class="link">Back to collection</span>
        </h2>

        <Nft {chainId} {address} {tokenID} />
      {:else}
        <NftsList {chainId} {address} {account} bind:tokenID />
      {/if}
    {/if}
  </span>
</HomeLayout>

<style>
  div {
    /* DO NOT REMOVE ! */
    visibility: visible;
  }
</style>
