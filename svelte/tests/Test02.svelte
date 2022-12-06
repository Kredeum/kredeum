<script lang="ts">
  import { onMount } from "svelte";

  import Nft from "../components/Nft/Nft.svelte";
  import NftBasic from "../components/Nft/NftBasic.svelte";
  import { metamaskInit } from "@helpers/metamask";

  onMount(async () => {
    await metamaskInit();
  });
</script>

<div>
  <!-- <Nft chainId={1} address="0x5c211B8E4f93F00E2BD68e82F4E00FbB3302b35c" tokenID="7108" /> -->

  <NftBasic chainId={1} address="0x5c211B8E4f93F00E2BD68e82F4E00FbB3302b35c" tokenID="7108" />
</div>
