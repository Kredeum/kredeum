<script lang="ts">
  import type { NftType } from "lib/ktypes";
  import { nftGetImageLink } from "lib/knft-get-metadata";
  import { nftStore } from "../stores/nft/nft";

  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let account: string = undefined;

  let nft: NftType;
  // // ACTION : refresh Nft
  // $: nftStore.refresh(chainId, address, account).catch(console.error);

  // // STATE VIEW : get Nft
  // $: nft = nftStore.get(chainId, address);
</script>

<p>
  <strong>{nft.name}</strong> : {nft.description}
</p>
<p>
  nft://{nft.chainId}/{nft.address}/{nft.tokenID}@{nft.owner}
</p>
<p>
  <a href={nft.tokenURI}>{nft.tokenURI}</a><br />
</p>
<p>
  <a href={nft.image}>{nft.image}</a>
</p>
<p>
  <a href={nftGetImageLink(nft)}> {nftGetImageLink(nft)}</a>
</p>
<p>
  {#if nft?.contentType.startsWith("video")}
    <video preload="metadata" style="border-radius: initial; height: 100px">
      <track kind="captions" />
      <source src={nftGetImageLink(nft)} type="video/mp4" />
    </video>
  {:else}
    <img alt={nft.name} width="100px" src={nftGetImageLink(nft)} />
  {/if}
</p>
<hr />
