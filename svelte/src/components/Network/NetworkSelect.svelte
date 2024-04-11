<script lang="ts">
  import { clickOutside } from "../../helpers/clickOutside";
  import { resolverGetExplorerUrl, resolverGetAddress } from "@kredeum/common/src/resolver/resolver-get";

  import Network from "./Network.svelte";

  import CopyRefItem from "../Global/CopyRefItem.svelte";
  import networks from "@kredeum/common/src/contract/networks";
  import { type NetworkType } from "@kredeum/common/src/common/types";
  import { type Address } from "viem";

  /////////////////////////////////////////////////
  // <NetworkSelect bind:{chainId} {txt} {label} />
  // Select Network via a list box
  /////////////////////////////////////////////////
  export let chainId: number = 0;
  export let txt: boolean = false;
  export let label = true;
  /////////////////////////////////////////////////
  let currentNetworks: NetworkType[] = [];
  let open = false;
  let resolverExplorerUrl: string;
  let resolverAddress: Address;
  /////////////////////////////////////////////////

  $: chainId && handleChainId();
  const handleChainId = () => {
    currentNetworks = networks.getAllSameType(chainId);
    resolverExplorerUrl = resolverGetExplorerUrl(chainId);
    resolverAddress = resolverGetAddress(chainId);
  };

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
        href={resolverExplorerUrl}
        target="_blank"
        rel="noreferrer"
        title="NFTs Factory address (click to view in explorer )
        {resolverAddress}"><i class="fas fa-info-circle" /></a
      >
      <CopyRefItem copyData={resolverAddress} />
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
