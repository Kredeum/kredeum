<script lang="ts">
  import { onMount } from "svelte";

  import type { Network } from "lib/ktypes";
  import { getShortAddress, explorerAccountUrl, getEnsName } from "lib/kconfig";

  import { metamaskInit, metamaskConnect, metamaskConnectMessage, metamaskInstallMessage } from "helpers/metamaskLib";

  import { chainId, network, owner } from "main/network";

  import AccountViewSlot from "./AccountViewSlot.svelte";

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
  <AccountViewSlot owner={$owner} notInstalled={metamaskNotInstalled}>
    <span slot="owner">{nameOrAddress}@{getChainname($network)}</span>
    <span slot="noinstall">{metamaskInstallMessage}</span>
    <span slot="link"><a href="." on:click={_metamaskConnect}>{metamaskConnectMessage}</a></span>
  </AccountViewSlot>
{:else}
  <div class="col col-xs-12 col-sm-3">
    <AccountViewSlot owner={$owner} notInstalled={metamaskNotInstalled}>
      <span slot="owner">
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
      </span>
      <span slot="noinstall">
        <div class="btn btn-light btn-metamask">
          {metamaskInstallMessage}
        </div></span
      >
      <span slot="link">
        <a href="." on:click={_metamaskConnect} class="btn btn-light btn-metamask">{metamaskConnectMessage}</a>
      </span>
    </AccountViewSlot>
  </div>
{/if}
