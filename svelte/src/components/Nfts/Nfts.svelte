<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { type Readable, type Writable } from "svelte/store";

  import { PAGE_SIZE, explorerCollectionUrl, isAddressNotZero, isCollection } from "@kredeum/common/src/common/config";
  import { keyCollection } from "@kredeum/common/src/common/keys";
  import { type CollectionType, type NftType } from "@kredeum/common/src/common/types";

  import { nftSubListStore, nftSubListStoreRefresh } from "../../stores/nft/nftSubList";
  import { collectionStore, collectionStoreRefresh } from "../../stores/collection/collection";

  import NftsDisplayMode from "./NftsDisplayMode.svelte";
  import NftsGrid from "./NftsGrid.svelte";
  import NftsLines from "./NftsLines.svelte";

  /////////////////////////////////////////////////
  // <Nfts {chainId} {address} {tokenID?} {account?} {page?}  {refreshing?}/>
  // List Nfts from collection owned by account
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string | undefined = undefined;
  export let owner: string | undefined = undefined;
  export let page: number | undefined = undefined;
  export let refreshing: boolean | undefined = undefined;
  export let mode: string | undefined = undefined; // modes => grid3 grid4 line

  ////////////////////////////////////////////////////////////////////////

  let refreshAll: Writable<number> = getContext("refreshAll");
  let collection: Readable<CollectionType>;
  let nfts: Readable<Map<string, NftType>>;

  const getOwnerSupply = (): number => (owner && $collection?.balancesOf?.get(owner)) || -1;
  const getTotalSupply = (): number => $collection?.totalSupply || -1;
  const getMaxSupply = () => (isAddressNotZero(owner) ? getOwnerSupply() : getTotalSupply());

  let displayOwnerSupply: string = "";
  $: $collection, isAddressNotZero(owner) && handleDisplayOwnerSupply();
  const handleDisplayOwnerSupply = (): string =>
    (displayOwnerSupply = getOwnerSupply() >= 0 ? String(getOwnerSupply()) : "?");

  let displayTotalSupply: string = "";
  $: $collection, handleDisplayTotalSupply();
  const handleDisplayTotalSupply = (): string =>
    (displayTotalSupply = getTotalSupply() >= 0 ? String(getTotalSupply()) : "?");

  $: isCollection({ chainId, address }) && resetNfts();
  const resetNfts = () => {
    // console.log("<Nfts resetNfts");
    refreshing = false;
    page = 1;

    collection = collectionStore(chainId, address);

    refresh();
  };

  $: moreNFTs = Math.max(getMaxSupply(), $nfts.size || 0) >= (page || 1) * PAGE_SIZE;
  const nextPage = () => (page = page ? page + 1 : 1);

  $: $refreshAll, owner, isCollection({ chainId, address }), page && refresh();
  const refresh = async () => {
    page ||= 1;

    // await tick();
    let offset = 0;

    let limit = page * PAGE_SIZE;
    let maxSupply = getMaxSupply();
    if (0 < maxSupply && maxSupply < limit) limit = maxSupply;

    if (limit > offset) {
      nfts = nftSubListStore(chainId, address, { tokenID, owner, offset, limit });
    }

    refreshing = true;
    await collectionStoreRefresh(chainId, address, owner);

    limit = page * PAGE_SIZE;
    maxSupply = getMaxSupply();
    if (0 < maxSupply && maxSupply < limit) limit = maxSupply;

    offset = Math.max(limit - PAGE_SIZE, 0);
    if (0 < maxSupply && maxSupply < offset) offset = maxSupply;

    if (limit > offset) {
      await nftSubListStoreRefresh(chainId, address, { owner, offset, limit });
    }

    refreshing = false;

    console.info("NFTS", $nfts);
    console.log("NFTS refreshed params", chainId, address, { owner, offset, limit });
  };

  onMount(async () => {
    resetNfts();
    await refresh();
  });
</script>

<div class="row alignbottom">
  <div class="col col-xs-12">
    <h2>Collection '{$collection?.name}'</h2>
    {#if isAddressNotZero(owner)}
      {displayOwnerSupply} /
    {/if}
    {displayTotalSupply}
    {$collection?.symbol || "NFT"}
    {#if refreshing}
      ...
    {/if}
    <a
      class="info-button"
      href={explorerCollectionUrl(chainId, address)}
      title="Collection address (click to view in explorer)&#013;
      {keyCollection(chainId, address)}"
      target="_blank"
      rel="noreferrer"><i class="fas fa-info-circle" /></a
    >
  </div>
  {#if mode !== "grid3"}
    <div class="col col-xs-12">
      <NftsDisplayMode bind:mode />
    </div>
  {/if}
</div>

{#if mode === "line"}
  <NftsLines nfts={$nfts} {owner} {mode} />
{:else}
  <NftsGrid nfts={$nfts} bind:tokenID {owner} {mode} />
{/if}

<div class="row">
  <div class="col col-sm">
    {#if moreNFTs}
      <button class="btn btn-default" on:click={nextPage} title="Click to View more NFTs">Display more NFTs...</button>
    {/if}
  </div>
</div>
