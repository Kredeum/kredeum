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
  export let chainId: number = 137;
  export let txt: boolean = false;
  export let all: boolean = true;
  export let label = true;

  let open = false;

  // Get Metamask chainId by default at startup
  // $: chainId ||= $metamaskChainId;

  interface SwitchEventTarget extends EventTarget {
    value: number;
  }
  const _switchChainEvt = (evt?: Event) => {
    // console.log("_switchChainEvt evt", evt);

    chainId = Number((evt.target as SwitchEventTarget).value);
    //   _switchChain(_chainId, evt).catch(console.error);
  };
  const _switchChain = async (_chainId: number, evt: Event): Promise<void> => {
    // console.log("_switchChain evt", evt);
    evt.preventDefault();

    //   await metamaskSwitchChain(_chainId);
    chainId = _chainId;
  };
</script>

<!-- <div class="col col-xs-12 col-sm-3"> -->
{#if label}
  <span class="label"
    >Network
    <a
      class="info-button"
      href={explorerNFTsFactoryUrl(chainId)}
      target="_blank"
      title="&#009; NFTs Factory address (click to view in explorer )
        {getNftsFactory(chainId)}"><i class="fas fa-info-circle" /></a
    >
  </span>
{/if}

<div class="select-wrapper select-network" use:clickOutside={() => (open = false)} on:click={() => (open = !open)}>
  <div class="select" class:open>
    <div class="select-trigger">
      <!-- <Network {chainId} {txt} /> -->
      Choose blochain
    </div>
    <div class="custom-options" />

    <div class="custom-options">
      {#each networks.filter((nw) => nw.mainnet && (all || nw.openMulti)) as nwk}
        <span
          class="custom-option {nwk.chainId == chainId && 'selected'}"
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
            class="custom-option {nwk.chainId == chainId && 'selected'}"
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
