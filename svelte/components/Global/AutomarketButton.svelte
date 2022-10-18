<script lang="ts">
  import { metamaskSwitchChain } from "@helpers/metamask";
  import { metamaskChainId, metamaskAccount, metamaskSigner } from "@main/metamask";
  import { getChainName } from "@lib/common/kconfig";

  import AccountConnect from "../Account/AccountConnect.svelte";
  import Nft from "../../components/Nft/Nft.svelte";

  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let platform: string;

  $: account = $metamaskAccount;

  $: chainId > 0 && $metamaskChainId && $metamaskChainId !== chainId && handleChainId();
  const handleChainId = async (): Promise<void> => {
    try {
      const messageSwitchTo = `Switch to ${getChainName(chainId)}`;

      if (confirm(messageSwitchTo)) {
        await metamaskSwitchChain(chainId);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
</script>

{#if $metamaskSigner}
  <div class="automarket-button">
    <Nft {chainId} {address} {tokenID} {account} {platform} />
  </div>
{:else}
  <AccountConnect bind:account {platform} />
{/if}

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
