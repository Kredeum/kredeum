<script lang="ts">
  import { onMount } from "svelte";

  import type { Network } from "lib/ktypes";
  import { getShortAddress, explorerAccountUrl, getEnsName } from "lib/kconfig";

  import { metamaskInit, metamaskConnect, metamaskConnectMessage, metamaskInstallMessage } from "helpers/metamaskLib";

  import { chainId, network, owner } from "main/network";

  export let txt: boolean = undefined;

  let nameOrAddress = "";
  let metamaskNotInstalled = false;
  let open = false;
  const testnets = true;

  $: if ($owner) setEnsName();
  const setEnsName = async () => {
    nameOrAddress = $owner;
    nameOrAddress = await getEnsName($owner);
  };

  const getChainname = (_network: Network): string => _network?.chainName || "unknown";

  const _metamaskConnect = (evt?: Event) => {
    evt.preventDefault();

    metamaskConnect();
  };

  onMount(async () => {
    window.addEventListener("click", (evt: Event): void => {
      const select = document.querySelector(".select-network");
      if (select && !select.contains(evt.target as HTMLElement)) {
        open = false;
      }
    });

    const metamaskNotInstalled = !(await metamaskInit());
  });
</script>

{#if txt}
  {#if $owner}
    {nameOrAddress}@{getChainname($network)}
  {:else if metamaskNotInstalled}
    {metamaskInstallMessage}
  {:else}
    <a href="." on:click={_metamaskConnect}>{metamaskConnectMessage}</a>
  {/if}
{:else}
  <div class="col col-xs-12 col-sm-3">
    {#if $owner}
      <span class="label"
        >Address
        <a
          class="info-button"
          href={explorerAccountUrl($chainId, $owner)}
          target="_blank"
          title="&#009;Owner address (click to view account in explorer )&#013;{$owner}"
          ><i class="fas fa-info-circle" /></a
        >
      </span>
      <div class="form-field">
        <input type="text" value={getShortAddress(nameOrAddress, 10)} />
      </div>
    {:else if metamaskNotInstalled}
      <div class="btn btn-light btn-metamask">
        {metamaskInstallMessage}
      </div>
    {:else}
      <a href="." on:click={_metamaskConnect} class="btn btn-light btn-metamask">{metamaskConnectMessage}</a>
    {/if}
  </div>
{/if}
