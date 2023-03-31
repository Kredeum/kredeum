<script lang="ts">
  import { onMount } from "svelte";
  import Nft from "../Nft/Nft.svelte";
  import { nftSubListGetStoreAndRefresh } from "@stores/nft/nftSubList";

  import { providerSetFallback } from "@lib/common/provider-get";
  import { ZeroAddress } from "ethers";
  import { metamaskInit } from "@helpers/metamask";
  import { RefPageType } from "@lib/common/types";

  /////////////////////////////////////////////////////////////////
  // <NftAutomarket {chainId} {address} {tokenID} />
  // Display NFT solo
  /////////////////////////////////////////////////////////////////
  export let chainId: number = 1;
  export let address: string = ZeroAddress;
  export let tokenID: string = "";
  /////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////
  $: nfts = nftSubListGetStoreAndRefresh(chainId, address, { tokenID });
  ////////////////////////////////////////////////////////////////////////

  onMount(async () => {
    const refParams: RefPageType = { chainId, address, tokenID };
    // console.log("<NftAutomarket refParams:", refParams);

    await metamaskInit();
    await providerSetFallback(chainId);
  });
</script>

<div class="nft-automarket">
  {#each [...$nfts.values()] as nft}
    <Nft chainId={nft.chainId} address={nft.address} tokenID={nft.tokenID} />
  {/each}
</div>
