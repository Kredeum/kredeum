<script lang="ts">
  import { nftSubListStoreAndRefresh } from "../../stores/nft/nftSubList";
  import { type Address } from "viem";

  ////////////////////////////////////////////////////////////////////////
  // <NftListData {chainId} {address} {account} />
  // List Nfts from collection owned by account or address
  ////////////////////////////////////////////////////////////////////////
  export let chainId: number;
  export let address: Address;
  export let tokenID: string | undefined = undefined;
  export let account: Address | undefined = undefined;
  export let offset = 0;
  export let limit = 12;

  ////////////////////////////////////////////////////////////////////////
  $: nfts = nftSubListStoreAndRefresh(chainId, address, { tokenID, owner: account, offset, limit });
  ////////////////////////////////////////////////////////////////////////
</script>

<slot nfts={$nfts}>
  <p>LOADING NFTS LIST...</p>
</slot>
