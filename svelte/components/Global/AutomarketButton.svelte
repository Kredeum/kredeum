<script lang="ts">
  import { NftType } from "@lib/common/types";
  import { metamaskSwitchChain } from "@helpers/metamask";
  import { metamaskChainId, metamaskAccount, metamaskSigner } from "@main/metamask";
  import { getChainName } from "@lib/common/config";

  import AccountConnect from "../Account/AccountConnect.svelte";
  import Nft from "../Nft/NftOld.svelte";
  import { onMount } from "svelte";

  import { collectionGetContract } from "@lib/collection/collection-get";
  import { nftGet } from "@lib/nft/nft-get";

  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let platform: string;

  $: account = $metamaskAccount;

  // $: chainId > 0 && $metamaskChainId > 0 && $metamaskChainId !== chainId && handleChainId();
  // const handleChainId = async (): Promise<void> => {
  //   try {
  //     const messageSwitchTo = `Switch to ${getChainName(chainId)}`;

  //     if (confirm(messageSwitchTo)) {
  //       await metamaskSwitchChain(chainId);
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  // onMount(async () => {
  // const { contract, collection } = await collectionGetContract(chainId, address);
  // const _nftLib = await nftGet(chainId, address, tokenID, collection, true);
  // const _nftLib = (await nftGet(chainId, address, tokenID, { chainId, address }, true)) as NftType;
  // console.log("onMount ~ _nftLib", _nftLib.metadata?.image);
  // });
</script>

<!-- {#if $metamaskSigner} -->
<div class="automarket-button">
  <Nft {chainId} {address} {tokenID} {account} {platform} />
</div>

<!-- {:else} -->

<!-- <AccountConnect bind:account {platform} /> -->

<!-- {/if} -->
<style>
  :global(.kre-buy-front) {
    width: 300px;
  }

  .automarket-button {
    font-family: "Work Sans", Arial, sans-serif;
    line-height: 1.3;
    font-size: 16px;
  }
</style>
