<script lang="ts">
  import { factoryGetAddress } from "lib/kfactory-get";
  import { explorerNFTsFactoryUrl } from "lib/kconfig";

  import NetworkSelectList from "./NetworkSelectList.svelte";

  /////////////////////////////////////////////////
  // <NetworkSelect {chainId} {txt} />
  // Select Network with label
  /////////////////////////////////////////////////
  export let chainId: number = undefined;
  export let txt = false;
  export let label = true;
</script>

{#if txt}
  Network
  <NetworkSelectList bind:chainId {txt} />
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
    <NetworkSelectList bind:chainId {txt} />
  </div>
{/if}
