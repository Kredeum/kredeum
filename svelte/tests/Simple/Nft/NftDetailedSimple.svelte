<script lang="ts">
  import { nftGetImageLink } from "@lib/nft/nft-get-metadata";
  import NftDataSimple from "./NftDataSimple.svelte";

  /////////////////////////////////////////////////
  //  <Nft {chainId} {address} {tokenID} {account}? {index}? {more}? {platform}? />
  // Display NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let account: string = undefined;
</script>

<NftDataSimple {chainId} {address} {tokenID} let:nft>
  {#if nft}
    <p>
      NAME <strong>{nft.name}</strong> : DESCRIPTION {nft.description}
    </p>
    <p>
      REF nft://{chainId}/{address}/{tokenID}@{nft.owner} @{account}
    </p>
    <p>
      TOKEN URI <a href={nft.tokenURI}>{nft.tokenURI}</a><br />
    </p>
    <p>
      IMAGE LINK ORIGIN <a href={nft.image}>{nft.image}</a>
    </p>
    <p>
      IMAGE LINK <a href={nftGetImageLink(nft)}> {nftGetImageLink(nft)}</a>
    </p>
    <p>
      {#if nft?.contentType?.startsWith("video")}
        VIDEO <video preload="metadata" style="border-radius: initial; height: 100px">
          <track kind="captions" />
          <source src={nftGetImageLink(nft)} type="video/mp4" />
        </video>
      {:else}
        IMAGE <img alt={nft.name} width="100px" src={nftGetImageLink(nft)} />
      {/if}
    </p>
    <hr />
  {/if}
</NftDataSimple>
