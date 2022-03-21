<script lang="ts">
  import type { Collection } from "lib/ktypes";
  import type { JsonRpcSigner } from "@ethersproject/providers";

  import KredeumListCollections from "./CollectionsListOld.svelte";

  import { nftsUrl, explorerCollectionUrl } from "lib/kconfig";
  import { factoryGetAddress } from "lib/kfactory-get";

  import { chainId, owner } from "main/network";

  export let txt = false;
  export let collection: Collection = undefined;

  const _explorerCollectionUrl = (_collectionAddress: string): string => {
    const ret = explorerCollectionUrl($chainId, _collectionAddress);
    // console.log("_explorerCollectionUrl", ret);
    return ret;
  };

  const _nftsUrl = (_collectionAddress: string): string => nftsUrl($chainId, _collectionAddress);

  const _supports = (_collection: Collection): string =>
    collection?.supports?.IERC721 ? "ERC721" : collection?.supports?.IERC1155 ? "ERC1155" : "";
</script>

{#if txt}
  {#if $owner && factoryGetAddress($chainId)}
    <p>
      <KredeumListCollections bind:collection {txt} />
    </p>
  {/if}
{:else}
  <div class="col col-xs-12 col-sm-3">
    {#if $owner && factoryGetAddress($chainId)}
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
      <KredeumListCollections bind:collection {txt} />
    {/if}
  </div>
{/if}
