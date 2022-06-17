<script lang="ts">
  import { getNftsFactory, explorerNFTsFactoryUrl, getChainName, getNetwork } from "lib/kconfig";

  import HomeLayout from "../Global/HomeLayout.svelte";
  import Navigation from "../Global/Navigation.svelte";
  import Title from "../Global/Title.svelte";
  import AccountConnect from "../Account/AccountConnectAma.svelte";
  import NftMintAma from "../Nft/NftMintAma.svelte";
  import NftAma from "../Nft/NftAma.svelte";

  import type { NftType } from "lib/ktypes";
  import type { Readable } from "svelte/store";
  import { metamaskChainId, metamaskProvider, metamaskSigner, metamaskAccount } from "main/metamask";
  import { nftStore } from "stores/nft/nft";

  import type { OpenBound as OpenBoundType } from "types/OpenBound";
  import openBoundAbi from "abis/OpenBound.json";
  import { ethers } from "ethers";

  import { metamaskSwitchChain } from "helpers/metamask";

  const prod = process.env.ENVIR === "PROD";
  const mintChainId = prod ? 137 : 137;
  // const mintChainId = prod ? 137 : 31337;
  const claimChainId = prod ? 10 : 42;

  let account: string;
  let tokenID: string = "";

  let address = ""; /*"0x7ddAd63aFfb4003bbE797747090315d725467473"*/
  let tokenIdClaimed: string;

  // let nftMinted: Readable<NftType>;
  // let nftClaimed: Readable<NftType>;

  $: account && $metamaskProvider && $metamaskChainId && handleMintOrClaim();
  const handleMintOrClaim = async () => {
    ////////////////////////////////////////////////////////////////////
    // TODO detect if user have a POAP on mintChain
    // if yes, get MintedTokenID && tokenID = MintedTokenID
    //
    ////////////////////////////////////////////////////////////////////
    if (!tokenID) {
      const openBoundAddress = getNetwork(mintChainId).openBoundAma;

      address = openBoundAddress;

      const openBound = new ethers.Contract(
        openBoundAddress,
        openBoundAbi,
        $metamaskSigner
      ) as unknown as OpenBoundType;

      if (Number(await openBound.balanceOf($metamaskAccount)) > 0) {
        tokenID = String(await openBound.tokenOfOwnerByIndex($metamaskAccount, 0));
      }
    }
    // nftMinted = nftStore.getOneStore($metamaskChainId, address, "");
    // await nftStore.refreshOne($metamaskChainId, address, "9").catch(console.error);
    // tokenID = $nftMinted?.tokenID || "";
    // console.log("🚀 ~ file: Ama.svelte ~ line 40 ~ handleMintOrClaim ~ tokenID", $nftMinted);

    ////////////////////////////////////////////////////////////////////
    // TODO detect if user have a POAP on claimChain
    // if yes, get ClaimedTokenID && tokenIDClaimed = ClaimedTokenID
    //
    ////////////////////////////////////////////////////////////////////
    if (tokenID) {
      // metamaskSwitchChain(claimChainId);

      const openBoundAddressClaim = getNetwork(claimChainId).openBoundAma;

      const openBoundClaim = new ethers.Contract(
        openBoundAddressClaim,
        openBoundAbi,
        $metamaskSigner
      ) as unknown as OpenBoundType;

      if (Number(await openBoundClaim.balanceOf(account)) > 0) {
        tokenIdClaimed = String(await openBoundClaim.tokenOfOwnerByIndex(account, 0));
      }
    }

    // if (tokenIdClaimed) {
    //   metamaskSwitchChain(mintChainId);
    // }

    // nftClaimed = nftStore.getOneStore($metamaskChainId, address, "");
    // await nftStore.refreshOne($metamaskChainId, address, "1").catch(console.error);
    // tokenIdClaimed = $nftClaimed?.tokenID || "";
  };

  $: console.log("🚀 ~ file: Ama.svelte ~ line 86 tokenIdClaimed", tokenIdClaimed);
</script>

<HomeLayout>
  <span slot="nav">
    <Navigation />
  </span>

  <span slot="header">
    <div class="ama-title">
      <h1 title="Kredeum NFTs Factory">My NFTs Factory</h1>
      <h2>AMA 06/15/22</h2>
    </div>
  </span>
  <span slot="content">
    <div class="ama">
      <div class="card-krd ama-krd">
        <div class="ama-header">
          <h3>Mint your AMA 06/15/22's POAP</h3>
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
                <span class={$metamaskChainId === mintChainId ? "ama-matic" : "ama-optimism"} />
                {$metamaskChainId === mintChainId ? "Polygon / Matic" : "Optimism"}
              </div>
            </div>
          {/if}
        </div>
        {#if tokenID && address}
          <NftAma chainId={$metamaskChainId} {address} {tokenID} {account} {claimChainId} {tokenIdClaimed} />
        {/if}
        {#if account}
          <div class="mint-button-ama">
            {#if !tokenID}
              <NftMintAma chainId={mintChainId} bind:tokenID type="mint" />
            {:else if !tokenIdClaimed}
              <NftMintAma chainId={claimChainId} {tokenID} type="claim" />
            {:else}
              <span class="label label-big">
                <i class="fas fa-exclamation" />
                Your POAP has been Claimed right on {getChainName(claimChainId)}
                <i class="fas fa-exclamation" /></span
              >
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </span>
</HomeLayout>

<style>
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

  .ama-optimism {
    display: block;
    width: 3rem;
    height: 3rem;
    background: url("../../../gulp/images/icon-optimism.png");
    background-size: contain;
    background-repeat: no-repeat;
    margin-right: 10px;
  }

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
