<script lang="ts">
  import { onMount } from "svelte";
  import type { Signer } from "ethers";
  import type { Collection } from "lib/kconfig";
  import { getChainName } from "lib/kconfig";

  import { listCollections, listCollectionsFromCache } from "lib/nfts-factory";
  import { collectionName } from "lib/knfts";
  import { utils } from "ethers";
  let collectionAddress: string;
  let Collections: Array<Collection>;
  let refreshingCollections: boolean;
  let open = false;

  export let chainId: number = undefined;
  export let address: string = undefined;
  export let collection: Collection = undefined;

  const collectionTotalSupply = (collContract: Collection) =>
    collContract?.totalSupply || (collContract?.totalSupply == 0 ? "0" : "?");
  const collectionNameAndTotalSupply = (collContract: Collection) =>
    collContract
      ? `${collectionName(collContract)} (${collectionTotalSupply(collContract)})`
      : "Choose collection";

  $: if (collectionAddress) {
    collection = Collections?.find((_collection) => _collection.address == collectionAddress);
  }

  // ON NETWORK OR ADDRESS
  $: if (chainId && address) _listCollections();

  async function _listCollections(): Promise<void> {
    // console.log("<kredeum-nfts/> listCollections", `nfts://${getChainName(chainId)}@${address}`);

    Collections = null;

    Collections = listCollectionsFromCache(chainId);
    // console.log("<kredeum-nfts/> Collections cache loaded", Collections);
    refreshingCollections = true;

    Collections = await listCollections(chainId, address);
    // console.log("<kredeum-nfts/> Collections refresh done", Collections);
    refreshingCollections = false;
  }

  onMount(async () => {
    window.addEventListener("click", (e: Event): void => {
      if (!document.querySelector(".select-collection").contains(e.target as HTMLElement)) {
        open = false;
      }
    });
  });
</script>

<div class="select-wrapper select-collection" on:click={() => (open = !open)}>
  {#if Collections}
    {#if Collections.length > 0}
      <div class="select" class:open>
        <div class="select-trigger">
          <span>{collectionNameAndTotalSupply(collection)}</span>
        </div>
        <div class="custom-options">
          {#each Collections as coll}
            <span
              class="custom-option {utils.getAddress(coll.address) == collectionAddress &&
                'selected'}"
              data-value={utils.getAddress(coll.address)}
              on:click={() => (collectionAddress = utils.getAddress(coll.address))}
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
