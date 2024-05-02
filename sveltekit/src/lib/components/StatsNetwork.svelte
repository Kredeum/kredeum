<script lang="ts">
  import type { NetworkType } from "@kredeum/common/src/common/types";
  import { networks } from "@kredeum/common/src/common/networks";
  import HomeLayout from "@kredeum/svelte/src/components/Global/HomeLayout.svelte";
  import Navigation from "@kredeum/svelte/src/components/Global/Navigation.svelte";
  import { resolverGetCollectionsAddresses } from "@kredeum/common/src/resolver/resolver-get-collection";
  import { explorerCollectionUrl, getShortAddress } from "@kredeum/common/src/common/config";

  ///////////////////////////////////////
  // <StatsNetwork {chainId} />
  ///////////////////////////////////////
  export let chainId: number;
  ///////////////////////////////////////
</script>

<HomeLayout>
  <span slot="nav">
    <Navigation back="/stats" />
  </span>

  <span slot="header">
    <h1>Kredeum NFTs Factory - Statistics {networks.getChainLabel(chainId).toUpperCase()}</h1>
  </span>

  <span slot="content">
    <h1>
      {chainId}
    </h1>

    {#await resolverGetCollectionsAddresses(chainId)}
      ...
    {:then collections}
      {#each collections as collection}
        <div>
          <a href={explorerCollectionUrl(chainId, collection)} target="_blank">{collection}</a>
        </div>
      {/each}
    {:catch}
      ---
    {/await}
  </span>
</HomeLayout>
