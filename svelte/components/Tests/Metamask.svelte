<script lang="ts">
  import { onMount } from "svelte";
  import { metamaskInit } from "helpers/metamask";

  import { metamaskAccount, metamaskChainId } from "main/metamask";
  export let chainId: number = undefined;
  export let account: string = undefined;

  $: chainId = $metamaskChainId;
  $: account = $metamaskAccount;

  onMount(async () => {
    await metamaskInit();
  });
</script>
