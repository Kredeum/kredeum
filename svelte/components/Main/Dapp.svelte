<script lang="ts">
  import { getCreate, isAddressNotZero, isCollection, isNetwork, tokenIdCount } from "@lib/common/config";

  import Create from "../Global/Create.svelte";
  import Navigation from "../Global/Navigation.svelte";
  import HomeLayout from "../Global/HomeLayout.svelte";
  import Title from "../Global/Title.svelte";
  import ButtonOwner from "../Global/ButtonOwner.svelte";
  import ButtonRefresh from "../Global/ButtonRefresh.svelte";
  import AccountConnect from "../Account/AccountConnect.svelte";
  import NetworkSelect from "../Network/NetworkSelect.svelte";
  import CollectionSelect from "../Collection/CollectionSelect.svelte";
  import Nfts from "../Nfts/Nfts.svelte";
  import Nft from "../Nft/Nft.svelte";
  // import BreadCrumb from "../Global/BreadCrumb.svelte";
  // import Networks from "../Network/Networks.svelte";

  import { providerSetFallback } from "@lib/common/provider-get";
  import { onMount, setContext } from "svelte";
  import { refPage2UrlHash, refPageFromUrlHash } from "@helpers/refPage";
  import { RefPageType } from "@lib/common/types";

  import { metamaskInit, metamaskSwitchChain } from "@helpers/metamask";
  import { metamaskChainId, metamaskSignerAddress } from "@main/metamask";
  import { constants } from "ethers";
  import { writable, Writable } from "svelte/store";

  ////////////////////////////////////////////////////////////////////
  // <Dapp />
  ////////////////////////////////////////////////////////////////////
  let chainId: number;
  let address: string;
  let tokenID: string;
  let account: string;
  let owner: string;
  let signer: string;

  let initalized = false;
  let refreshingCollections = false;
  let refreshingNfts = false;
  let refreshAll: Writable<number> = writable(1);
  setContext("refreshAll", refreshAll);

  $: refresh = refreshingCollections || refreshingNfts;

  // SET chainId on memataskChainId change
  $: $metamaskChainId && handleMetamaskChainId();
  const handleMetamaskChainId = () => {
    if (initalized) chainId = $metamaskChainId;
  };

  // SET nework on chainId change
  $: chainId && handleChainId();
  const handleChainId = async () => {
    // console.log("<Dapp handleChainId", initalized, chainId, $metamaskChainId);

    if (initalized) {
      setNetwork();
      resetAddress();
    }
  };
  const setNetwork = async () => {
    if (chainId != $metamaskChainId) {
      await metamaskSwitchChain(chainId);
      await providerSetFallback(chainId);
    }
  };

  // RESET tokenID on collection change
  $: isAddressNotZero(address) && handleAddress();
  const handleAddress = async () => {
    // console.log("<Dapp handleAddress", initalized, address);

    if (initalized) resetTokenID();
  };
  // SET account on signer change
  $: isAddressNotZero(signer) && handleSigner();
  const handleSigner = async () => {
    // console.log("<Dapp handleSigner", initalized, signer);

    if (initalized) account = signer;
  };

  // SET URL HASH on chainId, address or account change
  $: handleRefChange({ chainId, address, tokenID });
  const handleRefChange = (ref) => initalized && (window.location.hash = refPage2UrlHash(ref));

  const resetAddress = () => {
    address = null;
    resetTokenID();
    // console.log("<Dapp resetAddress", owner);
  };
  const resetTokenID = () => {
    owner = account;
    tokenID = "";
    // console.log("<Dapp resetTokenID");
  };

  onMount(async () => {
    // GET optionnal params from URL HASH
    const _refHash = refPageFromUrlHash(window.location.hash);
    // console.log("<Dapp get _refHash", _refHash);

    // init Metamask
    await metamaskInit();

    chainId = _refHash.chainId || $metamaskChainId || 1;
    address = _refHash.address;
    tokenID = _refHash.tokenID || "";
    account = isAddressNotZero(_refHash.account) ? _refHash.account : $metamaskSignerAddress || constants.AddressZero;

    // SET network
    await setNetwork();

    // INITIALIZATION end
    initalized = true;

    // console.log("<Dapp initialized", { chainId, address, tokenID, account, $metamaskSignerAddress, $metamaskChainId });
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

    <!-- <BreadCrumb {chainId} {address} {tokenID} {account} {signer} display={true} /> -->

    <div class="row alignbottom">
      <div class="col col-xs-12 col-sm-3 kre-copy-ref-container">
        <AccountConnect bind:signer />
      </div>

      <!-- <Networks {chainId} /> -->
      <div class="col col-xs-12 col-sm-3 kre-copy-ref-container">
        <NetworkSelect bind:chainId />
      </div>

      <div class="col col-xs-12 col-sm-3 kre-copy-ref-container">
        <CollectionSelect {chainId} bind:address {account} bind:refreshing={refreshingCollections} />
      </div>

      <div class="col col-sm-3">
        {#if isAddressNotZero(account)}
          <ButtonOwner {account} bind:owner />
        {/if}
        <ButtonRefresh {refresh} />
      </div>
    </div>
  </span>

  <span slot="content">
    {#if isCollection({ chainId, address })}
      {#if tokenIdCount(tokenID) == 1}
        <h2 class="m-b-20 return">
          <i class="fa fa-arrow-left fa-left" />
          <span on:click={resetTokenID} on:keydown={resetTokenID} class="link">Back to collection</span>
        </h2>
        <Nft {chainId} {address} {tokenID} {owner} details={true} mode="detail" />
      {:else}
        <Nfts {chainId} {address} {owner} bind:tokenID bind:refreshing={refreshingNfts} mode="grid6" />
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
