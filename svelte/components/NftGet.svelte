<script lang="ts">
  import { getChainName } from "lib/kconfig";
  import { nftGet, nftGetFromCache } from "lib/knft-get";
  import type { Nft as NftType } from "lib/ktypes";

  import Nft from "./Nft.svelte";

  /////////////////////////////////////////////////
  // <NftGet {chainId} {collection} {tokenId}
  // Get and display NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let collection: string;
  export let tokenID: string;

  let nft: NftType;

  $: if (chainId && collection && tokenID) _nftGet();
  const _nftGet = async () => {
    // ASAP read NFT from cache
    nft = nftGetFromCache(chainId, collection, tokenID);

    // THEN read NFT from metadata
    nft = await nftGet(chainId, collection, tokenID);
  };
</script>

<Nft {nft} />
