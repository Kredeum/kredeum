<script lang="ts">
  import { onMount } from "svelte";
  import { metamaskInit, metamaskConnect, metamaskConnectMessage, metamaskInstallMessage } from "@helpers/metamask";
  import { metamaskInit } from "@helpers/metamask";
  import { metamaskSignerAddress } from "@main/metamask";
  import { metamaskSignerAddress } from "@main/metamask";
  import Account from "./Account.svelte";

  /////////////////////////////////////////////////
  // <AccountConnect bind:{signer} {txt}? {platform}? />
  // Get Signer from Metamask (or compatible)
  /////////////////////////////////////////////////
  export let signer: string = undefined;
  export let txt: boolean = undefined;
  export let platform = "dapp";

  let metamaskNotInstalled = false;

  // change signer on memataskAccount change
  $: signer = $metamaskSignerAddress;
  $: console.log("AccountConnect signer CHANGE", signer);

  const _metamaskConnect = (evt?: Event) => {
    evt.preventDefault();
    metamaskConnect();
  };

  // metamask init
  onMount(async () => await metamaskInit());
</script>

{#if txt}
  {#if signer}
    <Account account={signer} {txt} />
  {:else if metamaskNotInstalled}
    {metamaskInstallMessage}
  {:else}
    <a href="." on:click={_metamaskConnect}>{metamaskConnectMessage}</a>
  {/if}
{:else}
  <div class={platform === "dapp" ? "col col-xs-12 col-sm-3 kre-copy-ref-container" : ""}>
    {#if signer}
      <Account account={signer} {txt} />
    {:else if metamaskNotInstalled}
      <div class="btn btn-light btn-metamask">
        {metamaskInstallMessage}
      </div>
    {:else}
      <a href="." on:click={_metamaskConnect} class="btn btn-light btn-metamask">{metamaskConnectMessage}</a>
    {/if}
  </div>
{/if}
