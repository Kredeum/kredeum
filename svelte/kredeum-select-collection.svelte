<script lang="ts">
  import type { Collection } from "lib/ktypes";
  import type { JsonRpcSigner } from "@ethersproject/providers";

  import KredeumListCollections from "./kredeum-list-collections.svelte";
  import KredeumMetamask from "./kredeum-metamask.svelte";

  import { getCreate, getNftsFactory, nftsUrl } from "lib/kconfig";
  import { explorerCollectionUrl } from "lib/knfts";

  import { chainId, owner } from "./network";

  // down from parent
  export let txt = false;
  // up to parent
  export let collection: Collection = undefined;

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // <KredeumMetamask autoconnect="off" />
  // <KredeumListCollections bind:collection />
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const _explorerCollectionUrl = (_collectionAddress: string): string => {
    const ret = explorerCollectionUrl($chainId, _collectionAddress);
    // console.log("_explorerCollectionUrl", ret);
    return ret;
  };

  const _nftsUrl = (_collectionAddress: string): string => nftsUrl($chainId, _collectionAddress);
  const _supports = (_collection: Collection): string =>
    collection?.supports?.ERC721 ? "ERC721" : collection?.supports?.ERC1155 ? "ERC1155" : "";
</script>

<KredeumMetamask autoconnect="off" bind:txt />
{#if txt}
  {#if $owner && getNftsFactory($chainId)}
    <p>
      <KredeumListCollections bind:collection bind:txt />
    </p>
  {/if}
{:else}
  <div class="col col-xs-12 col-sm-3">
    {#if $owner && getNftsFactory($chainId)}
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
      <KredeumListCollections bind:collection bind:txt />
    {/if}
  </div>
{/if}
