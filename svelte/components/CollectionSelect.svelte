<script lang="ts">
  import type { Collection } from "lib/ktypes";

  import CollectionSelectList from "./CollectionSelectList.svelte";

  import { nftsUrl, explorerCollectionUrl } from "lib/kconfig";
  import { factoryGetAddress } from "lib/kfactory-get";

  import { currentCollection } from "main/current";

  /////////////////////////////////////////////////
  // <CollectionSelect {chainId} {account} bind:{collection} {minting} {txt} />
  // Select Collection with label
  /////////////////////////////////////////////////
  export let chainId: number;
  export let account: string;
  export let collection: string = undefined;
  export let minting = false;
  export let txt = false;

  const _explorerCollectionUrl = (_collection: string): string => {
    const ret = explorerCollectionUrl(chainId, _collection);
    // console.log("_explorerCollectionUrl", ret);
    return ret;
  };

  $: if (collection) currentCollection.set(collection);

  const _nftsUrl = (_collection: string): string => nftsUrl(chainId, _collection);
</script>

{#if txt}
  {#if factoryGetAddress(chainId)}
    <p>
      <CollectionSelectList {chainId} {account} bind:collection {minting} {txt} />
    </p>
  {/if}
{:else}
  <div class="col col-xs-12 col-sm-3">
    {#if factoryGetAddress(chainId)}
      <span class="label"
        >Collection
        {#if collection}
          <a
            class="info-button"
            href={_explorerCollectionUrl(collection)}
            title="&#009;  Collection address (click to view in explorer)&#013;
            {_nftsUrl(collection)}"
            target="_blank"><i class="fas fa-info-circle" /></a
          >
        {/if}
      </span>
      <CollectionSelectList {chainId} {account} bind:collection {minting} {txt} />
    {/if}
  </div>
{/if}
