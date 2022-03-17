<script lang="ts">
  import { onMount } from "svelte";

  import { getChainName, getNetwork, networks } from "lib/kconfig";

  import { metamaskInit, metamaskSwitchChain } from "helpers/metamask";
  import Network from "./Network.svelte";

  export let chainId: number = undefined;
  export let txt: boolean = false;

  let open = false;
  const testnets = true;

  $: network = getNetwork(chainId);

  interface SwitchEventTarget extends EventTarget {
    value: number;
  }
  const _metamaskSwitchChainEvt = (evt?: Event) => {
    console.log("_metamaskSwitchChainEvt evt", evt);

    const _chainId = Number((evt.target as SwitchEventTarget).value);
    _metamaskSwitchChain(_chainId, evt);
  };
  const _metamaskSwitchChain = (_chainId: number, evt: Event) => {
    console.log("_metamaskSwitchChain evt", evt);
    evt.preventDefault();

    metamaskSwitchChain(_chainId);
  };

  onMount(async () => {
    window.addEventListener("click", (evt: Event): void => {
      const select = document.querySelector(".select-network");
      if (select && !select.contains(evt.target as HTMLElement)) {
        open = false;
      }
    });

    await metamaskInit();
  });
</script>

{#if txt}
  <select on:change={(evt) => _metamaskSwitchChainEvt(evt)}>
    {#each networks.filter((nw) => nw.mainnet) as _network}
      <option value={_network.chainId} selected={_network.chainId == chainId}>
        <Network chainId={_network.chainId} {txt} />
        &nbsp;
      </option>
    {/each}
    {#if network?.testnet}
      {#each networks.filter((nw) => nw.testnet) as _network}
        <option value={_network.chainId} selected={_network.chainId == chainId}>
          <Network chainId={_network.chainId} {txt} />
          &nbsp;
        </option>
      {/each}
    {/if}
  </select>
{:else}
  <div class="select-wrapper select-network" on:click={() => (open = !open)}>
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
        {#if network?.testnet}
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
{/if}
