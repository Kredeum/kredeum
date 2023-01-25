<script lang="ts">
  import { nftStore } from "@stores/nft/nft";
  import { keyNft } from "@lib/common/keys";

  /////////////////////////////////////////////////
  // <NftData {chainId} {address} {tokenID} />
  // NFT data
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  /////////////////////////////////////////////////

  // GET NFT
  $: nft = nftStore.getAndRefresh(chainId, address, tokenID);

  let i = 0;
  $: console.log(`NFT CHANGE #${++i} ${keyNft(chainId, address, tokenID)}`);
  $: console.info("Nft", $nft);
</script>

<slot nft={$nft}>
  <p>LOADING NFT...</p>
</slot>
