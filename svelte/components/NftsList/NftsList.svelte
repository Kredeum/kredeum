<script lang="ts">
  import type { Readable } from "svelte/store";
  import type { CollectionType, NftType } from "lib/ktypes";

  import { getContext } from "svelte";
  import { Writable } from "svelte/store";

  import { explorerCollectionUrl, collectionUrl } from "lib/kconfig";

  import { nftStore } from "stores/nft/nft";
  import { collectionStore } from "stores/collection/collection";

  import NftsListDisplayMode from "./NftsListDisplayMode.svelte";

  import NftsListLines from "./NftsListLines.svelte";
  import NftsListGrid from "./NftsListGrid.svelte";

  /////////////////////////////////////////////////
  // <NftList {chainId} {address}  {account} {refreshing} />
  // List Nfts from collection owned by account
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let account: string = undefined;
  export let refreshing: boolean = undefined;
  // export let refresh: number = 1;

  export let platform: string = "dapp";

  let refresh: Writable<number> = getContext("refresh");

  let displayMode: string = "grid";

  // let i = 1;
  let nfts: Readable<Map<string, NftType>>;
  let collection: Readable<CollectionType>;

  // HANDLE CHANGE : on truthy chainId, address and account, and whatever refresh
  $: $refresh, chainId && address && account && handleChange();
  const handleChange = async (): Promise<void> => {
    // console.log(`NFT LIST CHANGE #${i++} ${nftListKey(chainId, address, account)}`);

    // STATE VIEW : sync get Collection
    collection = collectionStore.getOneStore(chainId, address);

    // STATE VIEW : sync get NFT list
    nfts = nftStore.getSubListStore(chainId, address, account);

    // ACTION : async refresh NFT list
    refreshing = true;
    await nftStore.refreshSubList(chainId, address, account);
    refreshing = false;
  };
</script>

{#if $collection && nfts}
  <div class="row alignbottom">
    <div class="col col-xs-12">
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
    </div>
    <div class="col col-xs-12">
      <NftsListDisplayMode bind:displayMode />
    </div>
  </div>

  {#if "list" === displayMode}
    <NftsListLines {chainId} {account} {nfts} {platform} />
  {:else if "grid" === displayMode}
    <NftsListGrid {account} {nfts} />
  {/if}
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
