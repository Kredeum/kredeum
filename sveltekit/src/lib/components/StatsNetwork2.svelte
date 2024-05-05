<script lang="ts">
  import type { CollectionType, NetworkType } from "@kredeum/common/src/common/types";
  import { networks } from "@kredeum/common/src/common/networks";
  import HomeLayout from "@kredeum/svelte/src/components/Global/HomeLayout.svelte";
  import Navigation from "@kredeum/svelte/src/components/Global/Navigation.svelte";
  import {
    resolverGetCollectionsInfos,
    resolverGetCollectionsAddresses
  } from "@kredeum/common/src/resolver/resolver-get-collection";
  import {
    ADDRESS_DEAD,
    ADDRESS_ZERO,
    explorerCollectionUrl,
    getDappUrl,
    getShortAddress
  } from "@kredeum/common/src/common/config";
  import { collectionStore } from "../../../../svelte/src/stores/collection/collection";
  import { onMount } from "svelte";
  import Account from "../../../../svelte/src/components/Account/Account.svelte";

  ///////////////////////////////////////
  // <StatsNetwork {chainId} />
  ///////////////////////////////////////
  export let chainId: number;
  ///////////////////////////////////////

  let collections: CollectionType[] = [];

  onMount(async () => {
    console.log("onMount ~ chainId:", chainId);
    const res = await resolverGetCollectionsInfos(chainId, "0x981ab0D817710d8FFFC5693383C00D985A3BDa38");
    console.log("onMount ~ res: ", res);
    collections = Array.from(res.values());
    console.log("onMount ~ collections:", collections);
    console.log("onMount ~ network:", networks.getChainLabel(chainId));
  });
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
          <th>name</th>
          <th>Total </th>
          <th>View</th>
          <th>Collections Addresses</th>
        </tr>
      </thead>
      <tbody>
        {#each collections as collection}
          <tr>
            <td>{collection.name}</td>
            <td>{collection.totalSupply} {collection.symbol}</td>
            <td>
              <a href="{getDappUrl(chainId, { address: collection.address }, '')}@{ADDRESS_ZERO}" target="_blank"
                >view collection</a
              >
            </td>
            <td>
              <a href={explorerCollectionUrl(chainId, collection.address)} target="_blank">
                {collection.address}
              </a>
            </td>
          </tr>
        {/each}
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
    text-align: right;
    border-bottom: 1px solid #ddd;
    width: 180px;
  }
</style>
