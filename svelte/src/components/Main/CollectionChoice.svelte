<script lang="ts">
  import { onMount } from "svelte";

  import { metamaskInit, metamaskSwitchChain } from "../../helpers/metamask";
  import { metamaskChainId, metamaskSignerAddress } from "../../stores/metamask";

  import AccountConnect from "../Account/AccountConnect.svelte";
  import CollectionSelect from "../Collection/CollectionSelect.svelte";
  import NetworkSelect from "../Network/NetworkSelect.svelte";
  import { providerSetFallback } from "common/src/common/provider-get";

  /////////////////////////////////////////////////////////////////
  // <CollectionChoice bind:{address} {txt} />
  // Choose Collection, after Account Connect and Network choose
  /////////////////////////////////////////////////////////////////
  export let address: string | undefined = undefined;
  export let txt = true;
  /////////////////////////////////////////////////////////////////

  let chainId: number;

  // $: console.log("<CollectionChoice", chainId, "=>", address);
  // SET nework on chainId change
  $: chainId && handleChainId();
  const handleChainId = async () => {
    await metamaskSwitchChain(chainId);
    await providerSetFallback(chainId);
  };

  onMount(async () => {
    await metamaskInit();
    chainId = $metamaskChainId;
    await handleChainId();
  });
</script>

<p>
  <AccountConnect {txt} label={true} />
</p>
<p>
  <NetworkSelect bind:chainId {txt} label={true} />
</p>

<p>
  <CollectionSelect {chainId} bind:address account={$metamaskSignerAddress} {txt} mintable={true} />
</p>
