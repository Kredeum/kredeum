<script lang="ts">
  import { getNftsFactory, getCreate } from "lib/kconfig";

  import AccountConnect from "../Account/AccountConnect.svelte";
  import Network from "../Network/Network.svelte";
  import NetworkList from "../Network/NetworkList.svelte";
  import CollectionList from "../Collection/CollectionList.svelte";

  import { metamaskSwitchChain } from "helpers/metamask";
  import { metamaskChainId } from "main/metamask";

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

  let address: string;
  let account: string;
  let refreshing: boolean;
  let refresh: number;

  let tokenID: string;

  $: $metamaskChainId && handleNetwork();
  const handleNetwork = async () => {
    if ($metamaskChainId !== 137) {
      alert("Switch to Polygon / Matic");
      await metamaskSwitchChain(137);
    }
  };
</script>

<HomeLayout>
  <span slot="nav">
    <Navigation />
  </span>

  <span slot="header">
    <Title />

    <div class="row alignbottom">
      <AccountConnect bind:account />

      {#if account}
        <div class="col col-xs-12 col-sm-3">
          <span class="label">Network</span>
          <div class="select"><Network chainId={$metamaskChainId} /></div>
        </div>

        <NftMintAma chainId={$metamaskChainId} />
      {/if}
    </div>
  </span>
</HomeLayout>

<style>
  div {
    /* DO NOT REMOVE ! */
    visibility: visible;
  }
</style>
