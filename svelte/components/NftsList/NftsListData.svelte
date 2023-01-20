<script lang="ts">
  import type { Readable } from "svelte/store";
  import type {  NftType } from "@lib/common/types";
  import { keyNftList } from "@lib/common/keys";
  import { nftSubListRefresh, nftSubListStore } from "@stores/nft/nftSubList";

  /////////////////////////////////////////////////
  // <NftListData {chainId} {address} {account} />
  // List Nfts from collection owned by account or address
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let account: string = undefined;

  let i = 1;
  let nfts: Readable<Map<string, NftType>>;

  // HANDLE CHANGE : on truthy chainId, address and account, and whatever refresh
  $: chainId && address && account && handleChange();
  const handleChange = async (): Promise<void> => {
    console.log(`NFT LIST CHANGE #${i++} ${keyNftList(chainId, address, account)}`);

    // STATE VIEW : sync get NFT list
    nfts = nftSubListStore(chainId, address, account);
    console.info("NFTS cached", $nfts);

    // ACTION : async refresh NFT list
    await nftSubListRefresh(chainId, address, account);
    console.info("NFTS refreshed", $nfts);
  };
</script>

<slot nfts={$nfts}>
  <p>LOADING NFTS LIST...</p>
</slot>
