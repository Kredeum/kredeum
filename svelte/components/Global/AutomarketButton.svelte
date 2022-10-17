<script lang="ts">
  import { onMount } from "svelte";

  import { metamaskInit, metamaskSwitchChain } from "@helpers/metamask";
  import { metamaskChainId, metamaskAccount, metamaskSigner } from "@main/metamask";
  import { getChainName } from "@lib/common/kconfig";

  import Nft from "../../components/Nft/Nft.svelte";

  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let platform: string;

  $: account = $metamaskAccount;

  onMount(async () => {
    chainId = Number(chainId);
    await metamaskInit();
  });

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

<div>
  <Nft {chainId} {address} {tokenID} {account} {platform} />
</div>
