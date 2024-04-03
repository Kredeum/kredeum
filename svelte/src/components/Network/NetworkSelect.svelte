<script lang="ts">
  import { clickOutside } from "@svelte/helpers/clickOutside";
  import { resolverGetExplorerUrl, resolverGetAddress } from "@common/resolver/resolver-get";

  import Network from "./Network.svelte";

  import CopyRefItem from "../Global/CopyRefItem.svelte";
  import networks from "@common/common/networks";

  /////////////////////////////////////////////////
  // <NetworkSelect bind:{chainId} {txt} {label} />
  // Select Network via a list box
  /////////////////////////////////////////////////
  export let chainId: number = 0;
  export let txt: boolean = false;
  export let label = true;

  $: currentNetworks = networks.getAllSameType(chainId);

  let open = false;
  const handleToggleOpen = () => (open = !open);

  interface SwitchEventTarget extends EventTarget {
    value: number;
  }
  const _switchChainEvt = (evt: Event) => {
    const _chainId = Number((evt.target as SwitchEventTarget).value);
    _switchChain(_chainId, evt).catch(console.error);
  };
  const _switchChain = async (_chainId: number, evt: Event): Promise<void> => {
    evt.preventDefault();
    chainId = _chainId;
  };
</script>

{#if txt}
  {#if label}Network{/if}

  <select on:change={_switchChainEvt}>
    {#each currentNetworks as nwk}
      <option value={nwk.chainId} selected={nwk.chainId == chainId}>
        <Network chainId={nwk.chainId} {txt} pre={true} />
        &nbsp;
      </option>
    {/each}
  </select>
{:else}
  {#if label}
    <span class="label"
      >Network
      <a
        class="info-button"
        href={resolverGetExplorerUrl(chainId)}
        target="_blank"
        rel="noreferrer"
        title="NFTs Factory address (click to view in explorer )
        {resolverGetAddress(chainId)}"><i class="fas fa-info-circle" /></a
      >
      <CopyRefItem copyData={resolverGetAddress(chainId)} />
    </span>
  {/if}

  <div
    role="button"
    tabindex="0"
    class="select-wrapper select-network"
    use:clickOutside={() => (open = false)}
    on:click={handleToggleOpen}
    on:keydown={handleToggleOpen}
  >
    <div class="select" class:open>
      <div class="select-trigger">
        <Network {chainId} />
      </div>

      <div class="custom-options">
        {#each currentNetworks as nwk}
          <span
            role="button"
            tabindex="0"
            class="custom-option {nwk.chainId == chainId && 'selected'}"
            on:click={(evt) => _switchChain(nwk.chainId, evt)}
            on:keydown={(evt) => _switchChain(nwk.chainId, evt)}
          >
            <Network chainId={nwk.chainId} pre={true} />
          </span>
        {/each}
      </div>
    </div>
  </div>
{/if}
