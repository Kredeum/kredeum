<script lang="ts">
  import type { Readable } from "svelte/store";
  import type { NftType } from "@lib/common/types";

  import { nftSubListStoreRefresh, nftSubListStore } from "@stores/nft/nftSubList";

  export let chainId: number;
  export let address: string;

  let nfts: Readable<Map<string, NftType>>;

  $: chainId && address && handleChange();
  const handleChange = async (): Promise<void> => {
    nfts = nftSubListStore(chainId, address);
    await nftSubListStoreRefresh(chainId, address);
  };
  $: console.log("handleChange ~ nfts", $nfts);
</script>

<slot nfts={$nfts}>
  <p>LOADING NFT LIST...</p>
</slot>
