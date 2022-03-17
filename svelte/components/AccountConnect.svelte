<script lang="ts">
  import { onMount } from "svelte";

  import { metamaskInit, metamaskConnect, metamaskConnectMessage, metamaskInstallMessage } from "helpers/metamask";

  import Account from "./Account.svelte";

  import { refs } from "helpers/refs";
  import { metamaskChainId, metamaskAccount } from "main/metamask";

  export let txt: boolean = undefined;

  let metamaskNotInstalled = false;
  const testnets = true;

  const _metamaskConnect = (evt?: Event) => {
    evt.preventDefault();

    metamaskConnect();
  };

  onMount(async () => {
    metamaskNotInstalled = !(await metamaskInit());
  });
</script>

{#if txt}
  {#if $metamaskAccount}
    <Account chainId={$metamaskChainId} account={$metamaskAccount} {txt} />
  {:else if metamaskNotInstalled}
    {metamaskInstallMessage}
  {:else}
    <a href="." on:click={_metamaskConnect}>{metamaskConnectMessage}</a>
  {/if}
{:else}
  <div class="col col-xs-12 col-sm-3">
    {#if $metamaskAccount}
      <Account chainId={$metamaskChainId} account={$metamaskAccount} {txt} />
    {:else if metamaskNotInstalled}
      <div class="btn btn-light btn-metamask">
        {metamaskInstallMessage}
      </div>
    {:else}
      <a href="." on:click={_metamaskConnect} class="btn btn-light btn-metamask">{metamaskConnectMessage}</a>
    {/if}
  </div>
{/if}
