<script lang="ts">
  import type { Readable } from "svelte/store";
  import type { NftType } from "@lib/common/types";

  import { nftStore } from "@stores/nft/nft";
  import { keyNft } from "@lib/common/keys";

  /////////////////////////////////////////////////
  // <Nft {chainId} {address} {tokenID} />
  // NFT data
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  /////////////////////////////////////////////////

  let nft: Readable<NftType>;

  // let i = 1;
  // HANDLE CHANGE : on truthy chainId and address, and whatever account
  $: chainId && address && tokenID && handleNftNew();
  const handleNftNew = async (): Promise<void> => {
    // console.log(`NFTDETAIL CHANGE #${i++} ${keyNft(chainId, address, tokenID)}`);

    // STATE VIEW : sync get Nft
    nft = nftStore.getOneStore(chainId, address, tokenID);

    // ACTION : async refresh Nft
    nftStore.refreshOne(chainId, address, tokenID).catch(console.error);
  };

  $: console.info("Nft", $nft);
</script>

<slot nft={$nft} />
