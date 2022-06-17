<script lang="ts">
  import type { Readable } from "svelte/store";

  import type { NftType } from "lib/ktypes";
  import {
    nftUrl,
    explorerCollectionUrl,
    explorerAddressLink,
    kredeumNftUrl,
    getNetwork,
    nftOpenSeaUrl,
    addressSame
  } from "lib/kconfig";
  import MediaPreview from "../Media/MediaPreview.svelte";

  import { nftStore } from "stores/nft/nft";

  import { metamaskChainId, metamaskProvider, metamaskSigner, metamaskAccount } from "main/metamask";

  import { slide } from "svelte/transition";

  /////////////////////////////////////////////////
  //  <NftAma {chainId} {address} {tokenID} {account}? {tokenIdClaimed}? />
  // Display Minted POAP
  /////////////////////////////////////////////////
  //   export let chainId: number;
  //   export let address: string;
  export let tokenID: string;
  //   export let account: string = undefined;

  let chainTab: number = 1;

  let address: string = getNetwork($metamaskChainId).openBoundAma;
</script>
