<script lang="ts">
  import type { NftType } from "lib/ktypes";

  import { getNftsFactory, explorerNFTsFactoryUrl, getChainName, getNetwork } from "lib/kconfig";
  import { metamaskChainId, metamaskProvider, metamaskSigner, metamaskAccount } from "main/metamask";

  import HomeLayout from "../Global/HomeLayout.svelte";
  import Navigation from "../Global/Navigation.svelte";
  import Title from "../Global/Title.svelte";
  import AccountConnect from "../Account/AccountConnectAma.svelte";
  import NftMintAma from "../Nft/NftMintAma.svelte";

  import AmaDisplay from "./AmaDisplay.svelte";

  import { metamaskInit, metamaskConnect } from "helpers/metamask";
  import { onMount } from "svelte";

  const prod = process.env.ENVIR === "PROD";
  const mintChainId = prod ? 137 : 137;
  // const mintChainId = prod ? 137 : 80001;
  // const mintChainId = prod ? 137 : 31337;
  // const claimChainId = prod ? 10 : 42;

  let account: string;
  let tokenID: string = "";

  let nftMinted: NftType;
  let nftClaimed: NftType;
  // let nfts: Map<string, NftType> = new Map();

  let refresh: boolean = false;
  let isClaimed: boolean = false;

  // onMount(async () => {
  //   await metamaskInit();
  //   metamaskConnect();
  //   account = $metamaskAccount;
  // });

  $: refresh, isClaimed, account && $metamaskProvider && $metamaskChainId && nftAmaGetLocalStorage();
  const nftAmaGetLocalStorage = async (): Promise<void> => {
    // await metamaskInit();
    // metamaskConnect();
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);

      if (key?.startsWith("nft://")) {
        // nfts.set(key, JSON.parse(localStorage.getItem(key)) as NftType);

        if (key?.startsWith(`nft://${mintChainId}`)) {
          nftMinted = JSON.parse(localStorage.getItem(key)) as NftType;
          tokenID = nftMinted.tokenID;
        } else if (key?.startsWith(`nft://`)) {
          nftClaimed = JSON.parse(localStorage.getItem(key)) as NftType;
          isClaimed = true;
        }
      }
    }
  };

  $: console.log("🚀 ~ file: Ama.svelte ~ line 23 ~ tokenID", tokenID);
</script>

<HomeLayout>
  <span slot="nav">
    <Navigation />
  </span>

  <span slot="header">
    {#if !tokenID}
      <div class="ama-title">
        <h1 title="Kredeum NFTs Factory">My NFTs Factory</h1>
        <h2>Mint it right !</h2>
      </div>
    {:else}
      <h1 title="Kredeum NFTs Factory">Kredeum - AMA 22/06/22</h1>
      <div class="row">
        <div class="col col-xs-12 col-sm-6 col-md-2">
          <AccountConnect bind:account />
        </div>
      </div>
    {/if}
  </span>

  <span slot="content">
    {#if !tokenID}
      <div class="ama">
        <div class="card-krd ama-krd">
          <div class="ama-header">
            <h3>Mint your <span class="ama-green">AMA 06/22/22</span>'s POAP</h3>
          </div>
          <div class="ama-connect row">
            <div class="col col-xs-12 col-sm-6 col-md-4 ama-display-account">
              <AccountConnect bind:account />
            </div>

            {#if account}
              <div class="col col-xs-12 col-sm-6 col-md-3 ama-display-network">
                <span class="label"
                  >Network
                  <a
                    class="info-button"
                    href={explorerNFTsFactoryUrl($metamaskChainId)}
                    target="_blank"
                    title="&#009; NFTs Factory address (click to view in explorer )
        {getNftsFactory($metamaskChainId)}"><i class="fas fa-info-circle" /></a
                  >
                </span>
                <div class="ama-network-display">
                  <!-- <span class={$metamaskChainId === mintChainId ? "ama-matic" : "ama-optimism"} />
                  {$metamaskChainId === mintChainId ? "Polygon / Matic" : "Optimism"} -->
                  <span class="ama-matic" />
                  Polygon / Matic
                </div>
              </div>
            {/if}
          </div>
          {#if account}
            <div class="mint-button-ama">
              <NftMintAma chainId={mintChainId} bind:tokenID type="mint" />
            </div>
          {/if}
        </div>
      </div>
    {:else}
      <AmaDisplay {tokenID} {nftMinted} {nftClaimed} bind:refresh bind:isClaimed />
    {/if}
  </span>
</HomeLayout>

<style>
  .ama-green {
    color: #3acf6e;
  }

  .ama-title {
    text-align: center;
    margin-bottom: 80px;
  }

  .ama-title h1 {
    font-size: 30px;
    margin-bottom: 10px;
  }

  .ama-title h2 {
    color: #3acf6e;
    font-size: 25px;
    margin-top: 5px;
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
    width: 50vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* background-color: lightgrey; */
    padding-top: 200px;
    overflow: hidden;
    border-radius: 23px;
  }

  @media screen and (max-width: 767px) {
    .ama-krd {
      width: 80vw;
    }
  }

  @media screen and (max-width: 992px) {
    .ama-krd {
      width: 80vw;
    }

    .ama-display-account {
      margin-bottom: 10px;
    }
  }

  @media screen and (min-width: 1306px) and (max-width: 1848px) {
    .ama-display-network {
      width: 36%;
    }
  }

  @media screen and (min-width: 992px) and (max-width: 1305px) {
    .ama-display-network {
      width: 50%;
    }
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
    background: url("../../../gulp/images/ama-header.png");
    background-size: cover;
    background-repeat: no-repeat;
    color: white;
    padding: 1.5rem 1.5rem;
  }

  .ama-header h3 {
    margin: 0;
    font-size: 30px;
  }

  .ama-connect {
    display: flex;
    width: 100%;
    justify-content: center;
    padding: 6rem 0 5rem 0;
  }

  :global(.ama-connect > div > div.col-sm-3) {
    width: 100%;
  }

  .ama-network-display {
    display: flex;
    align-items: center;
    height: 50px;
    background-color: #f0f4fb;
    border-radius: 360px;
    padding: 5px 15px;
  }

  .ama-matic {
    display: block;
    width: 3rem;
    height: 3rem;
    background: url("../../../gulp/images/icon-matic.png");
    background-size: contain;
    background-repeat: no-repeat;
    margin-right: 10px;
  }

  /* .ama-optimism {
    display: block;
    width: 3rem;
    height: 3rem;
    background: url("../../../gulp/images/icon-optimism.png");
    background-size: contain;
    background-repeat: no-repeat;
    margin-right: 10px;
  } */

  :global(.form-field > input[type="text"]) {
    /* width: 100%; */
    border: 0;
    outline: 0;
    font-size: 15px;
    padding-left: 25px;
    background-color: #f0f4fb;
    color: #1e1e43;
    border-radius: 360px;
    height: 50px;
  }

  .mint-button-ama {
    padding: 3rem;
  }

  :global(.mint-button-ama .btn) {
    font-weight: bold;
  }
</style>
