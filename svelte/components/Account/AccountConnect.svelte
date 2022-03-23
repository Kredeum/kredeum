<script lang="ts">
  import { onMount } from "svelte";

  import { metamaskInit, metamaskConnect, metamaskConnectMessage, metamaskInstallMessage } from "helpers/metamask";
  import { metamaskAccount } from "main/metamask";

  import Account from "./Account.svelte";

  /////////////////////////////////////////////////
  // <AccountConnect bind:{account} {txt} />
  // Connect Account via Metamask (or compatible)
  /////////////////////////////////////////////////
  export let account: string = undefined;
  export let txt: boolean = undefined;

  let metamaskNotInstalled = false;

  $: account = $metamaskAccount;

  const _metamaskConnect = (evt?: Event) => {
    evt.preventDefault();
    metamaskConnect();
  };

  onMount(async () => {
    await metamaskInit();
  });
</script>

{#if txt}
  {#if account}
    <Account {account} {txt} />
  {:else if metamaskNotInstalled}
    {metamaskInstallMessage}
  {:else}
    <a href="." on:click={_metamaskConnect}>{metamaskConnectMessage}</a>
  {/if}
{:else}
  <div class="col col-xs-12 col-sm-3">
    {#if account}
      <Account {account} {txt} />
    {:else if metamaskNotInstalled}
      <div class="btn btn-light btn-metamask">
        {metamaskInstallMessage}
      </div>
    {:else}
      <a href="." on:click={_metamaskConnect} class="btn btn-light btn-metamask">{metamaskConnectMessage}</a>
    {/if}
  </div>
{/if}
