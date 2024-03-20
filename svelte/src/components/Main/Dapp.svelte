<script lang="ts">
  import { onMount, setContext } from "svelte";
  import { writable, type Writable } from "svelte/store";

  import { ADDRESS_ZERO, isAddressNotZero, isCollection, tokenIdCount } from "@common/common/config";
  import { providerSetFallback } from "@common/common/provider-get";
  import { type RefPageType } from "@common/common/types";

  import AccountConnect from "../Account/AccountConnect.svelte";
  import CollectionSelect from "../Collection/CollectionSelect.svelte";
  import ButtonOwner from "../Global/ButtonOwner.svelte";
  import ButtonRefresh from "../Global/ButtonRefresh.svelte";
  import Create from "../Global/Create.svelte";
  import HomeLayout from "../Global/HomeLayout.svelte";
  import Navigation from "../Global/Navigation.svelte";
  import Title from "../Global/Title.svelte";
  import NetworkSelect from "../Network/NetworkSelect.svelte";
  import Nft from "../Nft/Nft.svelte";
  import Nfts from "../Nfts/Nfts.svelte";

  import { metamaskInit, metamaskSwitchChain } from "@svelte/helpers/metamask";
  import { refPage2UrlHash, refPageFromUrlHash } from "@svelte/helpers/refPage";
  import { metamaskChainId, metamaskSignerAddress } from "@svelte/stores/metamask";
  import { Address } from "viem";

  ////////////////////////////////////////////////////////////////////
  // <Dapp />
  ////////////////////////////////////////////////////////////////////
  let chainId: number;
  let address: Address;
  let tokenID: string;
  let account: Address;
  let owner: Address;
  let signer: Address;

  let initalized = false;
  let refreshingCollections = false;
  let refreshingNfts = false;
  let refreshAll: Writable<number> = writable(1);
  setContext("refreshAll", refreshAll);

  let toPlayTokenID: Writable<string> = writable("");
  setContext("toPlayTokenID", toPlayTokenID);

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
  const handleRefChange = (ref: RefPageType) => initalized && (window.location.hash = refPage2UrlHash(ref));

  const resetAddress = () => {
    address = ADDRESS_ZERO;
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
    address = _refHash.address || ADDRESS_ZERO;
    tokenID = _refHash.tokenID || "";
    account = (isAddressNotZero(_refHash.account) ? _refHash.account : $metamaskSignerAddress) || ADDRESS_ZERO;

    // SET network
    await setNetwork();

    // INITIALIZATION end
    initalized = true;

    // console.log("<Dapp initialized", { chainId, address, tokenID, account, $metamaskSignerAddress, $metamaskChainId });
  });
</script>

<HomeLayout>
  <span slot="nav">
    <Navigation {chainId} />
  </span>

  <span slot="header">
    <Title />

    <Create {chainId} {signer} />

    <!-- <BreadCrumb {chainId} {address} {tokenID} {account} {signer} display={true} /> -->

    <div class="row alignbottom">
      <div class="col col-xs-12 col-sm-3 kre-copy-ref-container">
        <AccountConnect bind:signer />
      </div>

      <!-- <Networks {chainId} /> -->
      <div class="col col-xs-12 col-sm-3 kre-copy-ref-container">
        <NetworkSelect bind:chainId label={true} />
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
          <span role="button" tabindex="0" on:click={resetTokenID} on:keydown={resetTokenID} class="link"
            >Back to collection</span
          >
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
