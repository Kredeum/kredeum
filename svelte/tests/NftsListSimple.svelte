<script lang="ts">
  import type { Readable } from "svelte/store";
  import type { NftType } from "lib/ktypes";

  import NftSimple from "./NftSimple.svelte";
  import { nftListStore } from "stores/nft/nftList";

  export let chainId: number;
  export let address: string;
  export let account: string = undefined;

  let i = 1;
  let j = 1;
t nfts: Readable<Map<string, NftType>>;

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

{#if nfts}
  <p>{$nfts.size} NFTs</p>
  {#if $nfts.size > 0}
    {#each [...$nfts.values()] as nft, index}
      <NftSimple chainId={nft.chainId} address={nft.address} tokenID={nft.tokenID} />
    {/each}
  {:else}
    <p>
      NO NFTs nft://{chainId}/{address}
    </p>
  {/if}
{:else}
  <p>
    LOADING... nft://{chainId}/{address}
  </p>
{/if}
