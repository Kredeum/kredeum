<script lang="ts">
  import {  metamaskConnect, metamaskConnectMessage, metamaskInstallMessage } from "@helpers/metamask";
  import { metamaskSignerAddress } from "@main/metamask";
  import Account from "./Account.svelte";

  /////////////////////////////////////////////////
  // <AccountConnect bind:{signer} {txt}? {platform}? />
  // Get Signer from Metamask (or compatible)
  /////////////////////////////////////////////////
  export let signer: string = undefined;
  export let txt: boolean = undefined;

  let metamaskInstalled: boolean;

  // change signer on memataskAccount change
  $: signer = $metamaskSignerAddress;
  $:  console.log("AccountConnect signer CHANGE", signer);

  const classMetamask = txt ? "" : "btn btn-light btn-metamask";
  const _metamaskInstall = () => window.location.replace("https://metamask.io/download/");
  const _metamaskConnect = (evt?: Event) => {
    evt.preventDefault();
    metamaskConnect();
  };

  // Metamask init
  // onMount(async () => ({installed: metamaskInstalled} = await metamaskInit()));
</script>

{#if signer}
  <Account account={signer} {txt} />
{:else}
  <div class={classMetamask}>
    {#if metamaskInstalled}
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
