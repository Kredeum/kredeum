<script lang="ts">
  import type { Readable, Writable } from "svelte/store";

  import { explorerCollectionUrl, isAddressNotZero } from "@lib/common/config";

  import NftsDisplayMode from "./NftsDisplayMode.svelte";

  import NftsLines from "./NftsLines.svelte";
  import NftsGrid from "./NftsGrid.svelte";
  import { keyCollection } from "@lib/common/keys";

  import { nftSubListRefresh, nftSubListStore } from "@stores/nft/nftSubList";
  import { collectionStore } from "@stores/collection/collection";

  import { CollectionType, NftType } from "@lib/common/types";
  import { getContext } from "svelte";

  const PAGE_SIZE = 12;

  /////////////////////////////////////////////////
  // <Nfts {chainId} {address} {tokenID?} {account?} {page?}  {refreshing?}/>
  // List Nfts from collection owned by account
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string = undefined;
  export let owner: string = undefined;
  export let page = 1;
  export let refreshing: boolean = false;
  export let platform: string = undefined;
  export let end: boolean = false;
  ////////////////////////////////////////////////////////////////////////

  let refreshAll: Writable<number> = getContext("refreshAll");
  let collection: Readable<CollectionType>;
  let nfts: Readable<Map<string, NftType>>;

  $: ownerSupply =
    isAddressNotZero(owner) && $collection?.balancesOf?.has(owner) ? $collection.balancesOf.get(owner) : -1;
  $: totalSupply = $collection?.hasOwnProperty("totalSupply") ? $collection.totalSupply : -1;
  $: maxSupply = isAddressNotZero(owner) ? ownerSupply : totalSupply;

  $: $refreshAll, tokenID, owner, page > 0 && chainId && isAddressNotZero(address) && refresh();

  const refresh = async () => {
    collection = collectionStore.getOne(chainId, address);
    console.info("NFTS cached collection", $collection);

    // await tick();
    let offset = 0;

    let limit = page * PAGE_SIZE;
    if (0 < maxSupply && maxSupply < limit) limit = maxSupply;

    if (limit > offset) {
      nfts = nftSubListStore(chainId, address, { tokenID, owner, offset, limit });
    }
    console.info("NFTS cached", $nfts);
    console.info("NFTS cached params", chainId, address, { tokenID, owner, offset, limit });

    refreshing = true;
    await collectionStore.refreshOne(chainId, address, owner);
    // await tick();

    limit = page * PAGE_SIZE;
    if (0 < maxSupply && maxSupply < limit) limit = maxSupply;

    offset = Math.max(limit - PAGE_SIZE, 0);
    if (0 < maxSupply && maxSupply < offset) offset = maxSupply;

    // console.log("NFTS collection:", $collection);
    // console.log("NFTS collection has totalSupply", $collection?.hasOwnProperty("totalSupply"));

    // console.log("NFTS ownerSupply:", ownerSupply);
    // console.log("NFTS totalSupply:", totalSupply);
    // console.log("NFTS maxSupply:", maxSupply);
    // console.log("NFTS page:", page);
    // console.log("NFTS limit:", limit);
    // console.log("NFTS offset:", offset);
    // console.log("NFTS end:", end);

    if (limit > offset) {
      await nftSubListRefresh(chainId, address, { tokenID, owner, offset, limit });
    }
    end = $nfts.size < page * PAGE_SIZE;

    refreshing = false;

    console.info("NFTS refreshed", $nfts);
    console.info("NFTS refreshed params", chainId, address, { tokenID, owner, offset, limit });
  };

  let mode: string = "grid";

  $: console.log("NFTS from", chainId, address, tokenID, owner);
</script>

<div class="row alignbottom">
  <div class="col col-xs-12">
    <h2>Collection '{$collection?.name}'</h2>
    {#if owner}{ownerSupply >= 0 ? ownerSupply : "0"} / {/if}
    {totalSupply >= 0 ? totalSupply : "?"}
    {$collection?.symbol || "NFT"}
    {#if refreshing}...{/if}
    <a
      class="info-button"
      href={explorerCollectionUrl(chainId, address)}
      title="&#009;Collection address (click to view in explorer)&#013;
      {keyCollection(chainId, address)}"
      target="_blank"
      rel="noreferrer"><i class="fas fa-info-circle" /></a
    >
  </div>
  <div class="col col-xs-12">
    <NftsDisplayMode bind:mode />
  </div>
</div>

{#if mode === "grid"}
  <NftsGrid nfts={$nfts} bind:tokenID />
{:else}
  <NftsLines {chainId} nfts={$nfts} {owner} {platform} />
{/if}
