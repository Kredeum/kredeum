<script lang="ts">
  import type { Readable } from "svelte/store";
  import type { NftType } from "@lib/common/types";

  import NftSimple from "./NftSimple.svelte";
  import { nftSubListRefresh, nftSubListStore } from "@stores/nft/nftSubList";

  export let chainId: number;
  export let address: string;
  export let account: string = undefined;

  // let i = 1;
  // let j = 1;
  let nfts: Readable<Map<string, NftType>>;
  let refreshing: boolean;

  // ACTION : refresh  NFT list async
  $: if (chainId && address && account) _refresh(chainId, address, account);
  const _refresh = async (_chainId: number, _address: string, _account: string): Promise<void> => {
    refreshing = true;
    // console.log(`REFRESH NFT LIST ${i++} collection://${_chainId}/${_address}${_account ? "@" + _account : ""}`);
    await nftSubListRefresh(_chainId, _address, _account);
    refreshing = false;
  };

  // STATE VIEW : NFT list
  $: if (chainId && address) _get(chainId, address);
  const _get = (_chainId: number, _address: string) => {
    nfts = nftSubListStore(chainId, address);
    // console.log(`CURRENT NFT LIST ${j++} collection://${_chainId}/${_address}\n`, $nfts);
  };
</script>

{#if refreshing}Refreshing...{/if}

{#if nfts}
  <p>{$nfts.size} NFTs</p>
  {#if $nfts.size > 0}
    {#each [...$nfts.values()] as nft}
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
