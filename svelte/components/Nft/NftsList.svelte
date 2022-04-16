<script lang="ts">
  import type { Readable } from "svelte/store";

  import type { CollectionType, NftType } from "lib/ktypes";
  import { explorerCollectionUrl, collectionUrl } from "lib/kconfig";
  import { getNetwork, nftListKey } from "lib/kconfig";

  import Nft from "../Nft/Nft.svelte";
  // import NftSimple from "../tests/NftSimple.svelte";
  import { nftStore } from "stores/nft/nft";
  import { collectionStore } from "stores/collection/collection";

  /////////////////////////////////////////////////
  // <NftList {chainId} {address}  {account} {refreshing} />
  // List Nfts from collection owned by account
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let account: string = undefined;
  export let refreshing: boolean = undefined;
  export let refresh: number = 1;

  let i = 1;
  let nfts: Readable<Map<string, NftType>>;
  let collection: Readable<CollectionType>;

  // HANDLE CHANGE : on truthy chainId, address and account, and whatever refresh
  $: refresh, chainId && address && account && handleChange();
  const handleChange = async (): Promise<void> => {
    console.log(`NFT LIST CHANGE #${i++} ${nftListKey(chainId, address, account)}`);

    // STATE VIEW : sync get NFT list
    nfts = nftStore.getSubListStore(chainId, address, account);

    // STATE VIEW : sync get Collection
    collection = collectionStore.getOneStore(chainId, address);
    console.log("handleChange", $collection);

    // ACTION : async refresh NFT list
    refreshing = true;
    await nftStore.refreshSubList(chainId, address, account);
    refreshing = false;
  };
</script>

{#if $collection}
  <h2>Collection '{$collection?.name}'</h2>
  {$nfts?.size || 0}/{$collection?.balancesOf?.get(account) || $nfts?.size || 0}
  {$collection?.symbol || "NFT"}
  {#if refreshing}...{/if}
  <a
    class="info-button"
    href={explorerCollectionUrl(chainId, address)}
    title="&#009;Collection address (click to view in explorer)&#013;
      {collectionUrl(chainId, address)}"
    target="_blank"><i class="fas fa-info-circle" /></a
  >

  <div class="table">
    <div class="table-row table-head hidden-xs">
      <div class="table-col"><span class="label">Media</span></div>
      {#if getNetwork(chainId)?.openSea}
        <div class="table-col"><span class="label">Marketplace</span></div>
      {:else}
        <div class="table-col"><span class="label">Infos</span></div>
      {/if}
    </div>
    {#each [...$nfts.values()] as nft, index}
      <Nft chainId={nft.chainId} address={nft.address} tokenID={nft.tokenID} {account} />
    {/each}
  </div>
{:else}
  <div class="card-krd">
    <p>
      {#if refreshing}
        <h2>Collection '{$collection?.name}'</h2>
        Refreshing NFTs...
      {:else}
        No NFTs ✌️
      {/if}
    </p>
  </div>
{/if}
