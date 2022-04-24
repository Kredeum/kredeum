<script lang="ts">
  import { clickOutside } from "helpers/clickOutside";

  import { getChainName, getNetwork, networks, explorerNFTsFactoryUrl } from "lib/kconfig";
  import { factoryGetAddress } from "lib/kfactory-get";

  import { metamaskSwitchChain } from "helpers/metamask";
  import { metamaskChainId } from "main/metamask";

  import Network from "./Network.svelte";

  /////////////////////////////////////////////////
  // <NetworkList bind:{chainId} {txt} {label} />
  // Select Network via a list box
  /////////////////////////////////////////////////
  export let chainId: number = undefined;
  export let txt: boolean = undefined;
  export let label = true;

  let open = false;

  $: chainId = $metamaskChainId;

  interface SwitchEventTarget extends EventTarget {
    value: number;
  }
  const _metamaskSwitchChainEvt = (evt?: Event) => {
    // console.log("_metamaskSwitchChainEvt evt", evt);

    const _chainId = Number((evt.target as SwitchEventTarget).value);
    _metamaskSwitchChain(_chainId, evt);
  };
  const _metamaskSwitchChain = (_chainId: number, evt: Event) => {
    // console.log("_metamaskSwitchChain evt", evt);
    evt.preventDefault();

    metamaskSwitchChain(_chainId);
  };
</script>

{#if txt}
  {#if label}Network{/if}

  <!-- TODO change to bind => https://svelte.dev/tutorial/select-bindings (only possible in txt) -->
  <select on:change={_metamaskSwitchChainEvt}>
    {#each networks.filter((nw) => nw.mainnet) as _network}
      <option value={_network.chainId} selected={_network.chainId == chainId}>
        <Network chainId={_network.chainId} {txt} />
        &nbsp;
      </option>
    {/each}
    {#if getNetwork(chainId)?.testnet}
      {#each networks.filter((nw) => nw.testnet) as _network}
        <option value={_network.chainId} selected={_network.chainId == chainId}>
          <Network chainId={_network.chainId} {txt} />
          &nbsp;
        </option>
      {/each}
    {/if}
  </select>
{:else}
  <div class="col col-xs-12 col-sm-3">
    {#if label}
      <span class="label"
        >Network
        <a
          class="info-button"
          href={explorerNFTsFactoryUrl(chainId)}
          target="_blank"
          title="&#009; NFTs Factory address (click to view in explorer )
        {factoryGetAddress(chainId)}"><i class="fas fa-info-circle" /></a
        >
      </span>
    {/if}

    <div class="select-wrapper select-network" use:clickOutside={() => (open = false)} on:click={() => (open = !open)}>
      <div class="select" class:open>
        <div class="select-trigger">
          <Network {chainId} {txt} />
        </div>
        <div class="custom-options" />

        <div class="custom-options">
          {#each networks.filter((nw) => nw.mainnet) as nwk}
            <span
              class="custom-option {nwk.chainId == chainId && 'selected'}"
              data-value={getChainName(nwk.chainId)}
              on:click={(evt) => _metamaskSwitchChain(nwk.chainId, evt)}
            >
              <Network chainId={nwk.chainId} txt={true} />
            </span>
          {/each}
          {#if getNetwork(chainId)?.testnet}
            {#each networks.filter((nw) => nw.testnet) as nwk}
              <span
                class="custom-option {nwk.chainId == chainId && 'selected'}"
                data-value={getChainName(nwk.chainId)}
                on:click={(evt) => _metamaskSwitchChain(nwk.chainId, evt)}
              >
                <Network chainId={nwk.chainId} txt={true} />
              </span>
            {/each}
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}
