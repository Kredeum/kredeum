<script lang="ts">
  import { onMount } from "svelte";
  import Nft from "../Nft/Nft.svelte";
  import { nftSubListGetStoreAndRefresh } from "@stores/nft/nftSubList";
  import { RefPageType } from "@helpers/refPage";
  import BreadCrumb from "../Global/BreadCrumb.svelte";
  import { providerSetFallback } from "@lib/common/provider-get";
  import { constants } from "ethers";

  /////////////////////////////////////////////////////////////////
  // <NftAutomarket {chainId} {address} {tokenID} {platform}? />
  // Display NFT solo
  /////////////////////////////////////////////////////////////////
  export let chainId: number = 1;
  export let address: string = constants.AddressZero;
  export let tokenID: string = "";
  export let platform: string = undefined;
  /////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////
  $: nfts = nftSubListGetStoreAndRefresh(chainId, address, { tokenID });
  ////////////////////////////////////////////////////////////////////////

  onMount(async () => {
    const refParams: RefPageType = { chainId, address, tokenID };
    console.log("<NftAutomarket refParams:", refParams);

    providerSetFallback(chainId).catch(console.error);
  });
</script>

<div class="nft-automarket">
  <BreadCrumb {chainId} {address} {tokenID} display={true} />
  {#each [...$nfts] as [key, nft]}
    <Nft chainId={nft.chainId} address={nft.address} tokenID={nft.tokenID} {platform} />
  {/each}
</div>
