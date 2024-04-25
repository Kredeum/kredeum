<script lang="ts">
  import Addresses from "./Addresses.svelte";

  import { networks } from "@kredeum/common/src/common/networks";

  let activeTab = "mainnets";
</script>

<div class="stats">
  <h1>Kredeum NFTs Factory - Statistics</h1>

  <div class="tabs">
    <button class={activeTab === "mainnets" ? "active" : ""} on:click={() => (activeTab = "mainnets")}>Mainnets</button>
    <button class={activeTab === "opnets" ? "active" : ""} on:click={() => (activeTab = "opnets")}>OPnets</button>
    <button class={activeTab === "testnets" ? "active" : ""} on:click={() => (activeTab = "testnets")}>Testnets</button>
    <button class={activeTab === "inactives" ? "active" : ""} on:click={() => (activeTab = "inactives")}
      >Inactives</button
    >
  </div>

  {#if activeTab === "mainnets"}
    <Addresses networks={networks.getAllMainnets()} />
    {:else if activeTab === "opnets"}
      <Addresses networks={networks.getAllOpMainnets()} />
  {:else if activeTab === "testnets"}
    <Addresses networks={networks.getAllTestnets()} />
  {:else if activeTab === "inactives"}
    <Addresses networks={networks.getAllInactive()} />
  {/if}
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
