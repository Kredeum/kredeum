<script lang="ts">
  import { nftGetImageLink } from "@lib/nft/knft-get-metadata";
  import Nft from "./Nft.svelte";

  export let chainId: number;
  export let address: string;
  export let tokenID: string;
</script>

<Nft {chainId} {address} {tokenID} let:nft>
  {#if nft}
    <p>
      REF nft://{chainId}/{address}/{tokenID}@{nft.owner}
    </p>
    <p>
      NAME <strong>{nft.name}</strong>
    </p>
    <p>
      DESCRIPTION {nft.description}
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
  {:else}
    <p>
      LOADING... nft://{chainId}/{address}/{tokenID}
    </p>
  {/if}
</Nft>
