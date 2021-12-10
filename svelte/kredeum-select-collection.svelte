<script lang="ts">
  import type { Collection } from "lib/ktypes";
  import type { Signer } from "ethers";

  import KredeumListCollections from "./kredeum-list-collections.svelte";
  import KredeumMetamask from "./kredeum-metamask.svelte";

  import { getCreate, getNftsFactory, nftsUrl } from "lib/kconfig";
  import { explorerCollectionUrl } from "lib/knfts";

  // down from parent
  export let txt = false;
  // up from KredeumMetamask up to parent
  export let chainId: number;
  export let signer: Signer;
  // up to parent
  export let collection: Collection;

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // <KredeumMetamask autoconnect="off" bind:chainId bind:signer />
  // <KredeumListCollections bind:owner bind:chainId bind:collection />
  //
  // down to KredeumListCollections
  let owner: string;
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // ON CHAINID, OWNER OR COLLECTION CHANGE
  // $: logChange(chainId, owner, collection);
  // const logChange = async (_chainId: number, _owner: string, _collection: Collection) =>
  //   console.log("KredeumListCollections chainId, owner or collection changed", _chainId, _owner, _collection);

  // SET owner WHEN signer change
  $: setOwner(signer);
  const setOwner = async (_signer) => _signer && (owner = await _signer.getAddress());

  const _explorerCollectionUrl = (_collectionAddress: string): string => {
    const ret = explorerCollectionUrl(chainId, _collectionAddress);
    // console.log("_explorerCollectionUrl", ret);
    return ret;
  };

  const _nftsUrl = (_collectionAddress: string): string => nftsUrl(chainId, _collectionAddress);
</script>

<KredeumMetamask autoconnect="off" bind:chainId bind:signer bind:txt />
{#if txt}
  {#if owner && getNftsFactory(chainId)}
    <p>
      <KredeumListCollections bind:owner bind:chainId bind:collection bind:txt />
    </p>
  {/if}
{:else}
  <div class="col col-xs-12 col-sm-3">
    {#if owner && getNftsFactory(chainId)}
      <span class="label"
        >Collection
        {#if collection}
          <a
            class="info-button"
            href={_explorerCollectionUrl(collection.address)}
            title="&#009;Collection owner (click to view in explorer )&#013;{_nftsUrl(
              collection.address
            )}"
            target="_blank"><i class="fas fa-info-circle" /></a
          >
        {/if}
      </span>
      <KredeumListCollections bind:owner bind:chainId bind:collection bind:txt />
    {/if}
  </div>
{/if}
