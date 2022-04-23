<script lang="ts">
  import type { Readable } from "svelte/store";
  import type { NftType } from "lib/ktypes";
  import { nftGetImageLink } from "lib/knft-get-metadata";
  import { nftStore } from "../stores/nft/nft";
  import { collectionStore } from "../stores/collection/collection";
  import { nftsStoreList } from "./NftsStore/NftsStoreList";

  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let account: string = undefined;

  let i = 1;
  let j = 1;
  let nft: Readable<NftType>;

  $: console.log("NFT", $nft);

  // ACTION : refresh Nft on chainId, address or tokenID change
  $: if (chainId && address && tokenID) _refresh(chainId, address, tokenID);
  const _refresh = async (_chainId: number, _address: string, _tokenID: string): Promise<void> => {
    await nftStore.refresh(_chainId, _address, _tokenID);
    console.log(`REFRESH NFT ${i++} nft://${_chainId}/${_address}/${_tokenID}`);
  };

  // STATE VIEW : get Nft on chainId, address or tokenID change
  $: if (chainId && address && tokenID) _get(chainId, address, tokenID);
  const _get = (_chainId: number, _address: string, _tokenID: string): void => {
    nft = nftStore.getOne(_chainId, _address, _tokenID);
    console.log(`CURRENT NFT ${j++} bft://${_chainId}/${_address}\n`, $nft || { chainId: _chainId, address: _address });
  };
</script>

{#if nft}
  <p>
    NAME <strong>{$nft.name}</strong> : DESCRIPTION {$nft.description}
  </p>
  <p>
    REF nft://{chainId}/{address}/{tokenID}@{$nft.owner} @{account}
  </p>
  <p>
    TOKEN URI <a href={$nft.tokenURI}>{$nft.tokenURI}</a><br />
  </p>
  <p>
    IMAGE LINK ORIGIN <a href={$nft.image}>{$nft.image}</a>
  </p>
  <p>
    IMAGE LINK <a href={nftGetImageLink($nft)}> {nftGetImageLink($nft)}</a>
  </p>
  <p>
    {#if $nft?.contentType?.startsWith("video")}
      VIDEO <video preload="metadata" style="border-radius: initial; height: 100px">
        <track kind="captions" />
        <source src={nftGetImageLink($nft)} type="video/mp4" />
      </video>
    {:else}
      IMAGE <img alt={$nft.name} width="100px" src={nftGetImageLink($nft)} />
    {/if}
  </p>
  <hr />
{:else}
  <p>
    LOADING... nft://{chainId}/{address}/{tokenID}
  </p>
{/if}
