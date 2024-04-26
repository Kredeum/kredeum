<script lang="ts">
  import { onMount } from "svelte";

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

  ///////////////////////////////////////
  // <Addresses networks={networks} />
  ///////////////////////////////////////
  export let networks: NetworkType[];
  ///////////////////////////////////////
  let total = 0;
  let done = 0;
  let counts = new Map<number, number>();

  const refreshCount = () => {
    total = [...counts].reduce((tot, [k, n]) => tot + (n || 0), 0);
    done = [...counts].filter((n) => n !== undefined).length;
    if (done === networks.length) sortNetworks();
  };

  const countCollections = async (chainId: number): Promise<number | undefined> => {
    let count = counts.get(chainId);
    if (count === undefined) {
      count = (await resolverCountCollections(chainId)) || 0;
      counts.set(chainId, count);
      refreshCount();
    }
    return count;
  };
  let refresh = 0;

  const sortNetworks = () => {
    console.log("sortNetworks ~ sortNetworks:", networks);
    networks.sort((a: NetworkType, b: NetworkType) => (counts.get(b.chainId) || 0) - (counts.get(a.chainId) || 0));
    refresh++;
  };

  onMount(() => {});
</script>

<table>
  <thead>
    <tr>
      <th>Chain ID</th>
      <th>Chain<br />Name<br />{done}/{networks.length}</th>
      <th>Collections<br />Count<br />{total}</th>
      <th>OpenNFTs<br />Factory</th>
      <th>OpenNFTs<br />Resolver</th>
      <th>OpenNFTsV4<br />Template</th>
      <th>OpenAutoMarket<br />Template</th>
    </tr>
  </thead>
  <tbody>
    {#key refresh}
      {#each networks as network}
        <tr>
          <td>{network.chainId}</td>
          <td>{network.chainName}</td>
          <td>
            {#await countCollections(network.chainId)}
              ...
            {:then count}
              {count}
            {:catch}
              ---
            {/await}
          </td>

          <td class="addr">
            <a href={factoryGetExplorerUrl(network.chainId)} target="_blank">
              {getShortAddress(factoryGetAddress(network.chainId))}
            </a>
          </td>
          <td class="addr">
            <a href={resolverGetExplorerUrl(network.chainId)} target="_blank">
              {getShortAddress(resolverGetAddress(network.chainId))}
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
    {/key}
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
