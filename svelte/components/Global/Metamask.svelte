<script lang="ts">
  import { onMount } from "svelte";
  import { metamaskInit } from "helpers/metamask";

  import { metamaskAccount, metamaskChainId } from "main/metamask";
  export let chainId: number;
  export let account: string;

  $: chainId = $metamaskChainId;
  $: account = $metamaskAccount;

  onMount(async () => {
    await metamaskInit();
  });
</script>
