<script lang="ts">
  import type { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";
  import { onMount } from "svelte";

  import type { NftType } from "lib/ktypes";
  import { nftGetMetadata } from "lib/knft-get-metadata";

  import { metamaskSwitchChain } from "helpers/metamask";
  import { metamaskChainId, metamaskAccount, metamaskSigner, metamaskProvider } from "main/metamask";
  import ama from "config/ama.json";
  import { getChainName, getNetwork, getExplorer, ipfsGetLink, ipfsToUrlHttp, sleep } from "lib/kconfig";
  import { ethers, BigNumber } from "ethers";
  import { cidToInt } from "lib/kcid";
  import type { OpenBound as OpenBoundType } from "types/OpenBound";
  import openBoundAbi from "abis/OpenBound.json";

  import { fade } from "svelte/transition";
  import { clickOutside } from "helpers/clickOutside";

  /////////////////////////////////////////////////
  //  <NftMint {chainId} />
  // Mint NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let type: string;
  export let tokenID: string;
  export let isClaimed: boolean = false;
  /////////////////////////////////////////////////

  let openBound: OpenBoundType;
  let openBoundAddress: string;

  let mintingImage = "";
  let processing: boolean = false;
  let processEnded: boolean = false;

  $: chainName = getChainName(chainId);
  $: label = `${type === "mint" ? "Mint" : "Claim"} on ${chainName}`;

  let open: boolean = false;

  const openAmaModal = async () => {
    if (chainId !== $metamaskChainId) {
      const messageSwitchTo = `Switch to ${getChainName(chainId)}\n${$metamaskChainId || ""} => ${chainId}`;
      // console.log("isReady ~ messageSwitchTo", messageSwitchTo);
      alert(messageSwitchTo);
      await metamaskSwitchChain(chainId);
    }
    open = true;
  };

  $: $metamaskAccount && handlePoap();
  const handlePoap = (): void => {
    const n = Number(BigNumber.from($metamaskAccount).mod(4));
    const cidImage = ama.cidImage[n];
    mintingImage = ipfsToUrlHttp(ipfsGetLink(cidImage));
  };

  // $: $metamaskChainId && isReady();
  const isReady = async (): Promise<boolean> => {
    console.log(`isReady ${chainId} ${type}`);

    if (chainId === $metamaskChainId) {
      openBoundAddress = getNetwork(chainId).openBoundAma;

      openBound = new ethers.Contract(openBoundAddress, openBoundAbi, $metamaskSigner) as unknown as OpenBoundType;
      if (!openBound) return false;

      const bal = await openBound.balanceOf($metamaskAccount);

      if (Number(bal) > 0) {
        const tokenIdFound = String(await openBound.tokenOfOwnerByIndex($metamaskAccount, 0));
        console.log("isReady ~ tokenIdFound", tokenIdFound);
        alert(`NFT already exists on ${chainName} \n`);
        tokenID ||= tokenIdFound;
        open = false;
        if ("claim" === type) isClaimed = true;
        return false;
      }
    } else {
      const messageSwitchTo = `Switch to ${getChainName(chainId)}\n${$metamaskChainId || ""} => ${chainId}`;
      // console.log("isReady ~ messageSwitchTo", messageSwitchTo);
      alert(messageSwitchTo);
      await metamaskSwitchChain(chainId);
      return false;
    }

    // console.log("isReady OK");
    return true;
  };

  const ownerXorTokenID = (owner: string, tokenID: string): string => {
    return String(BigNumber.from(owner).xor(BigNumber.from(tokenID)));
  };

  const randomTokenID = (): string => {
    const n = Number(BigNumber.from($metamaskAccount).mod(4));
    const cidJson = ama.cidJson[n];
    return ownerXorTokenID($metamaskAccount, cidToInt(cidJson));
  };

  const mintOrClaim = async (): Promise<NftType> => {
    if (!(await isReady())) return;

    let tokenIdMintOrclaim = tokenID || randomTokenID();
    console.log("🚀 ~ file: NftMintAma.svelte ~ line 87 ~ mintOrClaim ~ tokenIdMintOrclaim", tokenIdMintOrclaim);

    processing = true;
    const mintingTxResp = await openBound.mint(tokenIdMintOrclaim);
    console.log("mintingTxResp", mintingTxResp);
    const linkTx = `${getExplorer(chainId)}/tx/${mintingTxResp?.hash || ""}`;
    console.log(linkTx);

    const mintingTxReceipt = await mintingTxResp.wait();
    console.log("mintingTxReceipt", mintingTxReceipt);
    const blockTx = mintingTxReceipt.blockNumber;

    do await sleep(1000);
    while ((await $metamaskProvider.getBlockNumber()) <= blockTx);

    processing = false;
    processEnded = true;
    await sleep(3000);
    // alert(`Transaction done`);
    tokenID = tokenIdMintOrclaim;
    if ("claim" === type) isClaimed = true;
    open = false;
    processEnded = false;
  };
</script>

<div class="ama-mint-btn">
  <div class="btn btn-default {type === 'claim' ? 'btn-claim' : ''}" title="Mint NFT" on:click={() => openAmaModal()}>
    <!-- {#if type === "claim"}
      <i class="fas fa-exclamation" /><strong>Claim</strong>
    {:else} -->
    <strong>{label}</strong>
    <!-- {/if} -->
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
              <div class="poap-mint-preview"><img src={mintingImage} alt="kredeum AMA poap" /></div>
              {#if processEnded}
                Your POAP was {type}ed right on {chainName}
              {:else}
                <div class="btn btn-default btn-mint-modal-ama" title="Mint NFT" on:click={mintOrClaim}>
                  {label}
                </div>
              {/if}
              {#if processing}
                <div class="ama-minting">
                  {type}ing your POAP on {chainName}<i class="fas fa-spinner fa-left c-green refresh" />
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
  }

  .poap-mint-preview img {
    width: 50%;
  }

  .btn-mint-modal-ama {
    background-color: #3acf6e;
  }

  .ama-warning {
    width: 100%;
    padding: 0 30px;
  }

  .btn-claim {
    padding: 12px 25px;
  }
</style>
