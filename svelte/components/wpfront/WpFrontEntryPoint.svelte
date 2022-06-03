<script lang="ts">
  import type { NftType } from "lib/ktypes";
  // import type { Collection as CollectionType } from "lib/ktypes";
  import { factoryGetAddress } from "lib/kfactory-get";
  import { getCreate } from "lib/kconfig";

  // import Demo from "../swarm/Demo.svelte";

  import { onMount } from "svelte";
  // import {
  //   wpMetamaskInit,
  //   wpMetamaskConnect,
  //   wpMetamaskSwitchChain,
  //   metamaskConnectMessage,
  //   metamaskInstallMessage
  // } from "helpers/metamaskWpHelper";
  // import { metamaskAccount } from "main/metamaskWp";

  // import AccountConnect from "../Account/AccountConnect.svelte";
  // import NetworkList from "../Network/NetworkList.svelte";

  // import Create from "../Global/Create.svelte";
  // import Navigation from "./Global/Navigation.svelte";

  // import Nft from "../Nft/Nft.svelte";

  // import NftsListGet from "./NftsList/NftsListGet.svelte";
  // import NftsListRefresh from "./NftsList/NftsListRefresh.svelte";

  // import Title from "./Global/Title.svelte";
  // // import BreadCrumb from "./Global/BreadCrumb.svelte";
  import ShortcodeLayout from "./views/ShortcodeLayout.svelte";

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // import { nftGet, nftGetFromContract } from "lib/knft-get";
  // import { nftGetMetadata } from "lib/knft-get-metadata";
  // import { collectionGet } from "lib/kcollection-get";
  // // import NftDetail from "./NftDetail.svelte";
  // import { metamaskProvider } from "main/metamask";

  // import { metamaskSigner } from "main/metamask";

  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  // import { nfts, isLoading, error, isAddingNft, errorAddingNft } from "./store/nftStore";
  // import { fetchNfts } from "./store/nftService";
  // import { Writable } from "svelte/store";

  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  // import { Bee } from "swarm/@ethersphere/bee-js";

  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  export let props: Record<string, string>;

  // let platform: string = "wordpress";

  let chainId: number = Number(props.chainId);
  let collection: string = props.collection;
  // let tokenID: string = props.tokenID;
  let account: string = props.account;
  // let refreshing: boolean;
  // let refresh: number;

  // let nft: Nft;
  let nft: NftType;

  // $: nft = $nfts;
  ////////////////////////////////////////////////////////////////////////////////////////////////
  // nfts.subscribe((value) => {
  //   nft = value ? value : null;
  // });

  // $: console.log("NFT from store", nft);

  // $: displayError = JSON.stringify($error);

  // $: fetchNfts(chainId, collection, tokenID, $metamaskProvider).catch(console.error);

  ///////////////////////////////////////////////////////////////////////////////////////////////

  // const bee = new Bee("http://localhost:1633");

  // $: wpNftGet(chainId, collection, tokenID, $metamaskProvider);

  // const _nftSet = async (_nft: Nft): Promise<void> => {
  //   nft = _nft;
  //   console.log("🚀 ~ file: WpFrontEntryPoint.svelte ~ line 60 ~ nft", nft);
  // };

  // const wpNftGet = async (
  //   _chainId: number,
  //   _collection: string,
  //   _tokenID: string,
  //   _metamaskProvider
  // ): Promise<void> => {
  //   if (_metamaskProvider) {
  //     _nftSet(
  //       await nftGetMetadata(
  //         await nftGetFromContract(
  //           chainId,
  //           await collectionGet(_chainId, _collection, _metamaskProvider),
  //           tokenID,
  //           _metamaskProvider
  //         )
  //       )
  //     );
  //   }
  // };

  onMount(async () => {
    // const result = await bee.uploadData(
    //   "a2fae7a4314c63436d2a575296afe35496bdaa12141c2b73e068c2d175c6ad7c",
    //   "Bee is awesome!"
    // );
    // console.log("data upload reference", result.reference);
    // const retrievedData = await bee.downloadData(result.reference);
    // console.log("I really hope that", retrievedData.text()); // prints 'Bee is awesome!'
    // fetchNfts(chainId, collection, tokenID, $metamaskProvider);
    // await wpMetamaskInit();
    // wpMetamaskConnect();
    // wpMetamaskSwitchChain(chainId);
  });
</script>

<ShortcodeLayout>
  <span slot="nav">
    <!-- <Navigation /> -->
  </span>

  <span slot="header">
    <!-- <Title /> -->

    {#if account && getCreate(chainId)}
      <!-- <Create {chainId} /> -->
    {/if}

    <!-- <BreadCrumb display={true} /> -->

    <div class="row alignbottom">
      <!-- View account -->
      <!-- <AccountConnect bind:account /> -->

      <!-- Select network -->
      <!-- <NetworkList bind:chainId /> -->

      <!-- Select collection -->
      {#if chainId && account}
        <!-- <CollectionListGet {chainId} {account} bind:collection /> -->

        {#if account && collection && factoryGetAddress(chainId)}
          <!-- Refresh button -->
          <!-- <NftsListRefresh {refreshing} bind:refresh /> -->
        {/if}
      {/if}
    </div>
  </span>

  <span slot="content">
    <!-- NFTs list -->
    <!-- <NftDetail collection={collectionObject} {tokenID} /> -->

    <!-- <Demo name={"swarm"} /> -->

    {#if chainId && account && collection}
      {#if nft}
        <!-- <NftGet {chainId} {collection} {tokenID} /> -->
        <!-- <Nft chainId={nft.chainId} address={nft.address} tokenID={nft.tokenID} account={nft.account} {platform} /> -->
      {:else}
        <!-- <NftsList {chainId} {collection} {account} bind:refreshing bind:nftsList {platform} /> -->
        <!-- <NftsListGet {chainId} {collection} {account} bind:refreshing {refresh} /> -->
      {/if}
    {/if}
  </span>
</ShortcodeLayout>

<style>
  div {
    /* DO NOT REMOVE ! */
    visibility: visible;
  }
</style>
