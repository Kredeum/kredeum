<script lang="ts">
  import { onMount } from "svelte";

  import { getChainName, getNetwork, networks } from "lib/kconfig";
  import { factoryGetDefaultImplementation } from "lib/kfactory-get";

  import { metamaskSwitchChain } from "helpers/metamask";
  import { metamaskChainId, metamaskProvider } from "main/metamask";
  import { storeCollectionSetDefaultMintableAddress } from "lib/kstore";

  import Network from "./Network.svelte";

  /////////////////////////////////////////////////
  // <NetworkSelectList bind:{chainId} {txt} />
  // Select Network via a list box
  /////////////////////////////////////////////////
  export let chainId: number = undefined;
  export let txt: boolean = undefined;

  let open = false;

  $: if ($metamaskChainId) _setChainId($metamaskChainId).catch(console.error);

  const _setChainId = async (_metamaskChainId: number) => {
    console.log(" _setChainId ", _metamaskChainId);
    chainId = _metamaskChainId;

    const defaultMintableCollection = await factoryGetDefaultImplementation(chainId, $metamaskProvider);
    storeCollectionSetDefaultMintableAddress(chainId, defaultMintableCollection);
  };

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

  onMount(() => {
    window.addEventListener("click", (evt: Event): void => {
      const select = document.querySelector(".select-network");
      if (select && !select.contains(evt.target as HTMLElement)) {
        open = false;
      }
    });
  });
</script>

{#if txt}
  <!-- TODO change to bind => https://svelte.dev/tutorial/select-bindings (only possible in txt) -->
  <select on:change={(evt) => _metamaskSwitchChainEvt(evt)}>
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
{/if}
