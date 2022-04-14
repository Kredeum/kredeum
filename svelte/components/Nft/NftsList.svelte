<script lang="ts">
  import type { Readable } from "svelte/store";

  import type { CollectionType, NftType } from "lib/ktypes";
  import { collectionName, explorerCollectionUrl, nftsBalanceAndName, collectionUrl } from "lib/kconfig";
  import { getNetwork } from "lib/kconfig";

  import Nft from "../Nft/Nft.svelte";
  // import NftSimple from "../tests/NftSimple.svelte";
  import { nftListStore } from "stores/nft/nftList";

  /////////////////////////////////////////////////
  // <NftList {chainId} {address}  {account} {refreshing} />
  // List Nfts from collection owned by account
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let account: string = undefined;
  export let refreshing: boolean = undefined;
  export let refresh: number = 1;

  // // ACTION : async NFT list refresh
  // $: nftListStore.refresh(chainId, address, account)
  //     .then(() => (refreshing = false))
  //     .catch(console.error);

  // // STATE VIEW : NFT list
  // $: nfts = nftListStore.getSubList(chainId, address);

  let i = 1;
  let j = 1;
  let nfts: Readable<Map<string, NftType>>;

  // ACTION : refresh  NFT list async
  $: if (chainId && address && account) _refresh(chainId, address, account);
  const _refresh = async (_chainId: number, _address: string, _account: string): Promise<void> => {
    let refreshing = true;
    console.log(`REFRESH NFT LIST ${i++} collection://${_chainId}/${_address}${_account ? "@" + _account : ""}`);
    await nftListStore.refresh(_chainId, _address, _account);
    refreshing = false;
  };

  // STATE VIEW : NFT list
  $: if (chainId && address) _get(chainId, address);
  const _get = (_chainId: number, _address: string) => {
    nfts = nftListStore.getSubList(chainId, address);
    console.log(`CURRENT NFT LIST ${j++} collection://${_chainId}/${_address}\n`, $nfts);
  };
</script>

{#if $nfts?.size > 0}
  <h2>Collection name</h2>
  {$nfts?.size || 0}/N
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
        Refreshing NFTs...
      {:else}
        No NFTs ✌️
      {/if}
    </p>
  </div>
{/if}
