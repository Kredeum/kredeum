<script lang="ts">
  import type { Collection } from "lib/ktypes";

  import { listCollections, listCollectionsFromCache } from "lib/klist-collections";
  import { nftsUrl, urlOwner, getOpenNFTsAddress } from "lib/kconfig";
  import { collectionName } from "lib/knfts";
  import { onMount } from "svelte";

  export let chainId: number = undefined;
  export let owner: string = undefined;
  export let collection: Collection = undefined;
  export let popup = false;

  let collectionAddress: string;
  let allCollections: Map<string, Collection>;
  let collections: Map<string, Collection>;
  let refreshingCollections: boolean;
  let open = false;

  // ON CHAINID or OWNER change THEN LIST collections
  $: if (chainId && owner) {
    // console.log("KredeumListCollections chainId or owner changed", chainId, owner);
    _setCollection("");
    _listCollections(chainId, owner);
  }

  const _setCollection = async (_collectionAddress: string): Promise<void> => {
    // console.log("KredeumListCollections _setCollection", _collectionAddress);
    collectionAddress = _collectionAddress;
    if (chainId && owner && collectionAddress) {
      collection = allCollections.get(urlOwner(nftsUrl(chainId, collectionAddress), owner));
    } else {
      collection = null;
    }
  };

  const _listCollections = async (_chainId: number, _owner: string): Promise<void> => {
    // console.log("KredeumListCollections _listCollections", _chainId, _owner);
    getCollections();

    refreshingCollections = true;
    allCollections = await listCollections(_chainId, _owner);
    refreshingCollections = false;

    getCollections();
  };

  const getCollections = async () => {
    // console.log("KredeumListCollections getCollections");
    allCollections = listCollectionsFromCache(owner);

    collections = new Map(
      [...allCollections]
        .filter(([, collection]) => {
          return (
            // FILTER NETWORK
            collection.chainId === chainId &&
            // FILTER COLLECTION NOT EMPTY OR MINE OR DEFAULT
            (collection.balanceOf > 0 ||
              collection.owner === owner ||
              collection.address === getOpenNFTsAddress(chainId)) &&
            // FILTER OpenNFTs collection inside popup
            (!popup || collection.openNFTsVersion)
          );
        })
        // SORT PER SUPPLY DESC
        .sort(([, a], [, b]) => b.balanceOf - a.balanceOf)
    );
    // console.log(collections);

    // SET FIRST AS DEFAULT COLLECTION
    if (!collectionAddress) {
      const [firstCollection] = collections.values();
      _setCollection(firstCollection?.address || "");
    }
  };

  const collectionBalanceOf = (collContract: Collection) =>
    collContract?.balanceOf || (collContract?.balanceOf == 0 ? "0" : "?");
  const collectionNameAndBalanceOf = (collContract: Collection) =>
    collContract
      ? `${collectionName(collContract)} (${collectionBalanceOf(collContract)})`
      : "Choose collection";

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
          <span>{collectionNameAndBalanceOf(collection)}</span>
        </div>
        <div class="custom-options">
          {#each [...collections] as [, coll]}
            <span
              class="custom-option {coll.address == collectionAddress ? 'selected' : ''}"
              data-value={coll.address}
              on:click={() => _setCollection(coll.address)}
            >
              {collectionNameAndBalanceOf(coll)}
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
