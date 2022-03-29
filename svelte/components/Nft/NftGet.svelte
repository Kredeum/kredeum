<script lang="ts">
  import { utils } from "ethers";

  import type { Nft as NftType } from "lib/ktypes";
  import { nftGet, nftGetFromStore } from "lib/knft-get";

  import { hashArray } from "helpers/hash";
  import Nft from "./Nft.svelte";

  /////////////////////////////////////////////////
  // <NftGet {chainId} {collection} {tokenId}
  // Get and display NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let collection: string;
  export let tokenID: string;

  // current hash of significant props
  $: hashCurrent = hashArray([chainId, collection, tokenID]);

  let nft: NftType;
  const _nftSet = (_nft: NftType, _hash: string): void => {
    //  set when significant props have not changed
    if (_hash === hashCurrent) nft = _nft;
  };

  $: _nftGet(chainId, collection, tokenID).catch(console.error);

  const _nftGet = async (_chainId: number, _collection: string, _tokenID: string): Promise<void> => {
    if (!(_chainId && _collection && _tokenID)) return;

    const hash = hashArray([_chainId, _collection, _tokenID]);

    // ASAP read NFT from cache
    _nftSet(nftGetFromStore(_chainId, _collection, _tokenID), hash);

    // THEN read NFT from metadata
    _nftSet(await nftGet(_chainId, _collection, _tokenID), hash);
  };
</script>

<Nft {nft} />
