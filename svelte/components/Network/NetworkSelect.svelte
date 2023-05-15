<script lang="ts">
  import { clickOutside } from "@helpers/clickOutside";
  import { getChainName, hasOpenBound, isTestnet, networks } from "@lib/common/config";
  import { resolverGetExplorerUrl, resolverGetAddress } from "@lib/resolver/resolver-get";

  import Network from "./Network.svelte";

  import CopyRefItem from "../Global/CopyRefItem.svelte";
  import { NetworkType } from "@lib/common/types";

  /////////////////////////////////////////////////
  // <NetworkSelect bind:{chainId} {txt} {label} />
  // Select Network via a list box
  /////////////////////////////////////////////////
  export let chainId: number = 0;
  export let txt: boolean = false;
  export let bound: boolean = undefined;
  export let label = true;

  let open = false;

  interface SwitchEventTarget extends EventTarget {
    value: number;
  }
  const _switchChainEvt = (evt?: Event) => {
    const _chainId = Number((evt.target as SwitchEventTarget).value);
    _switchChain(_chainId, evt).catch(console.error);
  };
  const _switchChain = async (_chainId: number, evt: Event): Promise<void> => {
    evt.preventDefault();
    chainId = _chainId;
  };

  const handleToggleOpen = () => (open = !open);

  // All mainnet networks
  // and testnet networks if current chain is testnet
  // that hasOpenBound if bound is true
  const networksFilter = (): Array<NetworkType> =>
    networks.filter(
      (nw: NetworkType) => (nw.mainnet || (isTestnet(chainId) && nw.testnet)) && (!bound || hasOpenBound(chainId))
    );
</script>

{#if txt}
  {#if label}Network{/if}

  <select on:change={_switchChainEvt}>
    {#each networksFilter() as nwk}
      <option value={nwk.chainId} selected={nwk.chainId == chainId}>
        <Network chainId={nwk.chainId} {txt} />
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
        title="&#009; NFTs Factory address (click to view in explorer )
        {resolverGetAddress(chainId)}"><i class="fas fa-info-circle" /></a
      >
      <CopyRefItem copyData={resolverGetAddress(chainId)} />
    </span>
  {/if}

  <div
    class="select-wrapper select-network"
    use:clickOutside={() => (open = false)}
    on:click={handleToggleOpen}
    on:keydown={handleToggleOpen}
  >
    <div class="select" class:open>
      <div class="select-trigger">
        <Network {chainId} txt={false} />
      </div>

      <div class="custom-options">
        {#each networksFilter() as nwk}
          <span
            class="custom-option {nwk.chainId == chainId && 'selected'}"
            data-value={getChainName(nwk.chainId)}
            on:click={(evt) => _switchChain(nwk.chainId, evt)}
            on:keydown={(evt) => _switchChain(nwk.chainId, evt)}
          >
            <Network chainId={nwk.chainId} txt={true} />
          </span>
        {/each}
      </div>
    </div>
  </div>
{/if}
