<script lang="ts">
  import type { NetworkType } from "@kredeum/common/src/common/types";

  import { resolverGetExplorerUrl, resolverGetAddress } from "@kredeum/common/src/resolver/resolver-get";
  import { factoryGetExplorerUrl, factoryGetAddress } from "@kredeum/common/src/common/factory-get";

  import {
    getShortAddress,
    getAddressOpenNFTsTemplate,
    getAddressOpenAutoMarket,
    explorerContractUrl
  } from "@kredeum/common/src/common/config";
  import { resolverCountCollections } from "@kredeum/common/src/resolver/resolver-get-collection";
  import { onMount } from "svelte";

  type NetworkTypeSorted = NetworkType & { countCollection?: number };

  export let networks: NetworkType[];

  let networksSorted: NetworkTypeSorted[];

  const countCollections = async (nw: NetworkTypeSorted): Promise<number | undefined> => {
    nw.countCollection ||= await resolverCountCollections(nw.chainId);

    return nw.countCollection;
  };

  onMount(async () => {
    await Promise.all(networks.map(countCollections));
    networksSorted = [...networks].sort(
      (a: NetworkTypeSorted, b: NetworkTypeSorted) => (b.countCollection || 0) - (a.countCollection || 0)
    );
    console.log("sorted !", networksSorted);
  });
</script>

<table>
  <thead>
    <tr>
      <th>Chain ID</th>
      <th>Chain Name</th>
      <th>Collections<br />Count</th>
      <th>OpenNFTs<br />Resolver</th>
      <th>OpenNFTs<br />Factory</th>
      <th>OpenNFTsV4<br />Template</th>
      <th>OpenAutoMarket<br />Template</th>
    </tr>
  </thead>
  <tbody>
    {#each networksSorted || networks as network}
      <tr>
        <td>{network.chainId}</td>
        <td>{network.chainName}</td>
        <td>
          {#await countCollections(network)}
            ...
          {:then count}
            {count}
          {:catch}
            ---
          {/await}
        </td>

        <td class="addr">
          <a href={resolverGetExplorerUrl(network.chainId)} target="_blank">
            {getShortAddress(resolverGetAddress(network.chainId))}
          </a>
        </td>
        <td class="addr">
          <a href={factoryGetExplorerUrl(network.chainId)} target="_blank">
            {getShortAddress(factoryGetAddress(network.chainId))}
          </a>
        </td>
        <td class="addr">
          <a href={explorerContractUrl(network.chainId, getAddressOpenNFTsTemplate(network.chainId))} target="_blank">
            {getShortAddress(getAddressOpenNFTsTemplate(network.chainId))}
          </a>
        </td>
        <td class="addr">
          <a href={explorerContractUrl(network.chainId, getAddressOpenAutoMarket(network.chainId))} target="_blank">
            {getShortAddress(getAddressOpenAutoMarket(network.chainId))}
          </a>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    border-collapse: collapse;
  }

  th,
  td {
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

  .addr {
    font-family: "Courier New", monospace;
  }
  .addr a {
    color: #007bff;
    text-decoration: none;
    transition: color 0.2s;
  }

  .addr a:hover {
    color: #0056b3;
    text-decoration: underline;
  }
</style>
