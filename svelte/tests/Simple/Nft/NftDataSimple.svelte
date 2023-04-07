<script lang="ts">
  import type { Readable } from "svelte/store";
  import type { NftType } from "@lib/common/types";
  import { nftStore, nftStoreRefresh } from "@stores/nft/nft";

  export let chainId: number;
  export let address: string;
  export let tokenID: string;

  let nft: Readable<NftType>;

  $: chainId && address && tokenID && handleChange();
  const handleChange = (): void => {
    nft = nftStore(chainId, address, tokenID);
    nftStoreRefresh(chainId, address, tokenID).catch(console.error);
  };
  $: console.info("NFT", $nft);
</script>

<slot nft={$nft}>
  <p>LOADING NFT...</p>
</slot>
