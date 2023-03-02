<script lang="ts">
  import { nftSubListGetStoreAndRefresh } from "@stores/nft/nftSubList";

  ////////////////////////////////////////////////////////////////////////
  // <NftListData {chainId} {address} {account} />
  // List Nfts from collection owned by account or address
  ////////////////////////////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let account: string = undefined;
  ////////////////////////////////////////////////////////////////////////
  $: nfts = nftSubListGetStoreAndRefresh(chainId, address, account);
  ////////////////////////////////////////////////////////////////////////
</script>

<slot nfts={$nfts}>
  <p>LOADING NFTS LIST...</p>
</slot>
