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
