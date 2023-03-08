<script lang="ts">
  import {
    metamaskConnect,
    metamaskConnectMessage,
    metamaskInstalled,
    metamaskInstallMessage
  } from "@helpers/metamask";
  import { metamaskSignerAddress } from "@main/metamask";
  import { onMount } from "svelte";
  import Account from "./Account.svelte";

  /////////////////////////////////////////////////
  // <AccountConnect bind:{signer} {txt}? {platform}? />
  // Get Signer from Metamask (or compatible)
  /////////////////////////////////////////////////
  export let signer: string = undefined;
  export let txt: boolean = undefined;

  let _metamaskInstalled: boolean;

  // change signer on memataskAccount change
  $: signer = $metamaskSignerAddress;
  // $: signer && console.log("SIGNER CHANGE", signer);

  const classMetamask = txt ? "" : "btn btn-light btn-metamask";
  const _metamaskInstall = () => window.location.replace("https://metamask.io/download/");
  const _metamaskConnect = async (evt?: Event) => {
    evt.preventDefault();
    await metamaskConnect();
  };

  onMount(async () => (_metamaskInstalled = await metamaskInstalled()));
</script>

{#if signer}
  <Account account={signer} {txt} />
{:else}
  <div class={classMetamask}>
    {#if _metamaskInstalled}
      <span on:click={_metamaskConnect} on:keydown={_metamaskConnect}>
        {metamaskConnectMessage}
      </span>
    {:else}
      <span on:click={_metamaskInstall} on:keydown={_metamaskInstall}>
        {metamaskInstallMessage}
      </span>
    {/if}
  </div>
{/if}
