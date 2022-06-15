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
  import Nft from "./Nft.svelte";

  /////////////////////////////////////////////////
  //  <NftMint {chainId} />
  // Mint NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let type: string;
  export let tokenID: string;
  /////////////////////////////////////////////////

  let openBound: OpenBoundType;
  let openBoundAddress: string;

  $: chainName = getChainName(chainId);
  $: label = `${type === "mint" ? "Mint" : "Claim"} on ${chainName}`;

  // $: $metamaskChainId && isReady();
  const isReady = async (): Promise<boolean> => {
    console.log(`isReady ${chainId} ${type}`);

    if (chainId === $metamaskChainId) {
      openBoundAddress = getNetwork(chainId).openBoundAma;
      // console.log("isReady ~ openBoundAddress", openBoundAddress);

      openBound = new ethers.Contract(openBoundAddress, openBoundAbi, $metamaskSigner) as unknown as OpenBoundType;
      if (!openBound) return false;

      if (Number(await openBound.balanceOf($metamaskAccount)) > 0) {
        const tokenIdFound = String(await openBound.tokenOfOwnerByIndex($metamaskAccount, 0));
        // console.log("isReady ~ tokenIdFound", tokenIdFound);
        alert(`NFT already exists on ${chainName} \n`);
        tokenID ||= tokenIdFound;
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

  const mintOrClaim = async (): Promise<NftType> => {
    if (!(await isReady())) return;

    let tokenIdMintOrclaim = tokenID;

    if (type === "mint") {
      const n = Math.floor(6 * Math.random());
      const cidJson = ama.cidJson[n];
      tokenIdMintOrclaim = ownerXorTokenID($metamaskAccount, cidToInt(cidJson));
    }

    const mintingTxResp = await openBound.mint(tokenIdMintOrclaim);
    console.log("mintingTxResp", mintingTxResp);
    const linkTx = `${getExplorer(chainId)}/tx/${mintingTxResp?.hash || ""}`;
    console.log(linkTx);

    const mintingTxReceipt = await mintingTxResp.wait();
    console.log("mintingTxReceipt", mintingTxReceipt);
    alert(`Transaction done`);

    tokenID = tokenIdMintOrclaim;
  };
</script>

<div class="col col-xs-12 col-sm-3">
  <div class="btn btn-default" title="Mint NFT" on:click={mintOrClaim}>
    {label}
  </div>
</div>
