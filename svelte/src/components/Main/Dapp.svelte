<script lang="ts">
  import { onMount, setContext } from "svelte";
  import { writable, type Writable } from "svelte/store";

  import { ADDRESS_ZERO, isAddressNotZero, isCollection, tokenIdCount } from "@kredeum/common/src/common/config";
  import { providerSetFallback } from "@kredeum/common/src/common/provider-get";
  import { type RefPageType } from "@kredeum/common/src/common/types";

  import AccountConnect from "../Account/AccountConnect.svelte";
  import CollectionSelect from "../Collection/CollectionSelect.svelte";
  import ButtonAll from "../Global/ButtonAll.svelte";
  import ButtonRefresh from "../Global/ButtonRefresh.svelte";
  import Create from "../Global/Create.svelte";
  import HomeLayout from "../Global/HomeLayout.svelte";
  import Navigation from "../Global/Navigation.svelte";
  import Title from "../Global/Title.svelte";
  import NetworkSelect from "../Network/NetworkSelect.svelte";
  import Nft from "../Nft/Nft.svelte";
  import Nfts from "../Nfts/Nfts.svelte";

  import { refPage2UrlHash, refPageFromUrlHash } from "../../helpers/refPage";
  import { metamaskInit, metamaskSwitchChain } from "../../helpers/metamask";
  import { metamaskChainId, metamaskSignerAddress } from "../../stores/metamask";

  ////////////////////////////////////////////////////////////////////
  // <Dapp />
  ////////////////////////////////////////////////////////////////////
  let chainId: number = 1;
  let address: string;
  let tokenID: string;
  let account: string;
  let action: string;

  let all = false;
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
    chainId = $metamaskChainId;
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
  // SET account on $metamaskSignerAddress change
  $: isAddressNotZero($metamaskSignerAddress) && handleSigner();
  const handleSigner = async () => {
    // console.log("<Dapp handleSigner", initalized, $metamaskSignerAddress);

    account = $metamaskSignerAddress;

    console.info("<Dapp handleSigner acount:", account, $metamaskSignerAddress);
  };

  // SET URL HASH on chainId, address or account change
  $: handleRefChange({ chainId, address, tokenID });
  const handleRefChange = (ref: RefPageType) => initalized && (window.location.hash = refPage2UrlHash(ref));

  const resetAddress = () => {
    address = ADDRESS_ZERO;
    resetTokenID();
  };
  const resetTokenID = () => {
    tokenID = "";
  };

  onMount(async () => {
    // GET optionnal params from URL HASH
    const _refHash = refPageFromUrlHash(window.location.hash);
    // console.log("<Dapp get _refHash", JSON.stringify(_refHash));

    // init Metamask
    await metamaskInit();

    if (_refHash.chainId !== undefined) chainId = _refHash.chainId;
    if (_refHash.address !== undefined) address = _refHash.address;
    if (_refHash.tokenID !== undefined) tokenID = _refHash.tokenID;
    if (_refHash.account !== undefined) account = _refHash.account;
    if (_refHash.action !== undefined) action = _refHash.action;
    if (action === "view-all") all = true;
    console.info("<Dapp onMount account:", account, _refHash.account, all);

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

    <Create {chainId} />

    <div class="row alignbottom">
      <div class="col col-xs-12 col-sm-3 kre-copy-ref-container">
        <AccountConnect />
      </div>

      <!-- <Networks {chainId} /> -->
      <div class="col col-xs-12 col-sm-3 kre-copy-ref-container">
        <NetworkSelect bind:chainId label={true} />
      </div>

      <div class="col col-xs-12 col-sm-3 kre-copy-ref-container">
        <CollectionSelect {chainId} bind:address {account} bind:refreshing={refreshingCollections} />
      </div>

      <div class="col col-sm-3">
        <ButtonRefresh {refresh} />
        {#if account && !(tokenIdCount(tokenID) == 1)}
          <ButtonAll bind:all />
        {/if}
      </div>
    </div>
  </span>

  <span slot="content">
    {#if isCollection({ chainId, address })}
      {#if tokenIdCount(tokenID) == 1}
        <h2 class="m-b-20 return">
          <i class="fa fa-arrow-left fa-left" />
          <span role="button" tabindex="0" on:click={resetTokenID} on:keydown={resetTokenID} class="link">
            Back to collection
          </span>
        </h2>
        <Nft {chainId} {address} {tokenID} owner={account} details={true} mode="detail" />
      {:else}
        <Nfts
          {chainId}
          {address}
          owner={all ? undefined : account}
          bind:tokenID
          bind:refreshing={refreshingNfts}
          mode="grid6"
        />
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
