<script lang="ts">
  import { onMount } from "svelte";

  import { factoryGetAddress } from "lib/kfactory-get";
  import { explorerNFTsFactoryUrl } from "lib/kconfig";

  import Network from "./Network.svelte";
  import NetworkSelect from "./NetworkSelect.svelte";
  import { metamaskChainId } from "main/metamask";

  export let txt: boolean = false;
  export let label: boolean = true;
</script>

{#if txt}
  Network
  <NetworkSelect chainId={$metamaskChainId} {txt} />
{:else}
  <div class="col col-xs-12 col-sm-3">
    {#if label}
      <span class="label"
        >Network
        <a
          class="info-button"
          href={explorerNFTsFactoryUrl($metamaskChainId)}
          target="_blank"
          title="&#009; NFTs Factory address (click to view in explorer )
          {factoryGetAddress($metamaskChainId)}"><i class="fas fa-info-circle" /></a
        >
      </span>
    {/if}
    <NetworkSelect chainId={$metamaskChainId} {txt} />
  </div>
{/if}
