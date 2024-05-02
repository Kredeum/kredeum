<script lang="ts">
  import type { NetworkType } from "@kredeum/common/src/common/types";
  import { networks } from "@kredeum/common/src/common/networks";
  import HomeLayout from "@kredeum/svelte/src/components/Global/HomeLayout.svelte";
  import Navigation from "@kredeum/svelte/src/components/Global/Navigation.svelte";
  import {
    resolverGetCollectionsInfos,
    resolverGetCollectionsAddresses
  } from "@kredeum/common/src/resolver/resolver-get-collection";
  import { ADDRESS_ZERO, explorerCollectionUrl, getDappUrl, getShortAddress } from "@kredeum/common/src/common/config";

  ///////////////////////////////////////
  // <StatsNetwork {chainId} />
  ///////////////////////////////////////
  export let chainId: number;
  ///////////////////////////////////////

  resolverGetCollectionsInfos(chainId).then(console.log);
</script>

<HomeLayout>
  <span slot="nav">
    <Navigation back="/stats" />
  </span>

  <span slot="header">
    <h1>Kredeum NFTs Factory - Statistics {networks.getChainLabel(chainId).toUpperCase()}</h1>
  </span>

  <span slot="content">
    <table>
      <caption> <h1>{networks.getChainName(chainId)} #{chainId}</h1></caption>
      <thead>
        <tr>
          <th>Total Supply</th>
          <th>View</th>
          <th>Collections Addresses</th>
        </tr>
      </thead>
      <tbody>
        {#await resolverGetCollectionsAddresses(chainId)}
          ...
        {:then addresses}
          {#each addresses as address}
            <tr>
              <td>1</td>
              <td> 
                <a href="{getDappUrl(chainId, { address }, '')}@{ADDRESS_ZERO}" target="_blank">view collection</a>
              </td>
              <td>
                <a href={explorerCollectionUrl(chainId, address)} target="_blank">{address}</a>
              </td>
            </tr>
          {/each}
        {:catch}
          ---
        {/await}
      </tbody>
    </table>
  </span>
</HomeLayout>

<style>
  table {
    border-collapse: collapse;
  }

  th {
    padding: 8px;
    text-align: center;
    border-bottom: 1px solid #ddd;
    width: 180px;
  }

  th {
    background-color: #f2f2f2;
  }

  tr:hover {
    background-color: #f5f5f5;
  }

  tr:hover {
    background-color: #f5f5f5;
  }
  td {
    font-family: "Courier New", monospace;
    padding: 8px;
    text-align: center;
    border-bottom: 1px solid #ddd;
    width: 180px;
  }
</style>
