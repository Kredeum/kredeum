<script lang="ts">
  import StatsNetworkLine from "./StatsNetworkLine.svelte";
  import { stats, statsSort, statsSubTotal, statsSubTotalUpdated } from "$lib/stores/statsCounts";
  import { onMount } from "svelte";

  ///////////////////////////////////////
  // <Statsnetworks networks={networks} />
  ///////////////////////////////////////
  export let chainIds: number[];
  ///////////////////////////////////////
  let total = 0;
  let updated = 0;
  let chainIdsSorted: number[] = [];

  $: $stats && handleStats();
  const handleStats = () => {
    updated = statsSubTotalUpdated(chainIds);
    total = statsSubTotal(chainIds);
    chainIdsSorted = statsSort(chainIds);
  };
</script>

<table>
  <thead>
    <tr>
      <th>Chain ID</th>
      <th>Chain<br />Name<br />{updated}/{chainIds.length}</th>
      <th>Collections<br />Count<br />{total}</th>
      <th>OpenNFTs<br />Factory</th>
      <th>OpenNFTs<br />Resolver</th>
      <th>OpenNFTsV4<br />Template</th>
      <th>OpenAutoMarket<br />Template</th>
    </tr>
  </thead>
  <tbody>
    {#each chainIdsSorted as chainId}
      <StatsNetworkLine {chainId} />
    {/each}
  </tbody>
</table>

<style>
  table {
    border-collapse: collapse;
  }

  th {
    padding: 8px;
    text-align: right;
    border-bottom: 1px solid #ddd;
    width: 180px;
  }

  th {
    background-color: #f2f2f2;
  }

  tr:hover {
    background-color: #f5f5f5;
  }
</style>
