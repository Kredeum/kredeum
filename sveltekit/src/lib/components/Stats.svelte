<script lang="ts">
  import HomeLayout from "@kredeum/svelte/src/components/Global/HomeLayout.svelte";
  import Navigation from "@kredeum/svelte/src/components/Global/Navigation.svelte";

  import StatsNetworks from "./StatsNetworks.svelte";

  import { networks } from "@kredeum/common/src/common/networks";
  import { statsClean } from "$lib/stores/statsCounts";
  import { goto } from "$app/navigation";

  // Manage StatsNetworks Svelte components in Tabs with 2 states:
  // - active (i.e. displayed) or not (only one at a time)
  // - mounted or not (mounted one time, can't be unmounted)
  // To avoid re-calling onchain data each time tab is reactivated
  // To avoid calling onchain data on a tab never activated
  type TabsMounted = { [key: string]: boolean };
  let tabsMounted: TabsMounted = {
    Mainnets: true,
    OPnets: false,
    Testnets: false
  };
  let tabActive = "Mainnets";

  const getChainIds = (tab: string): number[] => {
    if (tab === "OPnets") return networks.getAllOpMainnetIds();
    if (tab === "Testnets") return networks.getAllTestnetIds();
    return networks.getAllMainnetIds();
  };

  const refresh = () => {
    statsClean();
    window.location.reload();
  };

  $: console.log(tabsMounted);
</script>

<HomeLayout>
  <span slot="nav">
    <Navigation back="/" />
  </span>

  <span slot="header">
    <h1>Kredeum NFTs Factory - Statistics</h1>
  </span>

  <span slot="content">
    <div class="stats">
      <div class="tabs">
        {#each Object.keys(tabsMounted) as tabKey}
          <button
            class={tabActive === tabKey ? "active" : ""}
            on:click={() => {
              console.log("click", tabKey, tabsMounted);
              tabActive = tabKey;
              tabsMounted[tabKey] = true;
            }}>{tabKey}</button
          >
        {/each}

        <div class="tab-right">
          <button on:click={() => refresh()}>Refresh</button>
        </div>
      </div>

      {#each Object.entries(tabsMounted) as [tabKey, tabMounted]}
        {#if tabMounted}
          <span class={tabActive === tabKey ? "" : "hidden"}>
            <StatsNetworks chainIds={getChainIds(tabKey)} />
          </span>
        {/if}
      {/each}
    </div>
  </span>
</HomeLayout>

<style>
  .stats {
    margin-left: 20px;
    width: 1024px;
  }

  .tabs {
    display: flex;
    gap: 10px;
  }

  .tabs button {
    padding: 10px;
    border: none;
    cursor: pointer;
    background-color: #aaa;
  }

  .tabs button.active {
    background-color: #eee;
  }

  .tab-right {
    text-align: right;
    width: 100%;
  }

  .tab-right button {
    background-color: white;
  }
</style>
