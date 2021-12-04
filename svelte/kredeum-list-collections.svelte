<script lang="ts">
  import type { Collection } from "lib/ktypes";

  import { onMount } from "svelte";
  import { nftsUrl, urlCache, getOpenNFTsAddress } from "lib/kconfig";
  import { listCollections, listCollectionsFromCache } from "lib/klist-collections";
  import { collectionName } from "lib/knfts";

  export let chainId: number = undefined;
  export let address: string = undefined;
  export let collection: Collection = undefined;
  export let popup = false;

  let collectionAddress: string;
  let allCollections: Map<string, Collection>;
  let collections: Map<string, Collection>;
  let refreshingCollections: boolean;
  let open = false;

  const collectionTotalSupply = (collContract: Collection) =>
    collContract?.totalSupply || (collContract?.totalSupply == 0 ? "0" : "?");
  const collectionNameAndTotalSupply = (collContract: Collection) =>
    collContract
      ? `${collectionName(collContract)} (${collectionTotalSupply(collContract)})`
      : "Choose collection";

  $: if (collectionAddress && address) {
    collection = allCollections.get(urlCache(nftsUrl(chainId, collectionAddress), address));
  }

  // ON NETWORK OR ADDRESS
  $: if (chainId && address) _listCollections();

  const getCollections = async () => {
    allCollections = listCollectionsFromCache(address);
    console.log("getOpenNFTsAddress(chainId)", getOpenNFTsAddress(chainId));

    collections = new Map(
      [...allCollections]
        .filter(([, collection]) => {
          return (
            // FILTER NETWORK
            collection.chainId === chainId &&
            // FILTER COLLECTION NOT EMPTY OR MINE OR DEFAULT
            (collection.totalSupply > 0 ||
              collection.owner === address ||
              collection.address === getOpenNFTsAddress(chainId)) &&
            // FILTER OpenNFTs collection inside popup
            (!popup || collection.openNFTsVersion)
          );
        })
        // SORT PER SUPPLY DESC
        .sort(([, a], [, b]) => b.totalSupply - a.totalSupply)
    );
    console.log(collections);
    // SET FIRST AS DEFAULT COLLECTION
    if (!collectionAddress) {
      const [firstCollection] = collections.values();
      collectionAddress = firstCollection?.address || "";
    }
  };

  const _listCollections = async (): Promise<void> => {
    getCollections();

    refreshingCollections = true;
    allCollections = await listCollections(chainId, address);
    refreshingCollections = false;

    getCollections();
  };

  onMount(async () => {
    window.addEventListener("click", (e: Event): void => {
      if (
        !popup &&
        !document.querySelector(".select-collection").contains(e.target as HTMLElement)
      ) {
        open = false;
      }
    });
  });
</script>

<div class="select-wrapper select-collection" on:click={() => (open = !open)}>
  {#if collections}
    {#if collections.size > 0}
      <div class="select" class:open>
        <div class="select-trigger">
          <span>{collectionNameAndTotalSupply(collection)}</span>
        </div>
        <div class="custom-options">
          {#each [...collections] as [, coll]}
            <span
              class="custom-option {coll.address == collectionAddress ? 'selected' : ''}"
              data-value={coll.address}
              on:click={() => (collectionAddress = coll.address)}
            >
              {collectionNameAndTotalSupply(coll)}
            </span>
          {/each}
        </div>
      </div>
    {:else}
      <p><em>NO Collection found !</em></p>
    {/if}
  {:else}
    <p>
      {#if refreshingCollections}
        Refreshing Collection list...
      {/if}
    </p>
  {/if}
</div>
