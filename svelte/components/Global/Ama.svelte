<script lang="ts">
  import { getNftsFactory, getCreate } from "lib/kconfig";

  import AccountConnect from "../Account/AccountConnect.svelte";
  import NetworkList from "../Network/NetworkList.svelte";
  import CollectionList from "../Collection/CollectionList.svelte";

  import Create from "../Global/Create.svelte";
  import Navigation from "../Global/Navigation.svelte";

  import NftsListRefresh from "../NftsList/NftsListRefresh.svelte";

  import Title from "../Global/Title.svelte";
  // import BreadCrumb from "../../tests/BreadCrumb.svelte";
  import HomeLayout from "../Global/HomeLayout.svelte";

  import Content from "./Content.svelte";

  import NftMintAma from "../Nft/NftMintAma.svelte";
  import Nft from "../Nft/Nft.svelte";

  // import { metamaskProvider } from "main/metamask";

  export let platform: string = "dapp";

  let chainId: number = 42;
  let address: string;
  let account: string;
  let refreshing: boolean;
  let refresh: number;

  let tokenID: string;
</script>

<HomeLayout>
  <span slot="nav">
    <Navigation />
  </span>

  <span slot="header">
    <Title />

    <!-- <BreadCrumb display={true} /> -->

    <div class="row alignbottom">
      <!-- View account -->
      <AccountConnect bind:account />

      <!-- Select network -->
      <!-- <NetworkList bind:chainId /> -->

      <!-- Select collection -->
      <!-- {#if chainId && account}
          <CollectionList {chainId} {account} bind:address />
  
          {#if account && address && getNftsFactory(chainId)} -->
      <!-- Refresh button -->
      <!-- <NftsListRefresh {refreshing} bind:refresh />
          {/if}
        {/if} -->
    </div>
  </span>

  <span slot="content">
    {#if account && getCreate(chainId)}
      <a href="#create-nft" class="btn btn-default" title="Mint NFT">Mint NFT</a>

      <!-- SubModal create NFT -->
      <div id="create-nft" class="modal-window">
        <NftMintAma {chainId} />
      </div>
    {/if}

    <Nft {chainId} {address} {tokenID} {account} {platform} />

    {#if chainId && account && address}
      <!-- <Content {chainId} {address} {account} {platform} bind:refreshing {refresh} /> -->
    {/if}
  </span>
</HomeLayout>

<style>
  div {
    /* DO NOT REMOVE ! */
    visibility: visible;
  }
</style>
