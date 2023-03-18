<script lang="ts">
  import type { Readable, Writable } from "svelte/store";

  import { explorerCollectionUrl, isAddressNotZero, isCollection, PAGE_SIZE } from "@lib/common/config";

  import NftsDisplayMode from "./NftsDisplayMode.svelte";
  import ButtonMore from "../Global/ButtonMore.svelte";

  import NftsLines from "./NftsLines.svelte";
  import NftsGrid from "./NftsGrid.svelte";
  import { keyCollection } from "@lib/common/keys";

  import { nftSubListRefresh, nftSubListStore } from "@stores/nft/nftSubList";
  import { collectionStore } from "@stores/collection/collection";

  import { CollectionType, NftType } from "@lib/common/types";
  import { getContext } from "svelte";
  import { onMount } from "svelte";

  /////////////////////////////////////////////////
  // <Nfts {chainId} {address} {tokenID?} {account?} {page?}  {refreshing?}/>
  // List Nfts from collection owned by account
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string = undefined;
  export let owner: string = undefined;
  export let page: number = undefined;
  export let refreshing: boolean = undefined;
  export let end: boolean = undefined;
  export let mode: string = undefined; // modes => grid3 grid4 line
  export const more = () => page++;
  ////////////////////////////////////////////////////////////////////////

  let refreshAll: Writable<number> = getContext("refreshAll");
  let collection: Readable<CollectionType>;
  let nfts: Readable<Map<string, NftType>>;

  const getOwnerSupply = (): number =>
    isAddressNotZero(owner) && $collection?.balancesOf?.has(owner) ? $collection.balancesOf.get(owner) : -1;
  const getTotalSupply = (): number => ($collection?.hasOwnProperty("totalSupply") ? $collection.totalSupply : -1);
  const getMaxSupply = () => (isAddressNotZero(owner) ? getOwnerSupply() : getTotalSupply());

  let displayOwnerSupply: string = "";
  $: owner, $collection, handleDisplayOwnerSupply();
  const handleDisplayOwnerSupply = (): string =>
    (displayOwnerSupply = isAddressNotZero(owner) ? (getOwnerSupply() >= 0 ? String(getOwnerSupply()) : "?") : "");

  let displayTotalSupply: string = "";
  $: $collection, handleDisplayTotalSupply();
  const handleDisplayTotalSupply = (): string =>
    (displayTotalSupply = getTotalSupply() >= 0 ? String(getTotalSupply()) : "?");

  $: isCollection({ chainId, address }) && resetNfts();
  const resetNfts = () => {
    console.log("<Nfts resetNfts");
    refreshing = false;
    nfts = null;
    page = 1;
  };

  $: $refreshAll, owner, page > 0 && isCollection({ chainId, address }) && refresh();
  const refresh = async () => {
    end = true;

    collection = collectionStore.getOne(chainId, address);
    console.info("NFTS cached collection", $collection);

    // await tick();
    let offset = 0;

    let limit = page * PAGE_SIZE;
    let maxSupply = getMaxSupply();
    if (0 < maxSupply && maxSupply < limit) limit = maxSupply;

    if (limit > offset) {
      nfts = nftSubListStore(chainId, address, { owner, offset, limit });
    }
    console.info("NFTS cached", $nfts);
    // console.log("NFTS cached params", chainId, address, {  owner, offset, limit });

    refreshing = true;
    await collectionStore.refreshOne(chainId, address, owner);
    // await tick();

    limit = page * PAGE_SIZE;
    maxSupply = getMaxSupply();
    if (0 < maxSupply && maxSupply < limit) limit = maxSupply;

    offset = Math.max(limit - PAGE_SIZE, 0);
    if (0 < maxSupply && maxSupply < offset) offset = maxSupply;

    if (limit > offset) {
      await nftSubListRefresh(chainId, address, { owner, offset, limit });
    }
    end = $nfts.size < page * PAGE_SIZE;

    refreshing = false;

    console.info("NFTS refreshed", $nfts);
    // console.log("NFTS refreshed params", chainId, address, { owner, offset, limit });
  };

  $: console.log("NFTS from", chainId, "/", address, "@", owner);

  onMount(async () => {
    resetNfts();
    await refresh();
  });
</script>

<div class="row alignbottom">
  <div class="col col-xs-12">
    <h2>Collection '{$collection?.name}'</h2>
    {#if owner}{displayOwnerSupply} / {/if}
    {displayTotalSupply}
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
    {#if !end}
      <button class="btn btn-default" on:click={more} title="      Click to View more NFTs">Display more NFTs...</button
      >
    {/if}
  </div>
</div>
