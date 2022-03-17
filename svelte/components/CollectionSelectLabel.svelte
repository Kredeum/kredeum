<script lang="ts">
  import type { Collection } from "lib/ktypes";

  import CollectionSelect from "./CollectionSelect.svelte";

  import { nftsUrl, explorerCollectionUrl } from "lib/kconfig";
  import { factoryGetAddress } from "lib/kfactory-get";

  import { metamaskChainId, metamaskAccount } from "main/metamask";
  import { currentCollection } from "main/current";

  export let txt = false;
  export let collection: Collection = undefined;

  $: if (collection) currentCollection.set(collection.address);

  const _explorerCollectionUrl = (_collectionAddress: string): string => {
    const ret = explorerCollectionUrl($metamaskChainId, _collectionAddress);
    // console.log("_explorerCollectionUrl", ret);
    return ret;
  };

  const _nftsUrl = (_collectionAddress: string): string => nftsUrl($metamaskChainId, _collectionAddress);

  const _supports = (_collection: Collection): string =>
    _collection?.supports?.IERC721 ? "ERC721" : _collection?.supports?.IERC1155 ? "ERC1155" : "";
</script>

{#if txt}
  {#if factoryGetAddress($metamaskChainId)}
    <p>
      <CollectionSelect bind:collection {txt} />
    </p>
  {/if}
{:else}
  <div class="col col-xs-12 col-sm-3">
    {#if factoryGetAddress($metamaskChainId)}
      <span class="label"
        >Collection
        {#if collection}
          <a
            class="info-button"
            href={_explorerCollectionUrl(collection.address)}
            title="&#009; {_supports(collection)}  Collection address (click to view in explorer)&#013;
            {_nftsUrl(collection.address)}"
            target="_blank"><i class="fas fa-info-circle" /></a
          >
        {/if}
      </span>
      <CollectionSelect chainId={$metamaskChainId} account={$metamaskAccount} bind:collection {txt} />
    {/if}
  </div>
{/if}
