<script lang="ts">
  import { onMount } from "svelte";

  import {
    metamaskConnect,
    metamaskConnectMessage,
    metamaskInstalled,
    metamaskInstallMessage
  } from "../../helpers/metamask";
  import { metamaskSignerAddress } from "../../stores/metamask";
  import Account from "./Account.svelte";
  import { type Address } from "viem";

  /////////////////////////////////////////////////
  // <AccountConnect bind:{signer} {txt}? {label}? />
  // Get Signer from Metamask (or compatible)
  /////////////////////////////////////////////////
  export let signer: Address | undefined = undefined;
  export let txt: boolean | undefined = undefined;
  export let label: boolean | undefined = undefined;

  let _metamaskInstalled: boolean;

  // change signer on memataskAccount change
  $: signer = $metamaskSignerAddress;

  const classMetamask = txt ? "" : "btn btn-light btn-metamask";
  const _metamaskInstall = () => window.location.replace("https://metamask.io/download/");
  const _metamaskConnect = async () => await metamaskConnect();

  onMount(async () => (_metamaskInstalled = await metamaskInstalled()));
</script>

{#if signer}
  <Account account={signer} {txt} {label} />
{:else if txt}
  {#if _metamaskInstalled}
    <a href="." on:click|preventDefault={_metamaskConnect}>{metamaskConnectMessage}</a>
  {:else}
    <a href="https://metamask.io/download/" target="_blank">{metamaskInstallMessage}</a>
  {/if}
{:else}
  <div class={classMetamask}>
    {#if _metamaskInstalled}
      <span
        id="metamaskConnect"
        role="button"
        tabindex="0"
        on:click|preventDefault={_metamaskConnect}
        on:keydown={_metamaskConnect}
      >
        {metamaskConnectMessage}
      </span>
    {:else}
      <span role="button" tabindex="0" on:click={_metamaskInstall} on:keydown={_metamaskInstall}>
        {metamaskInstallMessage}
      </span>
    {/if}
  </div>
{/if}
