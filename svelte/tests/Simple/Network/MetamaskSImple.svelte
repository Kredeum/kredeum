<script lang="ts">
  import { onMount } from "svelte";
  import { metamaskInit, metamaskSwitchChain } from "@helpers/metamask";

  import { metamaskChainId, metamaskSignerAddress } from "@stores/metamask";

  /////////////////////////////////////////////////
  // <MetamaskSimple bind:{chainId}  />
  // Get Network from Metamask
  /////////////////////////////////////////////////
  export let chainId: number = undefined;
  export let signer: string = undefined;
  $: console.log("MetamaskSimple chainId CHANGE", chainId);
  $: console.log("MetamaskSimple signer CHANGE", signer);

  // change chainId on memataskChainId change
  $: chainId = $metamaskChainId;
  // change memataskChainId on chainId change
  $: chainId != $metamaskChainId && metamaskSwitchChain(chainId);

  // change signer on memataskAccount change
  $: signer = $metamaskSignerAddress;

  // metamask init
  onMount(async () => await metamaskInit());
</script>
