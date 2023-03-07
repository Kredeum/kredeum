<script lang="ts">
  import { getCreate, isAddressNotZero, isNetwork, tokenIdCount } from "@lib/common/config";

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
  import { refPage2UrlHash, refPageFromUrlHash, RefPageType } from "@helpers/refPage";
  import { metamaskInit, metamaskSwitchChain } from "@helpers/metamask";
  import { metamaskChainId, metamaskSignerAddress } from "@main/metamask";
  import { constants } from "ethers";

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

  const collectionDefined = (refHash: RefPageType) => isNetwork(refHash.chainId) && isAddressNotZero(refHash.address);

  // SET chainId on memataskChainId change
  $: $metamaskChainId && handleMetamaskChainId();
  const handleMetamaskChainId = () => {
    if (initalized) chainId = $metamaskChainId;
  };

  // SET nework on chainId change
  $: chainId && handleChainId();
  const handleChainId = async () => {
    console.log("<Dapp handleChainId", initalized, chainId, $metamaskChainId);

    if (initalized) {
      if (chainId != $metamaskChainId) setNetwork();
      resetAddress();
      resetTokenID();
    }
  };
  const setNetwork = async () => {
    await metamaskSwitchChain(chainId);
    await providerSetFallback(chainId);
  };

  // RESET tokenID on collection change
  $: isAddressNotZero(address) && handleAddress();
  const handleAddress = async () => {
    console.log("<Dapp handleAddress", initalized, address);

    if (initalized) resetTokenID();
  };
  // SET account on signer change
  $: isAddressNotZero(signer) && handleSigner();
  const handleSigner = async () => {
    console.log("<Dapp handleSigner", initalized, signer);

    if (initalized) account = signer;
  };

  // SET URL HASH on chainId, address or account change
  // $: handleRefChange({ chainId, address, tokenID });
  // const handleRefChange = (ref) => initalized && (window.location.hash = refPage2UrlHash(ref));

  // $: window.location.hash = refPage2UrlHash({ chainId, address, tokenID });

  const resetAddress = () => (address = undefined);
  const resetTokenID = () => (tokenID = "");

  onMount(async () => {
    // GET optionnal params from URL HASH
    const _refHash = refPageFromUrlHash(window.location.hash);
    console.log("<Dapp get _refHash", _refHash);

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

    console.info("<Dapp initialized", { chainId, address, tokenID, account, $metamaskSignerAddress, $metamaskChainId });
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

    <BreadCrumb {chainId} {address} {tokenID} {account} {signer} />

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
    {#if collectionDefined({ chainId, address })}
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
