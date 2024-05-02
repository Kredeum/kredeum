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
  import { networks } from "@kredeum/common/src/common/networks";

  import { statsUpdate } from "../stores/statsCounts";

  ///////////////////////////////////////
  // <Addresses networks={networks} />
  ///////////////////////////////////////
  export let chainId: number;
  ///////////////////////////////////////

  const countCollections = async (chainId: number): Promise<number | undefined> => {
    const count = await resolverCountCollections(chainId);
    if (count !== undefined) statsUpdate(chainId, count);

    console.log("countCollections:", chainId, count);
    return count;
  };
</script>

{#if chainId}
  <tr>
    <td>{chainId}</td>
    <td><a href="/stats/{chainId}">{networks.getChainName(chainId)}</a></td>
    <td>
      {#await countCollections(chainId)}
        ...
      {:then value}
        {value}
      {:catch}
        ---
      {/await}
    </td>

    <td class="addr">
      <a href={factoryGetExplorerUrl(chainId)} target="_blank">
        {getShortAddress(factoryGetAddress(chainId))}
      </a>
    </td>
    <td class="addr">
      <a href={resolverGetExplorerUrl(chainId)} target="_blank">
        {getShortAddress(resolverGetAddress(chainId))}
      </a>
    </td>
    <td class="addr">
      <a href={explorerContractUrl(chainId, getAddressOpenNFTsTemplate(chainId))} target="_blank">
        {getShortAddress(getAddressOpenNFTsTemplate(chainId))}
      </a>
    </td>
    <td class="addr">
      <a href={explorerContractUrl(chainId, getAddressOpenAutoMarket(chainId))} target="_blank">
        {getShortAddress(getAddressOpenAutoMarket(chainId))}
      </a>
    </td>
  </tr>
{/if}

<style>
  tr:hover {
    background-color: #f5f5f5;
  }
  td {
    padding: 8px;
    text-align: right;
    border-bottom: 1px solid #ddd;
    width: 180px;
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
