<script lang="ts">
  import type { NftType } from "@lib/common/types";
  import { metamaskChainId, metamaskSigner } from "@main/metamask";

  import NftMint from "../components/Nft/NftMint.svelte";
  import { onMount } from "svelte";
  import { metamaskInit } from "@helpers/metamask";

  let nft: NftType = undefined;

  $: nft && console.log(nft);

  onMount(async () => await metamaskInit());
</script>

<main>
  <NftMint
    src="https://www.kredeum.com/android-chrome-256x256.png"
    chainId={$metamaskChainId}
    address="0x3b011a741FA534b0E340D74141eAE66d2e0964d8"
    signer={$metamaskSigner}
    name="test"
    description="test description"
    ref="123"
    {nft}
  />
</main>

<style>
  main {
    padding: 20px;
  }
</style>
