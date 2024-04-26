<script lang="ts">
  import Addresses from "./Addresses.svelte";

  import type { NetworkType } from "@kredeum/common/src/common/types";
  import { networks } from "@kredeum/common/src/common/networks";

  // Manage Addresses Svelte components in Tabs with 2 states:
  // - active (i.e. displayed) or not (only one at a time)
  // - mounted or not (mounted one time, can't be unmounted)
  // To avoid re-calling onchain data each time tab is reactivated
  // To avoid calling onchain data on a tab never activated
  type TabsMounted = { [key: string]: boolean };
  let tabsMounted: TabsMounted = {
    Mainnets: true,
    OPnets: false,
    Testnets: false,
    Inactives: false
  };
  let tabActive = "Mainnets";

  const getNetworks = (tab: string): NetworkType[] => {
    if (tab === "OPnets") return networks.getAllOpMainnets();
    if (tab === "Testnets") return networks.getAllTestnets();
    if (tab === "Inactives") return networks.getAllInactive();
    return networks.getAllMainnets();
  };
</script>

<div class="stats">
  <h1>Kredeum NFTs Factory - Statistics</h1>

  <div class="tabs">
    {#each Object.keys(tabsMounted) as tabKey}
      <button
        class={tabActive === tabKey ? "active" : ""}
        on:click={() => {
          tabActive = tabKey;
          tabsMounted[tabKey] = true;
        }}>{tabKey}</button
      >
    {/each}
  </div>

  {#each Object.entries(tabsMounted) as [tabKey, tabMounted]}
    {#if tabMounted}
      <span class={tabActive === tabKey ? "" : "hidden"}>
        <Addresses networks={getNetworks(tabKey)} />
      </span>
    {/if}
  {/each}
</div>

<style>
  .stats {
    margin-left: 20px;
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
</style>
