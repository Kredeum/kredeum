<script lang="ts">
  import { metamaskSwitchChain } from "@helpers/metamask";
  import { metamaskChainId, metamaskSignerAddress, metamaskSigner } from "@main/metamask";
  import { getChainName } from "@lib/common/config";

  import AccountConnect from "../Account/AccountConnect.svelte";
  import NftOld from "./Nft.svelte";
  import Nft from "./NftData.svelte";
  import NftBasic from "./NftBasic.svelte";

  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let platform: string = undefined;

  $: account = $metamaskSignerAddress;

  $: console.log(platform);
</script>

<div class="nft-automarket">
  <NftBasic {chainId} {address} {tokenID} />
</div>

<style>
  :global(.nft-automarket) {
    width: 300px;
  }

  .nft-automarket {
    font-family: "Work Sans", Arial, sans-serif;
    line-height: 1.3;
    font-size: 16px;
  }
</style>
