<script lang="ts">
  import type { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";
  import { onMount } from "svelte";

  import type { NftType } from "lib/ktypes";
  import { nftGetMetadata } from "lib/knft-get-metadata";

  import { metamaskSwitchChain } from "helpers/metamask";
  import { metamaskChainId, metamaskAccount, metamaskSigner } from "main/metamask";
  import ama from "config/ama.json";
  import { getChainName, getNetwork, getExplorer } from "lib/kconfig";
  import { ethers, BigNumber } from "ethers";
  import { cidToInt } from "lib/kcid";
  import type { OpenBound as OpenBoundType } from "types/OpenBound";
  import openBoundAbi from "abis/OpenBound.json";

  import { fade } from "svelte/transition";
  import { clickOutside } from "helpers/clickOutside";

  /////////////////////////////////////////////////
  //  <NftMint {chainId} />
  // Mint NFT or Claim
  /////////////////////////////////////////////////
  export let chainId: number;
  export let type: string;
  export let tokenID: string;
  /////////////////////////////////////////////////

  let openBound: OpenBoundType;
  let openBoundAddress: string;

  let processing: boolean = false;

  $: chainName = getChainName(chainId);
  $: label = `${type === "mint" ? "Mint" : "Claim"} on ${chainName}`;

  let open: boolean = false;

  const openAmaModal = () => {
    open = true;
  };

  // $: $metamaskChainId && handleNetwork();
  const handleNetwork = async () => {
    let tokenIdFound = "";

    if (chainId === $metamaskChainId) {
      console.log(`handleNetwork ${chainId} ${type}`);
      openBoundAddress = getNetwork(chainId).openBoundAma;
      console.log("handleNetwork ~ openBoundAddress", openBoundAddress);

      openBound = new ethers.Contract(openBoundAddress, openBoundAbi, $metamaskSigner) as unknown as OpenBoundType;

      if (Number(await openBound.balanceOf($metamaskAccount)) > 0) {
        tokenIdFound = String(await openBound.tokenOfOwnerByIndex($metamaskAccount, 0));
        alert(`NFT already exists on ${chainName} \n`);
        tokenID ||= tokenIdFound;
      }
    } else {
      alert(`Switch to ${getChainName(chainId)}\n${$metamaskChainId || ""} => ${chainId}`);
      await metamaskSwitchChain(chainId);
    }
    return tokenIdFound;
  };

  const ownerXorTokenID = (owner: string, tokenID: string): string => {
    return String(BigNumber.from(owner).xor(BigNumber.from(tokenID)));
  };

  const mintOrClaim = async (): Promise<NftType> => {
    if (await handleNetwork()) return;

    let tokenIdMintOrclaim = tokenID;

    if (type === "mint") {
      const n = Math.floor(6 * Math.random());
      const cidJson = ama.cidJson[n];
      tokenIdMintOrclaim = ownerXorTokenID($metamaskAccount, cidToInt(cidJson));
    }

    processing = true;
    const mintingTxResp = await openBound.mint(tokenIdMintOrclaim);
    console.log("mintingTxResp", mintingTxResp);
    const linkTx = `${getExplorer(chainId)}/tx/${mintingTxResp?.hash || ""}`;
    console.log(linkTx);

    const mintingTxReceipt = await mintingTxResp.wait();
    processing = false;
    console.log("mintingTxReceipt", mintingTxReceipt);
    alert(`Transaction done`);

    tokenID = tokenIdMintOrclaim;
    open = false;
  };
</script>

<div class="ama-mint-btn">
  <div class="btn btn-default" title="Mint NFT" on:click={() => openAmaModal()}>
    {#if type === "claim"}
      <i class="fas fa-exclamation" />
    {/if}
    {label}
  </div>
</div>

{#if open}
  <div id="create-swarm-nft" class="modal-window" transition:fade>
    <div
      use:clickOutside={() => {
        open = false;
      }}
    >
      <div id="kredeum-create-nft">
        <div class="modal-content">
          <span title="Close" class="modal-close" on:click={() => (open = false)}><i class="fa fa-times" /></span>

          <div class="modal-body">
            <div class="titre">
              <i class="fas fa-plus fa-left c-green" />{type} your POAP on {chainName}
            </div>
            <div class="ama-modal-content">
              <div class="ama-warning">
                <span class="label label-big"
                  >You are about to Mint a NONE TRANSFERABLE && only ONE time mintable POAP. Once it will be minted, it
                  will be attached to your account forever. (V1 of Soul Bound Token)</span
                >
              </div>
              <div class="btn btn-default" title="Mint NFT" on:click={mintOrClaim}>
                {label}
              </div>
              {#if processing}
                <div class="ama-minting">
                  {type}ing Your POAP on {chainName}<i class="fas fa-spinner fa-left c-green refresh" />
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .ama-minting {
    height: 80px;
    padding-top: 50px;
    text-align: center;
    align-items: baseline;
  }

  .ama-minting i {
    margin-left: 10px;
    text-align: center;
  }

  #create-swarm-nft {
    visibility: visible;
    opacity: 1;
    pointer-events: auto;
  }

  .modal-body {
    overflow-y: auto;
  }

  .ama-modal-content {
    width: 100%;
    height: 100%;
    text-align: center;
    padding-top: 10%;
  }

  .ama-warning {
    margin-bottom: 30px;
    width: 100%;
    padding: 0 30px;
  }
</style>
