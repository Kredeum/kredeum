<script lang="ts">
  import { getCreate } from "@lib/common/config";

  import Create from "../Global/Create.svelte";
  import Navigation from "../Global/Navigation.svelte";
  import HomeLayout from "../Global/HomeLayout.svelte";
  import Title from "../Global/Title.svelte";
  import BreadCrumb from "../Global/BreadCrumb.svelte";

  import AccountConnect from "../Account/AccountConnect.svelte";
  // import Networks from "../Network/Networks.svelte";
  import NetworkSelect from "../Network/NetworkSelect.svelte";
  import CollectionSelect from "../Collection/CollectionSelect.svelte";
  import Nfts from "../Nfts/Nfts.svelte";
  import Nft from "../Nft/Nft.svelte";
  import { providerSetFallback } from "@lib/common/provider-get";
  import { onMount } from "svelte";
  import { initDapp } from "@helpers/initDapp";

  ////////////////////////////////////////////////////////////////////
  // <Dapp />
  ////////////////////////////////////////////////////////////////////
  let chainId: number;
  let address: string;
  let tokenID: string;
  let account: string;
  let signer: string;

  let chainIdFirst = true;
  let addressFirst = true;
  let signerFirst = true;

  $: signer && handleSigner();
  const handleSigner = () => {
    if (signerFirst) signerFirst = false;
    else account = signer;
  };

  $: chainId && handleChainId();
  const handleChainId = async () => {
    if (chainIdFirst) chainIdFirst = false;
    else resetAddress();

    await providerSetFallback(chainId);
  };

  $: address && handleAddress();
  const handleAddress = async () => {
    if (addressFirst) addressFirst = false;
    else resetTokenID();
  };

  const resetAddress = () => (address = undefined);
  const resetTokenID = () => (tokenID = undefined);

  onMount(async () => {
    const data = await initDapp();
    console.log("<Dapp ", data);

    ({ chainId, address, tokenID, account, signer } = data);
  });
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

    <BreadCrumb bind:chainId bind:address bind:tokenID bind:account {signer} display={true} />

    <div class="row alignbottom">
      <div class="col col-xs-12 col-sm-3 kre-copy-ref-container">
        <AccountConnect bind:signer />
      </div>

      <!-- <Networks {chainId} /> -->
      <div class="col col-xs-12 col-sm-3 kre-copy-ref-container">
        <NetworkSelect bind:chainId />
      </div>

      {#if chainId}
        <div class="col col-xs-12 col-sm-3 kre-copy-ref-container">
          <CollectionSelect {chainId} bind:address {account} />
        </div>
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

        <Nft {chainId} {address} {tokenID} {account} />
      {:else}
        <Nfts {chainId} {address} {account} bind:tokenID />
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
