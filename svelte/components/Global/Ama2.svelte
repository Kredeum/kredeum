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
  import Nft from "../Nft/Nft0.svelte";

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
  </span>
  <span slot="content">
    <div class="ama">
      <div class="card-krd ama-krd">
        <div class="ama-header">
          <h1>Kredeum Mint your AMA 06 15 22's POP</h1>
        </div>
        <div class="ama-connect row">
          <AccountConnect bind:account />

          {#if account}
            <div class="col col-xs-12 col-sm-3 col-md-3">
              <span class="label">Network</span>
              <div class="select"><span class="ama-matic" /><Network chainId={$metamaskChainId} /></div>
            </div>
          {/if}
        </div>

        {#if account}
          <div class="mint-button-ama">
            <NftMintAma chainId={$metamaskChainId} />
          </div>
        {/if}
      </div>
    </div>
  </span>
</HomeLayout>

<style>
  div {
    /* DO NOT REMOVE ! */
    visibility: visible;
  }

  .ama {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .ama-krd {
    position: relative;
    width: 55vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* background-color: lightgrey; */
    padding-top: 200px;
    overflow: hidden;
  }

  .ama-header {
    width: 100%;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    background: url("../../../gulp/images/logo-kredeum.svg");
    background-size: 3%;
    background-repeat: repeat;
    padding: 1.5rem 1.5rem;
  }

  .ama-header h1 {
    margin: 0;
  }

  .ama-connect {
    display: flex;
    width: 100%;
    justify-content: center;
    padding: 3rem 0;
  }

  .ama-matic {
    display: block;
    width: 3rem;
    height: 3rem;
    background: url("../../../gulp/images/icon-matic.png");
    background-size: contain;
    background-repeat: no-repeat;
  }

  :global(.form-field > input[type="text"]) {
    /* width: 100%; */
    border: 0;
    outline: 0;
    font-size: 15px;
    padding-left: 25px;
    background: white;
    color: #1e1e43;
    border-radius: 360px;
    height: 50px;
    border: 1px solid gray;
  }
</style>
