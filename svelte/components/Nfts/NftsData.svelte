<script lang="ts">
  import { owner } from "@main/network";
  import { nftSubListGetStoreAndRefresh } from "@stores/nft/nftSubList";

  ////////////////////////////////////////////////////////////////////////
  // <NftListData {chainId} {address} {account} />
  // List Nfts from collection owned by account or address
  ////////////////////////////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenIDs: string = undefined;
  export let tokenID: string = undefined;
  export let account: string = undefined;
  export let offset = 0;
  export let limit = 18;

  ////////////////////////////////////////////////////////////////////////
  $: nfts = nftSubListGetStoreAndRefresh(chainId, address, { tokenIDs, owner: account, offset, limit });
  // $: nfts = nftSubListGetStoreAndRefresh(chainId, address, {  offset, limit });
  ////////////////////////////////////////////////////////////////////////
</script>

<slot nfts={$nfts}>
  <p>LOADING NFTS LIST...</p>
</slot>
