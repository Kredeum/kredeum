<script lang="ts">
  import { clickOutside } from "helpers/clickOutside";
  import { getNftsFactory, getChainName, getNetwork, networks, explorerNFTsFactoryUrl } from "lib/kconfig";

  import { metamaskSwitchChain } from "helpers/metamask";
  import { metamaskChainId } from "main/metamask";

  import Network from "./Network.svelte";

  /////////////////////////////////////////////////
  // <NetworkList bind:{chainId} {txt} {label} />
  // Select Network via a list box
  /////////////////////////////////////////////////
  export let toClaimChainId: number;
  export let txt: boolean = false;
  export let all: boolean = true;
  export let label = true;

  let open = false;

  const _switchChain = async (_chainId: number, evt: Event): Promise<void> => {
    evt.preventDefault();

    toClaimChainId = _chainId;
  };
</script>

<div class="select-wrapper select-network" use:clickOutside={() => (open = false)} on:click={() => (open = !open)}>
  <div class="select" class:open>
    <div class="select-trigger">
      {#if !toClaimChainId}
        Choose blochain
      {:else}
        <Network chainId={toClaimChainId} {txt} />
      {/if}
    </div>
    <div class="custom-options" />

    <div class="custom-options">
      {#each networks.filter((nw) => nw.mainnet && (all || nw.openMulti)) as nwk}
        <span
          class="custom-option {nwk.chainId == toClaimChainId && 'selected'}"
          data-value={getChainName(nwk.chainId)}
          on:click={(evt) => _switchChain(nwk.chainId, evt)}
        >
          <Network chainId={nwk.chainId} txt={true} />
        </span>
      {/each}
      <!-- {#if getNetwork(chainId)?.testnet} -->
      {#if true}
        {#each networks.filter((nw) => nw.testnet && (all || nw.openMulti)) as nwk}
          <span
            class="custom-option {nwk.chainId == toClaimChainId && 'selected'}"
            data-value={getChainName(nwk.chainId)}
            on:click={(evt) => _switchChain(nwk.chainId, evt)}
          >
            <Network chainId={nwk.chainId} txt={true} />
          </span>
        {/each}
      {/if}
    </div>
  </div>
</div>

<!-- </div> -->
<style>
  .select-trigger {
    border: 1px solid lightgray;
  }
</style>
