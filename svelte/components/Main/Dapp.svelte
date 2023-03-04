<script lang="ts">
  import { getCreate, isAddressNotZero, tokenIdCount } from "@lib/common/config";

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
  import { onMount, tick } from "svelte";
  import { refPage2UrlHash, refPageFromUrlHash } from "@helpers/refPage";
  import { metamaskInit, metamaskInstalled } from "@helpers/metamask";

  ////////////////////////////////////////////////////////////////////
  // <Dapp />
  ////////////////////////////////////////////////////////////////////
  let chainId: number;
  let address: string;
  let tokenID: string;
  let account: string;
  let signer: string;

  let initalized = false;

  $: nftCount = tokenIdCount(tokenID);

  $: accountDefined = isAddressNotZero(account);
  $: collectionDefined = chainId > 0 && isAddressNotZero(address);
  let connectionNeeded: boolean;

  // RESET nework on chainId change
  $: chainId && handleChainId();
  const handleChainId = async () => {
    console.log("handleChainId", initalized, chainId);
    if (initalized) {
      resetAddress();
      await providerSetFallback(chainId);
    }
  };
  // RESET tokenID on collection change
  $: isAddressNotZero(address) && handleAddress();
  const handleAddress = async () => {
    console.log("handleAddress", initalized, address);
    if (initalized) {
      resetTokenID();
    }
  };
  // SET account on signer change
  $: isAddressNotZero(signer) && handleSigner();
  const handleSigner = async () => {
    console.log("handleSigner", initalized, signer);
    if (initalized) {
      account = signer;
    }
  };
  // SET URL HASH on chainId, address or account change
  $: handleRefChange({ chainId, address, tokenID, account, signer });
  const handleRefChange = (ref) => {
    if (initalized) {
      console.info("<Dapp set refHash", ref);
      window.location.hash = refPage2UrlHash(ref);
    }
  };

  const resetAddress = () => (address = undefined);
  const resetTokenID = () => (tokenID = isAddressNotZero(account) ? "" : "*");

  onMount(async () => {
    // GET optionnal params from URL HASH
    const refHash = refPageFromUrlHash(window.location.hash);
    ({ chainId, address, tokenID, account } = refHash);
    console.info("<Dapp get refHash", refHash);

    // Process reactivity on 'collectionDefined' and 'accountDefined'
    // Before 'connectionNeeded' assignment
    await tick();

    // NO 'metamask' connection needed when one collection or when account is defined
    connectionNeeded = !(collectionDefined || accountDefined);
    console.log("connectionNeeded", connectionNeeded);

    // SET network to mainnet if not already set
    chainId ||= 1;

    // SET network provider (works without 'metamask')
    providerSetFallback(chainId).catch(console.error);

    // Process reactivity on 'chainId'
    // Before 'initialized' set to true
    await tick();

    // INITIALIZATION ended
    initalized = true;
  });
</script>

<HomeLayout>
  <span slot="nav">
    <Navigation />
  </span>

  <span slot="header">
    {#if connectionNeeded}
      <Title />

      {#if signer}
        {#if getCreate(chainId)}
          <Create {chainId} />
        {/if}
      {/if}

      <BreadCrumb {chainId} {address} {tokenID} {account} {signer} display={true} />

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
    {/if}
  </span>

  <span slot="content">
    {#if collectionDefined}
      {#if nftCount == 1}
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
