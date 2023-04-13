<script lang="ts">
  import type { NftType } from "@lib/common/types";
  import { metamaskChainId, metamaskSigner } from "@main/metamask";

  import MintButton from "../components/Main/MintButtonWp.svelte";
  import { onMount } from "svelte";
  import { metamaskInit } from "@helpers/metamask";

  let nft: NftType = undefined;

  $: nft && console.log(nft);

  onMount(async () => await metamaskInit());
</script>

<main id="nft-mint">
  <MintButton
    src="https://www.kredeum.com/android-chrome-256x256.png"
    pid="820"
    nid="nft://11155111/0x3b011a741fa534b0e340d74141eae66d2e0964d8/10"
    alt="alt title"
  />
</main>
