<script lang="ts">
  import type { Readable } from "svelte/store";
  import type { NftType } from "@lib/common/types";

  import NftSimple from "./NftSimple.svelte";
  import { nftSubListRefresh, nftSubListStore } from "@stores/nft/nftSubList";

  export let chainId: number;
  export let address: string;
  export let account: string = undefined;

  let nfts: Readable<Map<string, NftType>>;
  let refresh;

  $: chainId && address && account && handleChange();
  const handleChange = async (): Promise<void> => {
    refresh = false;
    nfts = nftSubListStore(chainId, address, account);
    await nftSubListRefresh(chainId, address, account);
    refresh = true;
  };
  $: console.log("handleChange ~ nfts", $nfts);
</script>

{#if nfts}
  {#if $nfts.size > 0}
    {#each [...$nfts.values()] as nft}
      <p>
        <img width="30" src={nft.image} alt={nft.tokenID} />
        {nft.name} -
        #{nft.tokenID}
      </p>
    {/each}
  {:else if refresh}
    <p>
      NO NFTs !
    </p>
  {:else}
    <p>
      LOADING NFT LIST...
    </p>
  {/if}
{/if}
