<script lang="ts">
  import type { Readable } from "svelte/store";
  import type { NftType } from "@lib/common/types";

  import NftSimple from "./NftSimple.svelte";
  import { nftSubListRefresh, nftSubListStore } from "@stores/nft/nftSubList";

  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let account: string = undefined;

  let nfts: Readable<Map<string, NftType>>;
  let refresh;

  $: chainId && address && account && handleChange();
  const handleChange = async (): Promise<void> => {
    refresh = false;
    nfts = nftSubListStore(chainId, address, account, tokenID);
    await nftSubListRefresh(chainId, address, account, tokenID);
    refresh = true;
  };
  $: console.log("handleChange ~ nfts", $nfts);

  const _setNftFromEvent = (evt: Event) => (tokenID = (evt.target as HTMLInputElement).value);
</script>

<select on:change={_setNftFromEvent}>
  {#if nfts}
    {#if $nfts.size > 0}
      {#each [...$nfts] as [key, nft]}
        <option id={key} selected={nft.tokenID == tokenID} value={nft.tokenID}>
          {nft.name || "no name"} -
          #{nft.tokenID}
        </option>
      {/each}
    {:else if refresh}
      <option value="">NO NFTs !</option>
    {:else}
      <option value="">LOADING NFT LIST...</option>
    {/if}
  {/if}
</select>
