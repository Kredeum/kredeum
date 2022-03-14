<script lang="ts">
  import { onMount } from "svelte";

  import type { Network } from "lib/ktypes";
  import { getEnsName, networks } from "lib/kconfig";
  import { factoryGetAddress } from "lib/kfactory-get";
  import { explorerNFTsFactoryUrl } from "lib/kconfig";

  import {
    metamaskInit,
    metamaskConnect,
    metamaskSwitchChain,
    metamaskConnectMessage,
    metamaskInstallMessage
  } from "helpers/metamaskLib";

  import { chainId, network, provider, signer, owner } from "main/network";

  export let txt: boolean = false;
  export let label: boolean = false;

  let metamaskNotInstalled = false;
  let open = false;
  const testnets = true;
  let nameOrAddress = "";

  $: if ($owner) setEnsName();
  const setEnsName = async () => {
    nameOrAddress = $owner;
    nameOrAddress = await getEnsName($owner);
  };

  const strUpFirst = (str: string): string => (str.length >= 1 ? str.charAt(0).toUpperCase() + str.substr(1) : "");

  const getChainname = (_network: Network): string => _network?.chainName || "unknown";
  const getChainName = (_network: Network): string => strUpFirst(getChainname(_network));

  interface SwitchEventTarget extends EventTarget {
    value: number;
  }
  const _metamaskSwitchChainEvt = (evt?: Event) => {
    console.log("evt", evt);

    const _chainId = Number((evt.target as SwitchEventTarget).value);
    _metamaskSwitchChain(_chainId, evt);
  };
  const _metamaskSwitchChain = (_chainId: number, evt: Event) => {
    evt.preventDefault();

    metamaskSwitchChain(_chainId);
  };

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
    Network
    <select on:change={(evt) => _metamaskSwitchChainEvt(evt)}>
      {#each networks.filter((nw) => nw.mainnet) as _network}
        <option value={_network.chainId} selected={_network.chainId == $chainId}>
          {getChainName(_network)}
          &nbsp;
        </option>
      {/each}
      {#if $network?.testnet}
        {#each networks.filter((nw) => nw.testnet) as _network}
          <option value={_network.chainId} selected={_network.chainId == $chainId}>
            {getChainName(_network)}
            &nbsp;
          </option>
        {/each}
      {/if}
    </select>
  {:else if metamaskNotInstalled}
    {metamaskInstallMessage}
  {:else}
    <a href="." on:click={_metamaskConnect}>{metamaskConnectMessage}</a>
  {/if}
{:else}
  <div class="col col-xs-12 col-sm-3">
    {#if $owner}
      {#if label}
        <span class="label"
          >Network
          <a
            class="info-button"
            href={explorerNFTsFactoryUrl($chainId)}
            target="_blank"
            title="&#009; NFTs Factory address (click to view in explorer )
          {factoryGetAddress($chainId)}"><i class="fas fa-info-circle" /></a
          >
        </span>
      {/if}

      <div class="select-wrapper select-network" on:click={() => (open = !open)}>
        <div class="select" class:open>
          <div class="select-trigger">
            <span class={getChainname($network)}>{getChainName($network)}</span>
          </div>
          <div class="custom-options">
            {#each networks.filter((nw) => nw.mainnet) as _network}
              <span
                class="custom-option {_network.chainId == $chainId && 'selected'}"
                data-value={getChainname(_network)}
                on:click={(evt) => _metamaskSwitchChain(_network.chainId, evt)}
              >
                {getChainName(_network)}
              </span>
            {/each}
            {#if $network?.testnet}
              {#each networks.filter((nw) => nw.testnet) as _network}
                <span
                  class="custom-option {_network.chainId == $chainId && 'selected'}"
                  data-value={getChainname(_network)}
                  on:click={(evt) => _metamaskSwitchChain(_network.chainId, evt)}
                >
                  {getChainName(_network)}
                </span>
              {/each}
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>
{/if}
