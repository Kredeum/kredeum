<script lang="ts">
  import { metamaskSwitchChain } from "@helpers/metamask";
  import { metamaskChainId, metamaskAccount, metamaskSigner } from "@main/metamask";
  import { getChainName } from "@lib/common/config";

  import AccountConnect from "../Account/AccountConnect.svelte";
  import Nft from "../Nft/NftOld.svelte";

  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let platform: string;

  $: account = $metamaskAccount;
</script>

  <div class="automarket-button">
    <Nft {chainId} {address} {tokenID} {account} {platform} />
  </div>

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
